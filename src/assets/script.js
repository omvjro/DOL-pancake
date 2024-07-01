import { domToPng, domToBlob } from 'modern-screenshot'
import {
  hollows,
} from './data.js';
import { saveTwee, savePng, saveJSON } from './save.js';
import {
  position, insertTarget,
  generateInsertTarget,
  insertHard, insert,
  getSelectionAndPosition, createSelection,
} from './insert.js'
import { getCode } from '@/assets/utils';

const dolEditor = document.querySelector('div.passage');
const output = document.querySelector('#output');
function findInlineLink(candidate, operator) {
  if (!candidate) return;
  const candidateContent = candidate.textContent;
  if (candidateContent.includes('\n') || candidate.tagName === 'BR') return;
  if (candidateContent.includes('<</link>>') || candidate.tagName === 'A') {
    operator(candidate);
    return;
  }
  findInlineLink(candidate.previousSibling, operator);
}
function updateTip(tipbox, tip, color = 'red') {
  tipbox.innerHTML = `<span class="${color}">${tip}</span>`;
}

// 高级选项
const switchAdvanced = () => {
  document.querySelectorAll('.advanced').forEach((advanced) => {
    advanced.hidden = !advanced.hidden;
  });
};
const loadAdvanced = () => {
  if (localStorage.getItem('isAdvancer')) {
    switchAdvanced();
    document.querySelector('#advanced').checked = 1;
  }
};
loadAdvanced();
document.querySelector('#advanced').addEventListener('change', () => {
  if (localStorage.getItem('isAdvancer')) {
    localStorage.removeItem('isAdvancer');
  } else {
    localStorage.setItem('isAdvancer', 1);
  }
  switchAdvanced();
});

// 链接标号
const toggleIndex = (isChecked = document.querySelector('#link-num').checked) => document.querySelectorAll('#dol a').forEach((a, index) => {
  if (isChecked) {
    const n = (index + 1) % 10;
    const np1 = (`${n + 1}`).slice(-1);
    const prefxdn = {
      0: n,
      1: `Shift + ${np1}`,
      2: `Ctrl + ${np1}`,
      3: `Alt + ${np1}`,
    };
    const dataIndex = prefxdn[Math.floor((index + 1) / 10)];
    if (dataIndex) {
      a.setAttribute('data-index', `(${dataIndex}) `);
    }
    a.setAttribute('data-if-index', '1');
  } else { a.setAttribute('data-if-index', '0'); }
});
toggleIndex(true);
document.querySelector('#link-num').addEventListener('change', (event) => {
  event.target.toggleAttribute('checked');
  toggleIndex();
});

// 复制游戏原文
const editableSwitch = (isTrue, isNum = false) => {
  if (isTrue) {
    dolEditor.setAttribute('contenteditable', 'true');
    dolEditor.innerHTML = dolEditor.innerHTML.replaceAll('\n', '<br>');
    if (!isNum) {
      document.querySelector('#link-num').checked = false;
      document.querySelector('#link-num').disabled = true;
    }
    document.querySelector('#code').disabled = true;
    toggleIndex(false);
  } else {
    dolEditor.setAttribute('contenteditable', 'plaintext-only');
    dolEditor.innerHTML = dolEditor.innerHTML.replaceAll('<br>', '\n');
    document.querySelector('#link-num').disabled = false;
    document.querySelector('#code').disabled = false;
  }
};
if (document.querySelector('#direct-paste')) {
  document.querySelector('#direct-paste').addEventListener('change', (event) => {
    editableSwitch(event.target.checked);
  });
}

generateInsertTarget(dolEditor);

// NPC 部件
document.querySelector('#hollows').innerHTML = Object.keys(hollows).reduce((selects, key) => `
${selects}
<select id=${key}>
  <option value="" style="display: none">${key === 'person' ? 'personselect' : key}</option>
  ${hollows[key].reduce((options, option) => `${options}<option>${option}</option>`, '')}
</select>`, '');
document.querySelectorAll('#hollows select').forEach((select) => {
  select.addEventListener('change', (event) => {
    const hollow = event.target.value;
    insertHard(hollow, `<<${hollow}>>`, (widget) => widget.classList.add('noDisplay'));
    event.target.value = '';
  });
});

// 预览图片
document.querySelector('#pic').addEventListener('click', () => {
  document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'none'; });
  output.innerText = '生成图片中……';
  domToPng(document.querySelector('#dol'), {
    scale: 2,
    features: {
      removeControlCharacter: false,
      fixSvgXmlDecode: false,
    }
  }).then((dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.alt = 'dol-pancake';
    output.innerText = '';
    output.appendChild(img);
  }).catch((error) => {
    output.innerText = `出错了（${error}）`;
  }).finally(() => {
    document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'inline-block'; });
  });
});

// 下载图片
document.querySelector('#pic-down').addEventListener('click', () => {
  document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'none'; });
  output.innerText = '生成图片中……';
  domToBlob(document.querySelector('#dol'), {
    scale: 2,
    features: {
      removeControlCharacter: false,
      fixSvgXmlDecode: false,
    }
  }).then((blob) => {
    savePng(blob, 'dol-pancake');
    output.innerText = '';
  }).catch((error) => {
    output.innerText = `出错了（${error}）`;
  }).finally(() => {
    document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'inline-block'; });
  });
});

// 导出代码
document.querySelector('#code').addEventListener('click', () => {
  const code = getCode(dolEditor.innerHTML, document.querySelector('#html-mode').checked);

  output.innerHTML = `点击<a id="copyCode">此处</a>复制代码。
  请注意，由于显示部件存在歧义，导出代码不一定包含全部数据实际变化部件，且人称代词可能需要手动修改和补充&lt;&lt;personselect&gt;&gt;类代码。<div class="tempTip"></div>
  <pre contenteditable="plaintext-only"></pre>`;
  document.querySelector('#output pre').innerText = code;

  document.querySelector('#copyCode').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(code); } catch (err) {
      updateTip(document.querySelector('.tempTip'), '复制失败，请手动复制！');
    }
  });
});

// 存储管理
const toggleOptionsManage = () => {
  document.querySelectorAll('#saveManageSaved option').forEach((e) => { e.hidden = 1; });
  document.querySelectorAll(`.${document.querySelector('#saveManageType').value}`)?.forEach((e) => { e.hidden = 0; });
};
toggleOptionsManage();

let savedCode;
const loadSavedCode = () => {
  savedCode = JSON.parse(localStorage.getItem('savedCode')) || {
    widget: {},
    passage: {},
  };

  const genOptions = (type) => Object.keys(savedCode[type]).reduce((names, name) => `${names}<option class="${type}">${name}</option>`, '');
  const options = {
    widget: genOptions('widget'),
    passage: genOptions('passage'),
  };

  document.querySelector('#saveManageSaved').innerHTML = Object.values(options).join('');
  [document.querySelector('#saveManageSaved').value] = Object.keys(savedCode[document.querySelector('#saveManageType').value]);
  document.querySelector('#linkToList').innerHTML = options.passage || '';
  toggleOptionsManage();
};

let overlaySave = false;
document.querySelector('#save').addEventListener('click', () => {
  const name = document.querySelector('#saveName').value;
  const type = document.querySelector('#saveType').value;
  const tipBox = document.querySelector('#codeSaver .tipBox');
  const updateTipSave = (tip, color) => { updateTip(tipBox, tip, color); };

  if (name === '') {
    updateTipSave(tipBox, '请输入名字！');
    return;
  }
  if (savedCode[type][name] && !overlaySave) {
    updateTipSave(`存在同名 ${type}，再次点击“确认”将覆盖`);
    overlaySave = true;
    return;
  }

  savedCode[type][name] = {
    code: getCode(dolEditor.innerHTML, false),
    html: dolEditor.innerHTML,
  };

  localStorage.setItem('savedCode', JSON.stringify(savedCode));
  loadSavedCode();
  updateTipSave(`${type} ${name} 创建成功`, 'gold');
});

document.querySelector('#saveManage').addEventListener('change', (event) => {
  if (event.target.value === 'export' || event.target.value === 'clear') {
    document.querySelector('#saveManageSaved').hidden = 1;
  } else {
    document.querySelector('#saveManageSaved').hidden = 0;
  }
});

let overlayManager = false;

document.querySelector('#saveManageType').addEventListener('change', (event) => {
  toggleOptionsManage();
  document.querySelector('#saveManageSaved').value = document.querySelectorAll(`option.${document.querySelector('#saveManageType').value}`)?.[0]?.value || '';

  if (event.target.value === 'clear') overlayManager = false;
});

document.querySelector('#saveManageConfirm').addEventListener('click', () => {
  const saveManage = document.querySelector('#saveManage').value;
  const saveType = document.querySelector('#saveManageType').value;
  const saveName = document.querySelector('#saveManageSaved').value;
  const tipBox = document.querySelector('#saveManager .tipBox');
  const updateTipManager = (tip, color) => { updateTip(tipBox, tip, color); };

  if (saveManage === 'load') {
    dolEditor.innerHTML = savedCode[saveType][saveName].html;
    // afterInput();
  } else if (saveManage === 'delete') {
    delete savedCode[saveType][saveName];
    localStorage.setItem('savedCode', JSON.stringify(savedCode));
    loadSavedCode();
  } else if (saveManage === 'export') {
    let twee = '<!-- Generated by DOL-pancake -->';
    if (saveType === 'passage') {
      Object.entries(savedCode.passage).forEach(([name, passage]) => {
        twee += `\n:: ${name}\n${passage.code}\n`;
      });
    } else {
      twee += `\n:: Widgets ${Date.now()} [widget]\n`;
      Object.entries(savedCode.widget).forEach(([name, widget]) => {
        twee += `\n<<widget "${name}">>\n${widget.code}\n<</widget>>\n`;
      });
    }

    const blob = new Blob([twee], { type: 'text/plain' });
    saveTwee(blob, `${saveType}s`);
  } else if (saveManage === 'clear') {
    if (overlayManager) {
      updateTipManager(`已删除所有 ${saveType}`);
      overlayManager = false;
    } else {
      updateTipManager(`请再次点击以确认删除所有 ${saveType}`);
      overlayManager = true;
    }
  }
});

const loadAll = () => {
  // loadCustomWidgets();
  loadSavedCode();
  toggleIndex();
};
loadAll();
const tipBoxPancake = document.querySelector('#pancakeManager .tipBox');
document.querySelector('#pancakeManage').addEventListener('change', () => {
  updateTip(tipBoxPancake, '');
});
document.querySelector('#pancakeManageConfirm').addEventListener('click', () => {
  const operate = document.querySelector('#pancakeManage').value;

  if (operate === 'export') {
    const json = JSON.stringify(localStorage);
    const blob = new Blob([json], { type: 'application/json' });
    saveJSON(blob, 'dol-pancke-config');
  } else if (operate === 'import') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (event) => {
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = () => {
        const json = JSON.parse(reader.result);

        Object.entries(json).forEach(([key, item]) => {
          localStorage.setItem(key, item);
        });
        loadAll();
        updateTip(tipBoxPancake, '导入成功', 'gold');
      };
    });
    input.click();
  } else if (operate === 'reset') {
    localStorage.clear();
    loadAll();
    updateTip(tipBoxPancake, '重置成功', 'gold');
  }
});

document.addEventListener('keydown', (event) => {
  event.stopPropagation();
  // 允许回车退出颜色标签，阻止链接内换行，自动添加下一个链接
  if (event.key === 'Enter' && event.target === insertTarget) {
    event.preventDefault();
    getSelectionAndPosition();
    const startContainer = position?.startContainer;

    if (['SPAN', 'A'].includes(startContainer.parentElement.tagName)) {
      if (startContainer.textContent.length !== position?.startOffset) return;
      const empty = document.createTextNode(' ');
      startContainer.parentElement.after(empty);
      createSelection(empty, true);
    } else {
      const br = document.createElement('br');
      insert(br, true);
      findInlineLink(br.previousSibling, () => {
        br.remove();
        const a = document.createElement('a');
        insert(a);
        a.classList.add('normalLink');
        a.innerText = '\u200b';
        a.insertAdjacentHTML('beforebegin', '<br>');
        createSelection(a, true);
      });
    }
  }
}, { passive: false });

// 撤销重做
let undoData = [dolEditor.innerHTML]
let currentIndex = 0

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    undoData = undoData.slice(0, currentIndex + 1)
    if (undoData.at(-1) !== mutation.target.innerHTML) {
      undoData.push(mutation.target.innerHTML)
    }
    currentIndex = undoData.length - 1
  });
  toggleIndex();
});

observer.observe(dolEditor, {
  childList: true,
});

function undo() {
  observer.disconnect()
  currentIndex -= 1
  if (currentIndex < 0) currentIndex = 0
  if (undoData[currentIndex]) dolEditor.innerHTML = undoData[currentIndex]
  observer.observe(dolEditor, {
    childList: true,
  })
}

function redo() {
  observer.disconnect()
  currentIndex += 1
  if (currentIndex > undoData.length) currentIndex = undoData.length
  if(undoData[currentIndex]) dolEditor.innerHTML = undoData[currentIndex]
  observer.observe(dolEditor, {
    childList: true,
  })
}

document.addEventListener('keydown', (event) => {
  event.stopPropagation();
  if (event.ctrlKey) {
    if (event.key === 'z') {
      undo()
    } else if (event.key === 'y') {
      redo()
    }
  }
})

document.querySelector('#undo').addEventListener('click', undo);
document.querySelector('#redo').addEventListener('click', redo);

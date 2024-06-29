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

// 生成 twee 代码
const replacePronouns = (string, replacement) => string.replaceAll('\u200b', '')
  .replaceAll('他们', '\u200b们')
  .replaceAll('她们', '\u200c们')
  .replaceAll('其他', '其\u200b')
  .replaceAll('他妈', '\u200b妈')
  .replaceAll('他人', '\u200b人')
  .replaceAll('他娘', '\u200b娘')
  .replaceAll('他', replacement)
  .replaceAll('她', replacement)
  .replaceAll('\u200b', '他')
  .replaceAll('\u200c', '她');
const getCode = (sourceHTML, isHTML = false) => {
  const mockOutput = document.createElement('div');
  mockOutput.innerHTML = sourceHTML;

  Object.values(mockOutput.children).forEach((child) => {
    if (child.tagName === 'A') {
      child.textContent = replacePronouns(child.textContent, '${$NPCList[0].pronouns.him}');

      const endevent = child.getAttribute('endevent') ? `<<${child.getAttribute('endevent')}>>` : '';
      const linktime = child.getAttribute('linktime') ? `<<pass ${child.getAttribute('linktime')}>>` : '';
      const linkto = child.getAttribute('linkto') || '';

      const code = child.outerHTML.replace('</a>', `\`|${linkto}]]>>${linktime}${endevent}<</link>>`);

      if (child.classList.contains('nextWraith')) {
        child.setAttribute('code', code.replace(/<a.*?>/gi, '<span id="next" class="nextWraith"><<link [[`'));
      } else if (child.classList.contains('normalLink')) {
        child.setAttribute('code', code.replace(/<a.*?>/gi, '<<link [[`'));
      }
    }
    if (child.getAttribute('code')) {
      let valueCode = child.getAttribute('valueCode') || '';
      if (valueCode !== '') {
        findInlineLink(child.previousSibling, (link) => {
          link.textContent = link.textContent.replace('<</link>>', `${valueCode}<</link>>`);
          valueCode = '';
        });
      }
      const code = document.createTextNode(`${child.getAttribute('code')}${valueCode}`);
      mockOutput.replaceChild(code, child);
    }
    if (Array.from(child.childNodes).every((grandChild) => grandChild.nodeType !== 3 || grandChild.textContent === '') && child.tagName === 'SPAN') {
      child.outerHTML = child.innerHTML;
    }
    if (child.innerText === '\u200b') child.remove();
  });
  let code = mockOutput.innerHTML;
  code = code.split('\n').map((line) => (line.endsWith(' ') ? line.slice(0, -1) : line)).join('\n');
  code = code.replaceAll('\n', '<br>').replaceAll('<br>', '<br>\n')
    .replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  code = replacePronouns(code, '<<he>>');
  if (isHTML) {
    code = code.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  return code;
};

// 自定义部件
let customWidgets;
const loadCustomWidgets = () => {
  customWidgets = JSON.parse(localStorage.getItem('customWidgets')) || {};
  if (customWidgets) {
    const customWidgetSelect = document.querySelector('#customNames');
    customWidgetSelect.innerHTML = `${
      Object.keys(customWidgets).reduce((widgets, widget) => `${widgets}<option>${widget}</option>`, '')
    }<option>新建</option>`;
  }
};
const loadCustomEditor = () => {
  document.querySelector('#customEditor')?.remove();
  const newWidgetEditor = document.createElement('div');
  document.querySelector('#customWidget').after(newWidgetEditor);
  newWidgetEditor.outerHTML = `<div id="customEditor"><div class="item">
      <label>部件名称：</label>
      <input type="text" id="customWidgetName" placeholder="将置入<<>>中为导出代码所用"></input></div>
      <div class="item" style="display: flex; flex-wrap: wrap;">
      <label>部件显示：</label>
      <div id="customWidgetDisplay" contenteditable="plaintext-only"></div></div>
      <div class="item" style="display: flex; flex-wrap: wrap;">
      <label for="twee">twee 代码：</label>
      <textarea name="twee" id="twee" placeholder="可留空，在“插入”时，为“导出代码”所用；在“导出所有”时，替代由“部件显示”自动转化的代码"></textarea></div>
      <div class="item">
      <button id="customWidgetSave" class="small">保存</button>
      <button id="customWidgetInsert" class="small">插入</button>
      <button id="customWidgetQuit" class="small">取消</button>
      <label for="useHTML" style="font-size: .9em;">使用HTML</label><input type="checkbox" id="useHTML" name="useHTML" /></div>
      <div class="item" style="font-size: .9em;" id="tipBox"></div>
      </div>`;
  const newWidgetDisplay = document.querySelector('#customWidgetDisplay');
  generateInsertTarget(newWidgetDisplay);
  const overlayWidget = [false, false, false];
  const tipBox = document.getElementById('tipBox');
  const updateTipWidget = (tip, color) => { updateTip(tipBox, tip, color); };
  document.querySelector('#customWidgetSave').addEventListener('click', () => {
    const display = document.querySelector('#customWidgetDisplay');
    const widgetName = document.querySelector('#customWidgetName').value;
    const code = document.querySelector('#useHTML').checked ? display.textContent : display.innerHTML;
    const twee = document.querySelector('#twee').value;

    if (widgetName === '新建' || widgetName.includes('<') || widgetName.includes('>')) {
      updateTipWidget('用这种名字会出bug的QAQ');
      return;
    }
    if (customWidgets[widgetName] && !overlayWidget[0]) {
      updateTipWidget('存在同名部件，再次点击“确认”将覆盖');
      overlayWidget[0] = true;
      return;
    }
    if (widgetName === '') {
      updateTipWidget('请输入名字！');
      return;
    }
    if (code === '' && !overlayWidget[1]) {
      updateTipWidget(`显示没填哦！
      如果确定要创建空显示部件，请再次点击“确认”，创建的部件会显示在编辑框中，而不会出现在生成的图片里。`);
      overlayWidget[1] = true;
      return;
    }
    if (overlayWidget[0]) overlayWidget[0] = false;
    if (overlayWidget[1]) overlayWidget[1] = false;
    customWidgets[widgetName] = {
      html: code || `<span class="noDisplay">${widgetName}</span>`,
      twee,
    };
    localStorage.setItem('customWidgets', JSON.stringify(customWidgets));
    loadCustomWidgets();
    document.querySelector('#customNames').value = '新建';
    updateTipWidget(`${widgetName} 创建成功`, 'gold');
  });
  document.querySelector('#customWidgetInsert').addEventListener('click', () => {
    const twee = document.querySelector('#twee').value;
    const widgetName = document.querySelector('#customWidgetName').value;
    const display = document.querySelector('#customWidgetDisplay');
    const code = document.querySelector('#useHTML').checked ? display.textContent : display.innerHTML;

    if (code === '' && !overlayWidget[2]) {
      updateTipWidget(`显示没填哦！
      如果确定要插入空显示部件，请再次点击“确认”，插入的部件会显示在编辑框中，而不会出现在生成的图片里。`);
      overlayWidget[2] = true;
      return;
    }
    if (overlayWidget[2]) overlayWidget[2] = false;

    generateInsertTarget(dolEditor);
    insertHard(code || `<span class="noDisplay">${widgetName || twee}</span>`, twee || getCode(code));
  });
  document.querySelector('#customWidgetQuit').addEventListener('click', () => {
    document.querySelector('#customEditor').remove();
  });
};
document.querySelector('#customNames').addEventListener('change', (event) => {
  if (event.target.value !== '新建') return;
  loadCustomEditor();
});
document.querySelector('#customInsert').addEventListener('click', () => {
  const name = document.querySelector('#customNames').value;
  if (name === '新建') {
    loadCustomEditor();
    return;
  }
  generateInsertTarget(dolEditor);
  insertHard(customWidgets[name].html || customWidgets[name], `<<${name}>>`);
});
document.querySelector('#customDelete').addEventListener('click', () => {
  const name = document.querySelector('#customNames').value;
  if (name === '新建') return;
  delete customWidgets[name];
  localStorage.setItem('customWidgets', JSON.stringify(customWidgets));
  loadCustomWidgets();
});
document.querySelector('#customExport').addEventListener('click', () => {
  let twee = `<!-- Generated by DOL-pancake -->\n:: Widget ${Date.now()} [widget]\n`;

  Object.entries(customWidgets).forEach(([name, widget]) => {
    twee += `\n<<widget "${name}">>\n${
      widget.twee || getCode(widget.html || widget)
    }\n<</widget>>\n`;
  });

  const blob = new Blob([twee], { type: 'text/plain' });
  saveTwee(blob, 'widgets');
});

// 预览图片
document.querySelector('#pic').addEventListener('click', () => {
  document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'none'; });
  output.innerText = '生成图片中……';
  domToPng(document.querySelector('#dol'), {
    scale: 2,
    features: {
      removeControlCharacter: false
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
      removeControlCharacter: false
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
  loadCustomWidgets();
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
      insert(br, 1);
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
    console.log(undoData.length, currentIndex)
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
  console.log(undoData.length, currentIndex)
}

function redo() {
  observer.disconnect()
  currentIndex += 1
  if (currentIndex > undoData.length) currentIndex = undoData.length
  if(undoData[currentIndex]) dolEditor.innerHTML = undoData[currentIndex]
  observer.observe(dolEditor, {
    childList: true,
  })
  console.log(undoData.length, currentIndex)
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

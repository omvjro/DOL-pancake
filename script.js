import {
  colors, npcList, statics, diffiColors, tagColors,
} from './data.js';

const dolEditor = document.querySelector('div.passage');
const output = document.querySelector('#output');

Object.keys(colors).forEach((id) => {
  let options = '';
  colors[id].forEach((color) => {
    options += `<option${color.length === 1 ? ` class="${color[0]}"` : ''} value="${color[0]}">${color.at(-1)}</option>`;
  });
  document.getElementById(id).innerHTML += options;
});

Object.keys(statics).forEach((type) => {
  let options = '';
  Object.keys(statics[type]).forEach((id) => {
    options += `<option class="${type}" value="${id}">${statics[type][id].name}</option>`;
  });
  document.getElementById('static-type').innerHTML += options;
});

// 链接标号
const toggleIndex = (isChecked) => document.querySelectorAll('#dol a').forEach((a, index) => {
  if (isChecked) {
    a.setAttribute('data-index', `(${index + 1}) `);
    a.setAttribute('data-if-index', '1');
  } else { a.setAttribute('data-if-index', '0'); }
});
toggleIndex(true);
document.querySelector('#link-num').addEventListener('change', (event) => {
  event.target.toggleAttribute('checked');
  toggleIndex(event.target.checked);
});
document.addEventListener('click', () => {
  toggleIndex(document.querySelector('#link-num').checked);
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
document.querySelector('#direct-paste').addEventListener('change', (event) => {
  editableSwitch(event.target.checked);
});

// 准备插入元素
let selection;
let position;
let insertTarget;
const generateInsertTarget = (target) => {
  insertTarget = target;
  insertTarget.addEventListener('blur', () => {
    selection = window.getSelection();
    position = selection.getRangeAt(0);
  });
  insertTarget.addEventListener('input', (event) => {
    Object.values(event.target.children).forEach((child) => {
      if (child?.tagName === 'FONT') {
        child.before(document.createTextNode(child.innerText));
        child.remove();
      }
    });
  });
  insertTarget.addEventListener('click', () => {
    insertTarget = target;
  });
};
generateInsertTarget(dolEditor);

const insert = (element, cursor = 0) => {
  if (selection?.isCollapsed === false) { selection.deleteFromDocument(); }
  if (position?.startContainer.parentElement.parentElement === insertTarget) {
    position.startContainer.parentElement.after(element);
  } else if (position?.startContainer.parentElement === insertTarget) {
    position.insertNode(element);
  } else {
    insertTarget.append(element);
  }
  const newSelection = window.getSelection();
  newSelection.removeAllRanges();
  const range = document.createRange();
  range.selectNode(element);
  if (cursor) { range.collapse(0); }
  newSelection.addRange(range);
};

const wrap = (element) => {
  element.innerText = selection.toString();
  selection.getRangeAt(0).surroundContents(element);
};

const getOptionText = (id) => document.getElementById(id)?.options[document.getElementById(id)?.selectedIndex]?.text;

// 分类显示数据变化
const staticClass = document.querySelector('#static-class');
const toggleOptions = () => {
  document.querySelectorAll('#static-type option').forEach((e) => { e.hidden = 1; });
  document.querySelectorAll(`.${staticClass.value}`).forEach((e) => { e.hidden = 0; });
};
toggleOptions();
staticClass.addEventListener('change', () => {
  toggleOptions();
  document.querySelector('#static-type').value = document.querySelectorAll(`.${staticClass.value}`)[0].value;
  document.querySelector('#static-type').dispatchEvent(new Event('change'));
});

// 插入数据变化
document.querySelector('#static-type').addEventListener('change', (event) => {
  document.querySelector('#static-npc')?.remove();
  const type = event.target.value;
  const stat = statics[staticClass.value][type];

  if (stat.limit) {
    document.querySelectorAll('#static-plus option').forEach((option) => {
      if (option.value.includes('g')) {
        if (option.value.length > stat.limit[0]) {
          option.hidden = 1;
        }
      } else if (option.value.length > stat.limit[1]) {
        option.hidden = 1;
      }
    });
    document.querySelector('#static-plus').value = 'g';
  } else {
    document.querySelectorAll('#static-plus option').forEach((option) => {
      option.hidden = 0;
    });
  }

  if (!npcList[type]) return;
  const npcSelect = document.createElement('select');
  event.target.before(npcSelect);
  let npcOptions = '';
  Object.keys(npcList[type]).forEach((npc) => {
    npcOptions += `<option value="${npc}">${npcList[type][npc]}</option>`;
  });
  npcSelect.outerHTML = `<select id="static-npc" name="static-npc">${npcOptions}</select> `;
});
document.querySelector('#static').addEventListener('click', () => {
  let plus = document.getElementById('static-plus').value;
  const isPlus = plus.includes('g');
  let type = document.getElementById('static-type').value;
  const npc = document.getElementById('static-npc')?.value;
  const stat = statics[staticClass.value][type];

  if (stat.variant) {
    plus = plus.startsWith('g') ? plus.replaceAll('g', 'l') : plus.replaceAll('l', 'g');
    type = stat.variant;
  }

  let valueType = stat.valueMacro || type;
  if (staticClass.value === 'npc') {
    valueType = `npcincr "${stat.npc || npc}" ${stat.valueType || type}`;
  }

  let code = `<<${plus}${type}${npc ? ` "${npc}"` : ''}>>`;
  const valueCode = stat.value ? `<<${valueType} ${isPlus ? '' : '-'}${stat.value[plus.length - 1]}>>` : '';
  let text = `${getOptionText('static-plus')} ${getOptionText('static-npc') || ''}${stat.name}`;
  [text, , code] = stat.decorate?.({
    text, isPlus, code,
  }) || [text, isPlus, code];

  let color = stat.colors?.[+!isPlus];
  if (!color) {
    if (stat.positive || staticClass.value === 'skill') {
      color = isPlus ? 'green' : 'red';
    } else {
      color = isPlus ? 'red' : 'green';
    }
  }

  const widget = document.createElement('widget');
  widget.innerHTML = ` | <span class="${color}">${text}</span>`;
  widget.setAttribute('code', code);
  widget.setAttribute('valueCode', valueCode);
  widget.contentEditable = false;
  insert(widget, 1);
});

// 插入技能检定
document.querySelector('#skill-check-type').addEventListener('change', (event) => {
  document.querySelectorAll('.custom')?.forEach((e) => e.remove());
  if (document.getElementById('skill-check-type').value === 'custom') {
    const customInput = document.createElement('input');
    event.target.after(customInput);
    customInput.outerHTML = `
      <input type="text" class="custom" name="custom_skill" id="custom_skill" placeholder="技能名称"></input>
      <input type="text" class="custom" name="custom_value" id="custom_value" placeholder="判定变量"></input>`;
  }
});
document.querySelector('#skill-check').addEventListener('click', () => {
  const type = document.getElementById('skill-check-type').value;
  const diffi = document.getElementById('skill-check-diffi').value;
  let code;
  let typeDisplay = getOptionText('skill-check-type');

  if (type !== 'custom') {
    code = `<<${type}difficulty>>`;
  } else { // 自定义技能
    typeDisplay = document.getElementById('custom_skill').value;
    const typeValue = document.getElementById('custom_value').value;
    code = `<<skill_difficulty \`${typeValue}\` "${typeDisplay}">>`;
  }

  const skillcheck = document.createElement('skillcheck');
  skillcheck.innerHTML = ` | <span class="orange">${typeDisplay}</span>：<span class="${diffiColors[diffi]}">${getOptionText('skill-check-diffi')}</span>`;
  skillcheck.setAttribute('code', code);
  skillcheck.contentEditable = false;
  insert(skillcheck, 1);
});

// 插入标签
document.querySelectorAll('.tags').forEach((sel) => {
  sel.addEventListener('change', (event) => {
    const type = event.target.value;
    const tag = document.createElement('tag');
    tag.innerHTML = ` | <span class="${tagColors[type]}">${getOptionText(event.target.id)}</span>`;
    tag.setAttribute('code', `<<${type}>>`);
    tag.contentEditable = false;
    insert(tag, 1);
    event.target.value = '';
  });
});
document.querySelector('#lewd-tip').addEventListener('click', () => {
  const type = document.querySelector('#lewd-tip-type').value;
  const grade = document.querySelector('#lewd-tip-grade').value;
  const tag = document.createElement('tag');
  let text = `${getOptionText('lewd-tip-type')} ${getOptionText('lewd-tip-grade')}`;
  if (grade === '6') text = `!${text}!`;
  tag.innerHTML = ` | <span class="${tagColors[grade]}">${text}</span>`;
  tag.setAttribute('code', `<<${type}${grade}>>`);
  tag.contentEditable = false;
  insert(tag, 1);
});

// 插入颜色文字
document.querySelectorAll('.colorspan').forEach((sel) => {
  sel.addEventListener('change', (event) => {
    const spanText = event.target.id === 'link' ? 'a' : 'span';
    const span = document.createElement(spanText);
    span.classList.add(event.target.value);
    if (selection.isCollapsed) {
      span.innerText = spanText === 'a' ? '\u200b继续' : '\u200b请输入文本';
      insert(span);
      span.after(document.createTextNode(' '));
    } else {
      wrap(span);
    }
    event.target.value = '';
  });
});

// 插入图片
document.querySelector('#insertPic').addEventListener('input', (event) => {
  const img = new Image();
  const reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = () => {
    img.src = reader.result;
    insert(img, 1);
    event.target.value = '';
  };
  img.addEventListener('dragstart', () => {
    document.querySelector('#direct-paste').checked = true;
    editableSwitch(true, true);
  });
});

// 自定义部件
const customWidgets = JSON.parse(localStorage.getItem('customWidgets')) || {};
const loadCustomWidgets = () => {
  if (customWidgets) {
    const customWidgetSelect = document.querySelector('#customNames');
    let widgetOptions = '';
    Object.keys(customWidgets).forEach((widget) => {
      widgetOptions += `<option>${widget}</option>`;
    });
    customWidgetSelect.innerHTML = `${widgetOptions}<option>新建</option>`;
  }
};
loadCustomWidgets();
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
      <div class="item">
      <button id="customWidgetSave" class="small">保存</button>
      <button id="customWidgetQuit" class="small">取消</button>
      <label for="useHTML" style="font-size: .9em;">使用HTML</label><input type="checkbox" id="useHTML" name="useHTML" /></div>
      <div class="item" style="font-size: .9em;" id="tipBox"></div>
      </div>`;
  const newWidgetDisplay = document.querySelector('#customWidgetDisplay');
  generateInsertTarget(newWidgetDisplay);
  let overlay = false;
  document.querySelector('#customWidgetSave').addEventListener('click', () => {
    const tipBox = document.getElementById('tipBox');
    const updateTip = (tip, color = 'red') => {
      tipBox.innerHTML = `<span class="${color}">${tip}</span>`;
    };
    const display = document.querySelector('#customWidgetDisplay');
    const widgetName = document.querySelector('#customWidgetName').value;
    const code = document.querySelector('#useHTML').checked ? display.textContent : display.innerHTML;
    if (widgetName === '新建' || widgetName.includes('<') || widgetName.includes('>')) {
      updateTip('用这种名字会出bug的QAQ');
      return;
    }
    if (customWidgets[widgetName] && !overlay) {
      updateTip('存在同名部件，再次点击“确认”将覆盖');
      overlay = true;
      return;
    }
    if (widgetName === '' || code === '') {
      updateTip('还有东西没填哦');
      return;
    }
    if (overlay) overlay = false;
    customWidgets[widgetName] = code;
    localStorage.setItem('customWidgets', JSON.stringify(customWidgets));
    loadCustomWidgets();
    document.querySelector('#customNames').value = '新建';
    updateTip(`${widgetName} 创建成功`, 'gold');
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
  const widget = document.createElement('widget');
  widget.innerHTML = customWidgets[name];
  widget.setAttribute('code', `<<${name}>>`);
  widget.contentEditable = false;
  generateInsertTarget(dolEditor);
  insert(widget);
});
document.querySelector('#customDelete').addEventListener('click', () => {
  const name = document.querySelector('#customNames').value;
  if (name === '新建') return;
  delete customWidgets[name];
  localStorage.setItem('customWidgets', JSON.stringify(customWidgets));
  loadCustomWidgets();
});

// 更换主题
document.querySelector('#theme').addEventListener('change', (event) => {
  document.querySelector('#body').setAttribute('data-theme', event.target.value);
});

/* global modernScreenshot */
// 预览图片
document.querySelector('#pic').addEventListener('click', () => {
  output.innerText = '生成图片中……';
  modernScreenshot.domToPng(document.querySelector('#dol'), { scale: 2 }).then((dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.alt = 'dol-pancake';
    output.innerText = '';
    output.appendChild(img);
  }).catch((error) => {
    output.innerText = `出错了（${error}）`;
  });
});

// 下载图片
document.querySelector('#pic-down').addEventListener('click', () => {
  output.innerText = '生成图片中……';
  modernScreenshot.domToPng(document.querySelector('#dol'), { scale: 2 }).then((dataUrl) => {
    const link = document.createElement('a');
    link.download = `dol-pancake-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    output.innerText = '';
  }).catch((error) => {
    output.innerText = `出错了（${error}）`;
  });
});

// 导出代码
document.querySelector('#code').addEventListener('click', () => {
  const isHTML = document.querySelector('#html-mode').checked;
  const mockOutput = document.createElement('div');
  mockOutput.innerHTML = dolEditor.innerHTML;

  mockOutput.childNodes.forEach((child) => {
    if (child.nodeType === 1) {
      if (child.classList.contains('nextWraith')) {
        child.setAttribute('code', child.outerHTML
          .replace(/<a.*?>/gi, '<span id="next" class="nextWraith"><<link [[')
          .replace('</a>', '|]]>><</link>>'));
      }
      if (child.classList.contains('normalLink')) {
        child.setAttribute('code', child.outerHTML
          .replace(/<a.*?>/gi, '<<link [[')
          .replace('</a>', '|]]>><</link>>'));
      }
      if (child.getAttribute('code')) {
        let valueCode = child.getAttribute('valueCode') || '';
        if (valueCode !== '') {
          (function addValueCodeToInlineLink(candidate) {
            if (!candidate) { return; }
            const candidateContent = candidate.textContent;
            if (candidateContent.includes('\n')) { return; }
            if (candidateContent.includes('<</link>>')) {
              candidate.textContent = candidateContent.replace('<</link>>', `${valueCode}<</link>>`);
              valueCode = '';
              return;
            }
            addValueCodeToInlineLink(candidate.previousSibling);
          }(child.previousSibling));
        }
        const code = document.createTextNode(`${child.getAttribute('code')}${valueCode}`);
        mockOutput.replaceChild(code, child);
      }
      if (Array.from(child.childNodes).every((grandChild) => grandChild.nodeType !== 3 || grandChild.textContent === '') && child.tagName === 'SPAN') {
        child.outerHTML = child.innerHTML;
      }
      if (child.innerText === '\u200b') child.remove();
    }
    if (isHTML) {
      child.textContent = child.textContent.replaceAll('"', '&quot;').replaceAll("'", '&#39;');
    }
  });
  let code = mockOutput.innerHTML;
  code = code.split('\n').map((line) => (line.endsWith(' ') ? line.slice(0, -1) : line)).join('\n');
  code = code.replaceAll('\n', '\n<br>\n') // 换行
    .replaceAll('\n\n', '\n')
    .replaceAll('\u200b', '') // 颜色文本残余
    .replaceAll('&lt;', '<') // 尖括号
    .replaceAll('&gt;', '>')
    .replaceAll('他们', '\u200b们') // 人称代词
    .replaceAll('她们', '\u200c们')
    .replaceAll('其他', '其\u200b')
    .replaceAll('他妈', '\u200b妈')
    .replaceAll('他人', '\u200b人')
    .replaceAll('他娘', '\u200b娘')
    .replaceAll('他', '<<he>>')
    .replaceAll('她', '<<he>>')
    .replaceAll('\u200b', '他')
    .replaceAll('\u200c', '她');
  if (isHTML) {
    code = code.replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('&amp;', '&');
  }

  (async () => {
    try { await navigator.clipboard.writeText(code); } finally {
      output.innerHTML = `代码已复制到剪贴板，如未成功，请在下方手动复制，也可以点击<a id="downTwee">此处</a>将代码下载为 twee 文件。
      请注意，由于显示部件存在歧义，导出代码不一定包含全部数据实际变化部件，且人称代词可能需要手动修改和补充&lt;&lt;personselect&gt;&gt;类代码。
      <pre contenteditable="plaintext-only"></pre>`;
      document.querySelector('#output pre').innerText = code;
      const link = document.querySelector('#downTwee');
      link.download = `dol-pancake-${Date.now()}.twee`;
      const twee = new Blob([code], { type: 'text/plain' });
      link.href = URL.createObjectURL(twee);
    }
  })();
});

// 清空内容
document.querySelector('#clear').addEventListener('click', () => {
  dolEditor.innerText = '';
  output.innerText = '';
});

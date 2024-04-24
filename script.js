import {
  colors, npcList, statics, diffiColors, tagColors, hollows,
} from './lib/data.js';
import { saveTwee, savePng, saveJSON } from './lib/save.js';

const dolEditor = document.querySelector('div.passage');
const output = document.querySelector('#output');
let originalHTML;
const undoData = [];
let redoData = [];
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

Object.entries(colors).forEach(([id, colorSet]) => {
  document.getElementById(id).innerHTML += colorSet.reduce((options, [color, name]) => `${options}
  <option${!name ? ` class="${color}"` : ''} value="${color}">${name || color}</option>`, '');
});

document.getElementById('static-type').innerHTML = Object.entries(statics).reduce((goptions, [clas, stats]) => `${goptions}${
  Object.entries(stats).reduce((options, [value, { name }]) => `${options}<option class="${clas}" value="${value}">${name}</option>`, '')
}`, '');

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
    a.setAttribute('data-index', `(${index + 1}) `);
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
document.querySelector('#direct-paste').addEventListener('change', (event) => {
  editableSwitch(event.target.checked);
});

// 准备插入元素
let selection;
let position;
let insertTarget;

const recordData = () => {
  undoData.push(insertTarget.innerHTML);
  redoData = [];
};

const createSelection = (element, isCollapsed = false) => {
  const newSelection = window.getSelection();
  newSelection.removeAllRanges();
  const range = document.createRange();
  range.selectNode(element);
  if (isCollapsed) range.collapse(0);
  newSelection.addRange(range);
};
const insert = (element, isCollapsed) => {
  if (selection?.isCollapsed === false) selection.deleteFromDocument();
  if (position?.startContainer.parentElement.parentElement === insertTarget) {
    position.startContainer.parentElement.after(element);
  } else if (position?.startContainer.parentElement === insertTarget || position?.startContainer === insertTarget) {
    position.insertNode(element);
  } else {
    insertTarget.append(element);
  }
  createSelection(element, isCollapsed);
  recordData();
  toggleIndex();
};
const insertHard = (html, code, decorate) => {
  const widget = document.createElement('widget');
  widget.innerHTML = html;
  widget.setAttribute('code', code);
  widget.contentEditable = false;
  decorate?.(widget);
  insert(widget, 1);
};
const getSelectionAndPosition = () => {
  selection = window.getSelection();
  position = selection.getRangeAt(0);
};

const generateInsertTarget = (target) => {
  insertTarget = target;
  originalHTML = insertTarget.innerHTML;
  undoData.push(originalHTML);
  insertTarget.addEventListener('blur', getSelectionAndPosition);
  insertTarget.addEventListener('input', (event) => {
    Object.values(event.target.children).forEach((child) => {
      if (child?.tagName === 'FONT') {
        child.before(document.createTextNode(child.innerText));
        child.remove();
      }
    });

    toggleIndex();
    recordData();
  });
  insertTarget.addEventListener('click', () => {
    insertTarget = target;
  });
};
generateInsertTarget(dolEditor);

const wrap = (element) => {
  element.innerText = selection.toString().replaceAll('\n', '');
  insert(element, true);
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
  npcSelect.outerHTML = `<select id="static-npc" name="static-npc">${
    Object.entries(npcList[type]).reduce((npcs, [value, npc]) => `${npcs}<option value="${value}">${npc}</option>`, '')
  }</select>`;
});
document.querySelector('#static').addEventListener('click', () => {
  let plus = document.getElementById('static-plus').value;
  const isPlus = plus.includes('g');
  let type = document.getElementById('static-type').value;
  const npc = document.getElementById('static-npc')?.value;
  const stat = statics[staticClass.value][type];

  if (stat.variant) {
    plus = isPlus ? plus.replaceAll('g', 'l') : plus.replaceAll('l', 'g');
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

  insertHard(` | <span class="${color}">${text}</span>`, code, (widget) => widget.setAttribute('valueCode', valueCode));
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

  insertHard(` | <span class="orange">${typeDisplay}</span>：<span class="${diffiColors[diffi]}">${getOptionText('skill-check-diffi')}</span>`, code);
});

// 插入标签
document.querySelectorAll('.tags').forEach((sel) => {
  sel.addEventListener('change', (event) => {
    const type = event.target.value;
    insertHard(
      ` | <span class="${tagColors[type]}">${getOptionText(event.target.id)}</span>`,
      `<<${type}>>`,
    );
    event.target.value = '';
  });
});
document.querySelector('#lewd-tip').addEventListener('click', () => {
  const type = document.querySelector('#lewd-tip-type').value;
  const grade = document.querySelector('#lewd-tip-grade').value;
  let text = `${getOptionText('lewd-tip-type')} ${getOptionText('lewd-tip-grade')}`;
  if (grade === '6') text = `!${text}!`;
  insertHard(` | <span class="${tagColors[grade]}">${text}</span>`, `<<${type}${grade}>>`);
});

// 插入颜色文字
const insertOrWrap = (element) => {
  if (selection?.isCollapsed || !selection) {
    element.innerText = '\u200b请输入文本';
    insert(element);
  } else {
    wrap(element);
  }
};
document.querySelectorAll('.colorspan').forEach((sel) => {
  sel.addEventListener('change', (event) => {
    const span = document.createElement('span');
    span.classList.add(event.target.value);
    insertOrWrap(span);
    event.target.value = '';
  });
});
document.querySelector('#biu').addEventListener('change', (event) => {
  const element = document.createElement(event.target.value);
  insertOrWrap(element);
  event.target.value = '';
});

// 插入链接
document.querySelector('#linkConfirm').addEventListener('click', () => {
  const link = document.createElement('a');
  const time = document.querySelector('#linkTime').value || '';
  link.classList.add(document.querySelector('#link').value);
  link.setAttribute('endevent', document.querySelector('#endevent').value || '');
  link.setAttribute('linkto', document.querySelector('#linkTo').value || '');
  link.setAttribute('linktime', time);
  if (position?.startContainer.parentElement !== insertTarget) {
    selection.collapse(insertTarget);
  }
  if (selection?.isCollapsed || !selection) {
    link.innerText = '\u200b继续';
    if (time !== '') link.innerText += ` (${Math.floor(time / 60)}:${(`${time % 60}`).padStart(2, '0')})`;
    insert(link);
  } else {
    wrap(link);
  }
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

const updateTip = (tipbox, tip, color = 'red') => {
  tipbox.innerHTML = `<span class="${color}">${tip}</span>`;
};

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
    insertHard(code || `<span class="noDisplay">${widgetName}</span>`, twee || getCode(code));
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
  saveTwee(blob, `widgets-${Date.now()}.twee`);
});

// 更换主题
const loadTheme = () => {
  document.querySelector('#body').setAttribute('data-theme', localStorage.getItem('theme'));
  document.querySelector('#theme').value = localStorage.getItem('theme') || '';
};
document.querySelector('#theme').addEventListener('change', (event) => {
  localStorage.setItem('theme', event.target.value);
  loadTheme();
});

/* global modernScreenshot */
// 预览图片
document.querySelector('#pic').addEventListener('click', () => {
  document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'none'; });
  output.innerText = '生成图片中……';
  modernScreenshot.domToPng(document.querySelector('#dol'), { scale: 2 }).then((dataUrl) => {
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
  modernScreenshot.domToBlob(document.querySelector('#dol'), { scale: 2 }).then((blob) => {
    savePng(blob, `dol-pancake-${Date.now()}.png`);
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
    recordData();
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
    saveTwee(blob, `${saveType}s-${Date.now()}.twee`);
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

// 设置管理
const loadAll = () => {
  loadCustomWidgets();
  loadSavedCode();
  loadTheme();
};
loadAll();
const tipBoxPancake = document.querySelector('#pancakeManager .tipBox');
document.querySelector('#pancakeManage').addEventListener('change', () => {
  updateTip(tipBoxPancake, '');
});
document.querySelector('#pancakeManageConfirm').addEventListener('click', () => {
  const operate = document.querySelector('#pancakeManage').value;
  const injection = 'injected for recognition';

  if (operate === 'export') {
    let json = `{"//":"${injection}",`;
    let count = 0;
    Object.entries(localStorage).forEach(([key, item]) => {
      count += 1;
      json += `"${key}":${JSON.stringify(item) === `"${item}"` ? `"${item}"` : item}`;
      if (count !== Object.keys(localStorage).length) json += ',';
    });
    json += '}';

    const blob = new Blob([json], { type: 'application/json' });
    saveJSON(blob, `dol-pancke-config-${Date.now()}.json`);
  } else if (operate === 'import') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (event) => {
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = () => {
        const json = JSON.parse(reader.result);
        if (json['//'] !== injection) {
          updateTip(tipBoxPancake, '该文件不是有效的烤饼机设置');
          return;
        }
        Object.entries(json).forEach(([key, item]) => {
          if (key === '//') return;
          const jitem = JSON.stringify(item);
          localStorage.setItem(key, jitem === `"${item}"` ? item : jitem);
          loadAll();
        });
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

// 撤销
const undo = () => {
  const previousHTML = undoData.at(-2);
  const currentHTML = undoData.pop();
  if (currentHTML) redoData.push(currentHTML);
  if (previousHTML) insertTarget.innerHTML = previousHTML;
};
const redo = () => {
  const nextHTML = redoData.pop();
  if (nextHTML) {
    insertTarget.innerHTML = nextHTML;
    undoData.push(nextHTML);
  }
};

document.querySelector('#undo').addEventListener('click', undo);
document.querySelector('#redo').addEventListener('click', redo);
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey) {
    if (event.key === 'z') {
      undo();
    } else if (event.key === 'y') {
      redo();
    }
  }
  // 允许回车退出颜色标签，阻止链接内换行
  if (event.key === 'Enter' && event.target === insertTarget) {
    event.stopPropagation();
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
        a.insertAdjacentText('beforebegin', '\n');
        createSelection(a, true);
      });
    }
  }
}, { passive: false });

// 清空内容
document.querySelector('#clear').addEventListener('click', () => {
  dolEditor.innerText = '';
  output.innerText = '';
  recordData();
});

import {
  colors, npcList, statics, diffiColors, tagColors, hollows,
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

// 高级选项
const switchAdvanced = () => {
  document.querySelectorAll('.advanced').forEach((advanced) => {
    advanced.hidden = advanced.hidden ? 0 : 1;
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
  if (selection?.isCollapsed === false) selection.deleteFromDocument();
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
  if (cursor) range.collapse(0);
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
    const span = document.createElement('span');
    span.classList.add(event.target.value);
    if (selection?.isCollapsed || !selection) {
      span.innerText = '\u200b请输入文本';
      insert(span);
      span.after(document.createTextNode(' '));
    } else {
      wrap(span);
    }
    event.target.value = '';
  });
});

// 插入链接
document.querySelector('#linkConfirm').addEventListener('click', () => {
  const link = document.createElement('a');
  const time = document.querySelector('#linkTime').value || '';
  link.classList.add(document.querySelector('#link').value);
  link.setAttribute('endevent', document.querySelector('#endevent').value || '');
  link.setAttribute('linkto', document.querySelector('#linkTo').value || '');
  link.setAttribute('linktime', time);
  if (selection?.isCollapsed || !selection) {
    link.innerText = '\u200b继续';
    if (time !== '') link.innerText += ` (${Math.floor(time / 60)}:${(`${time % 60}`).padStart(2, '0')})`;
    insert(link);
    link.after(document.createTextNode(' '));
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

// 插入常用不可见部件
let hollowOptions = '';
Object.keys(hollows).forEach((key) => {
  hollowOptions += `<select id=${key}>
  <option value="" style='display: none'>${key === 'person' ? 'personselect' : key}</option>`;
  hollows[key].forEach((option) => {
    hollowOptions += `<option>${option}</option>`;
  });
  hollowOptions += '</select>\n';
});
document.querySelector('#hollows').innerHTML = hollowOptions;
document.querySelectorAll('#hollows select').forEach((select) => {
  select.addEventListener('change', (event) => {
    const hollow = event.target.value;
    const widget = document.createElement('widget');
    widget.classList.add('noDisplay');
    widget.innerText = `${hollow}`;
    widget.setAttribute('code', `<<${hollow}>>`);
    widget.contentEditable = false;
    insert(widget, 1);
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

      if (child.classList.contains('nextWraith')) {
        child.setAttribute('code', child.outerHTML
          .replace(/<a.*?>/gi, '<span id="next" class="nextWraith"><<link [[`')
          .replace('</a>', `\`|${linkto}]]>>${linktime}${endevent}<</link>>`));
      } else if (child.classList.contains('normalLink')) {
        child.setAttribute('code', child.outerHTML
          .replace(/<a.*?>/gi, '<<link [[`')
          .replace('</a>', `\`|${linkto}]]>>${linktime}${endevent}<</link>>`));
      }
    }
    if (child.getAttribute('code')) {
      let valueCode = child.getAttribute('valueCode') || '';
      if (valueCode !== '') {
        (function addValueCodeToInlineLink(candidate) {
          if (!candidate) return;
          const candidateContent = candidate.textContent;
          if (candidateContent.includes('\n')) return;
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
  });
  let code = mockOutput.innerHTML;
  code = code.split('\n').map((line) => (line.endsWith(' ') ? line.slice(0, -1) : line)).join('\n');
  code = code.replaceAll('\n', '\n<br>\n').replaceAll('\n\n', '\n')
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

    const widget = document.createElement('widget');
    widget.innerHTML = code || `<span class="noDisplay">${widgetName}</span>`;
    widget.setAttribute('code', `${twee}`);
    widget.contentEditable = false;
    generateInsertTarget(dolEditor);
    insert(widget, 1);
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
  widget.innerHTML = customWidgets[name].html || customWidgets[name];
  widget.setAttribute('code', `<<${name}>>`);
  widget.contentEditable = false;
  generateInsertTarget(dolEditor);
  insert(widget, 1);
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

  Object.keys(customWidgets).forEach((name) => {
    twee += `\n<<widget "${name}">>\n${
      customWidgets[name].twee || getCode(customWidgets[name].html || customWidgets[name])
    }\n<</widget>>\n`;
  });

  const link = document.createElement('a');
  link.download = `widgets-${Date.now()}.twee`;
  const blob = new Blob([twee], { type: 'text/plain' });
  link.href = URL.createObjectURL(blob);
  link.click();
});

// 更换主题
document.querySelector('#theme').addEventListener('change', (event) => {
  document.querySelector('#body').setAttribute('data-theme', event.target.value);
});

/* global modernScreenshot */
// 预览图片
document.querySelector('#pic').addEventListener('click', () => {
  document.querySelectorAll('.noDisplay').forEach((e) => { e.hidden = 1; });
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
    document.querySelectorAll('.noDisplay').forEach((e) => { e.hidden = 0; });
  });
});

// 下载图片
document.querySelector('#pic-down').addEventListener('click', () => {
  document.querySelectorAll('.noDisplay').forEach((e) => { e.hidden = 1; });
  output.innerText = '生成图片中……';
  modernScreenshot.domToPng(document.querySelector('#dol'), { scale: 2 }).then((dataUrl) => {
    const link = document.createElement('a');
    link.download = `dol-pancake-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    output.innerText = '';
  }).catch((error) => {
    output.innerText = `出错了（${error}）`;
  }).finally(() => {
    document.querySelectorAll('.noDisplay').forEach((e) => { e.hidden = 0; });
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
  const options = {
    widget: '',
    passage: '',
  };
  Object.keys(savedCode.passage).forEach((name) => {
    options.passage += `<option class="passage">${name}</option>`;
  });
  Object.keys(savedCode.widget).forEach((name) => {
    options.widget += `<option class="widget">${name}</option>`;
  });
  document.querySelector('#saveManageSaved').innerHTML = Object.values(options).join('');
  [document.querySelector('#saveManageSaved').value] = Object.keys(savedCode[document.querySelector('#saveManageType').value]);
  document.querySelector('#linkToList').innerHTML = options.passage || '';
  toggleOptionsManage();
};
loadSavedCode();

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
  }
  if (saveManage === 'delete') {
    delete savedCode[saveType][saveName];
    localStorage.setItem('savedCode', JSON.stringify(savedCode));
    loadSavedCode();
  }
  if (saveManage === 'export') {
    let twee = '<!-- Generated by DOL-pancake -->';
    if (saveType === 'passage') {
      Object.keys(savedCode.passage).forEach((name) => {
        twee += `\n:: ${name}\n${savedCode.passage[name].code}\n`;
      });
    } else {
      twee += `\n:: Widgets ${Date.now()} [widget]\n`;
      Object.keys(savedCode.widget).forEach((name) => {
        twee += `\n<<widget "${name}">>\n${savedCode.widget[name].code}\n<</widget>>\n`;
      });
    }

    const link = document.createElement('a');
    link.download = `${saveType}s-${Date.now()}.twee`;
    const blob = new Blob([twee], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
    link.click();
  }
  if (saveManage === 'clear') {
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
};
const tipBoxPancake = document.querySelector('#pancakeManager .tipBox');
document.querySelector('#pancakeManage').addEventListener('change', () => {
  updateTip(tipBoxPancake, '');
});
document.querySelector('#pancakeManageConfirm').addEventListener('click', () => {
  const operate = document.querySelector('#pancakeManage').value;
  let blob;
  const injection = 'injected for recognition';

  if (operate === 'export') {
    let json = `{"//":"${injection}",`;
    let count = 0;
    Object.keys(localStorage).forEach((item) => {
      count += 1;
      json += `"${item}": ${localStorage.getItem(item)}`;
      if (count !== Object.keys(localStorage).length) json += ',';
    });
    json += '}';

    blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `dol-pancke-config-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }
  if (operate === 'import') {
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
        Object.keys(json).forEach((item) => {
          if (item === '//') return;
          localStorage.setItem(item, JSON.stringify(json[item]));
          loadAll();
        });
        updateTip(tipBoxPancake, '导入成功', 'gold');
      };
    });
    input.click();
  }
  if (operate === 'reset') {
    localStorage.clear();
    loadAll();
    updateTip(tipBoxPancake, '重置成功', 'gold');
  }
});

// 清空内容
document.querySelector('#clear').addEventListener('click', () => {
  dolEditor.innerText = '';
  output.innerText = '';
});

/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
document.addEventListener('DOMContentLoaded', () => {
  const dolEditor = document.querySelector('div.passage');
  const output = document.querySelector('#output');
  const npcList = {
    love: {
      '': '',
      Avery: '艾弗里的',
      Eden: '伊甸的',
      Kylar: '凯拉尔的',
      Robin: '罗宾的',
      Whitney: '惠特尼的',
      Alex: '艾利克斯的',
      Sydney: '悉尼的',
      'Black Wolf': '黑狼的',
      'Great Hawk': '巨鹰的',
      Bailey: '贝利的',
      Briar: '布莱尔的',
      Charlie: '查里的',
      Darryl: '达里尔的',
      Doren: '多伦的',
      Gwylan: '格威岚的',
      Harper: '哈珀的',
      Jordan: '约旦的',
      Landry: '兰德里的',
      Leighton: '礼顿的',
      Mason: '梅森的',
      Morgan: '摩根的',
      River: '瑞沃的',
      Sam: '萨姆的',
      Sirris: '西里斯的',
      Winter: '温特的',
      Niki: '尼奇的',
      Quinn: '奎恩的',
      Remy: '雷米的',
      Wren: '伦恩的',
      'Ivory Wraith': '象牙怨灵的',
      Zephyr: '泽菲尔的',
    },
    lust: {
      '': '',
      Avery: '艾弗里的',
      Eden: '伊甸的',
      Kylar: '凯拉尔的',
      Mason: '梅森的',
      Robin: '罗宾的',
      Whitney: '惠特尼的',
      Alex: '艾利克斯的',
      Sydney: '悉尼的',
      'Black Wolf': '黑狼的',
      'Great Hawk': '巨鹰的',
    },
    dom: {
      Whitney: '惠特尼的',
      Eden: '伊甸的',
      Alex: '艾利克斯的',
      'Great Hawk': '巨鹰的',
    },
  };
  const typeVariants = {
    innocence: 'awareness',
    scorruption: 'spurity',
  };
  const staticColors = {
    awareness: ['lblue', 'blue'],
    innocence: ['blue', 'blue'],
    corruption: ['pink', 'teal'],
    lewdity: ['lewd', 'lewd'],
    attention: ['lewd', 'lewd'],
    lust: ['lewd', 'teal'],
    dom: ['purple', 'lblue'],
    rdom: ['purple', 'lblue'],
    spurity: ['teal', 'purple'],
    scorruption: ['teal', 'purple'],
    slust: ['lewd', 'teal'],
    endear: ['teal', 'pink'],
    hope: ['teal', 'pink'],
    reb: ['def', 'blue'],
  };
  const positiveTypes = new Set(['control', 'love', 'purity', 'cool', 'chaos', 'trust', 'respect']);
  const diffiColors = {
    very_easy: 'green',
    easy: 'teal',
    medium: 'lblue',
    challenging: 'blue',
    hard: 'purple',
    very_hard: 'pink',
    impossible: 'red',
  };
  const tagColors = {
    1: 'teal',
    2: 'lblue',
    3: 'blue',
    4: 'purple',
    5: 'pink',
    6: 'red',
    crime: 'red',
    defianttext: 'def',
    submissivetext: 'sub',
    wolfgirl: 'blue',
    cat: 'blue',
    cow: 'blue',
    harpy: 'gold',
    fox: 'orange',
    angel: 'gold',
    fallenangel: 'black',
    demon: 'red',
  };

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
  document.querySelector('#direct-paste').addEventListener('change', (event) => {
    if (event.target.checked) {
      dolEditor.setAttribute('contenteditable', 'true');
      dolEditor.innerHTML = dolEditor.innerHTML.replaceAll('\n', '<br>');
      document.querySelector('#link-num').checked = false;
      document.querySelector('#link-num').disabled = true;
      document.querySelector('#code').disabled = true;
      toggleIndex(false);
    } else {
      dolEditor.setAttribute('contenteditable', 'plaintext-only');
      dolEditor.innerHTML = dolEditor.innerHTML.replaceAll('<br>', '\n');
      document.querySelector('#link-num').disabled = false;
      document.querySelector('#code').disabled = false;
    }
  });

  // 准备插入元素
  let position;
  let insertTarget;
  const generateInsertTarget = (target) => {
    insertTarget = target;
    insertTarget.addEventListener('blur', () => {
      position = window.getSelection().getRangeAt(0);
    });
    insertTarget.addEventListener('input', (event) => {
      Object.keys(event.target.children).forEach((key) => {
        const child = event.target.children[key];
        if (child?.tagName === 'FONT') {
          child.before(document.createTextNode(child.innerText));
          child.remove();
        }
      });
    });
    insertTarget.addEventListener('click', (event) => {
      event.target = target;
    });
  };
  generateInsertTarget(dolEditor);
  const insert = (element, cursor = 0) => {
    if (position?.startContainer.parentElement.parentElement === insertTarget) {
      position.startContainer.parentElement.after(element);
    } else if (position?.startContainer.parentElement === insertTarget) {
      position.insertNode(element);
    } else {
      insertTarget.append(element);
    }
    const selection = window.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNode(element);
    if (cursor) range.collapse(0);
    selection.addRange(range);
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
    const colorType = document.getElementById('static-type').value;
    let type = colorType;
    const npc = document.getElementById('static-npc')?.value;

    if (typeVariants[type]) {
      plus = isPlus ? plus.replaceAll('g', 'l') : plus.replaceAll('l', 'g');
      type = typeVariants[type];
    }

    let code = `<<${plus}${type}${npc ? ` "${npc}"` : ''}>>`; // TODO: 数据默认变化值
    let text = `${getOptionText('static-plus')} ${getOptionText('static-npc') || ''}${getOptionText('static-type')}`;
    if (type === 'slust' && !isPlus) text = text.replace('悉尼的', '');
    if (type === 'rdom') code = code.replace('rdom', 'dom "Robin"');

    let color = isPlus ? staticColors?.[colorType]?.[0] : staticColors?.[colorType]?.[1];
    if (!color) {
      if (positiveTypes.has(type) || staticClass.value === 'skill') {
        color = isPlus ? 'green' : 'red';
      } else {
        color = isPlus ? 'red' : 'green';
      }
    }

    const status = document.createElement('status');
    status.innerHTML = ` | <span class="${color}">${text}</span>`;
    status.setAttribute('code', code);
    status.contentEditable = false;
    insert(status, 1);
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
    const text = `${grade === '6' ? '!' : ''}${getOptionText('lewd-tip-type')} ${getOptionText('lewd-tip-grade')}${grade === '6' ? '!' : ''}`;
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
      span.innerText = spanText === 'a' ? '\u200b继续' : '\u200b请输入文本';
      span.classList.add(event.target.value);
      insert(span);
      span.after(document.createTextNode(' '));
      event.target.value = '';
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

  // 预览图片
  document.querySelector('#pic').addEventListener('click', () => {
    output.innerText = '生成图片中……';
    // eslint-disable-next-line no-undef
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
    // eslint-disable-next-line no-undef
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
        if (child.classList.contains('nextWraith')) { // 幽灵链接
          child.setAttribute('code', child.outerHTML
            .replace(/<a.*?>/gi, '<span id="next" class="nextWraith"><<link [[')
            .replace('</a>', '|]]>><</link>>'));
        }
        if (child.classList.contains('normalLink')) { // 普通链接
          child.setAttribute('code', child.outerHTML
            .replace(/<a.*?>/gi, '<<link [[')
            .replace('</a>', '|]]>><</link>>'));
        }
        if (child.getAttribute('code')) {
          const code = document.createTextNode(child.getAttribute('code'));
          mockOutput.replaceChild(code, child);
        }
      }
      if (isHTML) {
        child.textContent = child.textContent.replaceAll('"', '&quot;').replaceAll("'", '&#39;');
      }
    });
    let code = mockOutput.innerHTML;
    code = code.split('\n').map((line) => (line.endsWith(' ') ? line.slice(0, -1) : line)).join('\n');
    code = code.replaceAll('\n', '\n<br>\n') // 换行
      .replaceAll('\n\n', '\n')
      .replaceAll('\u200b', '') // 颜色文字残余
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

    try { navigator.clipboard.writeText(code); } finally {
      output.innerHTML = `代码已复制到剪贴板，如未成功，请在下方手动复制，也可以点击<a id="downTwee">此处</a>将代码下载为 twee 文件。
      请注意，导出代码不含数据实际变化部件，且人称代词可能需要手动修改和补充&lt;&lt;personselect&gt;&gt;类代码。
      <pre contenteditable="plaintext-only"></pre>`;
      document.querySelector('#output pre').innerText = code;
      const link = document.querySelector('#downTwee');
      link.download = `dol-pancake-${Date.now()}.twee`;
      const twee = new Blob([code], { type: 'text/plain' });
      link.href = URL.createObjectURL(twee);
    }
  });

  // 清空内容
  document.querySelector('#clear').addEventListener('click', () => {
    dolEditor.innerText = '';
    output.innerText = '';
  });
});

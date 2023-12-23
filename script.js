document.addEventListener('DOMContentLoaded', () => {

  const dol_editor = document.querySelector('div.passage');
  const output = document.querySelector('#output');

  // 链接标号
  let getIndex = ifChecked => document.querySelectorAll('#dol a').forEach((a, index) => {
    if (ifChecked) {
      a.setAttribute('data-index', `(${index + 1}) `);
      a.setAttribute('data-if-index', '1');
    } else { a.setAttribute('data-if-index', '0') }
  });
  getIndex(true);
  document.querySelector('#link-num').addEventListener('change', event => {
    event.target.toggleAttribute('checked');
    getIndex(event.target.checked);
  });
  document.addEventListener('click', () => {
    getIndex(document.querySelector('#link-num').checked);
  });

  // 准备插入元素
  let position;
  dol_editor.addEventListener('blur', () => {
    position = window.getSelection().getRangeAt(0);
  });
  const insert = (element, cursor=0) => {
    if (position) {
      position.insertNode(element);
    } else {
      dol_editor.append(element);
    }
    let selection = window.getSelection();
    selection.removeAllRanges();
    let range = document.createRange();
    range.selectNode(element);
    if (cursor) { range.collapse(0) }
    selection.addRange(range);
  }

  // 获取 option 文字
  let selectedText = id => document.getElementById(id)?.options[document.getElementById(id)?.selectedIndex]?.text;

  // 分类显示数据变化
  let static_class = document.querySelector('#static-class');
  let toggle_options = () => {
    document.querySelectorAll('#static-type option').forEach(e => { e.hidden = 1 });
    document.querySelectorAll(`.${static_class.value}`).forEach(e => { e.hidden = 0 });
  }
  toggle_options();
  static_class.addEventListener('change', () => {
    toggle_options();
    document.querySelector('#static-type').value = document.querySelectorAll(`.${static_class.value}`)[0].value;
    document.querySelector('#static-type').dispatchEvent(new Event('change'));
  });

  // 插入数据变化
  document.querySelector('#static-type').addEventListener('change', event => {
    let type = event.target.value;
    let npc_select = document.querySelector('#static-npc');
    if (npc_select) { npc_select.remove() }
    if (type !== 'dom' && type !== 'love' && type !== 'lust') { return }
    npc_select = document.createElement('select');
    event.target.before(npc_select);
    const npc_list = {
      love: {
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
    }
    let npc_options = '';
    for (let npc in npc_list[type]) {
      npc_options += `<option value="${npc}">${npc_list[type][npc]}</option>`
    }
    npc_select.outerHTML = `<select id="static-npc" name="static-npc">${npc_options}</select> `
  });
  document.querySelector('#static').addEventListener('click', () => {
    let plus = document.getElementById('static-plus').value;
    let ctype = document.getElementById('static-type').value;
    let type = ctype;
    let npc = document.getElementById('static-npc')?.value;

    // 处理同代码变体
    const type_variants = {
      innocence: 'awareness',
      scorruption: 'spurity',
    }
    for (let variant in type_variants) {
      if (ctype === variant) {
        plus = plus.includes('g') ? plus.replaceAll('g', 'l') : plus.replaceAll('l', 'g');
        type = type_variants[type];
      }
    }

    let code = `<<${plus}${type}${npc ? ' "' + npc + '"' : ''}>>`; // TODO: 数据默认变化值
    let text = `${selectedText('static-plus')} ${selectedText('static-npc') || ''}${selectedText('static-type')}`;

    // 处理颜色
    let color;
    const positive_types = ['control', 'love', 'purity', 'cool','chaos', 'trust', 'respect'];
    const if_positive = type => { for (let positive_type of positive_types) { if (type === positive_type) { return 1 } } }
    const colors = {
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
    }
    let if_plus = plus.includes('g');
    color = if_plus ? colors?.[ctype]?.[0] : colors?.[ctype]?.[1];
    if (!color) {
      if (if_positive(type) || static_class.value === 'skill') {
        color = if_plus ? 'green' : 'red';
      } else {
        color = if_plus ? 'red' : 'green';
      }
    }

    if (type === 'slust' && !if_plus) { text = text.replace('悉尼的', '') }
    if (type === 'rdom') { code = code.replace('rdom', 'dom "Robin"') }

    let status = document.createElement('status');
    status.innerHTML = ` | <span class="${color}">${text}</span>`
    status.setAttribute('code', code);
    status.contentEditable = false;
    insert(status, 1);
  });

  // 插入技能检定
  document.querySelector('#skill-check-type').addEventListener('change', event => {
    if (document.getElementById('skill-check-type').value === 'custom') { // 自定义技能
      let custom_skill = document.createElement('input');
      let custom_value = document.createElement('input');
      event.target.after(custom_value);
      event.target.after(custom_skill);
      custom_skill.outerHTML = '<input type="text" class="custom" name="custom_skill" id="custom_skill" placeholder="技能名称"></input>';
      custom_value.outerHTML = '<input type="text" class="custom" name="custom_value" id="custom_value" placeholder="判定变量"></input>';
    } else {
      let custom_input = document.querySelectorAll('.custom');
      if (custom_input) { custom_input.forEach(e => e.remove()) }
    }
  });
  document.querySelector('#skill-check').addEventListener('click', () => {
    let type = document.getElementById('skill-check-type').value;
    let diffi = document.getElementById('skill-check-diffi').value;
    const diffi_color = {
      very_easy: 'green',
      easy: 'teal',
      medium: 'lblue',
      challenging: 'blue',
      hard: 'purple',
      very_hard: 'pink',
      impossible: 'red',
    }
    let code;
    let type_display = selectedText('skill-check-type');
    if (type !== 'custom') {
      code = `<<${type}difficulty>>`;
    } else { // 自定义技能
      type_display = document.getElementById('custom_skill').value;
      type_value = document.getElementById('custom_value').value;
      code = `<<skill_difficulty \`${type_value}\` "${type_display}">>`
    }
    let skillcheck = document.createElement('skillcheck');
    skillcheck.innerHTML = ` | <span class="orange">${type_display}</span>：<span class="${diffi_color[diffi]}">${selectedText('skill-check-diffi')}</span>`;
    skillcheck.setAttribute('code', code);
    skillcheck.contentEditable = false;
    insert(skillcheck, 1);
  });

  // 插入颜色文字
  document.querySelectorAll('.colorspan').forEach(sel => {
    sel.addEventListener('change', (event) => {
      let span_text = event.target.id === 'link' ? 'a' : 'span';
      let span = document.createElement(span_text);
      span.innerText = '\u200b请输入文本';
      span.classList.add(event.target.value);
      insert(span);
      span.after(document.createTextNode(' '));
      event.target.value = '';
    });
  });

  // 更换主题
  document.querySelector('#theme').addEventListener('change', event => {
    document.querySelector('#body').setAttribute('data-theme', event.target.value);
  });

  // 预览图片
  document.querySelector('#pic').addEventListener('click', () => {
    output.innerText = '生成图片中……';
    modernScreenshot.domToPng(document.querySelector('#dol'), { scale: 2 }).then(dataUrl => {
      let img = new Image();
      img.src = dataUrl;
      img.alt = 'DOL-pancake';
      output.innerText = '';
      output.appendChild(img);
    }).catch(error => {
      output.innerText = `出错了（${error}）`;
    });
  });

  // 下载图片
  document.querySelector('#pic-down').addEventListener('click', () => {
    output.innerText = '生成图片中……';
    modernScreenshot.domToPng(document.querySelector('#dol'), { scale: 2 }).then(dataUrl => {
      const link = document.createElement('a');
      link.download = 'dol-pancake.png';
      link.href = dataUrl;
      link.click();
      output.innerText = '';
    }).catch(error => {
      output.innerText = `出错了（${error}）`;
    });
  });

  // 导出代码
  document.querySelector('#code').addEventListener('click', () => {

    let output_container = document.createElement('div');
    output_container.innerHTML = dol_editor.innerHTML;
    output_container.childNodes.forEach(child => {
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
          let code = document.createTextNode(child.getAttribute('code'));
          output_container.replaceChild(code, child);
        }
      }
      if (document.querySelector('#html-mode').checked) { // HTML 模式
        child.textContent = child.textContent.replaceAll('"', '&quot;').replaceAll("'", '&#39;');
      }
    });
    let code = output_container.innerHTML;
    code = code.split('\n').map(line => line.endsWith(' ') ? line.slice(0, -1) : line).join('\n');
    code = code.replaceAll('\n', '\n<br>\n') // 换行
    .replaceAll('\n\n', '\n')
    .replaceAll('\u200b', '') // 颜色文字残余
    .replaceAll('&lt;', '<') // 尖括号
    .replaceAll('&gt;', '>')
    .replaceAll('他们', '\u200b们')  // 人称代词
    .replaceAll('她们', '\u200c们')
    .replaceAll('其他', '其\u200b')
    .replaceAll('他妈', '\u200b妈')
    .replaceAll('他人', '\u200b人')
    .replaceAll('他娘', '\u200b娘')
    .replaceAll('他', '<<he>>')
    .replaceAll('她', '<<he>>')
    .replaceAll('\u200b', '他')
    .replaceAll('\u200c', '她');
    if (document.querySelector('#html-mode').checked) { // HTML 模式
      code = code.replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('&amp;', '&');
    }

    try { navigator.clipboard.writeText(code) } finally {
      output.innerHTML = `代码已复制到剪贴板，如未成功，请在下方手动复制。
      请注意，导出代码不含数据实际变化部件，且人称代词可能需要手动修改和补充&lt;&lt;personselect&gt;&gt;类代码。
      <pre contenteditable="plaintext-only"></pre>`;
      document.querySelector('#output pre').innerText = code;
    }
  });

  // 清空内容
  document.querySelector('#clear').addEventListener('click', () => {
    dol_editor.innerText = '';
    output.innerText = '';
  });

});

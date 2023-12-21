document.addEventListener('DOMContentLoaded', () => {

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
  let position = '';
  document.querySelector('div.passage').addEventListener('blur', () => {
    position = window.getSelection().getRangeAt(0);
  });
  const insert = element => {
    if (position === '') {
      document.querySelector('div.passage').append(element);
    } else {
      position.insertNode(element);
    }
  }

  // 获取 option 文字
  let selectedText = id => document.getElementById(id).options[document.getElementById(id).selectedIndex].text;

  // 分类显示数据变化
  document.querySelectorAll('#static-type option').forEach(e => { e.hidden = 1 });
  document.querySelectorAll(`.${document.querySelector('#static-class').value}`).forEach(e => { e.hidden = 0 });
  document.querySelector('#static-class').addEventListener('change', () => {
    document.querySelectorAll(`#static-type option`).forEach(e => { e.hidden = 1 });
    document.querySelector('#static-type').value = document.querySelectorAll(`.${document.querySelector('#static-class').value}`)[0].value;
    document.querySelectorAll(`.${document.querySelector('#static-class').value}`).forEach(e => { e.hidden = 0 });
  });

  // 插入数据变化
  document.querySelector('#static').addEventListener('click', () => {
    let plus = document.getElementById('static-plus').value;
    let type = document.getElementById('static-type').value;

    // 处理同代码变体
    const type_variants = {
      innocence: 'awareness',
      scorruption: 'spurity',
    }
    for (let variant in type_variants) {
      if (type == variant) {
        plus = plus.includes('g') ? plus.replaceAll('g', 'l') : plus.replaceAll('l', 'g');
        type = type_variants[type];
        var if_variant = 1;
      }
    }
    let code = `<<${plus}${type}>>`; // TODO: 数据默认变化值
    let text = `${selectedText('static-plus')} ${selectedText('static-type')}`;

    // 处理颜色
    let color, if_positive;
    const positive_types = ['control', 'love', 'purity', 'cool','chaos', 'trust', 'respect']; // 正面数据列表
    for (let type of positive_types) {
      if (code.includes(type)) { if_positive = 1 };
    }
    if (type == 'awareness') { // 意识、纯真
      if (if_variant) {
        color = 'blue';
      } else {
        color = plus.includes('g') ? 'lblue' : 'blue';
      }
    } else if (type == 'awareness') { // 堕落
      color = plus.includes('g') ? 'pink' : 'teal';
    } else if (type == 'lewdity' || type == 'attention') { // 淫秽、关注度
      color = 'lewd';
    } else if (type == 'lust') { // 性欲
      color = plus.includes('g') ? 'lewd' : 'teal';
    } else if (type == 'spurity') { // 悉尼的纯洁、堕落
      color = plus.includes('g') ? 'teal' : 'purple';
    } else if (type == 'endear' || type == 'hope') { // 亲密、希望
      color = plus.includes('g') ? 'teal' : 'pink';
    } else if (type == 'reb') { // 叛逆
      color = plus.includes('g') ? 'def' : 'blue';
    } else if (if_positive || document.querySelector('#static-class').value == 'skill') { // 正面数据
      color = plus.includes('g') ? 'green' : 'red';
    } else  { // 负面数据
      color = plus.includes('g') ? 'red' : 'green';
    }

    let status = document.createElement('status');
    insert(status);
    status.outerHTML = `<status contenteditable="false" code="${code}"> | <span class="${color}">${text}</span> </status>`;
  });

  // 插入技能检定
  document.querySelector('#skill-check-type').addEventListener('change', event => {
    if (document.getElementById('skill-check-type').value == 'custom') { // 自定义技能
      let custom_skill = document.createElement('input');
      let custom_value = document.createElement('input');
      event.target.after(custom_value);
      event.target.after(custom_skill);
      custom_skill.outerHTML = '<input type="text" class="custom" name="custom_skill" id="custom_skill" placeholder="技能名称"></input>';
      custom_value.outerHTML = '<input type="text" class="custom" name="custom_value" id="custom_value" placeholder="判定变量"></input>';
    } else {
      let custom_input = document.querySelectorAll('.custom');
      if (custom_input) {custom_input.forEach(e => e.remove());}
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
    insert(skillcheck);
    skillcheck.outerHTML = `<skillcheck contenteditable="false" code='${code}'> | <span class="orange">${type_display}</span>：<span class="${diffi_color[diffi]}">${selectedText('skill-check-diffi')}</span></skillcheck>`;
  });

  // 插入颜色文字
  document.querySelectorAll('.colorspan').forEach(sel => {
    sel.addEventListener('change', (event) => {
      let span_text = event.target.id == 'link' ? 'a' : 'span';
      let span = document.createElement(span_text);
      insert(span);
      span.outerHTML = `<${span_text} class="${event.target.value}">\u200b请输入文本</${span_text}> `;
      event.target.value = '';
    });
  });

  // 更换主题
  document.querySelector('#theme').addEventListener('change', event => {
    document.querySelector('#body').setAttribute('data-theme', event.target.value);
  });

  // 预览图片
  document.querySelector('#pic').addEventListener('click', () => {
    document.querySelector('#output').innerText = '生成图片中……';
    htmlToImage.toPng(document.querySelector("#dol")).then(function(dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      img.alt = 'DOL-pancake';
      document.querySelector('#output').innerText = '';
      document.querySelector('#output').appendChild(img);
    }).catch(function(error) {
      console.error('oops, something went wrong!', error);
    });
  });

  // 下载图片
  document.querySelector('#pic-down').addEventListener('click', () => {
    document.querySelector('#output').innerText = '生成图片中……';
    htmlToImage.toBlob(document.querySelector("#dol"))
      .then(function (blob) {
        if (window.saveAs) {
          window.saveAs(blob, 'dol-pancake.png');
        } else {
          FileSaver.saveAs(blob, 'dol-pancake.png');
        }
      });
    document.querySelector('#output').innerText = '';
  });

  // 导出代码
  document.querySelector('#code').addEventListener('click', () => {

    let output_container = document.createElement('div');
    output_container.innerHTML = document.querySelector('div.passage').innerHTML;
    output_container.childNodes.forEach(child => {
      if (child.nodeType == 1) {
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
          output_container.replaceChild(code, child)
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

    navigator.clipboard.writeText(code);
    document.querySelector('#output').innerHTML = `代码已复制到剪贴板，如未成功，请在下方手动复制。<pre contenteditable="plaintext-only"></pre>`;
    document.querySelector('#output pre').innerText = code;
  });

  // 清空内容
  document.querySelector('#clear').addEventListener('click', () => {
    document.querySelector('div.passage').innerText = '';
    document.querySelector('#output').innerText = '';
  });

});

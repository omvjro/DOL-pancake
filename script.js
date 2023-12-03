document.addEventListener('DOMContentLoaded', () => {
    // 链接标号
    let getIndex = ifChecked => document.querySelectorAll('#dol a').forEach((a, index) => {
      if (ifChecked) {
        a.setAttribute('data-index', `(${index + 1}) `);
        a.setAttribute('data-if-index', '1');
      } else { a.setAttribute('data-if-index', '0') }
    });
    getIndex(true);
    document.querySelector('#link-num').addEventListener('change', () => {
      document.querySelector('#link-num').toggleAttribute('checked');
      getIndex(document.querySelector('#link-num').checked);
    });
    document.addEventListener('click', () => {
      getIndex(document.querySelector('#link-num').checked);
    });

    // 插入元素
    let position = '';
    document.querySelector('div.passage').addEventListener('blur', () => {
      position = window.getSelection().getRangeAt(0);
    });
    document.querySelectorAll('.colorspan').forEach(sel => {
      sel.addEventListener('change', (event) => {
        let span_text = event.target.id == 'link' ? 'a' : 'span';
        let span = document.createElement(span_text);
        if (position === '') {
          document.querySelector('div.passage').append(span);
        } else {
          position.insertNode(span);
        }
        span.outerHTML = `<${span_text} class="${event.target.value}">\u200b请输入文本</${span_text}> `;
        event.target.value = '';
      });
    });

    // 更换主题
    document.querySelector('#theme').addEventListener('change', (event) => {
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
      let code = document.querySelector('div.passage').innerHTML;
      code = code.split('\n').map(line => {
        line = line.includes('<a class="nextWraith">') ? line
          .replace('<a class="nextWraith">', '<span id="next" class="nextWraith"><<link [[')
          .replace('</a>', '|]]>><</link>></span>') : line;
        line = line.endsWith(' ') ? line.slice(0, -1) : line;
        return line;
      }).join('\n');
      code = code.replaceAll('\n', '\n<br>\n')
      .replaceAll('\n\n', '\n')
      .replaceAll('\u200b', '')
      .replaceAll('\n<br>\n</span>', '</span>\n<br>\n')
      .replaceAll('\n<br>\n</a>', '</a>\n<br>\n')
      .replaceAll(/<a.*?>/gi, '<<link [[')
      .replaceAll('</a>', '|]]>><</link>>');
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
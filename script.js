document.addEventListener('DOMContentLoaded', (event) => {
    let position = '';
    document.querySelector('div.passage').addEventListener('blur', (event) => {
      position = window.getSelection().getRangeAt(0)
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
        span.outerHTML = `<${span_text} class="${event.target.value}">请输入文本</${span_text}>⁣⁣⁣⁣　`;
        event.target.value = '';
      });
    });
    document.querySelector('#theme').addEventListener('change', (event) => {
      document.querySelector('#body').setAttribute('data-theme', event.target.value);
    });
    document.querySelector('#pic').addEventListener('click', (event) => {
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
    document.querySelector('#pic-down').addEventListener('click', (event) => {
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
    document.querySelector('#code').addEventListener('click', (event) => {
      let code = document.querySelector('div.passage').innerHTML;
      code = code.split('\n').map(line => {
        return line.includes('<a class="nextWraith">') ? line
          .replace('<a class="nextWraith">', '<span id="next" class="nextWraith"><<link [[')
          .replace('</a>', '|]]>><</link>></span>') : line
      }).join('\n');
      code = code.replaceAll('\n', '\n<br>\n')
      .replaceAll('\n\n', '\n')
      .replaceAll('>⁣⁣⁣⁣　', '>')
      .replaceAll('<a class=" ">', '<<link [[')
      .replaceAll('</a>', '|]]>><</link>>');
      navigator.clipboard.writeText(code);
      document.querySelector('#output').innerHTML = `代码已复制到剪贴板，如未成功，请在下方手动复制。<pre contenteditable="plaintext-only"></pre>`;
      document.querySelector('#output pre').innerText = code;
    });
    document.querySelector('#clear').addEventListener("click", (event) => {
      document.querySelector('div.passage').innerText = '';
      document.querySelector('#output').innerText = '';
    });
  });
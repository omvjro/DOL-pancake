const getOptionText = (id) => document.getElementById(id)?.options[document.getElementById(id)?.selectedIndex]?.text;

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

export {
    getOptionText,
    getCode
}
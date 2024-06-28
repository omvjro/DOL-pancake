let selection;
let position;
let insertTarget;

const createSelection = (element, isCollapsed = false) => {
  const newSelection = window.getSelection();
  newSelection.removeAllRanges();
  const range = document.createRange();
  range.selectNode(element);
  if (isCollapsed) range.collapse(0);
  newSelection.addRange(range);
};
const insert = (element, isCollapsed, forceLocal = false) => {
  if (selection?.isCollapsed === false) selection.deleteFromDocument();
  if (forceLocal) {
    position.insertNode(element);
  } else if (position?.startContainer.parentElement.parentElement === insertTarget) {
    position.startContainer.parentElement.after(element);
  } else if (position?.startContainer.parentElement === insertTarget || position?.startContainer === insertTarget) {
    position.insertNode(element);
  } else {
    insertTarget.append(element);
  }
  createSelection(element, isCollapsed);
//   afterInput();
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
//   undoData.push(insertTarget.innerHTML);
  insertTarget.addEventListener('blur', getSelectionAndPosition);
  insertTarget.addEventListener('input', (event) => {
    Object.values(event.target.children).forEach((child) => {
      if (child?.tagName === 'FONT') {
        child.before(document.createTextNode(child.innerText));
        child.remove();
      }
      // 阻止由粘贴等方式造成的颜色文字或链接内换行，同时避免移动端允许换行的奇怪bug
      if (['A', 'SPAN'].includes(child?.tagName) && child.innerHTML.includes('\n')) {
        if (child.innerHTML.endsWith('\n')) {
          const br = document.createElement('br');
          child.after(br);
          createSelection(br, true);
        }
        child.innerHTML = child.innerHTML.replace('\n', '');
      }
    });

    // afterInput();
  });
  insertTarget.addEventListener('click', () => {
    insertTarget = target;
  });
};

const wrap = (element) => {
  element.innerText = selection.toString().replaceAll('\n', '');
  insert(element, true);
};

export {
    selection, position, insertTarget,
    generateInsertTarget,
    insertHard, insert, wrap,
    getSelectionAndPosition, createSelection,
}

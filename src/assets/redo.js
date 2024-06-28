import {
  insertTarget
} from './insert.js'

const undoData = [];
let redoData = [];
const recordData = () => {
  undoData.push(insertTarget.innerHTML);
  redoData = [];
};
const afterInput = () => {
  recordData();
//   toggleIndex();
};

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

export { undoData, redoData, afterInput, undo, redo }
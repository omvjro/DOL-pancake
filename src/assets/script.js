import {
  hollows,
} from './data.js';
import {
  position, insertTarget,
  generateInsertTarget,
  insertHard, insert,
  getSelectionAndPosition, createSelection,
  selection,
} from './insert.js'

const dolEditor = document.querySelector('div.passage');
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
}
loadAdvanced()
document.querySelector('#advanced').addEventListener('change', () => {
  if (localStorage.getItem('isAdvancer')) {
    localStorage.removeItem('isAdvancer')
  } else {
    localStorage.setItem('isAdvancer', 1)
  }
  switchAdvanced()
})

// 链接标号
const toggleIndex = (isChecked = document.querySelector('#link-num').checked) => document.querySelectorAll('#dol a').forEach((a, index) => {
  if (isChecked) {
    const n = (index + 1) % 10
    const np1 = (`${n + 1}`).slice(-1)
    const prefxdn = {
      0: n,
      1: `Shift + ${np1}`,
      2: `Ctrl + ${np1}`,
      3: `Alt + ${np1}`,
    }
    const dataIndex = prefxdn[Math.floor((index + 1) / 10)]
    if (dataIndex) {
      a.setAttribute('data-index', `(${dataIndex}) `)
    }
    a.setAttribute('data-if-index', '1')
  } else { a.setAttribute('data-if-index', '0') }
});
toggleIndex(true);
document.querySelector('#link-num').addEventListener('change', (event) => {
  event.target.toggleAttribute('checked')
  toggleIndex()
})

// 复制游戏原文
const editableSwitch = (isTrue, isNum = false) => {
  if (isTrue) {
    dolEditor.setAttribute('contenteditable', 'true')
    dolEditor.innerHTML = dolEditor.innerHTML.replaceAll('\n', '<br>')
    if (!isNum) {
      document.querySelector('#link-num').checked = false
      document.querySelector('#link-num').disabled = true
    }
    document.querySelector('#code').disabled = true
    toggleIndex(false)
  } else {
    dolEditor.setAttribute('contenteditable', 'plaintext-only')
    dolEditor.innerHTML = dolEditor.innerHTML.replaceAll('<br>', '\n')
    document.querySelector('#link-num').disabled = false
    document.querySelector('#code').disabled = false
  }
}
if (document.querySelector('#direct-paste')) {
  document.querySelector('#direct-paste').addEventListener('change', (event) => {
    editableSwitch(event.target.checked)
  });
}

generateInsertTarget(dolEditor)

document.querySelector('#hollows').innerHTML = Object.keys(hollows).reduce((selects, key) => `
${selects}
<select id=${key}>
  <option value="" style="display: none">${key === 'person' ? 'personselect' : key}</option>
  ${hollows[key].reduce((options, option) => `${options}<option>${option}</option>`, '')}
</select>`, '')
document.querySelectorAll('#hollows select').forEach((select) => {
  select.addEventListener('change', (event) => {
    const hollow = event.target.value
    insertHard(hollow, `<<${hollow}>>`, (widget) => widget.classList.add('noDisplay'))
    event.target.value = ''
  });
});

dolEditor.addEventListener('keydown', (event) => {
  getSelectionAndPosition()

  if (event.key === 'Enter') {
    event.preventDefault()
    const startContainer = position?.startContainer
    console.log(startContainer.parentElement.tagName)
    // 允许回车退出颜色标签，阻止链接或颜色文字内换行
    if (['SPAN', 'A'].includes(startContainer.parentElement.tagName)) {
      if (startContainer.textContent.length !== position?.startOffset) return
      const empty = document.createTextNode(' ')
      startContainer.parentElement.after(empty)
      createSelection(empty, true)
    } else {
      const br = document.createElement('br')
      insert(br, true)
      // 自动添加下一个链接
      findInlineLink(br.previousSibling, () => {
        br.remove()
        const a = document.createElement('a')
        insert(a)
        a.classList.add('normalLink')
        a.innerText = '\u200b'
        a.insertAdjacentHTML('beforebegin', '<br>')
        // a.insertAdjacentText('beforebegin', '\u200b')
        selection.collapse(a, 1)
      })
    }
  }

  // 跳过零宽空格
  // if (event.key === 'ArrowLeft') {
  //   if (position.startOffset === 1 && position.startContainer.textContent.startsWith('\u200b')) {
  //     const previousSibling = position.startContainer.previousSibling
  //     if (previousSibling) {
  //       createSelection(previousSibling, true)
  //     }
  //   }
  // }

  // if (event.key === 'ArrowRight') {
  //   if (position.startOffset === 0 && position.startContainer.textContent.startsWith('\u200b')) {
  //     if (position.startContainer.nodeType === 3) {
  //       return selection.collapse(position.startContainer, 1)
  //     }
  //     const nextSibling = position.startContainer.nextSibling
  //     if (nextSibling.isContentEditable === false) {
  //       return createSelection(nextSibling, true)
  //     }
  //   }
  // }

  // TODO 避免重复删除零宽空格

}, { passive: false })

// 撤销重做
// TODO 撤销重做后光标位置
let undoData = [dolEditor.innerHTML]
let currentIndex = 0

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    undoData = undoData.slice(0, currentIndex + 1)
    if (undoData.at(-1) !== mutation.target.innerHTML) {
      undoData.push(mutation.target.innerHTML)
    }
    currentIndex = undoData.length - 1
  })
  toggleIndex()
})

observer.observe(dolEditor, {
  childList: true,
});

function undo() {
  observer.disconnect()
  currentIndex -= 1
  if (currentIndex < 0) currentIndex = 0
  if (undoData[currentIndex]) dolEditor.innerHTML = undoData[currentIndex]
  observer.observe(dolEditor, {
    childList: true,
  })
}

function redo() {
  observer.disconnect()
  currentIndex += 1
  if (currentIndex > undoData.length) currentIndex = undoData.length
  if(undoData[currentIndex]) dolEditor.innerHTML = undoData[currentIndex]
  observer.observe(dolEditor, {
    childList: true,
  })
}

dolEditor.addEventListener('keydown', (event) => {
  event.stopPropagation()
  if (event.ctrlKey) {
    if (event.key === 'z') {
      event.preventDefault()
      undo()
    } else if (event.key === 'y') {
      event.preventDefault()
      redo()
    }
  }
})

document.querySelector('#undo').addEventListener('click', undo)
document.querySelector('#redo').addEventListener('click', redo)

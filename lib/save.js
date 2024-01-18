function getNewFileHandle(mime, extension) {
  // For Chrome 86 and later...
  if ('showSaveFilePicker' in window) {
    const opts = {
      types: [{
        accept: { [mime]: [extension] },
      }],
    };
    return window.showSaveFilePicker(opts);
  }
  // For Chrome 85 and earlier...
  const opts = {
    type: 'save-file',
    accepts: [{
      extensions: [extension],
      mimeTypes: [mime],
    }],
  };
  return window.chooseFileSystemEntries(opts);
}

async function saveModern(blob, mime, extention) {
  const newHandle = await getNewFileHandle(mime, extention);
  const writableStream = await newHandle.createWritable();
  await writableStream.write(blob);
  await writableStream.close();
}

function saveFallback(blob, name, extention) {
  const link = document.createElement('a');
  link.download = `${name}-${Date.now()}${extention}`;
  link.href = URL.createObjectURL(blob);
  link.click();
}

function save(blob, name, mime, extention) {
  if (!('chooseFileSystemEntries' in window
  || 'showSaveFilePicker' in window)) {
    saveFallback(blob, name, extention);
    return;
  }
  saveModern(blob, mime, extention);
}

function saveTwee(blob, name) {
  save(blob, name, 'text/plain', '.twee');
}

function savePng(blob, name) {
  save(blob, name, 'image/png', '.png');
}

function saveJSON(blob, name) {
  save(blob, name, 'application/json', '.json');
}

export { saveTwee, savePng, saveJSON };

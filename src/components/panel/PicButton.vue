<script setup>
import { domToPng, domToBlob } from 'modern-screenshot'
import { savePng } from '@/assets/save.js'
import { useI18n } from 'vue-i18n'
import { store } from '@/assets/store'

const { t } = useI18n()

function preview() {
  let inputID = store.scene === 'default' ? 'html' : 'npc-relations'
  // TODO 不知道为什么截出来只有一半
  // if (store.captureFeat) inputID = 'feat'
  const output = document.querySelector('#output');
  document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'none'; });
  output.innerText = t('pic.loading');
  domToPng(document.getElementById(inputID), {
    scale: 2,
    features: {
      removeControlCharacter: false,
      fixSvgXmlDecode: false,
    }
  }).then((dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.alt = 'dol-pancake';
    output.innerText = '';
    output.appendChild(img);
  }).catch((error) => {
    output.innerText = `${ t('pic.error') }${error}`;
  }).finally(() => {
    document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'inline-block'; });
  });
}

function download() {
  let inputID = store.scene === 'default' ? 'html' : 'npc-relations'
  // if (store.captureFeat) inputID = 'feat'
  const output = document.querySelector('#output');
  document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'none'; });
  output.innerText = t('pic.loading');
  domToBlob(document.getElementById(inputID), {
    scale: 2,
    features: {
      removeControlCharacter: false,
      fixSvgXmlDecode: false,
    }
  }).then((blob) => {
    savePng(blob, 'dol-pancake');
    output.innerText = '';
  }).catch((error) => {
    output.innerText = `${ t('pic.error') }${error}`;
  }).finally(() => {
    document.querySelectorAll('.noDisplay').forEach((e) => { e.style.display = 'inline-block'; });
  });
}
</script>

<template>
    <button id="pic" @click="preview">{{ $t('preview') }}</button>
    <button id="pic-down" @click="download">{{ $t('download') }}</button>
</template>

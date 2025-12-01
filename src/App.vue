<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import RelationBox from './components/RelationBox.vue';
import FileInput from './components/FileInput.vue';
import StatChange from './components/panel/StatChange.vue';
import SkillCheck from './components/panel/SkillCheck.vue';
import InsertTags from './components/panel/InsertTags.vue';
import ColouredText from './components/panel/ColouredText.vue'
import CustomWidget from './components/panel/CustomWidget.vue';
import { insert } from './assets/insert'
import ToolTip from './components/ToolTip.vue';
import FeatBox from './components/FeatBox.vue';
import { colors } from './assets/data';
import CodeButton from './components/panel/CodeButton.vue';
import PicButton from './components/panel/PicButton.vue';
import SaveManage from './components/panel/SaveManage.vue';
import { store } from './assets/store'

const { t, locale } = useI18n();
const placeholder = localStorage.getItem('temp') || `${t('placeholder.1')}${
  window.innerWidth > 836 ? t('placeholder.buttonPosWide') : t('placeholder.buttonPosNarrow')
}${t('placeholder.2')}`
// const isRestored = computed(() => {
//   return localStorage.getItem('temp');
// })
// function restoreInit(e) {
//   localStorage.removeItem('temp');
//   e.target.hidden = true;
//   document.querySelector('div.passage').innerHTML = t('placeholder');
// }
window.addEventListener('beforeunload', () => {
  localStorage.setItem('temp', document.querySelector('div.passage').innerHTML);
});

const feat = ref('none'),
      featTitle = ref(''),
      featText = ref(''),

      name = ref(t('relationBox.kylar')),
      title = ref(t('relationBox.loner')),
      description = ref(t('relationBox.isHysterical')),
      color = ref('red'),
      stats = ref([
          {
            name: t('relationBox.love'),
            progress: 80,
            direction: 'horizontal',
            activeicon: 'img/ui/heart.png',
            inactiveicon: 'img/ui/emptyheart.png'
          },
          {
            name: t('relationBox.lust'),
            progress: 50,
            direction: 'vertical',
            activeicon: 'img/ui/vial.png',
            inactiveicon: 'img/ui/emptyvial.png'
          },
          {
            name: t('relationBox.jealousy'),
            progress: 100,
            direction: 'horizontal',
            activeicon: 'img/ui/wideeye.png'
          },
          {
            name: '',
            progress: 100,
            direction: 'horizontal',
            activeicon: ''
          },
      ])

function changeTheme() {
  localStorage.setItem('theme', store.theme)
}
watch(locale, (newValue) => {
  localStorage.setItem('locale', newValue)
  document.title = t('title')
  document.querySelector('html').lang = locale.value
})

function loadFile(stat) {
  return function(e) {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      stat.activeicon = reader.result;
      stat.inactiveicon = undefined;
    };
  }
}

function insertPic() {
  return function(e) {
    const img = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      img.src = reader.result;
      insert(img, true);
      e.target.value = '';
    };
    img.addEventListener('dragstart', () => {
      document.querySelector('#direct-paste').checked = true;
      // editableSwitch(true, true);
    });
  }
}

function clear() {
  if (store.scene === 'default') {
    const dolEditor = document.querySelector('div.passage');
    dolEditor.innerText = '';
  } else if (store.scene === 'npc') {
    stats.value = [{name: '',},{name: '',},{name: '',},{name: '',}]
    name.value = ''
    title.value = ''
    description.value = ''
  }
}

onMounted(() => {
  document.title = t('title')
  document.querySelector('html').lang = locale.value
})
</script>

<template>
<div id="container">
      <div id="dol">
        <div id="html" v-show="store.scene === 'default'">
          <div id="body" :data-theme="store.theme">
            <div id="ui-overlay" class="ui-close"></div>
            <div id="ui-bar" aria-live="polite" class="stowed">
              <div id="ui-bar-tray">
                <button id="ui-bar-toggle" tabindex="0" title="Toggle the UI bar" aria-label="Toggle the UI bar" type="button" role="button"></button>
              </div>
              <div id="ui-bar-body"></div>
            </div>
            <div id="story" role="main" class="">
              <!-- <ToolTip :fixed="true" v-if="isRestored" @click="restoreInit($event)">{{ $t('restoreTip') }}</ToolTip> -->
              <FeatBox :feat
                       :featTitle
                       :featText />
              <div id="passages" aria-live="polite">
                <div class="passage" contenteditable="plaintext-only" v-html="placeholder"></div>
              </div>
            </div>
            <div id="gameVersionDisplay" contenteditable="plaintext-only"> {{ $t('watermark') }} </div>
            <div id="gameVersionDisplay2" contenteditable="plaintext-only">{{ $t('watermark') }}</div>
          </div>
        </div>
        <RelationBox :data-theme="store.theme" v-show="store.scene === 'npc'"
                     :name
                     :title
                     :color
                     :description
                     :stats />
      </div>
      <div class="toolbox">
        <div class="item"><small v-html="t('intro')"></small></div>
        <div class="item flex">
          <div>
            <label for="theme">{{ $t('theme') }}</label>
            <select name="theme" v-model="store.theme" @change="changeTheme">
              <option value="" style="background-color: #111; color: #eee;">{{ $t('default') }}</option>
              <option value="zen" style="background-color: hsl(0deg 0% 22%); color: hsl(60deg 20% 86%);">Zen</option>
              <option value="arctic" style="background-color: hsl(220deg 16% 22%); color: hsl(218deg 27% 94%);">Arctic</option>
              <option value="monokai" style="background-color: hsl(24deg 8% 12%); color: hsl(60deg 30% 96%);">Monokai</option>
              <option value="storm" style="background-color: hsl(235deg 19% 13%); color: hsl(227deg 35% 71%);">Storm</option>
              <option value="latte" style="background-color: hsl(220deg 23% 95%); color: hsl(234deg 16% 35%);">Catppuccin Latte</option>
              <option value="frappe" style="background-color: hsl(229deg 19% 23%); color: hsl(227deg 70% 87%);">Catppuccin Frappé</option>
              <option value="macchiato" style="background-color: hsl(232deg 23% 18%); color: hsl(227deg 68% 88%);">Catppuccin Macchiato</option>
              <option value="mocha" style="background-color: hsl(240deg 21% 15%); color: hsl(226deg 64% 88%);">Catppuccin Mocha</option>
            </select>
          </div>
          <div>
            <label for="scene">{{ $t('scene') }}</label>
            <select name="scene" v-model="store.scene">
              <option value="default">{{ $t('default') }}</option>
              <option value="npc">NPC</option>
            </select>
          </div>
          <div>
            <label for="language">{{ $t('language') }}</label>
            <select name="language" v-model="locale">
              <option>zh</option>
              <option>en</option>
              <option>zh-TW</option>
              <option>zh-HK</option>
            </select>
          </div>
        </div>
        <div v-show="store.scene === 'default'">
        <div class="item flex">
          <div><label for="advanced">{{ $t('experimental') }}</label><input type="checkbox" id="advanced" name="advanced" /></div>
          <div><label for="link-num">{{ $t('indexed') }}</label><input type="checkbox" id="link-num" name="link-num" checked /></div>
          <div><label for="html-mode">{{ $t('exportHTML') }}</label><input type="checkbox" id="html-mode" name="html-mode" /></div>
          <div><label for="direct-paste">{{ $t('pasteDirectly') }}</label><input type="checkbox" id="direct-paste" name="direct-paste" /></div>
        </div>
        <StatChange />
        <SkillCheck />
        <InsertTags />
        <ColouredText />
        <div class="item">
        <FileInput id="insertPic" :label="`${t('insertPics')}`" :func="insertPic()" />
        </div>
        <div class="item advanced" hidden="1">
          {{ $t('insertNPCwidgets') }}
          <span id="hollows"></span>
          <ToolTip>{{ $t('invisibleTip') }}</ToolTip>
        </div>
        <div class="item" id="feat">
          {{ $t('achievementPopup') }}
          <select id="featClass" v-model="feat">
            <option value="none">{{ $t('noPopup') }}</option>
            <option>Copper</option>
            <option>Silver</option>
            <option>Gold</option>
            <option>Platinum</option>
            <option>Jeweled</option>
            <option>Cheat</option>
            <option>Emerald</option>
            <option>Ruby</option>
          </select>
          <input type="text" v-model="featTitle" :placeholder="$t('achvName')">
          <input type="text" v-model="featText" :placeholder="$t('achvDesc')">
          <!-- <label for="captureFeat">{{ $t('captureFeat') }}</label>
          <input type="checkbox" id="captureFeat" name="captureFeat" v-model="store.captureFeat" /> -->
        </div>
        <CustomWidget />
        <SaveManage />
        </div>
        <div v-show="store.scene === 'npc'">
        <div class="item">
            <input type="text" v-model="name" />
            <input type="text" v-model="title" />
          </div>
          <div class="item"><select v-model="color">
            <option v-for="color in colors.color" :class="color" :key="color">{{ color }}</option>
            <option>white</option>
          </select>
          {{ $t('relationBox.desc') }}<input v-model="description" /></div>
          <div v-for="(stat, i) in stats" class="item" :key="stat.name">
            <input type="text" v-model="stat.name" />
            <input type="number" v-model="stat.progress" min="1" max="100" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value > 100) this.value = '100';">%
            <select v-model="stat.direction">
              <option value="horizontal">{{ $t('relationBox.horizontal') }}</option>
              <option value="vertical">{{ $t('relationBox.vertical') }}</option>
            </select>
            <FileInput :id="`activeicon${i}`" :label="`${t('relationBox.icon')}`" :func="loadFile(stat)" />
          </div>
        </div>
        <div class="item">
          <button id="undo"><span class="iconfont icon-undo-alt"></span></button>
          <button id="redo"><span class="iconfont icon-redo-alt"></span></button>
          <PicButton />
          <CodeButton v-show="store.scene === 'default'" />
          <button id="clear" @click="clear">{{ $t('clear') }}</button>
        </div>
        <div class="item" id="output"></div>
      </div>
    </div>
</template>

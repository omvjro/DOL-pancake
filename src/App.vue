<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

const { t, locale } = useI18n();
const placeholder = localStorage.getItem('temp') || t('placeholder')
const isRestored = computed(() => {
  return localStorage.getItem('temp');
})
function restoreInit(e) {
  localStorage.removeItem('temp');
  e.target.hidden = true;
  document.querySelector('div.passage').innerHTML = t('placeholder');
}
window.addEventListener('beforeunload', () => {
  localStorage.setItem('temp', document.querySelector('div.passage').innerHTML);
});

const isFirefox = computed(() => {
  return navigator.userAgent.includes('Firefox')
})
const contenteditable = computed(() => {
  return isFirefox.value ? 'true' : 'plaintext-only'
})

const scene = ref('default'),
      theme = ref(localStorage.getItem('theme') || ''),

      feat = ref('none'),
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
            activeicon: '/img/ui/heart.png',
            inactiveicon: '/img/ui/emptyheart.png'
          },
          {
            name: t('relationBox.lust'),
            progress: 50,
            direction: 'vertical',
            activeicon: '/img/ui/vial.png',
            inactiveicon: '/img/ui/emptyvial.png'
          },
          {
            name: t('relationBox.jealousy'),
            progress: 100,
            direction: 'horizontal',
            activeicon: '/img/ui/wideeye.png'
          },
          {
            name: '',
            progress: 100,
            direction: 'horizontal',
            activeicon: ''
          },
      ])

watch(theme, (newValue) => {
  localStorage.setItem('theme', newValue)
})
watch(locale, (newValue) => {
  localStorage.setItem('locale', newValue)
  document.title = t('title')
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
      insert(img, 1);
      e.target.value = '';
    };
    img.addEventListener('dragstart', () => {
      document.querySelector('#direct-paste').checked = true;
      // editableSwitch(true, true);
    });
  }
}

function clear() {
  if (scene.value === 'default') {
    const dolEditor = document.querySelector('div.passage');
    dolEditor.innerText = '';
  } else if (scene.value === 'npc') {
    stats.value = [{name: '',},{name: '',},{name: '',},{name: '',}]
    name.value = ''
    title.value = ''
    description.value = ''
  }
}

onMounted(() => {
  document.title = t('title')
})
</script>

<template>
<div id="container">
      <div id="dol">
        <div id="html" v-show="scene === 'default'">
          <div id="body" :data-theme="theme">
            <div id="ui-overlay" class="ui-close"></div>
            <div id="ui-bar" aria-live="polite" class="stowed">
              <div id="ui-bar-tray">
                <button id="ui-bar-toggle" tabindex="0" title="Toggle the UI bar" aria-label="Toggle the UI bar" type="button" role="button"></button>
              </div>
              <div id="ui-bar-body"></div>
            </div>
            <div id="story" role="main" class="">
              <ToolTip :fixed="true" v-if="isRestored" @click="restoreInit($event)">{{ $t('restoreTip') }}</ToolTip>
              <FeatBox :feat
                       :featTitle
                       :featText />
              <div id="passages" aria-live="polite">
                <div class="passage" :contenteditable="contenteditable" v-html="placeholder"></div>
              </div>
            </div>
            <div id="gameVersionDisplay" :contenteditable="contenteditable"> {{ $t('watermark') }} </div>
            <div id="gameVersionDisplay2" :contenteditable="contenteditable">{{ $t('watermark') }}</div>
          </div>
        </div>
        <RelationBox v-show="scene === 'npc'"
                     :name
                     :title
                     :color
                     :description
                     :stats />
      </div>
      <div class="toolbox">
        <div class="item">
          <label for="theme">{{ $t('theme') }}：</label>
          <select name="theme" v-model="theme">
            <option value="">{{ $t('default') }}</option>
            <option value="zen">Zen</option>
            <option value="arctic">Arctic</option>
            <option value="monokai">Monokai</option>
            <option value="storm">Storm</option>
            <option value="latte">Catppuccin Latte</option>
            <option value="frappe">Catppuccin Frappé</option>
            <option value="macchiato">Catppuccin Macchiato</option>
            <option value="mocha">Catppuccin Mocha</option>
          </select>
          <label for="scene">{{ $t('scene') }}：</label>
          <select name="scene" v-model="scene">
            <option value="default">{{ $t('default') }}</option>
            <option value="npc">NPC</option>
          </select>
          <label for="language">{{ $t('language') }}：</label>
          <select name="language" v-model="locale">
            <option>zh</option>
            <option>en</option>
            <option>zh-TW</option>
            <option>zh-HK</option>
          </select>
        </div>
        <div v-show="scene === 'default'">
        <div class="item">
          <label for="advanced">{{ $t('experimental') }}</label><input type="checkbox" id="advanced" name="advanced" />
          <label for="link-num">{{ $t('indexed') }}</label><input type="checkbox" id="link-num" name="link-num" checked />
          <label for="html-mode">{{ $t('exportHTML') }}</label><input type="checkbox" id="html-mode" name="html-mode" />
          <template v-if="!isFirefox">
            <label for="direct-paste">{{ $t('pasteDirectly') }}</label><input type="checkbox" id="direct-paste" name="direct-paste" :checked="isFirefox" />
          </template>
        </div>
        <StatChange />
        <SkillCheck />
        <InsertTags />
        <ColouredText />
        <div class="item">
        <FileInput id="insertPic" :label="`${t('insertPics')}：`" :func="insertPic()" />
        </div>
        <div class="item advanced" hidden="1">
          {{ $t('insertNPCwidgets') }}：
          <span id="hollows"></span>
          <ToolTip>{{ $t('invisibleTip') }}</ToolTip>
        </div>
        <div class="item" id="feat">
          {{ $t('achievementPopup') }}：
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
        </div>
        <CustomWidget />
        <div class="item advanced" hidden="1" id="codeSaver">
          <label for="saveName">{{ $t('savePassage.1') }}</label>
          <input type="text" name="saveName" id="saveName">
          {{ $t('savePassage.2') }}
          <select id="saveType"><option>passage</option><option>widget</option></select>
          <button id="save" class="small">{{ $t('confirm') }}</button>
          <span class="tipBox"></span>
        </div>
        <div class="item advanced" id="saveManager" hidden="1">
          <select id="saveManage">
            <option value="load">{{ $t('load') }}</option>
            <option value="delete">{{ $t('delete') }}</option>
            <option value="export">{{ $t('exportAll') }}</option>
            <option value="clear">{{ $t('deleteAll') }}</option>
          </select>
          <label for="saveManage">{{ $t('saved') }}</label>
          <select id="saveManageType">
            <option>passage</option>
            <option>widget</option>
          </select>
          <select id="saveManageSaved" name="saveManageSaved"></select>
          <button id="saveManageConfirm" class="small">{{ $t('confirm') }}</button>
          <span class="tipBox"></span>
        </div>
        <div class="item advanced" id="pancakeManager" hidden="1">
          <select id="pancakeManage">
            <option value="export">{{ $t('export') }}</option>
            <option value="import">{{ $t('import') }}</option>
            <option value="reset">{{ $t('reset') }}</option>
          </select>
          <label for="pancakeManage">{{ $t('settings') }}</label>
          <button id="pancakeManageConfirm" class="small">{{ $t('confirm') }}</button>
          <ToolTip>{{ $t('settingsTip') }}</ToolTip>
          <span class="tipBox"></span>
        </div>
        </div>
        <div v-show="scene === 'npc'">
        <div class="item">
            <input type="text" v-model="name" />
            <input type="text" v-model="title" />
          </div>
          <div class="item"><select v-model="color">
            <option v-for="color in colors.color" :class="color" :key="color">{{ color }}</option>
            <option>white</option>
          </select>
          {{ $t('relationBox.desc') }}：<input v-model="description" /></div>
          <div v-for="(stat, i) in stats" class="item" :key="stat.name">
            <input type="text" v-model="stat.name" />
            <input type="number" v-model="stat.progress" min="1" max="100" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value > 100) this.value = '100';">%
            <select v-model="stat.direction">
              <option value="horizontal">{{ $t('relationBox.horizontal') }}</option>
              <option value="vertical">{{ $t('relationBox.vertical') }}</option>
            </select>
            <FileInput :id="`activeicon${i}`" :label="`${t('relationBox.icon')}：`" :func="loadFile(stat)" />
          </div>
        </div>
        <div class="item">
          <button id="undo"><span class="iconfont icon-undo-alt"></span></button>
          <button id="redo"><span class="iconfont icon-redo-alt"></span></button>
          <button id="pic">{{ $t('preview') }}</button>
          <button id="pic-down">{{ $t('download') }}</button>
          <button id="code" v-show="scene === 'default'">{{ $t('code') }}</button>
          <button id="clear" @click="clear">{{ $t('clear') }}</button>
        </div>
        <div class="item" id="output"></div>
      </div>
    </div>
</template>

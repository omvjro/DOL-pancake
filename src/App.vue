<script setup>
import { watch } from 'vue';
import { ref } from 'vue'
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import RelationBox from './components/RelationBox.vue';
import FileInput from './components/FileInput.vue';
import {
  colors, npcList, statics, diffiColors, lewdColors, tags, hollows,
} from './assets/data.js';
import { insert } from './assets/insert'

const { t, locale } = useI18n();
const placeholder = localStorage.getItem('temp') || t('placeholder')
window.addEventListener('beforeunload', () => {
  const currentHTML = document.querySelector('div.passage').innerHTML;
  if (!localStorage.getItem('temp') && currentHTML === t('placeholder')) return;
  localStorage.setItem('temp', currentHTML);
});

const isFirefox = computed(() => {
  return navigator.userAgent.includes('Firefox')
})
const contenteditable = computed(() => {
  return isFirefox.value ? 'true' : 'plaintext-only'
})

const scene = ref('default'),
      theme = ref(localStorage.getItem('theme')),

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
            activeicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/heart.png',
            inactiveicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/emptyheart.png'
          },
          {
            name: t('relationBox.lust'),
            progress: 50,
            direction: 'vertical',
            activeicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/vial.png',
            inactiveicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/emptyvial.png'
          },
          {
            name: t('relationBox.jealousy'),
            progress: 100,
            direction: 'horizontal',
            activeicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/wideeye.png'
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
            <div id="story" role="main" class=""><div class="feat feat-overlay" v-show="feat !== 'none'">
                <div class="featImage">
                    <img :src="`https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/${feat}Coin.gif`" class="featCoin">
                </div>
                <div class="featText"><span class="title">{{ featTitle }}</span><br><span class="text">{{ featText }}</span></div>
                <div class="closeFeat"></div>
              </div>
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
          </select>
        </div>
        <div v-show="scene === 'default'">
        <div class="item">
          <label for="advanced">{{ $t('advance') }}</label><input type="checkbox" id="advanced" name="advanced" />
          <label for="link-num">{{ $t('indexed') }}</label><input type="checkbox" id="link-num" name="link-num" checked />
          <label for="html-mode">{{ $t('exportHTML') }}</label><input type="checkbox" id="html-mode" name="html-mode" />
          <template :v-if="isFirefox">
            <label for="direct-paste">{{ $t('pasteDirectly') }}</label><input type="checkbox" id="direct-paste" name="direct-paste" :checked="isFirefox" />
          </template>
        </div>
        <div class="item">
          <label>{{ $t('insert') }}
          <select id="static-class" name="static-class"></select>
          {{ $t('statChange') }}：</label>
          <select id="static-plus" name="static-plus">
            <option value="g">+</option>
            <option value="gg">+ +</option>
            <option value="ggg">+ + +</option>
            <option value="l">-</option>
            <option value="ll">- -</option>
            <option value="lll">- - -</option>
          </select>
          <select id="static-type" name="static-type">
          </select>
          <button id="static" class="small">{{ $t('confirm') }}</button>
        </div>
        <div class="item">
          {{ $t('insertSkillChecks') }}：
          <select id="skill-check-type" name="static-check-type">
            <option value="skulduggery">{{ $t('skill.skulduggery') }}</option>
            <option value="physique">{{ $t('skill.physique') }}</option>
            <option value="willpower">{{ $t('skill.willpower') }}</option>
            <option value="english">{{ $t('skill.english') }}</option>
            <option value="swimming">{{ $t('skill.swimming') }}</option>
            <option value="athletics">{{ $t('skill.athletics') }}</option>
            <option value="tending">{{ $t('skill.tending') }}</option>
            <option value="housekeeping">{{ $t('skill.housekeeping') }}</option>
            <option value="dance">{{ $t('skill.dance') }}</option>
            <option value="custom">{{ $t('skill.custom') }}</option>
          </select>
          <select id="skill-check-diffi" name="skill-check-diffi">
            <option value="very_easy">{{ $t('skillDiff.very_easy') }}</option>
            <option value="easy">{{ $t('skillDiff.easy') }}</option>
            <option value="medium">{{ $t('skillDiff.medium') }}</option>
            <option value="challenging">{{ $t('skillDiff.challenging') }}</option>
            <option value="hard">{{ $t('skillDiff.hard') }}</option>
            <option value="very_hard">{{ $t('skillDiff.very_hard') }}</option>
            <option value="impossible">{{ $t('skillDiff.impossible') }}</option>
          </select>
          <button id="skill-check" class="small">{{ $t('confirm') }}</button>
        </div>
        <div class="item">
          {{ $t('insertLewd') }}：
          <select id="lewd-tip-type" name="lewd-tip-type">
            <option value="exhibitionist">{{ $t('lewd.exhibitionist') }}</option>
            <option value="promiscuous">{{ $t('lewd.promiscuous') }}</option>
            <option value="deviant">{{ $t('lewd.deviant') }}</option>
          </select>
          <select id="lewd-tip-grade" name="lewd-tip-grade">
            <option value="1">{{ $t('lewdGrade.1') }}</option>
            <option value="2">{{ $t('lewdGrade.2') }}</option>
            <option value="3">{{ $t('lewdGrade.3') }}</option>
            <option value="4">{{ $t('lewdGrade.4') }}</option>
            <option value="5">{{ $t('lewdGrade.5') }}</option>
            <option value="6">{{ $t('lewdGrade.6') }}</option>
          </select>
          <button id="lewd-tip" class="small">{{ $t('confirm') }}</button>
        </div>
        <div class="item otherTags">{{ $t('insertOther') }}：
          <select name="symbols" id="symbols">
            <option style="display: none" value="">{{ $t('symbols') }}</option>
            <option value=" | ">|</option>
            <option>£</option>
          </select>
        </div>
        <div class="item">
          {{ $t('insertColoredText') }}：
          <select id="color" name="color" class="colorspan">
            <option style='display: none' value="">{{ $t('normal') }}</option>
            <option v-for="color in colors.color" :class="color" :key="color">{{ color }}</option>
          </select>
          <select id="statusColor" name="statusColor" class="colorspan">
            <option style='display: none' value="">{{ $t('attitude') }}</option>
            <option v-for="color in colors.statusColor" :class="color" :key="color">{{ color }}</option>
          </select>
          <select id="specialColor" name="specialColor" class="colorspan">
            <option style='display: none' value="">{{ $t('effected') }}</option>
            <option v-for="color in colors.specialColor" :key="color[0]" :value="color[0]">{{ color[1] }}</option>
          </select>
          <select id="biu" name="biu">
            <option style='display: none' value="">{{ $t('biu') }}</option>
            <option value="b">{{ $t('bold') }}</option>
            <option value="i">{{ $t('italic') }}</option>
            <option value="u">{{ $t('underlined') }}</option>
          </select>
        </div>
        <div class="item">
          {{ $t('insert') }}
          <select id="link" name="link">
            <option value="normalLink">{{ $t('link') }}</option>
            <option value="nextWraith">{{ $t('wraithLink') }}</option>
          </select><temp hidden="1" class="advanced"><label for="linkTime">{{ $t('insertLink.1') }}</label>
          <input type="number" name="linkTime" id="linkTime" min="1" max="599" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value > 599) this.value = '599';">
          {{ $t('insertLink.2') }}<label for="linkTo">{{ $t('insertLink.3') }}</label>
          <input list="linkToList" id="linkTo" name="linkTo" />
          <datalist id="linkToList"></datalist>
          {{ $t('insertLink.4') }}
          <select id="endevent" name="endevent">
            <option value="">{{ $t('insertLink.5') }}</option>
            <option value="endevent">{{ $t('insertLink.6') }}</option>
          </select>
          {{ $t('insertLink.7') }}</temp>
          <button id="linkConfirm" class="small">{{ $t('confirm') }}</button>
        </div>
        <div class="item">
        <FileInput id="insertPic" :label="`${t('insertPics')}：`" :func="insertPic()" />
        </div>
        <div class="item advanced" hidden="1">
          {{ $t('insertNPCwidgets') }}：
          <span id="hollows"></span>
          <mouse class="tooltip-tiny"><sup class="linkBlue">(?)</sup><span>{{ $t('invisibleTip') }}</span></mouse>
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
        <div class="item" id="customWidget">
          {{ $t('insertCustomWidgets') }}：
          <select id="customNames"><option value="new">新建</option></select>
          <button id="customInsert" class="small">{{ $t('confirm') }}</button>
          <button id="customDelete" class="small">{{ $t('delete') }}</button>
          <button id="customExport" class="small">{{ $t('exportAll') }}</button>
        </div>
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
          <mouse class="tooltip-tiny"><sup class="linkBlue">(?)</sup><span>{{ $t('settingsTip') }}</span></mouse>
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

<style scoped>

</style>

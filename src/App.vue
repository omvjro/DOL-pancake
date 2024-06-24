<script setup>
import { watch } from 'vue';
import { ref } from 'vue'
import { computed } from 'vue';
import RelationBox from './components/RelationBox.vue';

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

      name = ref('凯拉尔'),
      title = ref('不合群者'),
      description = ref('因嫉妒歇斯底里。'),
      color = ref('red'),
      stats = ref([
          {
            name: '好感',
            progress: 80,
            direction: 'horizontal',
            activeicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/heart.png',
            inactiveicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/emptyheart.png'
          },
          {
            name: '性欲',
            progress: 50,
            direction: 'vertical',
            activeicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/vial.png',
            inactiveicon: 'https://eltirosto.github.io/Degrees-of-Lewdity-Chinese-Localization/img/ui/emptyvial.png'
          },
          {
            name: '嫉妒',
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
                <div class="passage" :contenteditable="contenteditable" v-html="temp || $t('placeholder')"></div>
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
          <select name="language" v-model="$i18n.locale">
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
            <option value="skulduggery">诡术</option>
            <option value="physique">体能</option>
            <option value="willpower">意志</option>
            <option value="english">语文</option>
            <option value="swimming">游泳</option>
            <option value="athletics">运动</option>
            <option value="tending">护理</option>
            <option value="housekeeping">家务</option>
            <option value="dance">舞蹈</option>
            <option value="custom">自定义</option>
          </select>
          <select id="skill-check-diffi" name="skill-check-diffi">
            <option value="very_easy">易如反掌</option>
            <option value="easy">简单</option>
            <option value="medium">普通</option>
            <option value="challenging">挑战</option>
            <option value="hard">困难</option>
            <option value="very_hard">极难</option>
            <option value="impossible">不可能</option>
          </select>
          <button id="skill-check" class="small">{{ $t('confirm') }}</button>
        </div>
        <div class="item">
          {{ $t('insertLewdTips') }}：
          <select id="lewd-tip-type" name="lewd-tip-type">
            <option value="exhibitionist">露出癖</option>
            <option value="promiscuous">淫乱</option>
            <option value="deviant">异种癖</option>
          </select>
          <select id="lewd-tip-grade" name="lewd-tip-grade">
            <option value="1">1级</option>
            <option value="2">2级</option>
            <option value="3">3级</option>
            <option value="4">4级</option>
            <option value="5">5级</option>
            <option value="6">6级</option>
          </select>
          <button id="lewd-tip" class="small">{{ $t('confirm') }}</button>
        </div>
        <div class="item otherTags">{{ $t('insertOtherTips') }}：
          <select name="symbols" id="symbols">
            <option style="display: none" value="">常用符号</option>
            <option value=" | ">|</option>
            <option>£</option>
          </select>
        </div>
        <div class="item">
          {{ $t('insertColoredText') }}：
          <select id="color" name="color" class="colorspan">
            <option style='display: none' value="">{{ $t('normal') }}</option>
          </select>
          <select id="statusColor" name="statusColor" class="colorspan">
            <option style='display: none' value="">{{ $t('attitude') }}</option>
          </select>
          <select id="specialColor" name="specialColor" class="colorspan">
            <option style='display: none' value="">{{ $t('effected') }}</option>
          </select>
          <select id="biu" name="biu">
            <option style='display: none' value="">{{ $t('biu') }}</option>
            <option value="b">{{ $t('bold') }}</option>
            <option value="i">{{ $t('italic') }}</option>
            <option value="u">{{ $t('underlined') }}</option>
          </select>
        </div>
        <div class="item">
          {{ $t('insert') }}<temp hidden="1" class="advanced"><label for="linkTime">耗时</label>
          <input type="number" name="linkTime" id="linkTime" min="1" max="599" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value > 599) this.value = '599';">
          分钟、<label for="linkTo">前往</label>
          <input list="linkToList" id="linkTo" name="linkTo" />
          <datalist id="linkToList"></datalist>
          且
          <select id="endevent" name="endevent">
            <option value="">不</option>
            <option value="endevent"></option>
          </select>
          结束事件的</temp>
          <select id="link" name="link">
            <option value="normalLink">{{ $t('link') }}</option>
            <option value="nextWraith">{{ $t('wraithLink') }}</option>
          </select>
          <button id="linkConfirm" class="small">{{ $t('confirm') }}</button>
        </div>
        <div class="item">
        <label for="insertPic">{{ $t('insertPics') }}：</label>
        <input id="insertPic" for="insertPic" type="file" accept="image/png, image/jpeg, image/webp">
        </div>
        <div class="item advanced" hidden="1">
          插入NPC部件：
          <span id="hollows"></span>
          <mouse class="tooltip-tiny"><sup class="linkBlue">(?)</sup><span>不可见部件，在编辑框中显示，在导出图片中不显示</span></mouse>
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
          <select id="customNames"><option>新建</option></select>
          <button id="customInsert" class="small">{{ $t('confirm') }}</button>
          <button id="customDelete" class="small">{{ $t('delete') }}</button>
          <button id="customExport" class="small">{{ $t('exportAll') }}</button>
        </div>
        <div class="item advanced" hidden="1" id="codeSaver">
          <label for="saveName">保存为名为</label>
          <input type="text" name="saveName" id="saveName">
          的
          <select id="saveType"><option>passage</option><option>widget</option></select>
          <button id="save" class="small">{{ $t('confirm') }}</button>
          <span class="tipBox"></span>
        </div>
        <div class="item advanced" id="saveManager" hidden="1">
          <select id="saveManage">
            <option value="load">载入</option>
            <option value="delete">删除</option>
            <option value="export">导出所有</option>
            <option value="clear">删除所有</option>
          </select>
          <label for="saveManage">已保存的</label>
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
            <option value="export">导出</option>
            <option value="import">导入</option>
            <option value="reset">重置</option>
          </select>
          <label for="pancakeManage">烤饼机设置</label>
          <button id="pancakeManageConfirm" class="small">{{ $t('confirm') }}</button>
          <mouse class="tooltip-tiny"><sup class="linkBlue">(?)</sup><span>包括已保存 passage 等，导入将覆盖当前设置</span></mouse>
          <span class="tipBox"></span>
        </div>
        </div>
        <div v-show="scene === 'npc'">
        <div class="item">
            <input type="text" v-model="name" />
            <input type="text" v-model="title" />
          </div>
          <div class="item"><select id="descolor" v-model="color"></select>
          描述：<input v-model="description" /></div>
          <div v-for="(stat, i) in stats" class="item" :key="stat.name">
            <input type="text" v-model="stat.name" />
            <input type="number" v-model="stat.progress" min="1" max="100" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value > 100) this.value = '100';">%
            <select v-model="stat.direction">
              <option value="horizontal">水平</option>
              <option value="vertical">竖直</option>
            </select>
            <label :for="'activeicon' + i">图标：</label>
            <input @change="loadFile(stat, $event)" :id="'activeicon' + i" type="file" accept="image/png, image/jpeg, image/webp">
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

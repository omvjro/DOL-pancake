<script setup>
defineProps({
  name: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  color: {
    type: String
  },
  stats: {
    type: Array
  },
})
</script>

<template>
  <div id="npc-relations" class="relation-box-list">
          <div class="relation-box">
              <div class="relation-top-line">
                  <span class="relation-name">
                      {{ name }}
                      <small class="relation-title black"><i>{{ title }}</i></small>
                  </span>
              </div>
              <div class="relation-description">{{ name }}
                  <span :class="color">{{ description }}</span><br>
              </div>
              <div class="relation-stat-list">
                  <div v-for="stat in stats" v-show="stat.name !== ''" class="relation-stat-block" :style="`--progress: ${ stat.progress }%;`" :key="stat.name">
                      <label>{{ stat.name }}</label>
                      <div class="relation-stat">
                          <span v-show="stat.name !== '' && stat.activeicon" class="relation-stat-icon" :class="stat.direction">
                              <img class="active-icon-img" :src="stat.activeicon">
                              <img class="inactive-icon-img" :class="{ outlined: !stat.inactiveicon }" :src="stat.inactiveicon || stat.activeicon">
                          </span>
                          <span v-show="stat.name !== '' && stat.progress" class="relation-stat-percent black">{{ stat.progress }}<small>%</small></span>
                      </div>
                  </div>
              </div>
          </div>
        </div>
</template>

<style scoped>
.relation-box {
	color: var(--000);
	background-color: var(--850);
}

.characteristic-box-list,
.relation-box-list {
	display: flex;
	flex-wrap: wrap;
	position: relative;
}

.characteristic-box-list .characteristic-title,
.relation-box .relation-top-line .relation-name {
	flex: 1;
	align-self: flex-end;
	text-align: left;
	padding-left: 0.5rem;
}

.farm-status .characteristic-title,
.relation-box .relation-top-line .relation-name {
	flex: 1;
	align-self: flex-end;
	text-align: center;
	padding-left: 0.5rem;
}

.characteristic-box-list .characteristic-top-line .characteristic-level .grade-percent,
.characteristic-modifier,
.relation-box .relation-top-line .relation-title {
	display: inline-block;
	min-width: 37px;
}

.relation-box-list .relation-box {
	position: relative;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	/* min-width: 250px; */
	max-width: 100%;
	margin: 0.15rem;
	border: 1px solid var(--300);
	text-align: center;
	overflow: hidden;
	flex: 1 1 32.4%;
}

.relation-box .relation-top-line {
	display: flex;
	align-items: space-between;
	font-size: 1.1em;
	border-bottom: 1px solid var(--750);
	padding: 0.3em;
	align-self: stretch;
}

.relation-box .relation-top-line .relation-title {
	margin-right: 5px;
	text-transform: capitalize;
}

.relation-box .relation-top-line .love-interest-icon {
	width: 24px;
	height: 24px;
}

.relation-box .relation-description {
	padding: 0.5em;
	font-size: 90%;
}

.relation-box .relation-description .meter {
	position: absolute;
	bottom: 0;
	left: 0;
}

.relation-box .relation-stat-list {
	display: flex;
	flex-wrap: wrap;
	background-image: linear-gradient(transparent 50%, var(--750) 0.1em, transparent calc(50% + 0.1em)),
		linear-gradient(90deg, transparent 50%, var(--750) 0.1em, transparent calc(50% + 0.1em));
	border-top: 1px solid var(--750);
	background-size: contain;
	background-repeat: no-repeat;
	flex: 1;
	width: 100%;
	min-height: 130px;
}

.relation-box .relation-stat-list.no-images {
	min-height: 80px;
}

.relation-box .relation-stat-list .relation-stat-block {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(50% - 0.6em);
	padding: 0.3em;
	width: calc(50% - 0.6em);
	margin: 0;
}

.relation-box .relation-stat-list.no-images .relation-stat-block {
	flex-direction: row;
	justify-content: center;
}

.relation-box .relation-stat {
	display: flex;
	flex-direction: row;
	align-items: center;
	z-index: 0;
}

.relation-box .relation-stat-icon {
	position: relative;
	display: inline-block;
	width: 32px;
	height: 32px;
	margin-right: 5px;
}

.relation-box .relation-stat-icon .active-icon-img {
	position: relative;
	z-index: 1;
	clip-path: inset(0 calc(100% - var(--progress)) 0 0);
}

.relation-box .relation-stat-icon.vertical .active-icon-img {
	clip-path: inset(calc(100% - var(--progress)) 0 0 0);
}

.relation-box .relation-stat-icon.vertical-inverted .active-icon-img {
	clip-path: inset(0 0 calc(100% - var(--progress)) 0);
}

.relation-box .relation-stat-icon.horizontal-inverted .active-icon-img {
	clip-path: inset(0 0 0 calc(100% - var(--progress)));
}

.relation-box .relation-stat-icon img.inactive-icon-img.outlined {
	filter: contrast(0.35) brightness(0.25) saturate(0) drop-shadow(0 0 0 white);
}

.relation-box .relation-stat-icon img {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}

.relation-box .relation-stat .relation-stat-percent {
	text-align: left;
}

.relation-box .relation-stat-block .progress-bar {
	width: var(--progress);
	top: auto;
	bottom: 0;
}

#npc-relations .relation-box {
	max-width: 100%;
}

#secondary-npcs,
#farm-status {
	font-size: 85%;
}

#secondary-npcs .relation-box,
#farm-status .relation-box {
	min-width: 220px;
	border-color: var(--500);
	flex: 0 1 24.3%;
}

#secondary-npcs .relation-box .relation-top-line #farm-status .relation-box .relation-top-line {
	padding: 0.2rem 0 0.1rem;
}

#secondary-npcs .relation-box .quick-stats {
	display: inline-flex;
	padding-right: 0.3em;
	align-self: flex-end;
	z-index: 0;
}

#secondary-npcs .relation-box .quick-stats .relation-stat-block:not(:first-child) {
	margin-left: 0.3em;
}

#secondary-npcs .relation-box .relation-stat .relation-stat-icon {
	width: 20px;
	height: 20px;
}

#secondary-npcs .relation-box .relation-stat .relation-stat-percent {
	font-size: 85%;
}

#secondary-npcs .relation-box .relation-description,
#farm-status .relation-box .relation-description,
#global-recognition .relation-box .relation-description {
	padding: 0.3em;
}

#faction-reputations .relation-box {
	flex: 1 1 49%;
}

#global-recognition .relation-box {
	flex: 1 1 30%;
	min-width: 220px;
	border-color: var(--700);
}

#global-recognition .relation-box:last-child {
	font-size: 110%;
	flex-basis: 100%;
}

#farm-status .relation-box:last-child {
	font-size: 120%;
	flex-basis: 100%;
	text-align: center;
	align-items: center;
}

#global-recognition .relation-box:nth-child(12n) {
	font-size: 120%;
	flex-basis: 100%;
	text-align: center;
}

#global-recognition .relation-box:not(:last-child) .relation-box:not(:nth-child(12n)) .relation-description #farm-status .relation-box:not(:last-child) {
	align-self: flex-start;
}

@media (max-width: 869px) {
	#npc-relations .relation-box {
		max-width: 100%;
		box-sizing: border-box;
	}

	#secondary-npcs .relation-box,
	#farm-status .relation-box {
		flex: 1 1 24.3%;
	}
}
</style>

<script setup>
defineProps({
  feat: {
    type: String,
  },
  featTitle: {
    type: String,
  },
  featText: {
    type: String,
  }
})
</script>

<template>
<div class="feat feat-overlay" v-show="feat !== 'none'">
  <div class="featImage">
      <img :src="`/img/ui/${feat}Coin.gif`" class="featCoin">
  </div>
  <div class="featText"><span class="title">{{ featTitle }}</span><br><span class="text">{{ featText }}</span></div>
  <div class="closeFeat"></div>
</div>
</template>

<style scoped>
.feat-overlay {
	/* display: none; */
	position: absolute;
	right: 10px;
	top: 20px;
	/* height: 81px; */
	width: 80%;
	max-width: 400px;
	z-index: 1000;
}

.feat {
	display: flex;
	flex-direction: row;
	background-color: var(--gold);
	padding: 1px;
	gap: 1px;
	line-height: 1.75;
}

.featImage {
	display: flex;
	padding: 2px;
	background-color: var(--800);
	align-items: center;
}

.featCoin {
	padding: 1px;
}

.dot {
	height: 74px;
	width: 74px;
	background-color: var(--400);
	border-radius: 50%;
	padding: 1px;
}

.featText {
	background-color: var(--800);
	flex-grow: 1;
	padding: 5px;
}

.featText .title {
	font-weight: bold;
	margin: 5px;
}

.closeFeat {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	width: calc(100% + 79px);
	max-width: 400px;
	z-index: 1001;
}

.hiddenFeat .closeFeat {
	display: none;
}
</style>
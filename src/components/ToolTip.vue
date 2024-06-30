<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  sup: {
    type: Boolean,
    default: true
  },
  fixed: {
    type: Boolean,
    default: false
  }
})

const tip = ref(null)

onMounted(() => {
  setTimeout(() => {
	tip.value.remove()
  }, 3000);
})
</script>

<template>
    <mouse ref="tip" :class="{
        'tooltip-centertop' : fixed,
        'tooltip-tiny' : !fixed
        }"><sup v-if="!fixed" class="linkBlue">(?)</sup><span><slot>text</slot></span></mouse>
</template>

<style scoped>
mouse.tooltip {
	font-weight: normal;
	border-bottom: 1px dotted var(--tooltip-border);
	cursor: help;
}

.columnRadioControl > span, /* Specifically choosing direct descendants to avoid messing with inter-option formatting. */
.columnRadioControl > label,
.columnRadioControl > .extraMargin > span,
.columnRadioControl > .extraMargin > label {
	margin-right: 30px;
 /* On very narrow displays (aka phones) The text can run together between columns.  This prevents that from happening. */
}

mouse.tooltip span:last-of-type {
	z-index: 210;
	display: none;
	padding: 14px 10px;
	margin-top: 50px;
	margin-left: -40px;
	min-width: 50px;
	max-width: 450px !important;
	line-height: 20px;
	border-radius: 2px;
	box-shadow: 0 0 8px 4px var(--900);
	cursor: default;
}

mouse.tooltip span:last-of-type > :last-child {
	margin-left: 0;
	left: 0;
}

mouse.tooltip-small span:last-of-type {
	z-index: 210;
	display: none;
	padding: 10px 6px;
	margin-top: 40px;
	margin-left: -30px;
	min-width: 50px;
	max-width: 450px !important;
	line-height: 20px;
	border-radius: 1px;
	box-shadow: 0 0 8px 4px var(--900);
	cursor: default;
}

mouse.tooltip-tiny span:last-of-type {
	z-index: 210;
	display: none;
	padding: 0 4px;
	margin-top: 25px;
	margin-left: -20px;
	min-width: 20px;
	max-width: 450px !important;
	line-height: 20px;
	border-radius: 1px;
	white-space: nowrap;
	box-shadow: 0 0 8px 4px var(--900);
}

mouse.tooltip-centertop span:last-of-type {
	/* z-index: 210; */
    z-index: 1001;
	/* display: none; */
	padding: 5px 10px;
	min-width: 20px;
	/* max-width: 200px !important; */
    max-width: 300px;
	line-height: 20px;
	border-radius: 1px;
	/* white-space: nowrap; */
	box-shadow: 0 0 8px 4px var(--900);
}

mouse.tooltip-image span:last-of-type {
	z-index: 210;
	display: none;
	padding: 0 4px;
	margin-top: 25px;
	margin-left: -20px;
	min-width: 20px;
	max-width: 450px !important;
	line-height: 20px;
	border-radius: 1px;
	white-space: nowrap;
	box-shadow: 0 0 8px 4px var(--900);
}

mouse.tooltip:hover span:last-of-type {
	display: inline;
	position: absolute;
	border: 2px solid var(--gold);
	font-weight: normal;
	text-decoration: none;
	font-size: 1em;
	background: var(--tooltip-background) repeat-x 0 0;
}

mouse.tooltip-small,
mouse.tooltip-centertop {
	font-weight: normal;
	border-bottom: 1px dotted;
	cursor: help;
}

mouse.tooltip-small:hover span:last-of-type {
	display: inline;
	position: absolute;
	border: 1px solid var(--gold);
	font-weight: normal;
	text-decoration: none;
	font-size: 80%;
	background: var(--tooltip-background) repeat-x 0 0;
}

mouse.tooltip-tiny:hover span:last-of-type {
	display: inline;
	position: absolute;
	border: 1px solid var(--gold);
	font-weight: normal;
	text-decoration: none;
	font-size: 80%;
	background: var(--tooltip-background) repeat-x 0 0;
}

/* mouse.tooltip-centertop:hover span:last-of-type { */
mouse.tooltip-centertop span:last-of-type {
	/* display: block; */
	position: fixed;
	top: 20px;
	left: 50%;
	transform: translate(-50%, 0);
	border: 1px solid var(--gold);
	font-weight: normal;
	text-decoration: none;
	font-size: 90%;
	background: var(--tooltip-background) repeat-x 0 0;
}

mouse.tooltip-image {
	cursor: help;
}

mouse.tooltip-image:hover span:last-of-type {
	display: inline;
	position: absolute;
	border: 1px solid var(--gold);
	font-weight: normal;
	text-decoration: none;
	font-size: 80%;
	background: var(--tooltip-background) repeat-x 0 0;
}

@media only screen and (max-width: 800px) {
	mouse.tooltip:hover span:last-of-type {
		left: 100px;
	}

	mouse.tooltip-small:hover span:last-of-type {
		left: 100px;
	}
}
</style>
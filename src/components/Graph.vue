<template>
  <div class="graph">
    <div class="flex">
      <div class="flex-item">
        <span>#{{this.index + 1}}</span>
        &nbsp;
        <a :href="`https://github.com/${this.githuber.login}`">{{this.githuber.login}}</a>
      </div>
      <div class="flex-item flex-grow text-right" :title="slocPerDay">
        <span>{{this.githuber.total}} commits</span>
        &nbsp;
        <span class="green">{{this.githuber.a}} ++</span>
        &nbsp;
        <span class="red">{{this.githuber.d}} --</span>
      </div>
    </div>
    <Chart cssClasses="chart-container" :data="githuber.weeks" />
  </div>
</template>

<script>
import Chart from './Chart.vue'

export default {
  name: 'Graph',
  components: {
    Chart,
  },
  props: {
    index: Number,
    githuber: Object,
  },
  computed: {
    slocPerDay() {
      return Math.round((this.githuber.a + this.githuber.d) / ((20 * 12) - 5)) + ' sloc/day'
    },
  },
}
</script>

<style scoped>
.flex {
  padding: 10px;
}
.chart-container {
  /* position: relative; */
  height: 30vh;
  /* width: 100%; */
}
</style>

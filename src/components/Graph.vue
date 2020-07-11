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
    <Chart :chartData="chartData" />
  </div>
</template>

<script>
import Chart from './Chart.vue'
import moment from 'moment'

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
    chartData() {
      return this.githuber.weeks.reduce((carry, { w, a, d, raw }) => {
        carry.labels.push(moment(w * 1000).format('MMM'))
        carry.datasets[0].data.push(a)
        carry.datasets[1].data.push(d)
        carry.datasets[0].raw.push(raw.a)
        carry.datasets[1].raw.push(raw.d)
        return carry;
      }, {
        labels: [],
        datasets: [{
          label: '++',
          data: [],
          raw: [],
          borderColor: '#00FF00',
          pointBackgroundColor: 'transparent',
          borderWidth: 1,
          pointBorderColor: 'transparent',
        }, {
          label: '--',
          data: [],
          raw: [],
          borderColor: '#FF0000',
          pointBackgroundColor: 'transparent',
          borderWidth: 1,
          pointBorderColor: 'transparent',
        }],
      })
    },
  },
}
</script>

<style scoped>
.flex {
  padding: 10px;
}
.info {
  margin: 0 20px;
}
</style>

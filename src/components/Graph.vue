<template>
  <div class="flex-item flex-half">
    <div class="flex">
      <div class="flex-item">
        #{{this.index + 1}} {{this.githuber.login}}
      </div>
      <div class="flex-item flex-grow text-right" :title="slocPerDay">
        {{this.githuber.total}} commits ++{{this.githuber.a}} --{{this.githuber.d}}
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
      return Math.round((this.githuber.a + this.githuber.d) / ((20 * 12) - 5)) + ' sloc/day';
    },
    chartData() {
      return this.githuber.weeks.reduce((carry, { w, a, d }) => {
        carry.labels.push('W' + moment(w * 1000).week())
        carry.datasets[0].data.push(a)
        carry.datasets[1].data.push(d)
        return carry;
      }, {
        labels: [],
        datasets: [{
          label: '++',
          data: [],
        }, {
          label: '--',
          data: [],
        }],
      })
    }
  },
}
</script>

<style scoped>
.flex {
  padding: 10px;
}
.flex-grow {
  flex-grow: 1;
}
.flex-half {
  width: 50%;
  padding: 10px 0;
}
.info {
  margin: 0 20px;
}
.text-right {
  text-align: right;
}
</style>

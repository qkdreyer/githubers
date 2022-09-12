<template>
  <Line
    :chart-data="reactiveData"
    :chart-options="options"
    :chart-id="`chart-${id}`"
    css-classes="chartjs-render-monitor"
    :styles="styles"
    :height="150"
  />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, PointElement, LineElement, LogarithmicScale, LinearScale, Filler } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, PointElement, LineElement, LogarithmicScale, LinearScale, Filler)

export default {
  components: { Line },
  props: {
    id: String,
    data: Array,
  },
  computed: {
    reactiveData() {
      return this.data.reduce((carry, { w, a, d, raw, ad }) => {
        const d1 = new Date(w * 1000)
        const d2 = new Date(w * 1000)
        d2.setDate(d2.getDate() + 7)
        carry.labels.push(d1.toLocaleString('default', { month: 'short' }))
        carry.datasets[0].data.push(`${d1.toLocaleDateString()} - ${d2.toLocaleDateString()}`)
        carry.datasets[1].data.push(a)
        carry.datasets[2].data.push(d)
        carry.datasets[1].raw.push(raw.a)
        carry.datasets[2].raw.push(raw.d)
        return carry;
      }, {
        labels: [],
        datasets: [{
          label: 'period',
          hidden: true,
          data: []
        }, {
          label: '++',
          data: [],
          raw: [],
          type: 'line',
          borderColor: '#00FF00',
          borderWidth: 1,
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          backgroundColor: this.gradient(0, 255, 0, 0.5),
          fill: true,
        }, {
          label: '--',
          data: [],
          raw: [],
          type: 'line',
          borderColor: '#FF0000',
          pointBackgroundColor: 'transparent',
          borderWidth: 1,
          pointBorderColor: 'transparent',
          backgroundColor: this.gradient(255, 0, 0, 0.5),
          fill: true,
        }],
      })
    },
    options() {
      return {
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'transparent',
            },
          },
          y: {
            display: false,
            type: 'logarithmic',
            grid: {
              color: 'transparent',
            },
            min: 0.001,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: ([{ chart: { data }, dataIndex }]) => data.datasets[0].data[dataIndex],
              label({ dataset, dataIndex }) {
                const { label, data, raw } = dataset
                const kv = (key, value) => `${key} : ${value}`
                return [kv(label, data[dataIndex])].concat(Object.entries(raw[dataIndex]).map(([repo, value]) => kv(`・${repo}`, value)))
              },
              labelColor: ({ dataset: { backgroundColor, borderColor } }) => ({
                backgroundColor,
                borderColor,
              }),
            },
          },
          legend: {
            labels: {
              filter: ({ text }, chart) => text !== 'period',
            },
          },
        },
      };
    },
    styles() {
      return {
        height: '30vh',
        position: 'relative'
      }
    }
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.chartData = this.reactiveData
        })
      },
      immediate: true
    },
  },
  methods: {
    gradient(r, g, b, a1, a2 = 0.25, a3 = 0) {
      const gradient = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 0, 450)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a1})`)
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a2})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${a3})`)
      return gradient
    },
  },
}
</script>

<style scoped>
.chartjs-render-monitor {
  background: #2c3e50;
  border-radius: 15px;
  box-shadow: 0px 2px 15px rgba(25, 25, 25, 0.27);
}
</style>

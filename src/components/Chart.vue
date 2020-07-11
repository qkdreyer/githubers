<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
                color: 'transparent',
            },
          }],
          yAxes: [{
            display: false,
            type: 'logarithmic',
            gridLines: {
                color: 'transparent',
            },
          }],
        },
        tooltips: {
          callbacks: {
            label({ datasetIndex, index }, object) {
              const { label, data } = object.datasets[datasetIndex]
              const kv = (key, value) => `${key} : ${value}`
              return [kv(label, data[index])].concat(Object.entries(object.datasets[datasetIndex].raw[index]).map(([repo, value]) => kv(repo, value)))
            },
            labelColor({ datasetIndex }, { config: { data } }) {
              const { backgroundColor, borderColor } = data.datasets[datasetIndex]
              return {
                backgroundColor,
                borderColor,
              }
            },
          },
        },
      }),
    },
  },
  watch: {
    chartData() {
      this.chartData.datasets = this.chartData.datasets.map(data => ({
        ...data,
        backgroundColor: this.gradient(Number(data.label !== '++') * 255, Number(data.label === '++') * 255, 0, data.label === '++' ? 0.25 : 0.25),
      }))
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    gradient(r, g, b, a1, a2 = 0.25, a3 = 0) {
      var gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
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

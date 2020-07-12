<script>
import { Line, mixins } from 'vue-chartjs'
import moment from 'moment'

const { reactiveData } = mixins
moment.locale(navigator.language)

export default {
  extends: Line,
  mixins: [reactiveData],
  props: {
    data: {
      type: Array,
    },
    options: {
      type: Object,
      default: () => ({
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
            title: ([{ index }], object) => object.datalabel[index],
            label({ datasetIndex, index }, object) {
              const { label, data } = object.datasets[datasetIndex]
              const kv = (key, value) => `${key} : ${value}`
              return [kv(label, data[index])].concat(Object.entries(object.datasets[datasetIndex].raw[index]).map(([repo, value]) => kv(`・${repo}`, value)))
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
  computed: {
    reactiveData() {
      return this.data.reduce((carry, { w, a, d, raw }) => {
        const m = moment(w * 1000)
        carry.labels.push(m.format('MMM'))
        carry.datalabel.push(`${m.format('L')} - ${m.add(1, 'w').format('L')}`)
        carry.datasets[0].data.push(a)
        carry.datasets[1].data.push(d)
        carry.datasets[0].raw.push(raw.a)
        carry.datasets[1].raw.push(raw.d)
        return carry;
      }, {
        labels: [],
        datalabel: [],
        datasets: [{
          label: '++',
          data: [],
          raw: [],
          borderColor: '#00FF00',
          pointBackgroundColor: 'transparent',
          borderWidth: 1,
          pointBorderColor: 'transparent',
          backgroundColor: this.gradient(0, 255, 0, 0.5),
        }, {
          label: '--',
          data: [],
          raw: [],
          borderColor: '#FF0000',
          pointBackgroundColor: 'transparent',
          borderWidth: 1,
          pointBorderColor: 'transparent',
          backgroundColor: this.gradient(255, 0, 0, 0.5),
        }],
      })
    },
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
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    gradient(r, g, b, a1, a2 = 0.25, a3 = 0) {
      const gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
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

const params = new URLSearchParams(window.location.search)

export default {
  methods: {
    hasParam: param => params.has(param),
    getParam: param => params.get(param),
    getAllParam: param => params.getAll(param),
  },
}

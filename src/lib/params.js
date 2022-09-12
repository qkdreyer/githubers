const params = new URLSearchParams(window.location.search)

export default params
export const hasParam = param => params.has(param)
export const getParam = param => params.get(param)
export const getAllParam = param => params.getAll(param)

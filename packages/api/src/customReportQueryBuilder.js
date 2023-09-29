import API from './utils/API'

const api = new API()
const prefix = '/report/custom'

const getAllItems = () =>
  api
    .callApi({
      url: `${prefix}/definition`,
      method: 'get',
    })
    .then((result) => result?.data?.result)

const loadChartData = (params) =>
  api
    .callApi({
      url: `${prefix}/load`,
      method: 'get',
      params,
    })
    .then((result) => result?.data?.result)

const getDataSource = () =>
  api
    .callApi({
      url: `${prefix}/data-source`,
      method: 'get',
    })
    .then((result) => result?.data?.result)

const getItemById = (itemId) =>
  api
    .callApi({
      url: `${prefix}/definition/${itemId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getMetaData = () =>
  api
    .callApi({
      url: `${prefix}/meta/all`,
      method: 'get',
    })
    .then((result) => result.data.result)

const addItem = (data) =>
  api
    .callApi({
      url: `${prefix}/definition`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateItem = (data) =>
  api
    .callApi({
      url: `${prefix}/definition`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const deleteItemById = (itemId) =>
  api
    .callApi({
      url: `${prefix}/definition/${itemId}`,
      method: 'delete',
    })
    .then(({ data: response }) => response)

export default {
  getAllItems,
  getItemById,
  loadChartData,
  getDataSource,
  addItem,
  updateItem,
  deleteItemById,
  getMetaData,
}

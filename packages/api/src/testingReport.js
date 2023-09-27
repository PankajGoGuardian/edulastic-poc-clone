import API from './utils/API'

const api = new API()
const prefix = '/testing-report'

const getAllItems = () =>
  api
    .callApi({
      url: `${prefix}/items`,
      method: 'get',
    })
    .then((result) => result?.data?.result)

const buildChartData = (data) =>
  api
    .callApi({
      url: `${prefix}/chartData`,
      method: 'post',
      data,
    })
    .then((result) => result?.data?.result)

const getDataSource = () =>
  api
    .callApi({
      url: `${prefix}/data-source`,
      method: 'get',
    })
    .then((result) => result?.data?.result)

const getItemById = (params) =>
  api
    .callApi({
      url: `${prefix}/item`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

const generateQuery = (data) =>
  api
    .callApi({
      url: `${prefix}/query`,
      method: 'post',
      data,
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
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateItem = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const deleteItemById = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'delete',
      data,
    })
    .then(({ data: response }) => response)

export default {
  getAllItems,
  getItemById,
  buildChartData,
  getDataSource,
  addItem,
  updateItem,
  deleteItemById,
  getMetaData,
  generateQuery,
}

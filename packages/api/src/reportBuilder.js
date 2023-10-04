import API from './utils/API'

const api = new API()
const prefix = '/report/builder'

const getReportDefinitions = () =>
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
      url: `${prefix}/source`,
      method: 'get',
    })
    .then((result) => result?.data?.result)

const getReportDefinitionById = (id) =>
  api
    .callApi({
      url: `${prefix}/definition/${id}`,
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

const addReportDefinition = (data) =>
  api
    .callApi({
      url: `${prefix}/definition`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateReport = ({ definitionId, updateDoc }) =>
  api
    .callApi({
      url: `${prefix}/definition/${definitionId}`,
      method: 'put',
      data: updateDoc,
    })
    .then((result) => result.data.result)

const deleteWidgetById = (definitionId) =>
  api
    .callApi({
      url: `${prefix}/definition/${definitionId}`,
      method: 'delete',
    })
    .then(({ data: response }) => response)

export default {
  getReportDefinitions,
  getReportDefinitionById,
  loadChartData,
  getDataSource,
  addReportDefinition,
  updateReport,
  deleteWidgetById,
  getMetaData,
}

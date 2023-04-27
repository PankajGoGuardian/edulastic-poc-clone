import API from './utils/API'

const api = new API()

const createRubrics = (payload) =>
  api
    .callApi({
      method: 'post',
      url: '/rubrics',
      data: {
        ...payload,
      },
    })
    .then((result) => result.data.result)

const generateRubrics = (payload) =>
  api
    .callApi({
      method: 'post',
      url: '/rubrics/generate-rubric-criteria',
      data: {
        ...payload,
      },
      useSlowApi: true,
    })
    .then((result) => result.data.result)

const getSerchedRubrics = (data) =>
  api
    .callApi({ url: '/rubrics/search', method: 'post', data: { ...data } })
    .then((result) => result.data.result)

const getRubricsById = (id) =>
  api.callApi({ url: `/rubrics/${id}` }).then((result) => result.data.result)

const deleteRuricsById = (id) =>
  api
    .callApi({ url: `/rubrics/${id}`, method: 'delete' })
    .then((result) => result.data.result)

const updateRubricsById = ({ id, body }) =>
  api
    .callApi({ url: `/rubrics/${id}`, method: 'put', data: body })
    .then((result) => result.data.result)

const getRubricsUsedByDistrict = () =>
  api
    .callApi({ url: `/rubrics/used-by-district`, method: 'get' })
    .then((result) => result.data.result)

export default {
  createRubrics,
  getSerchedRubrics,
  getRubricsById,
  deleteRuricsById,
  updateRubricsById,
  getRubricsUsedByDistrict,
  generateRubrics,
}

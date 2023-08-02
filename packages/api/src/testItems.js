import { get } from 'lodash'
import API from './utils/API'
import AttchmentApi from './attachment'

const api = new API()
const prefix = '/testitem'
const prefixElasticSearch = '/search/items'

const formatData = (data) => {
  const item = JSON.parse(JSON.stringify(data))
  delete item._id
  return item
}

const getAll = (data) =>
  api
    .callApi({
      url: prefixElasticSearch,
      method: 'post',
      data,
    })
    .then((result) => {
      const items = get(result, 'data.result.hits.hits', []).map((el) => ({
        _id: el._id,
        ...el._source,
      }))
      const count = get(result, 'data.result.hits.total', 0)
      return { items, count }
    })

const getById = (id, params = {}) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

const updateById = (id, item, testId) => {
  const {
    updatedAt,
    createdAt,
    authors,
    autoGrade,
    sharedType,
    algoVariablesEnabled,
    owner,
    sharedWith,
    previousTestItemId,
    ...data
  } = formatData(item)
  return api
    .callApi({
      url: `${prefix}/${id}${testId ? `?testId=${testId}` : ''}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)
}

const create = (data, params = {}) =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data,
      params,
    })
    .then((result) => result.data.result)

const update = ({ id, item }) => {
  const { updatedAt, createdAt, previousTestItemId, ...data } = formatData(item)
  return api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)
}

const evaluation = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}/evaluation`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const duplicateTestItem = (id, data = {}) =>
  api
    .callApi({
      url: `${prefix}/${id}/duplicate`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const publishTestItem = (data) =>
  api
    .callApi({
      url: `${prefix}/${data.itemId}/publish?status=${data.status}`,
      method: 'put',
    })
    .then((result) => {
      if (data.status !== 'rejected') {
        AttchmentApi.saveAttachment({
          type: 'testitem',
          referrerType: 'TestItemContent',
          referrerId: data.itemId,
          data: {
            note: '',
          },
          status: data.status,
        })
      }
      return result.data.result
    })

const bulkPublishTestItems = (data) =>
  api
    .callApi({
      url: `${prefix}/bulk`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const getByV1Id = (id) =>
  api
    .callApi({
      url: `${prefix}/v1/${id}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const deleteById = (id, params = {}) =>
  api
    .callApi({ url: `${prefix}/${id}`, method: 'delete', params })
    .then((result) => result.data)

const getPassageItems = (id) =>
  api
    .callApi({
      url: `${prefix}/passage-items/${id}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getAutoSelectedItems = (data) =>
  api
    .callApi({ url: `${prefix}/auto-select/search`, method: 'post', data })
    .then((result) => result.data.result)

const evaluateAsStudent = (id, data) => {
  return api
    .callApi({
      url: `${prefix}/evaluate-as-student/${id}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)
}

const updateCorrectItemById = ({
  testItemId: id,
  testItem: item,
  testId,
  assignmentId,
  editRegradeChoice,
  proceedRegrade: regrade,
}) => {
  const {
    public: publicValue,
    autoGrade,
    passageContent,
    alreadyLiked,
    algoVariablesEnabled,
    previousTestItemId,
    sharedType,
    sharedWith,
    createdAt,
    updatedAt,
    __v,
    passageData,
    ...data
  } = formatData(item)

  return api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${id}/correct-item-and-publish`,
      method: 'put',
      params: {
        testId,
        assignmentId,
        editRegradeChoice,
        regrade,
      },
      data,
    })
    .then((result) => result.data.result)
}

const addItems = (data, params = {}) =>
  api
    .callApi({
      url: `${prefix}/multi`,
      method: 'post',
      data,
      params,
    })
    .then((result) => result.data.result)

export default {
  getAll,
  getById,
  updateById,
  create,
  update,
  evaluation,
  duplicateTestItem,
  publishTestItem,
  bulkPublishTestItems,
  getByV1Id,
  deleteById,
  getPassageItems,
  getAutoSelectedItems,
  updateCorrectItemById,
  evaluateAsStudent,
  addItems,
}

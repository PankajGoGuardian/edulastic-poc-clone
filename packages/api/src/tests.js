import { omit, get } from 'lodash'

import API from './utils/API'

const api = new API()
const prefix = '/test'
const prefixElasticSearch = '/search/tests'

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

const formatData = (data) => omit(data, ['_id', 'autoGrade', 'active'])

const getById = (id, params = {}) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

const getByIdMinimal = (id, params = {}) =>
  api
    .callApi({
      url: `${prefix}/${id}/minimal`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

const getSummary = (id) =>
  api
    .callApi({
      url: `${prefix}/${id}/summary`,
      method: 'get',
    })
    .then((result) => result.data)

const create = (data) =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const update = ({ id, data: test }) => {
  const { authors, ...data } = formatData(test)
  return api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)
}

const publishTest = (testId) =>
  api
    .callApi({
      url: `${prefix}/${testId}/publish`,
      method: 'put',
    })
    .then((result) => result.data.result)

const updateTestStatus = (data) =>
  api
    .callApi({
      url: `${prefix}/${data.testId}/publish?status=${data.status}`,
      method: 'put',
      data: { collections: data.collections },
    })
    .then((result) => result.data.result)

const updateBulkTestsStatus = (data) =>
  api
    .callApi({
      url: `${prefix}/bulk`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const getPublicTest = (testId) =>
  api
    .callApi({
      url: `/public/test/${testId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getByV1Id = (v1Id) =>
  api
    .callApi({
      url: `test/v1Id/${v1Id}/id`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getDefaultImage = ({ subject, standard }) =>
  api
    .callApi({
      url: `${prefix}/default-thumbnail?subject=${subject}&standard=${standard}`,
    })
    .then((result) => result.data.result.image)

const getDefaultTestSettings = ({ orgId, params = {} }) =>
  api
    .callApi({
      url: `${prefix}/default-test-settings/${orgId}`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

const deleteAssignments = ({ testId, assignmentIds = [] }) =>
  api
    .callApi({
      url: `${prefix}/${testId}/delete-assignments`,
      method: 'delete',
      data: { assignmentIds },
    })
    .then((result) => result.data.result)

const deleteTest = ({ testId, type }) =>
  api
    .callApi({
      url: `/test/${testId}`,
      method: 'delete',
      params: {
        type,
      },
    })
    .then((result) => result.data.result)

const getTestIdFromVersionId = (versionId) =>
  api
    .callApi({
      url: `${prefix}/version/${versionId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getYoutubeThumbnail = (videoId) =>
  api
    .callApi({
      url: `${prefix}/yt-thumb/${videoId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

export default {
  getAll,
  getById,
  getByIdMinimal,
  create,
  update,
  getDefaultImage,
  publishTest,
  updateTestStatus,
  updateBulkTestsStatus,
  getPublicTest,
  getByV1Id,
  getDefaultTestSettings,
  deleteAssignments,
  deleteTest,
  getTestIdFromVersionId,
  getSummary,
  getYoutubeThumbnail,
}

import qs from 'qs'
import API from './utils/API'

const api = new API()
const prefix = '/playlists'
const getPlaylist = ({ id, forUseThis = false, termIds = [] }) => {
  const queryString = qs.stringify({ termIds }, { commaSuffix: 'bracket' })
  return api
    .callApi({
      method: 'get',
      url: `${prefix}/${id}?${queryString}${forUseThis ? '&forUseThis=1' : ''}`,
    })
    .then((result) => result.data.result)
}

const delelePlaylist = (id) =>
  api
    .callApi({
      method: 'delete',
      url: `${prefix}/${id}`,
    })
    .then((result) => result.data)

const delelePlaylistFromUse = (id) =>
  api
    .callApi({
      method: 'delete',
      url: `${prefix}/use/${id}`,
    })
    .then((result) => result.data)

const searchDistinctPublishers = () =>
  api
    .callApi({
      method: 'get',
      url: `${prefix}/search/collection`,
    })
    .then((result) => result.data.result)

const updateCurriculumSequence = (id, curriculumSequence) => {
  const _curriculumSequence = { ...curriculumSequence }

  delete _curriculumSequence._id
  delete _curriculumSequence.__v

  const options = {
    method: 'put',
    url: `${prefix}/${id}`,
    data: _curriculumSequence,
  }

  return api.callApi(options).then((res) => res.data.result)
}

const searchCurriculumSequences = ({ search, sort, limit, page }) => {
  const options = {
    method: 'post',
    url: `${prefix}/search/`,
    data: {
      page,
      limit,
      search,
      sort,
    },
  }

  return api.callApi(options).then((res) => res.data.result)
}

const create = ({ data }) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}`,
      data,
    })
    .then((res) => res.data.result)

const update = ({ data, id }) =>
  api
    .callApi({
      method: 'put',
      url: `${prefix}/${id}`,
      data,
    })
    .then((res) => res.data.result)

const publishPlaylist = (payload) =>
  api
    .callApi({
      method: 'put',
      url: payload.unlinkFromId
        ? `${prefix}/${payload.id}/publish?unlinkFromId=${payload.unlinkFromId}`
        : `${prefix}/${payload}/publish`,
    })
    .then((res) => res)

const updatePlaylistStatus = (data) =>
  api
    .callApi({
      method: 'put',
      url: `${prefix}/${data.playlistId}/publish?status=${data.status}`,
      data: { collections: data.collections },
    })
    .then((result) => result.data.result)

const duplicatePlayList = ({
  _id,
  title,
  forUseThis = false,
  forceClone = false,
}) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/${_id}/duplicate?title=${title}${
        forUseThis ? `&forUseThis=1` : ''
      }${forceClone ? '&forceClone=1' : ''}`,
    })
    .then((res) => res.data.result)

const publishCustomizeDraft = ({ _id, data }) =>
  api
    .callApi({
      method: 'put',
      url: `${prefix}/${_id}/duplicate`,
      data,
    })
    .then((res) => res.data.result)

const checkExistingDuplicatedForUser = (id) =>
  api
    .callApi({
      method: 'get',
      url: `${prefix}/${id}/duplicate`,
    })
    .then((res) => res.data.result)

const fetchPlaylistMetrics = (data) => {
  const queryString = qs.stringify(data)
  return api
    .callApi({
      useSlowApi: true,
      method: 'get',
      url: `/report/playlist-metrics?${queryString}`,
    })
    .then((result) => result.data.result)
}

const fetchPlaylistInsights = (data) => {
  const queryString = qs.stringify(data)
  return api
    .callApi({
      useSlowApi: true,
      method: 'get',
      url: `/report/insights?${queryString}`,
    })
    .then((result) => result.data.result)
}

const getSignedRequest = ({ playlistId, moduleId, contentId, resource }) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/${playlistId}/generate-lti-request`,
      data: {
        moduleId,
        contentId,
        resource,
      },
    })
    .then((result) => result.data.result)

const usePlaylist = (id) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/${id}/use-this`,
    })
    .then((result) => result.data.result)

export default {
  getCurriculums: getPlaylist,
  updateCurriculumSequence,
  searchDistinctPublishers,
  searchCurriculumSequences,
  create,
  publishPlaylist,
  updatePlaylistStatus,
  update,
  duplicatePlayList,
  fetchPlaylistMetrics,
  fetchPlaylistInsights,
  getSignedRequest,
  delelePlaylist,
  delelePlaylistFromUse,
  usePlaylist,
  publishCustomizeDraft,
  checkExistingDuplicatedForUser,
}

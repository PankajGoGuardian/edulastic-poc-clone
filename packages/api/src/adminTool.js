import { notification } from '@edulastic/common'
import API from './utils/API'

const prefix = '/admin-tool'

const api = new API()

const showErrorNotification = (error) => {
  const message = error?.response?.data?.message || 'Something went wrong'
  notification({ type: 'error', msg: message })
}

const getDistinctFeedTypes = () =>
  api
    .callApi({
      url: `${prefix}/distinct-feed-types`,
      method: 'get',
    })
    .then(({ data: response }) => response)
    .catch((error) => showErrorNotification(error))

const deleteFeedType = (data) =>
  api
    .callApi({
      url: `${prefix}/delete-feed-type`,
      method: 'delete',
      data,
    })
    .then(() => notification({ type: 'success', msg: 'Deleted Successfully' }))
    .catch((error) => showErrorNotification(error))

const insertFeedType = (data) =>
  api
    .callApi({
      url: `${prefix}/insert-feed-types`,
      method: 'post',
      data,
    })
    .then(() =>
      notification({ type: 'success', msg: 'Feed Type Enabled Successfully' })
    )
    .catch((error) => showErrorNotification(error))

const updateFeedType = (data) =>
  api
    .callApi({
      url: `${prefix}/update-feed-types`,
      method: 'put',
      data,
    })
    .then(() => notification({ type: 'success', msg: 'Updated Successfully' }))
    .catch((error) => showErrorNotification(error))
export default {
  getDistinctFeedTypes,
  deleteFeedType,
  insertFeedType,
  updateFeedType,
}

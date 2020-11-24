import { API } from '@edulastic/api'
import { notification } from '@edulastic/common'

const api = new API()

export const doValidate = (params, endpoint, method = 'post') =>
  api
    .callApi({
      url: endpoint,
      method,
      data: method === 'post' ? params : {},
      params: method === 'get' ? params : {},
    })
    .then(({ data }) => data)
    .catch(({ data: errorData }) =>
      notification({ msg: errorData?.message || 'Something went wrong' })
    )

export const submit = (params, endpoint, method, isSlowApi) =>
  api
    .callApi({
      useSlowApi: isSlowApi,
      url: endpoint,
      method,
      data: params,
    })
    .then(({ data, status }) => ({ ...data, status }))
    .catch(({ data: errorData }) =>
      notification({ msg: errorData?.message, messageKey: 'apiFormErr' })
    )

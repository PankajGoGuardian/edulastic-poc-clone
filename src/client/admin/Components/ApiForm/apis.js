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
    .catch((errorObj) => {
      const { data: errorData } = errorObj
      if (errorObj?.response?.data?.message === 'DistrictNotFound') {
        notification({
          msg: 'District not found!',
          messageKey: 'apiFormErr',
        })
      } else {
        notification({
          msg: errorData?.message || errorObj?.response?.data?.message,
          messageKey: 'apiFormErr',
        })
      }
    })

export const uploadFile = (file, endPoint) => {
  const formData = new FormData()
  formData.append('file', file)
  return api
    .callApi({
      url: endPoint,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((result) => result.data.result)
}

export const saveStandard = (subject, standardData) =>
  api.callApi({
    url: `admin-tool/standards`,
    method: 'post',
    data: { subject, standardData },
  })

export const saveMultiStandardMapping = (multiStandardMappingData) =>
  api.callApi({
    url: `admin-tool/multi-standard-mapping`,
    method: 'post',
    data: { multiStandardMappingData },
  })

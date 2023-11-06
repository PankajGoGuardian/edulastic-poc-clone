import API from '@edulastic/api/src/utils/API'
import qs from 'qs'
import { reportPrefix } from '../../index'

const api = new API()

const standardsProgressPrefix = '/standards-progress'

const fetchStandardsProgressTestInfo = (params) =>
  api
    .callApi({
      url: `${reportPrefix}${standardsProgressPrefix}/test-info`,
      method: 'get',
      params,
      paramsSerializer: (param) => qs.stringify(param),
      useSlowApi: true,
    })
    .then((response) => response?.data?.result)

const fetchStandardsProgressSummary = (params) =>
  api
    .callApi({
      url: `${reportPrefix}${standardsProgressPrefix}/summary`,
      method: 'get',
      params,
      paramsSerializer: (param) => qs.stringify(param),
      useSlowApi: true,
    })
    .then((response) => response?.data?.result)

const fetchStandardsProgressDetails = (params) =>
  api
    .callApi({
      url: `${reportPrefix}${standardsProgressPrefix}/details`,
      method: 'get',
      params,
      paramsSerializer: (param) => qs.stringify(param),
      useSlowApi: true,
    })
    .then((response) => response?.data?.result)

export default {
  fetchStandardsProgressTestInfo,
  fetchStandardsProgressDetails,
  fetchStandardsProgressSummary,
}

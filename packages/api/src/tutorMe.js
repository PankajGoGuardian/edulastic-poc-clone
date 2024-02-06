import qs from 'qs'
import API from '@edulastic/api/src/utils/API'

const api = new API()
const tutorMeApiPrefix = '/tutor-me'

const getTutorMeStandards = (params) => {
  const queryString = qs.stringify(params)
  return api
    .callApi({
      url: `${tutorMeApiPrefix}/standards?${queryString}`,
      method: 'get',
    })
    .then(({ data }) => data?.result)
}

function authorizeTutorme() {
  return api
    .callApi({
      url: `${tutorMeApiPrefix}/authorize`,
      method: 'post',
    })
    .then((r) => r.data.result)
}

export default {
  getTutorMeStandards,
  authorizeTutorme,
}

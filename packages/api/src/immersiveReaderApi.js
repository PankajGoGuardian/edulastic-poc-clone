import API from './utils/API'

const api = new API()

export const fetchIRtokenAndSubDomain = () =>
  api
    .callApi({
      url: `/immersive-reader/GetTokenAndSubdomain`,
      method: 'get',
    })
    .then(({ data }) => data)

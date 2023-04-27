import API from './utils/API'

const api = new API()

export const getGptResponse = (params) => {
  return api
    .callApi({
      useSlowApi: true,
      url: `/evaluate-llm`,
      params,
    })
    .then((result) => result)
}

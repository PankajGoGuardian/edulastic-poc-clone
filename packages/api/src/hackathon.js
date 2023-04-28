import API from './utils/API'

const api = new API()

export const getGptEvaluateResponse = (params) => {
  return api
    .callApi({
      url: `test-activity/evaluate-llm`,
      method: 'post',
      data: {
        ...params,
      },
    })
    .then((result) => result)
}

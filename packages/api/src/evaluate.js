import { getApiUri } from '../../../src/utils/commons'
import API from './utils/API'

const api = new API(getApiUri())

const evaluate = (data, type) =>
  api
    .callApi({
      method: 'post',
      url: 'math/evaluate',
      data: {
        ...data,
        type,
      },
    })
    .then((result) => result.data)

const calculate = (data) =>
  api
    .callApi({
      method: 'post',
      url: 'math/calculate',
      data,
    })
    .then((result) => result.data)

export default {
  evaluate,
  calculate,
}

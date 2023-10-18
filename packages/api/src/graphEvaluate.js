import { getApiUri } from '../../../src/utils/commons'
import API from './utils/API'

const api = new API(getApiUri())
const convertLatex2Js = '/math/convertLatex2Js'

const convert = (data) =>
  api
    .callApi({
      url: convertLatex2Js,
      method: 'post',
      data,
    })
    .then((result) => result.data)

export default {
  convert,
}

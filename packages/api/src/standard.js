import API from './utils/API'

const api = new API()
const saveStandard = (subject) =>
  api.callApi({
    url: `admin-tool/save-standard`,
    method: 'post',
    data: { subject },
  })

export default { saveStandard }

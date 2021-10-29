import axios from 'axios'

const baseURL = 'https://api.hsforms.com/submissions/v3/integration/submit'
const portalId = '5258344'
const formId = '830c8b35-4d35-48da-a4ef-62c6ed1f6a71'
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
}

const submitRequestQuote = (payload) =>
  axios({
    method: 'post',
    url: `${baseURL}/${portalId}/${formId}`,
    data: {
      fields: payload,
    },
    config,
  })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log('error: ' + error)
    })

export default { submitRequestQuote }

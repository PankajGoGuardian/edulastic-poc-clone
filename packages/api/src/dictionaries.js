import API from './utils/API'

const api = new API()

const receiveCurriculums = () =>
  api.callApi({ url: '/curriculum' }).then((result) => result.data.result)

const receiveStandards = ({ curriculumId, grades = [], search }) => {
  const curriculumIds =
    curriculumId && Array.isArray(curriculumId) ? curriculumId : [curriculumId]
  const data = { curriculumIds, grades, search }
  return api
    .callApi({
      method: 'post',
      url: '/search/browse-standards',
      data,
    })
    .then((result) => result.data.result)
}

export default {
  receiveCurriculums,
  receiveStandards,
}

import API from '@edulastic/api/src/utils/API'

const api = new API()
const prefix = '/skill-report'

const fetchSkillReport = (data) =>
  api
    .callApi({
      url: `${prefix}/${data.classId}/${data.curriculumId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

export default {
  fetchSkillReport,
}

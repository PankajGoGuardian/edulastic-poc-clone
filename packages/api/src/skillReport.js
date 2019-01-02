import API from '@edulastic/api/src/utils/API';

const api = new API();
const prefix = '/skill-report';

const fetchSkillReport = classId =>
  api
    .callApi({
      url: `${prefix}/${classId}`,
      method: 'get'
    })
    .then(result => result.data.result);

export default {
  fetchSkillReport
};

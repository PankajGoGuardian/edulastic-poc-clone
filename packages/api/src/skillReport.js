import API from '@edulastic/api/src/utils/API';

const api = new API();
const prefix =
  '/skill-report/5c4abae2fb69ca2753feca5c/d6ec0d994eaf3f4c805c8011';

const fetchSkillReport = classId =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'get'
    })
    .then(result => result.data.result);

export default {
  fetchSkillReport
};

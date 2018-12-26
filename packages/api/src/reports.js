import API from '@edulastic/api/src/utils/API';

const api = new API();
const prefix = '/test-activity/summary';

const fetchReports = () =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'get'
    })
    .then(result => result.data.result);

export default {
  fetchReports
};

import API from '@edulastic/api/src/utils/API';

const api = new API();
const prefix = '/report';

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

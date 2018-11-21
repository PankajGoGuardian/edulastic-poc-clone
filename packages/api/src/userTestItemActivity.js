import API from './utils/API';

const api = new API();
const prefix = '/usertestitemactivity';

const create = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data
    })
    .then(result => result.data.result);

export default {
  create
};

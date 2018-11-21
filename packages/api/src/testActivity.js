import API from '@edulastic/api/src/utils/API';

const api = new API();
const prefix = '/usertestactivity';

const create = data =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data
    })
    .then(result => result.data.result);

const submit = id =>
  api
    .callApi({
      url: `${prefix}/${id}/submit`,
      method: 'post'
    })
    .then(result => result.data);

export default {
  create,
  submit
};

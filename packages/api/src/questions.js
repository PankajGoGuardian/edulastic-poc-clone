import API from './API';

const api = new API('http://localhost:9020');

const evaluateAnswer = (qid, answer) =>
  api
    .callApi({
      url: '/question/evaluate',
      method: 'post',
      data: { qid, answer },
    })
    .then(result => result.data);

export default {
  evaluateAnswer,
};

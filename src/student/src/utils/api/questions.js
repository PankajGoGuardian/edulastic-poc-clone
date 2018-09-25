import callApi from './callApi';

export const evaluateAnswer = (qid, answer) => callApi({
  url: '/question/evaluate',
  method: 'post',
  data: { qid, answer },
}).then(result => result.data);

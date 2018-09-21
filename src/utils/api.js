import axios from 'axios';

const base_url = 'http://localhost:9020/';

export const getAssessment = async id => {
  let url = `${base_url}assessment/${id}`;
  let data = await axios.get(url);
  return data.data;
};

export const evaluateAnswer = async (qid, answer) => {
  let url = `${base_url}question/evaluate`;
  let result = await axios.post(url, { qid, answer });
  return result.data;
};

export const addQuestion = async payload => {
  let { assessmentId, question, options, type, answer } = payload;
  let url = `${base_url}assessment/${assessmentId}/question`;
  let result = await axios.post(url, {
    question,
    options,
    type,
    answer
  });
  return result;
};

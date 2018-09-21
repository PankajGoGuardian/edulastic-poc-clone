import axios from 'axios';

const baseUrl = 'http://localhost:9020/';

export const getAssessment = async (id) => {
  const url = `${baseUrl}assessment/${id}`;
  const data = await axios.get(url);
  return data.data;
};

export const evaluateAnswer = async (qid, answer) => {
  const url = `${baseUrl}question/evaluate`;
  const result = await axios.post(url, { qid, answer });
  return result.data;
};

export const addQuestion = async (payload) => {
  const {
    assessmentId, question, options, type, answer,
  } = payload;
  const url = `${baseUrl}assessment/${assessmentId}/question`;
  const result = await axios.post(url, {
    question,
    options,
    type,
    answer,
  });
  return result;
};

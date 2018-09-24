import callApi from './callApi';

export const getAssessment = id =>
  callApi({
    url: `/assessment/${id}`,
  }).then(data => data.data);

export const addQuestion = ({ assessmentId, question, options, type, answer }) =>
  callApi({
    url: `/assessment/${assessmentId}/question`,
    method: 'post',
    data: {
      question,
      options,
      type,
      answer,
    },
  });

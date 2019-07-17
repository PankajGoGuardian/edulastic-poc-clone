import { get } from "lodash";

export const getTestAuthorName = item => {
  const { createdBy = {}, collectionName = "", authors = [] } = item;
  if (collectionName) return collectionName;
  if (createdBy._id) {
    const author = authors.find(item => item._id === createdBy._id) || {};
    return author.name || authors[0].name;
  }
  return authors.length && authors[0].name;
};

export const getTestItemAuthorName = item => {
  const { owner = "", collectionName = "", authors = [] } = item;
  if (collectionName) {
    const collectionNameMap = { Great_Minds_DATA: "Eureka Math", PROGRESS_DATA: "PROGRESS Bank" };
    return collectionNameMap[collectionName] ? collectionNameMap[collectionName] : collectionName;
  }
  if (owner) {
    const author = authors.find(item => item._id === owner) || {};
    return author.name || authors[0].name;
  }
  return authors.length && authors[0].name;
};

export const getPlaylistAuthorName = item => {
  const {
    _source: { createdBy }
  } = item;
  if (createdBy) {
    return `${createdBy.name}`;
  }
  const {
    _source: { sharedBy }
  } = item;
  if (sharedBy && sharedBy[0]) {
    return `${sharedBy[0].name}`;
  } else return ``;
};

export const getQuestionType = item => {
  const questions = get(item, ["data", "questions"], []);
  const resources = get(item, ["data", "resources"], []);
  if (questions.length > 1 || resources.length) {
    return "MULTIPART";
  }
  return questions[0] && questions[0].title;
};

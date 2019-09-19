import { get } from "lodash";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { questionType } from "@edulastic/constants";

const { PASSAGE } = questionType;

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
  const hasPassage = resources.some(item => item.type === PASSAGE);
  if (hasPassage) {
    //All questions that are linked to passage should show type as passage and question type attached to passage
    return questions.length > 1
      ? [PASSAGE.toUpperCase(), "MULTIPART"]
      : [PASSAGE.toUpperCase(), questions[0] && questions[0].title];
  }
  if (questions.length > 1 || resources.length) {
    return ["MULTIPART"];
  }
  return questions[0] && questions[0].title ? [questions[0].title] : [];
};

/**
 * @param summary is the summary object from test
 * @param interestestedCurriculums is the user interested curriculums
 * @param curriculumId is the current filter used
 */

export const getInterestedStandards = (summary = {}, interestedCurriculums) => {
  if (!summary.standards || !summary.standards.length) return [];
  const curriculumId = getFromLocalStorage("defaultCurriculumIdSelected") || "";
  //removing all multiStandard mappings
  const authorStandards = summary.standards.filter(item => !item.isEquivalentStandard && item.curriculumId);

  //pick standards matching with interested curriculums
  let interestedStandards = authorStandards.filter(standard =>
    interestedCurriculums.some(interested => interested._id === standard.curriculumId)
  );

  //pick standards based on search if interested standards is empty
  if (!interestedStandards.length) {
    interestedStandards = authorStandards.filter(standard => standard.curriculumId === curriculumId);
    // use the authored standards if still the interested alignments is empty
    if (!interestedStandards.length) {
      interestedStandards = authorStandards;
    }
  }
  return interestedStandards;
};

export const markQuestionLabel = questions => {
  let questionNumber = 0;
  return _item => {
    const rowQuestions = {};
    const allQreferences = _item.flatMap(item => item.widgets.map(item => item.reference));
    allQreferences.forEach(ref => {
      if (questions[ref]?.isPassage) {
        rowQuestions[ref] = questions[ref];
      } else {
        questionNumber++;
        rowQuestions[ref] = { ...questions[ref], qLabel: `Q${questionNumber}` };
      }
    });
    return rowQuestions;
  };
};

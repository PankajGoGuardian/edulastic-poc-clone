import { get, keyBy } from "lodash";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { questionType } from "@edulastic/constants";
import { UserIcon } from "./ItemList/components/Item/styled";
import { EdulasticVerified } from "./TestList/components/ListItem/styled";

const { PASSAGE } = questionType;

export const hasUserGotAccessToPremiumItem = (itemCollections = [], orgCollections = [], returnFlag = true) => {
  const itemCollectionsMap = keyBy(itemCollections, o => o._id);
  if (returnFlag) {
    return !!orgCollections.find(o => itemCollectionsMap[o._id]);
  } else {
    return orgCollections.find(o => itemCollectionsMap[o._id]);
  }
};

export const getAuthorCollectionMap = (isBottom, width, height) => {
  return {
    edulastic_certified: {
      icon: <EdulasticVerified bottom={isBottom} width={width} height={height} />,
      displayName: "Edulastic Certified"
    },
    engage_ny: {
      icon: <EdulasticVerified bottom={isBottom} width={width} height={height} />,
      displayName: "Edulastic Certified"
    },
    "Edulastic Certified": {
      icon: <EdulasticVerified bottom={isBottom} width={width} height={height} />,
      displayName: "Edulastic Certified"
    },
    Great_Minds_DATA: { icon: <UserIcon />, displayName: "Eureka Math" },
    PROGRESS_DATA: { icon: <UserIcon />, displayName: "PROGRESS Bank" }
  };
};

export const getTestAuthorName = (item, orgCollections) => {
  const { createdBy = {}, collections = [], authors = [] } = item;

  if (collections.length) {
    // TO DO : this if block hasnt been tested cuz data wasnt present at the time of development
    const collectionItem = hasUserGotAccessToPremiumItem(collections, orgCollections, false);
    if (collectionItem) {
      return collectionItem.name;
    }
  }
  if (createdBy._id) {
    const author = authors.find(item => item._id === createdBy._id) || {};
    return author.name || authors[0].name;
  }
  return authors.length && authors[0].name;
};

export const getTestItemAuthorName = (item, orgCollections) => {
  const { owner = "", collections = [], authors = [] } = item;

  if (collections.length) {
    // TO DO : this if block hasnt been tested cuz data wasnt present at the time of development
    const collectionItem = hasUserGotAccessToPremiumItem(collections, orgCollections, false);
    if (collectionItem) {
      return collectionItem.name;
    }
  }
  if (owner) {
    const author = authors.find(item => item._id === owner) || {};
    return author.name || authors?.[0]?.name || "Anonymous";
  }
  return (authors.length && authors?.[0]?.name) || "Anonymous";
};

export const getTestItemAuthorIcon = (item, orgCollections) => {
  let { collections = [] } = item;

  if (collections.length) {
    // TO DO : this if block hasnt been tested cuz data wasnt present at the time of development
    const collectionItem = hasUserGotAccessToPremiumItem(collections, orgCollections, false);
    const collectionMap = getAuthorCollectionMap(true, 15, 15);
    if (collectionItem && collectionMap[collectionItem.name]) {
      return collectionMap[collectionItem.name].icon;
    }
  }

  return <UserIcon />;
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
  const hasPassage = resources.some(item => item.type === PASSAGE) || item.passageId;
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

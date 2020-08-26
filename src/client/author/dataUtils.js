import React from "react";
import { get, keyBy, uniqBy, uniq, memoize } from "lodash";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { questionType as questionTypes } from "@edulastic/constants";
import { UserIcon } from "./ItemList/components/Item/styled";
import { EdulasticVerified } from "./TestList/components/ListItem/styled";

const { PASSAGE } = questionTypes;

export const hasUserGotAccessToPremiumItem = (itemCollections = [], orgCollections = [], returnFlag = true) => {
  const itemCollectionsMap = keyBy(itemCollections, o => o._id);
  if (returnFlag) {
    return !!orgCollections.find(o => itemCollectionsMap[o._id]);
  }
  return orgCollections.find(o => itemCollectionsMap[o._id]);
};

export const getAuthorCollectionMap = (isBottom, width, height) => ({
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
});

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
    const author = authors.find(_item => _item._id === createdBy._id) || {};
    return author.name || authors[0].name;
  }
  return authors.length && authors[0].name;
};

export const getTestItemAuthorName = item => {
  const { owner = "", authors = [] } = item;
  if (owner) {
    const author = authors.find(_item => _item._id === owner) || {};
    return author.name || authors?.[0]?.name || "Anonymous";
  }
  return (authors.length && authors?.[0]?.name) || "Anonymous";
};

export const getTestItemCollectionName = (item, orgCollections) => {
  const { collections = [] } = item;
  if (collections.length) {
    // TO DO : this if block hasnt been tested cuz data wasnt present at the time of development
    const collectionItem = hasUserGotAccessToPremiumItem(collections, orgCollections, false);
    if (collectionItem) {
      return collectionItem.name;
    }
  }
};

export const getTestItemCollectionIcon = (item, orgCollections) => {
  const { collections = [] } = item;

  if (collections.length) {
    // TO DO : this if block hasnt been tested cuz data wasnt present at the time of development
    const collectionItem = hasUserGotAccessToPremiumItem(collections, orgCollections, false);
    const collectionMap = getAuthorCollectionMap(true, 15, 15);
    if (collectionItem && collectionMap[collectionItem.name]) {
      return collectionMap[collectionItem.name].icon;
    }
  }
};

export const getTestItemAuthorIcon = () => <UserIcon data-cy="user" />;

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
  }
  return ``;
};

const getTitleFromQuestionType = memoize(questionType =>
  questionTypes.selectsData.find(data => data.value === questionType)
);

export const getQuestionType = item => {
  const questions = get(item, ["data", "questions"], []);
  const resources = get(item, ["data", "resources"], []);
  const hasPassage = resources.some(_item => _item.type === PASSAGE) || item.passageId;

  /**
   * Trying to find the question title from questionType (used in q-type search dropdown)
   * https://snapwiz.atlassian.net/browse/EV-17163
   * */
  const _questionTypeTitle = getTitleFromQuestionType(questions[0]?.type)?.text;
  const questionTitle = _questionTypeTitle || questions[0]?.title || "";

  if (hasPassage) {
    // All questions that are linked to passage should show type as passage and question type attached to passage
    return questions.length > 1
      ? [PASSAGE.toUpperCase(), "MULTIPART"]
      : questionTitle
      ? [PASSAGE.toUpperCase(), questionTitle]
      : [PASSAGE.toUpperCase()];
  }
  if (questions.length > 1 || resources.length) {
    return ["MULTIPART"];
  }
  return questionTitle ? [questionTitle] : [];
};

/**
 * @param summary is the summary object from test
 * @param interestestedCurriculums is the user interested curriculums
 * @param curriculumId is the current filter used
 */

export const getInterestedStandards = (summary, interestedCurriculums) => {
  let allStandards = summary?.standards || [];
  if (summary?.groupSummary?.length) {
    allStandards = uniqBy(summary.groupSummary.flatMap(item => item.standards || []), "identifier");
  }

  if (!allStandards?.length) return [];
  const curriculumId = getFromLocalStorage("defaultCurriculumIdSelected") || "";
  // removing all multiStandard mappings
  const authorStandards = allStandards.filter(item => !item.isEquivalentStandard && item.curriculumId);

  // pick standards matching with interested curriculums
  let interestedStandards = authorStandards.filter(standard =>
    interestedCurriculums.some(interested => interested._id === standard.curriculumId)
  );

  // pick standards based on search if interested standards is empty
  if (!interestedStandards.length) {
    interestedStandards = authorStandards.filter(standard => standard.curriculumId === curriculumId);
    // use the authored standards if still the interested alignments is empty
    if (!interestedStandards.length) {
      interestedStandards = authorStandards;
    }
  }
  return interestedStandards;
};

export const flattenPlaylistStandards = (modules = []) => {
  const standardz = modules?.flatMap(m => m?.data?.flatMap(d => d?.standardIdentifiers))?.filter(item => !!item) || [];
  return uniq(standardz);
};

export const setDefaultInterests = newInterest => {
  const sessionGlobals = JSON.parse(sessionStorage.getItem("filters[globalSessionFilters]")) || {};
  // For all subject change reset curriculumIds
  const resetCurriculumId = Object.keys(newInterest).includes("subject") ? { curriculumId: "" } : {};
  sessionStorage.setItem(
    "filters[globalSessionFilters]",
    JSON.stringify({ ...sessionGlobals, ...newInterest, ...resetCurriculumId })
  );
};

export const getDefaultInterests = () => JSON.parse(sessionStorage.getItem("filters[globalSessionFilters]")) || {};

export const sortTestItemQuestions = testItems => {
  for (const [, item] of testItems.entries()) {
    if (!(item.data && item.data.questions)) {
      continue;
    }
    // sort questions based on widegets
    const questions = keyBy(get(item, "data.questions", []), "id");
    const widgets = (item.rows || []).reduce((acc, curr) => [...acc, ...curr.widgets], []);
    item.data.questions = widgets.map(widget => questions[widget.reference]).filter(q => !!q);
  }
  return testItems;
};

// Show premium label on items/tests/playlists
export const showPremiumLabelOnContent = (itemCollections = [], orgCollections = []) => {
  // TODO: if collection ids are constant then replace with ids instead of looping on orgCollections
  const premiumCollectionIds = orgCollections
    .filter(c => !["edulastic certified", "engage ny"].includes(c.name.toLowerCase()))
    .map(x => x._id);
  return itemCollections.some(c => premiumCollectionIds.includes(c._id));
};

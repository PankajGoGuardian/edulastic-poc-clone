import { flatMap, flatten, map, groupBy, some, sumBy, uniqBy, get } from "lodash";
import { helpers } from "@edulastic/common";
import { test as testConstants, collections } from "@edulastic/constants";

const { nonPremiumCollections = {} } = collections;

const { getQuestionLevelScore, getPoints } = helpers;

const getStandardWiseSummary = (question, point) => {
  let standardSummary;
  if (question) {
    const points = point;
    const alignment = get(question, "alignment", []);
    standardSummary = flatMap(alignment, ({ domains, isEquivalentStandard = false, curriculumId }) =>
      flatMap(domains, ({ standards }) =>
        map(standards, ({ name }) => ({
          curriculumId: `${curriculumId}`,
          identifier: name,
          totalPoints: points,
          totalQuestions: 1,
          isEquivalentStandard
        }))
      )
    );
  }
  return standardSummary;
};

const createItemsSummaryData = (items = [], scoring, isLimitedDeliveryType) => {
  const summary = {
    totalPoints: 0,
    totalQuestions: 0,
    totalItems: items.length,
    standards: [],
    noStandards: { totalQuestions: 0, totalPoints: 0 }
  };
  if (!items || !items.length) return summary;
  for (const item of items) {
    const { itemLevelScoring, maxScore, itemLevelScore, _id } = item;
    const itemPoints = isLimitedDeliveryType
      ? 1
      : scoring[_id] || (itemLevelScoring === true && itemLevelScore) || maxScore;
    const questions = get(item, "data.questions", []);
    const itemTotalQuestions = questions.length;
    const questionWisePoints = getQuestionLevelScore(
      { ...item, isLimitedDeliveryType },
      questions,
      getPoints(item),
      scoring[_id]
    );
    for (const question of questions) {
      const standardSummary = getStandardWiseSummary(question, questionWisePoints[question.id]);
      if (standardSummary) {
        summary.standards.push(...standardSummary);
      }
    }
    if (summary.standards.length > 0) {
      const standardSummary = groupBy(summary.standards, "curriculumId");
      const standardSumm = map(standardSummary, (objects, curriculumId) => {
        const obj = groupBy(objects, "identifier");
        const standardObj = map(obj, (elements, identifier) => ({
          curriculumId,
          identifier,
          totalQuestions: sumBy(elements, "totalQuestions"),
          totalPoints: sumBy(elements, "totalPoints"),
          isEquivalentStandard: !some(elements, ["isEquivalentStandard", false])
        }));
        return standardObj;
      });
      summary.standards = flatten(standardSumm);
    } else {
      summary.noStandards.totalQuestions += questions.length;
      summary.noStandards.totalPoints += sumBy(questions, ({ id }) => questionWisePoints[id]);
    }
    summary.totalPoints += itemPoints;
    summary.totalQuestions += itemTotalQuestions;
  }
  return summary;
};

export const createGroupSummary = test => {
  const summary = {
    totalPoints: 0,
    totalItems: 0,
    totalQuestions: 0,
    standards: [],
    noStandards: { totalQuestions: 0, totalPoints: 0 },
    groupSummary: []
  };
  if (!test.itemGroups.length) return summary;
  for (const itemGroup of test.itemGroups) {
    const isLimitedDeliveryType = itemGroup.deliveryType === testConstants.ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM;
    const isAutoSelect = itemGroup.type === testConstants.ITEM_GROUP_TYPES.AUTOSELECT;
    const { noStandards, ...summaryData } = createItemsSummaryData(
      itemGroup.items,
      test.scoring,
      isLimitedDeliveryType
    );
    if (isAutoSelect) {
      summaryData.standards = [
        {
          isEquivalentStandard: false,
          identifier: itemGroup.standardDetails.identifier,
          curriculumId: itemGroup.standardDetails.curriculumId
        }
      ];
    }
    if ((!isAutoSelect && isLimitedDeliveryType && itemGroup.deliverItemsCount) || isAutoSelect) {
      summaryData.totalPoints = itemGroup.deliverItemsCount;
      summaryData.totalItems = itemGroup.deliverItemsCount;
      summaryData.totalQuestions = itemGroup.deliverItemsCount;
    }

    summary.totalPoints += summaryData.totalPoints;
    summary.totalItems += summaryData.totalItems;
    summary.totalQuestions += summaryData.totalQuestions;
    if (summaryData.standards?.length) {
      summary.standards = uniqBy(
        [...summaryData.standards.filter(s => !s.isEquivalentStandard), ...(test.summary?.standards || [])],
        "identifier"
      );
    }
    summary.noStandards.totalQuestions += noStandards.totalQuestions;
    summary.noStandards.totalPoints += noStandards.totalPoints;
    summary.groupSummary.push({ ...summaryData, groupId: itemGroup._id || itemGroup.groupName });
  }
  return summary;
};

// Kidergarten should out put as the first grade and other should be the last grade.
// Eg: grades = ["1","2","K","O"]
export const sortGrades = grades => {
  if (!grades || !grades.length) {
    return [];
  }
  let sortedGrades = grades.filter(item => item !== "K" && item !== "O").sort((a, b) => a - b);
  if (grades.includes("K")) {
    sortedGrades = ["K", ...sortedGrades];
  } else if (grades.includes("k")) {
    sortedGrades = ["k", ...sortedGrades];
  }
  if (grades.includes("O")) {
    sortedGrades = [...sortedGrades, "O"];
  } else if (grades.includes("o")) {
    sortedGrades = [...sortedGrades, "o"];
  }
  return sortedGrades;
};

/**
 * Checks if the item is premium content or not.
 * Any item which has collections excluding edulastic certified and engage ny
 * is premium content
 * @param {Array<Object>} _collections
 * @returns {Boolean} isPremium
 */
export const isPremiumContent = (_collections = []) => {
  const nonPremiumIds = Object.keys(nonPremiumCollections);
  const isPremium = collection => !nonPremiumIds.includes(collection._id);
  const result = _collections.filter(isPremium);
  return result.length > 0;
};

export default {
  createGroupSummary
};

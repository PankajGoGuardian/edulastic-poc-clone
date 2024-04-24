import {
  flatMap,
  flatten,
  map,
  groupBy,
  some,
  sumBy,
  uniqBy,
  get,
  difference,
  isEmpty,
} from 'lodash'
import { helpers } from '@edulastic/common'
import {
  test as testConstants,
  question as questionConstants,
} from '@edulastic/constants'

import moment from 'moment'
import {
  settingsNotApplicableToDocBased,
  testCategoryTypes,
  testSettingsOptions,
} from '@edulastic/constants/const/test'
import { TEST_TYPES } from '@edulastic/constants/const/testTypes'
import { getQuestions } from './ducks'

const { TOP_ORDER_SKINS } = testConstants

export const roundOff = (number) =>
  number ? Number(Number(number).toFixed(2)) : number

const { sectionLabelType } = questionConstants

const { getQuestionLevelScore, getPoints } = helpers

const getStandardWiseSummary = (question, point) => {
  let standardSummary
  if (question && question.type !== sectionLabelType) {
    const unscored = get(question, 'validation.unscored', false)
    const points = unscored ? 0 : point
    const alignment = get(question, 'alignment', [])
    standardSummary = flatMap(
      alignment,
      ({ domains, isEquivalentStandard = false, curriculumId }) =>
        flatMap(domains, ({ standards }) =>
          map(standards, ({ name }) => ({
            curriculumId,
            identifier: name,
            totalPoints: points,
            totalQuestions: 1,
            isEquivalentStandard,
          }))
        )
    )
  }
  return standardSummary
}

export const DEFAULT_TEST_TITLE = 'Untitled Test'
export const DEFAULT_PLAYLIST_TITLE = 'Untitled Playlist'

export const getSettingsToSaveOnTestType = (isDocBased) => {
  return isDocBased
    ? difference(testSettingsOptions, settingsNotApplicableToDocBased)
    : testSettingsOptions
}

const createItemsSummaryData = (
  items = [],
  scoring = {},
  isLimitedDeliveryType,
  itemsDefaultMaxScore
) => {
  const summary = {
    totalPoints: 0,
    totalQuestions: 0,
    totalItems: items.length,
    standards: [],
    noStandards: { totalQuestions: 0, totalPoints: 0 },
  }
  if (!items || !items.length) return summary
  for (const item of items) {
    const itemStandards = []
    const { itemLevelScoring, maxScore, itemLevelScore, _id } = item
    const questions = get(item, 'data.questions', []).filter(
      ({ type }) => type !== sectionLabelType
    )
    let itemPoints = 0
    itemPoints =
      scoring[_id] || (itemLevelScoring === true && itemLevelScore) || maxScore

    if (isLimitedDeliveryType) {
      itemPoints = itemsDefaultMaxScore || 1
    }
    const itemTotalQuestions = questions.length
    const questionWisePoints = getQuestionLevelScore(
      { ...item, isLimitedDeliveryType, itemsDefaultMaxScore },
      questions,
      getPoints(item),
      scoring[_id]
    )
    for (const question of questions) {
      const standardSummary = getStandardWiseSummary(
        question,
        questionWisePoints[question.id]
      )
      if (standardSummary) {
        summary.standards.push(
          ...uniqBy(standardSummary, (x) => `${x.curriculumId}${x.identifier}`)
        )
        itemStandards.push(...standardSummary)
      }
    }

    if (itemStandards.length > 0) {
      const standardSummary = groupBy(summary.standards, 'curriculumId')
      const standardSumm = map(standardSummary, (objects, curriculumId) => {
        const obj = groupBy(objects, 'identifier')
        const standardObj = map(obj, (elements, identifier) => ({
          curriculumId: parseInt(curriculumId, 10),
          identifier,
          totalQuestions: sumBy(elements, 'totalQuestions'),
          totalPoints: roundOff(sumBy(elements, 'totalPoints')),
          isEquivalentStandard: !some(elements, [
            'isEquivalentStandard',
            false,
          ]),
        }))
        return standardObj
      })
      summary.standards = flatten(standardSumm)
    } else {
      summary.noStandards.totalQuestions += questions.length
      summary.noStandards.totalPoints = roundOff(
        summary.noStandards.totalPoints +
          sumBy(questions, ({ id }) => questionWisePoints[id])
      )
    }
    summary.totalPoints = roundOff(
      (summary.totalPoints + parseFloat(itemPoints)).toFixed(2)
    )
    summary.totalQuestions += itemTotalQuestions
  }
  return summary
}

export const createGroupSummary = (test) => {
  const summary = {
    totalPoints: 0,
    totalItems: 0,
    totalQuestions: 0,
    standards: [],
    noStandards: { totalQuestions: 0, totalPoints: 0 },
    groupSummary: [],
  }
  if (!test.itemGroups.length) return summary
  for (const itemGroup of test.itemGroups) {
    const {
      deliveryType,
      type,
      itemsDefaultMaxScore = 1,
      items,
      deliverItemsCount,
      _id: groupId,
      standardDetails,
      groupName,
    } = itemGroup
    const isLimitedDeliveryType =
      deliveryType === testConstants.ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
    const isAutoSelect = type === testConstants.ITEM_GROUP_TYPES.AUTOSELECT
    const { noStandards, ...summaryData } = createItemsSummaryData(
      items,
      test.scoring,
      isLimitedDeliveryType,
      itemsDefaultMaxScore
    )
    if (isAutoSelect) {
      summaryData.standards =
        standardDetails?.standards.map((std) => ({
          isEquivalentStandard: false,
          identifier: std.identifier,
          curriculumId: std.curriculumId,
        })) || []
    }
    if (
      (isLimitedDeliveryType && deliverItemsCount) ||
      (isAutoSelect && !itemGroup.items?.length)
    ) {
      summaryData.totalPoints = roundOff(
        deliverItemsCount * (itemsDefaultMaxScore || 1)
      )
      summaryData.totalItems = deliverItemsCount
      summaryData.totalQuestions = deliverItemsCount
    }

    summary.totalPoints += summaryData.totalPoints
    summary.totalItems += summaryData.totalItems
    summary.totalQuestions += summaryData.totalQuestions
    if (summaryData.standards?.length) {
      summary.standards = uniqBy(
        [
          ...summaryData.standards.filter((s) => !s.isEquivalentStandard),
          ...(test.summary?.standards || []),
        ],
        'identifier'
      )
    }
    summary.noStandards.totalQuestions += noStandards.totalQuestions
    summary.noStandards.totalPoints += noStandards.totalPoints
    summary.groupSummary.push({
      ...summaryData,
      groupId: groupId || groupName,
    })
  }
  return summary
}

// TK instead of PK for PreKindergarten is intentional
// PreKindergarten, Kindergarten should be first and Other should be last
// Eg: grades = ["1","2","K","O"]
// Order should be PreKindergarten, Kindergarten, 1...12, Other
// TK, K, 1...12, O
export const sortGrades = (grades) => {
  if (!grades || !grades.length) {
    return []
  }
  let sortedGrades = grades
    .filter((item) => {
      const convertedGrade = (item || '').toLowerCase()
      return (
        convertedGrade !== 'k' &&
        convertedGrade !== 'o' &&
        convertedGrade !== 'tk'
      )
    })
    .sort((a, b) => a - b)
  if (grades.includes('K')) {
    sortedGrades = ['K', ...sortedGrades]
  } else if (grades.includes('k')) {
    sortedGrades = ['k', ...sortedGrades]
  }
  if (grades.includes('TK')) {
    sortedGrades = ['TK', ...sortedGrades]
  } else if (grades.includes('tk')) {
    sortedGrades = ['tk', ...sortedGrades]
  }
  if (grades.includes('O')) {
    sortedGrades = [...sortedGrades, 'O']
  } else if (grades.includes('o')) {
    sortedGrades = [...sortedGrades, 'o']
  }
  return sortedGrades
}

export const skinTypesOrder = (skinTypes = {}) => {
  const _skinTypes = Object.keys(skinTypes) || []
  if (!_skinTypes.length) {
    return []
  }
  _skinTypes.sort()
  const excludePulledSkins = difference(_skinTypes, TOP_ORDER_SKINS)
  return [...TOP_ORDER_SKINS, 'devider', ...excludePulledSkins]
}

export const showRubricToStudentsSetting = (itemGroups = []) =>
  (getQuestions(itemGroups) || []).some((question) => question?.rubrics)

export const showAutoEssayEvaluationSetting = (itemGroups = []) =>
  (getQuestions(itemGroups) || []).some(
    (question) =>
      question?.title.toLowerCase().includes('essay') && question?.rubrics
  )

export const checkIsDateLessThanSep30 = () => {
  const currentDate = moment().utc()
  const targetDate = moment()
    .utc()
    .year(2023)
    .month(8)
    .date(30)
    .hour(23)
    .minute(59)
    .second(59)
    .millisecond(999)

  return currentDate.isBefore(targetDate) || currentDate.isSame(targetDate)
}

/*
This method mutates maxScore of testItem and question score incase there is a mismatch in item score and rubric maxScore.
To handle STR mentioned on EV-41730
 */
export const applyRubricScoreToTest = (test, rubricScoreMap) => {
  const { testCategory, testType, status, itemGroups } = test
  // test category doc based or video quiz and survey test dont do any action
  if (
    isEmpty(rubricScoreMap) ||
    testCategory === testCategoryTypes.DOC_BASED ||
    testCategory === testCategoryTypes.VIDEO_BASED ||
    TEST_TYPES.SURVEY.includes(testType) ||
    status !== 'draft'
  ) {
    return
  }
  const testItems = itemGroups.flatMap((itemGroup) => itemGroup.items)
  for (const testItem of testItems) {
    const { data, maxScore } = testItem
    const questions = data?.questions || []
    const rubricLinkedQuestion = questions.find((item) => item.rubrics)
    if (!rubricLinkedQuestion) continue
    const questionWiseMaxScore = questions.reduce((acc, q) => {
      const { validation, rubrics } = q
      const score = rubrics?._id
        ? rubricScoreMap[rubrics?._id] || 0
        : validation.validResponse.score || 0
      return acc + score
    }, 0)
    if (questionWiseMaxScore && maxScore !== questionWiseMaxScore) {
      testItem.maxScore = questionWiseMaxScore || maxScore
      questions.forEach((q) => {
        const { validation, rubrics } = q
        if (validation.validResponse.score && rubrics?._id) {
          const rubricMaxScore = rubricScoreMap[rubrics?._id]
          q.validation.validResponse.score =
            rubricMaxScore || validation.validResponse.score
        }
      })
    }
  }
}

export default {
  createGroupSummary,
}

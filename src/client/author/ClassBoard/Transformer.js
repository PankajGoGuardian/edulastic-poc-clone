/* eslint-disable no-unused-vars */
import {
  keyBy,
  groupBy,
  get,
  values,
  flatten,
  isEmpty,
  uniq,
  some,
  every,
  cloneDeep,
} from 'lodash'
import {
  testActivityStatus,
  questionType,
  test as testContants,
} from '@edulastic/constants'
import produce from 'immer'
import { getMathHtml } from '@edulastic/common'
import { red, yellow, themeColorLighter, darkBlue2 } from '@edulastic/colors'
import { getServerTs } from '../../student/utils'
import { getFormattedName } from '../Gradebook/transformers'

const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('')

const { evalTypeLabels, evalTypeValues } = testContants
/**
 *
 * @param {{data:{questions:Object[]},itemLevelScoring?:boolean, itemLevelScore: number}[]}
 * @param {object[]} testItems
 */
export const markQuestionLabel = (testItems) => {
  for (let i = 0; i < testItems.length; i++) {
    const item = testItems[i]
    if (!(item.data && item.data.questions)) {
      continue
    }
    if (item.data.questions.length === 1) {
      item.data.questions[0].qLabel = i + 1
      item.data.questions[0].barLabel = `Q${i + 1}`
    } else if (item.isDocBased) {
      let qIndex = 0
      item.data.questions = item.data.questions
        .sort((a, b) => a.qIndex - b.qIndex)
        .map((q) => {
          if (q.type === questionType.SECTION_LABEL) {
            return q
          }
          qIndex++
          return {
            ...q,
            qLabel: qIndex,
            barLabel: `Q${qIndex}`,
          }
        })
    } else {
      item.data.questions = item.data.questions.map((q, qIndex) => ({
        ...q,
        qLabel: qIndex === 0 ? i + 1 : null,
        qSubLabel: alphabets[qIndex],
        barLabel: item.itemLevelScoring
          ? `Q${i + 1}`
          : `Q${i + 1}.${alphabets[qIndex]}`,
      }))
    }
  }
}

/**
 * @returns {{id:string,weight:number,disabled:boolean,qids?:string[],testItemId?:string,maxScore?: number,qLabel:string,barLabel:string}[]}
 */
export const getAllQidsAndWeight = (testItemIds, testItemsDataKeyed) => {
  let qids = []
  for (const testItemId of testItemIds) {
    const questions =
      (testItemsDataKeyed[testItemId].data &&
        testItemsDataKeyed[testItemId].data.questions) ||
      []
    const isPracticeItem =
      testItemsDataKeyed[testItemId]?.itemLevelScoring &&
      every(questions, ({ validation }) => validation && validation.unscored)
    if (!questions.length) {
      qids = [
        ...qids,
        {
          id: '',
          weight: 1,
          maxScore: 1,
          testItemId,
          qids: [],
          qLabel: '',
          barLabel: '',
          isPractice: false,
        },
      ]
    } else if (testItemsDataKeyed[testItemId].itemLevelScoring) {
      qids = [
        ...qids,
        ...questions
          // .filter(x => !x.scoringDisabled)
          .map((x, index) => ({
            id: x.id,
            maxScore:
              index === 0 ? testItemsDataKeyed[testItemId].itemLevelScore : 0,
            weight: questions.length,
            disabled: x.scoringDisabled || index > 0,
            testItemId,
            qids: questions.map((_x) => _x.id),
            qLabel: x.qLabel,
            barLabel: x.barLabel,
            isPractice: testItemsDataKeyed[testItemId]?.itemLevelScoring
              ? isPracticeItem
              : x?.validation?.unscored || false,
          })),
      ]
    } else {
      qids = [
        ...qids,
        ...questions.map((x) => ({
          id: x.id,
          weight: 1,
          maxScore: get(x, ['validation', 'validResponse', 'score'], 0),
          testItemId,
          qids: [x.id],
          qLabel: x.qLabel,
          barLabel: x.barLabel,
          isPractice: testItemsDataKeyed[testItemId]?.itemLevelScoring
            ? isPracticeItem
            : x?.validation?.unscored || false,
        })),
      ]
    }
  }
  return qids
}

/**
 *
 * @param {{data:{questions:Object[]},itemLevelScoring?:boolean, itemLevelScore: number}[]} testItemsData
 * @param {{itemId:string}[]} testItems
 * @returns {{[qid:string]:{qLabel:string, barLabel: string } }}
 */
export const getQuestionLabels = (testItemsData = []) => {
  /**
   * @type {{[qid:string]:{qLabel:string, barLabel: string }  }}
   */
  const result = {}
  for (let i = 0; i < testItemsData.length; i++) {
    const item = testItemsData[i]
    if (!item) {
      continue
    }
    if (!(item.data && item.data.questions)) {
      continue
    }
    if (item.data.questions.length === 1) {
      result[`${item._id}_${item.data.questions[0].id}`] = {
        qLabel: item.data.questions[0].qLabel || i + 1,
        barLabel: item.data.questions[0].barLabel || `Q${i + 1}`,
      }
    } else {
      let qLabelCount = 1
      for (let qIndex = 0; qIndex < item.data.questions.length; qIndex++) {
        const q = item.data.questions[qIndex]
        if (item.isDocBased && q.type !== questionType.SECTION_LABEL) {
          result[`${item._id}_${q.id}`] = {
            qLabel: `Q${qLabelCount}`,
            barLabel: `Q${qLabelCount++}`,
          }
        } else {
          result[`${item._id}_${q.id}`] = {
            qLabel: qIndex === 0 ? i + 1 : null,
            qSubLabel: alphabets[qIndex],
            barLabel: item.itemLevelScoring
              ? `Q${i + 1}`
              : `Q${i + 1}.${alphabets[qIndex]}`,
          }
        }
      }
    }
  }

  return result
}

/**
 * @returns {number}
 */
const getMaxScoreFromQuestion = (question) => {
  return get(question, 'validation.validResponse.score', 0)
}

/**
 *
 * @param {string} qid
 * @param {Object[]} testItemsData
 */
export const getMaxScoreOfQid = (qid, testItemsData, qActivityMaxScore) => (
  testItemId
) => {
  if (!qid) {
    return qActivityMaxScore || 1
  }
  // TODO: Need to make it more efficient . no need to loop through all items
  for (const testItem of testItemsData) {
    const questions = get(testItem, ['data', 'questions'], [])
    const questionIndex = questions.findIndex(
      (x) => x.id === qid && (!testItemId || testItem._id === testItemId)
    )
    const questionNeeded = questions[questionIndex]
    if (questionNeeded) {
      // for item level scoring handle scores as whole instead of each questions
      if (testItem.itemLevelScoring && questionIndex === 0) {
        return testItem.itemLevelScore
      }
      if (testItem.itemLevelScoring && questionIndex > 0) {
        return 0
      }
      return getMaxScoreFromQuestion(questionNeeded)
    }
  }
  console.warn('no such qid for maxScore', qid)
  return 0
}

const getSkippedStatusOfQuestion = (
  testItemId,
  questionActivitiesMap,
  testItems,
  qId
) => {
  const questionActivities = Object.values(questionActivitiesMap)
  const questions = questionActivities.filter(
    (o) => o.testItemId === testItemId
  )
  const item = testItems.find((o) => o._id === testItemId)

  let skipCount = 0
  if (item && item.itemLevelScoring) {
    for (const q of questions) {
      if (q.skipped === true) {
        skipCount++
      }
    }
    if (skipCount === questions.length) {
      return true
    }
    return false
  }
  return questionActivitiesMap[`${testItemId}_${qId}`]?.skipped
}

/**
 * @returns {number}
 */
const getMaxScoreFromItem = (testItem) => {
  let total = 0
  if (!testItem) {
    return total
  }
  if (testItem?.itemLevelScoring) {
    return testItem.itemLevelScore || 0
  }
  if (!testItem?.data?.questions) {
    return total
  }
  for (const question of testItem?.data?.questions || []) {
    if (!question?.validation?.unscored) {
      total += getMaxScoreFromQuestion(question)
    }
  }
  return total
}

export const getAvatarName = (studentName) => {
  if (!studentName) {
    console.warn('no name')
    return ''
  }
  const parts = studentName.split(' ')
  if (parts.length > 1) {
    return `${parts[0].trim().charAt(0)}${parts[1]
      .trim()
      .charAt(0)}`.toUpperCase()
  }
  const part = parts[0].trim()
  return `${part.charAt(0)}${part.charAt(1)}`.toUpperCase()
}

export const getFirstName = (studentName) => {
  if (!studentName) {
    return ''
  }
  const parts = studentName.trim().split(' ')
  return parts[0]
}

export const transformTestItems = ({ passageData, testItemsData }) => {
  const passagesKeyed = keyBy(passageData, '_id')

  for (const x of testItemsData) {
    if (x.passageId && passagesKeyed[x.passageId]) {
      x.rows.unshift(passagesKeyed[x.passageId].structure)
    }
  }
}

// writing this ouside `stripHtml` for performance optimisation
const temporalDivElement = document.createElement('div')

export function stripHtml(html) {
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html
  // retrieve the text format for math expressions
  const mathTag = temporalDivElement.getElementsByTagName('math')[0]
  if (mathTag) {
    const annotationTag = mathTag.getElementsByTagName('annotation')[0]
    return annotationTag?.textContent || annotationTag?.innerHTML || ''
  }
  // Retrieve the text property of the element (cross-browser support)
  return temporalDivElement.textContent || temporalDivElement.innerText || ''
}

const extractFunctions = {
  [questionType.MULTIPLE_CHOICE]: (question = {}, userResponse = []) =>
    Array.isArray(userResponse)
      ? userResponse
          .map((r) => question?.options?.findIndex((x) => x?.value === r))
          .map((x) => alphabets[x]?.toUpperCase())
          .join(',')
      : userResponse,
  [questionType.CLOZE_DRAG_DROP]: (question = {}, userResponse = []) =>
    Array.isArray(userResponse)
      ? userResponse
          .filter((x) => x)
          .map((r) => question?.options?.find((x) => x?.value === r)?.label)
          .map((x) => stripHtml(x || ''))
          .filter((x) => x)
          .join(',')
      : userResponse,
  [questionType.CLOZE_DROP_DOWN]: (question = {}, userResponse = []) =>
    Array.isArray(userResponse)
      ? userResponse
          .filter((x) => x)
          .map((x) => x?.value)
          .map((x) => stripHtml(x || ''))
          .filter((x) => x)
          .join(',')
      : userResponse,
  [questionType.CLOZE_TEXT]: (question = {}, userResponse = []) =>
    Array.isArray(userResponse)
      ? userResponse
          .filter((x) => x)
          .map((x) => x?.value)
          .map((x) => stripHtml(x || ''))
          .filter((x) => x)
          .join(',')
      : userResponse,
  [questionType.MATH]: (question, userResponse) => {
    if (isEmpty(userResponse)) {
      return ''
    }
    const restrictedMathTypes = [
      'Matrices',
      'Complete the Equation',
      'Formula Essay',
    ]
    if (restrictedMathTypes.includes(question.title)) return 'TEI'
    if (question.title === 'Units' && typeof userResponse === 'object') {
      return getMathHtml(
        `${userResponse.expression || ''} ${userResponse.unit || ''}`
      )
    }
    return getMathHtml(userResponse)
  },
  [questionType.SHORT_TEXT]: (question, userResponse = '') =>
    userResponse ? 'CR' : '',
  [questionType.ESSAY_PLAIN_TEXT]: (question, userResponse = '') =>
    userResponse ? 'CR' : '',
  [questionType.ESSAY_RICH_TEXT]: (question, userResponse = '') =>
    userResponse ? 'CR' : '',
  [questionType.FORMULA_ESSAY]: (question, userResponse = '') =>
    userResponse ? 'CR' : '',
  [questionType.EXPRESSION_MULTIPART]: (question, userResponse = '') => {
    if (isEmpty(userResponse)) {
      return ''
    }
    const maths = get(userResponse, 'maths')
    if (!isEmpty(maths) || typeof maths === 'object') {
      const mathResponses = Object.values(maths)
      return getMathHtml(`${mathResponses[0]?.value}`)
    }
    const inputs = get(userResponse, 'inputs')
    if (!isEmpty(inputs) || typeof inputs === 'object') {
      const inputResponses = Object.values(inputs)
      return `${inputResponses[0]?.value}`
    }

    const dropDowns = get(userResponse, 'dropDowns')
    if (!isEmpty(dropDowns) || typeof inputs === 'object') {
      const dropDownResponses = Object.values(dropDowns)
      return `${dropDownResponses[0]?.value}`
    }

    const mathUnits = get(userResponse, 'mathUnits')
    if (!isEmpty(mathUnits) || typeof inputs === 'object') {
      const mathUnitResponses = Object.values(mathUnits)
      return getMathHtml(
        `${mathUnitResponses[0]?.value} ${mathUnitResponses[0]?.unit}`
      )
    }
    return ''
  },
}
export function getResponseTobeDisplayed(
  testItem = {},
  userResponse,
  questionId,
  currentQuestionActivity,
  uqasGroupedByItemId
) {
  if (
    testItem.data?.questions?.filter(
      (x) => x.type !== questionType.SECTION_LABEL
    )?.length > 1 &&
    testItem?.itemLevelScoring
  ) {
    const notSkipped = (obj) => !obj.skipped
    const hasAttempted = uqasGroupedByItemId?.[testItem._id]?.some(notSkipped)
    if (hasAttempted) {
      return 'TEI'
    }
  }

  const question =
    (testItem.data?.questions || [])?.find((q) => q.id === questionId) || {}

  const qType = question.type
  if (currentQuestionActivity?.skipped) {
    return '-'
  }

  if (extractFunctions[qType]) {
    return extractFunctions[qType](
      question,
      userResponse,
      currentQuestionActivity
    )
  }
  return userResponse ? 'TEI' : ''
}

export function getScoringType(
  qid,
  testItemsData,
  testItemId,
  gradingPolicy,
  applyEBSR
) {
  for (const testItem of testItemsData) {
    const questions = get(testItem, ['data', 'questions'], [])
    const questionNeeded = questions.find(
      (x) => x.id === qid && (!testItemId || testItem._id === testItemId)
    )
    if (questionNeeded) {
      const containsManualGrad = questions.some((ques) =>
        questionType.manuallyGradableQn.includes(ques.type)
      )
      if (
        (containsManualGrad && testItem.itemLevelScoring) ||
        questionType.manuallyGradableQn.includes(questionNeeded.type)
      ) {
        return evalTypeValues.ManualGrading
      }
      if (gradingPolicy === evalTypeLabels.ITEM_LEVEL_EVALUATION) {
        if (testItem.multipartItem && questions.length > 1) {
          return (
            evalTypeValues[testItem.itemGradingType] ||
            evalTypeValues.anyCorrect
          )
        }
        if (questionNeeded?.validation?.scoringType) {
          return evalTypeValues[questionNeeded.validation.scoringType]
        }
      }
    }
  }
  return applyEBSR
    ? evalTypeValues.PARTIAL_CREDIT_EBSR
    : evalTypeValues[gradingPolicy]
}

export function getStandardsForStandardBasedReport(
  testItems,
  standardsDescriptions
) {
  const standardsDescriptionsKeyed = keyBy(
    standardsDescriptions,
    (x) => `${x._id}`
  )
  const standardsQuestionsMap = {}
  const items = cloneDeep(testItems)
  const questions = []
  items.forEach(({ itemLevelScoring, data, _id }) => {
    if (itemLevelScoring && data?.questions?.length) {
      const alignment = []
      data.questions.forEach((question) => {
        alignment.push(...(question.alignment || []))
        question.alignment = []
        question.itemId = _id
      })
      data.questions[0].alignment = alignment
    } else {
      data.questions.forEach((question) => {
        question.itemId = _id
      })
    }
    questions.push(...data.questions)
  })
  for (const q of questions) {
    if (q?.validation?.unscored) {
      continue
    }
    const standards =
      q.alignment
        ?.flatMap((x) => x?.domains || [])
        .flatMap((x) => x?.standards || []) || []
    for (const std of standards) {
      if (standardsQuestionsMap[`${std.id}`]) {
        standardsQuestionsMap[`${std.id}`].qIds = uniq([
          ...standardsQuestionsMap[`${std.id}`].qIds,
          `${q.itemId}_${q.id}`,
        ])
      } else {
        standardsQuestionsMap[`${std.id}`] = {
          ...std,
          desc: standardsDescriptionsKeyed[`${std.id}`]?.desc,
          qIds: [`${q.itemId}_${q.id}`],
          ...(std.name ? { identifier: std.name } : {}),
          ...(std._id ? {} : { _id: std.id }), // use .id prop as fallback for _id
        }
      }
    }
  }
  return values(standardsQuestionsMap)
}

export const transformGradeBookResponse = (
  {
    test = {},
    testItemsData = {},
    students: studentNames = [],
    testActivities = [],
    testQuestionActivities = [],
    passageData = {},
    status: assignmentStatus,
    endDate,
    ts,
    gradingPolicy,
    applyEBSR,
  },
  studentResponse
) => {
  /**
   * TODO: need to refactor
   */
  testItemsData = produce(testItemsData, (draft) => {
    draft.forEach((testItem) => {
      if (testItem.data) {
        testItem.data.questions = testItem.data.questions.filter(
          (q) => q.type !== questionType.SECTION_LABEL
        )
        testItem.rows = testItem.rows.map((row) => {
          row.widgets = row.widgets.filter(
            (w) => w.type !== questionType.SECTION_LABEL
          )
          return row
        })
      }
    })
  })

  const serverTimeStamp = getServerTs({ ts })

  const testItemIds = testItemsData.map((o) => o._id)
  const testItemIdsSet = new Set(testItemIds)
  testQuestionActivities = testQuestionActivities.filter((x) =>
    testItemIdsSet.has(x.testItemId)
  )
  const testItemsDataKeyed = keyBy(testItemsData, '_id')
  const qids = getAllQidsAndWeight(testItemIds, testItemsDataKeyed)
  const testMaxScore = Number(
    Number(
      testItemsData.reduce((prev, cur) => prev + getMaxScoreFromItem(cur), 0)
    ).toFixed(2)
  )
  const questionActivitiesGrouped = groupBy(
    testQuestionActivities,
    'testItemId'
  )

  for (const itemId of Object.keys(questionActivitiesGrouped)) {
    const notGradedQuestionActivities = questionActivitiesGrouped[
      itemId
    ].filter((x) => x.graded === false)

    const { itemLevelScoring } = testItemsDataKeyed[itemId]
    if (itemLevelScoring) {
      notGradedQuestionActivities.forEach(({ qid, testActivityId }) => {
        questionActivitiesGrouped[itemId]
          .filter((x) => x.qid === qid && x.testActivityId === testActivityId)
          .forEach((x) => {
            Object.assign(x, { graded: false, score: 0 })
          })
      })
    }
  }

  testQuestionActivities = flatten(values(questionActivitiesGrouped))

  const studentTestActivities = keyBy(testActivities, 'userId')
  const testActivityQuestionActivities = groupBy(
    testQuestionActivities,
    'userId'
  )
  // for students who hasn't even started the test
  const emptyQuestionActivities = qids.map((x) => ({
    _id: x.id,
    weight: x.weight,
    notStarted: true,
    disabled: x.disabled,
    testItemId: x.testItemId,
    qids: x.qids,
    qLabel: x.qLabel,
    barLabel: x.barLabel,
    scoringDisabled: true,
    isPractice: x.isPractice,
  }))
  return studentNames
    .map(
      ({
        _id: studentId,
        firstName,
        middleName,
        lastName,
        email,
        username: userName,
        fakeFirstName,
        fakeLastName,
        icon,
      }) => {
        const testActivity = studentTestActivities[studentId]
        // console.log('testActivity', testActivity, studentId)
        if (!testActivity) {
          return false
        }
        const fullName = getFormattedName(firstName, middleName, lastName)
        const fakeName = `${fakeFirstName} ${fakeLastName}`

        // TODO: for now always present
        const present = true
        // TODO: no graded status now. using submitted as a substitute for graded
        const { graded } = testActivity
        const submitted = testActivity.status == testActivityStatus.SUBMITTED
        const absent = testActivity.status === testActivityStatus.ABSENT
        const {
          _id: testActivityId,
          groupId,
          previouslyRedirected: redirected = false,
          number,
          redirect = false,
        } = testActivity

        const questionActivitiesRaw = testActivityQuestionActivities[studentId]

        const score =
          (questionActivitiesRaw &&
            questionActivitiesRaw.reduce(
              (e1, e2) => (e2.score || 0) + e1,
              0
            )) ||
          0

        const questionActivitiesIndexed =
          (questionActivitiesRaw &&
            keyBy(questionActivitiesRaw, (x) => `${x.testItemId}_${x.qid}`)) ||
          {}
        const uqasGroupedByItemId = groupBy(questionActivitiesRaw, 'testItemId')
        const questionActivities = qids.map(
          (
            {
              id: el,
              weight,
              qids: _qids,
              disabled,
              testItemId,
              maxScore,
              barLabel,
              qLabel,
              _id: qActId,
              isPractice,
            },
            index
          ) => {
            const _id = el
            const currentQuestionActivity =
              questionActivitiesIndexed[`${testItemId}_${el}`]
            const scoringType = getScoringType(
              _id,
              testItemsData,
              testItemId,
              gradingPolicy,
              applyEBSR
            )
            const questionMaxScore =
              maxScore ||
              (maxScore == 0 &&
                getMaxScoreOfQid(
                  _id,
                  testItemsData,
                  currentQuestionActivity?.maxScore
                )(testItemId)) ||
              0
            if (!currentQuestionActivity) {
              return {
                _id,
                qid: _id,
                userId: studentId,
                weight,
                disabled,
                testItemId,
                barLabel,
                testActivityId,
                qActId,
                groupId,
                score: 0,
                qLabel,
                ...(submitted
                  ? {
                      skipped: true,
                      score: 0,
                      maxScore: questionMaxScore,
                      isDummy: true,
                    }
                  : {
                      notStarted: true,
                      score: 0,
                      maxScore: questionMaxScore,
                      isDummy: true,
                    }),
                isPractice,
              }
            }
            let {
              skipped = false,
              correct = false,
              partiallyCorrect: partialCorrect = false,
            } = currentQuestionActivity
            const {
              timeSpent,
              // eslint-disable-next-line no-shadow
              score,
              // eslint-disable-next-line no-shadow
              graded = false,
              pendingEvaluation = false,
              scratchPad,
              userResponse,
              autoGrade = false,
              ...remainingProps
            } = currentQuestionActivity
            skipped = getSkippedStatusOfQuestion(
              testItemId,
              questionActivitiesIndexed,
              testItemsData,
              el
            )

            if (score > 0 && skipped) {
              skipped = false
            }
            if (_qids && _qids.length) {
              correct = score === questionMaxScore && score > 0
              if (!correct) {
                partialCorrect = score > 0 && score <= questionMaxScore
              }
            }

            let _graded = graded
            if (autoGrade === false && score === undefined) {
              _graded = false
            }

            return {
              ...(studentResponse ? remainingProps : {}),
              _id,
              weight,
              skipped,
              correct,
              partialCorrect,
              score,
              maxScore: questionMaxScore,
              timeSpent,
              disabled,
              testItemId,
              qids: _qids,
              testActivityId,
              graded: _graded,
              qLabel,
              barLabel,
              pendingEvaluation,
              userId: studentId,
              qActId: currentQuestionActivity._id,
              scoringType,
              scratchPad,
              responseToDisplay: getResponseTobeDisplayed(
                testItemsDataKeyed[testItemId],
                userResponse,
                _id,
                currentQuestionActivity,
                uqasGroupedByItemId
              ),
              userResponse,
              isPractice,
              autoGrade,
            }
          }
        )

        let displayStatus = 'inProgress'
        if (submitted) {
          displayStatus = 'submitted'
        } else if (absent) {
          displayStatus = 'absent'
        }

        // testItem containing only intstruction. qid="", !qids
        // Redirect and submit. qid="...xyz", !qids
        // on attempt qids=[...]
        const isValidQuestionActivity = (x = {}) =>
          (x.qids && x.qids.length && x.testActivityId) || x.qid
        // has own property  then pick it or else default to true
        const {
          isEnrolled = false,
          isAssigned = false,
          isPaused = false,
          tabNavigationCounter: outNavigationCounter = 0,
          pauseReason,
          languagePreference = 'en',
          archived,
        } = testActivity
        return {
          studentId,
          studentName: fullName,
          userName,
          email,
          fakeName,
          icon,
          color: fakeFirstName,
          status:
            testActivity.redirect && !studentResponse
              ? 'redirected'
              : displayStatus,
          UTASTATUS: testActivity.status,
          archived,
          isEnrolled,
          isAssigned,
          present,
          check: false,
          graded,
          maxScore: testMaxScore,
          score,
          testActivityId,
          number,
          redirected: redirected || redirect,
          questionActivities:
            testActivity.status === testActivityStatus.NOT_STARTED
              ? emptyQuestionActivities.map((qact) => ({
                  ...qact,
                  userId: studentId,
                }))
              : questionActivities.filter((x) => isValidQuestionActivity(x)),
          endDate: testActivity.endDate,
          isPaused,
          outNavigationCounter,
          pauseReason,
          languagePreference,
        }
      }
    )
    .filter((x) => x)
}

export const getStudentCardStatus = (
  student = {},
  endDate,
  serverTimeStamp,
  closed
) => {
  const status = {}
  const { NOT_STARTED, START, SUBMITTED, ABSENT } = testActivityStatus
  const { UTASTATUS, isEnrolled, isAssigned, isPaused } = student
  if (student.redirected && UTASTATUS === NOT_STARTED) {
    status.status = 'Redirected'
    status.color = themeColorLighter
    if (isPaused) {
      status.status = `${status.status} (paused)`
    }
    return status
  }

  if (isEnrolled === false) {
    status.status = 'Not Enrolled'
    if (UTASTATUS === ABSENT) {
      status.status = 'Absent'
    }
    if (isAssigned === false) {
      status.status = 'Unassigned'
    }
    status.color = red
    if (isPaused) {
      status.status = `${status.status} (paused)`
    }
    return status
  }

  if (isAssigned === false) {
    status.status = 'Unassigned'
    status.color = red
    if (isPaused) {
      status.status = `${status.status} (paused)`
    }
    return status
  }

  switch (UTASTATUS) {
    case NOT_STARTED:
      status.status = 'Not Started'
      status.color = red
      // Assessment expired and student havent attempted.
      if (endDate < serverTimeStamp || closed) {
        status.status = 'Absent'
      }
      break
    case START:
      status.status = 'In Progress'
      status.color = yellow
      break
    case SUBMITTED:
      status.status = student?.graded === 'GRADED' ? 'Graded' : student.status
      status.color =
        student?.graded === 'GRADED' ? themeColorLighter : darkBlue2
      break
    case ABSENT:
      status.status = 'Absent'
      status.color = red
      break
    default:
      status.status = 'Not Started'
      status.color = red
  }
  if (isPaused) {
    status.status = `${status.status} (paused)`
  }
  return status
}

import { get, keyBy, values, round, groupBy, isUndefined, uniq } from 'lodash'
import next from 'immer'
import { questionType } from '@edulastic/constants'
import { responseDisplayOption } from './constants'
import { replaceVariables } from '../../../assessment/utils/variables'
import { formatToMathAnswer } from '../../../assessment/widgets/MathFormula/components/CorrectAnswerBox'

// format answers for doc based
const formatAnswerForDocBased = (value, q, options = {}) => {
  return options[value]?.label || value?.value || value || '-'
}

// to return data for 'Your answer' and 'Correct Anser', as per question Type
// Responses: 'ETI'/'CR'/<User response>
export const formatAnswertoDisplay = (value, type, title) => {
  const matchedType = responseDisplayOption[type]
  if (matchedType) {
    if (
      !matchedType.titles ||
      (matchedType.titles && matchedType.titles.includes(title))
    ) {
      return matchedType.value
    }
    return value
  }
  return value
}

// to format correct/user answer
export const formatAnswers = (
  data,
  options,
  q,
  qActivity = null,
  context = '',
  viewMode = ''
) => {
  if ((!qActivity || qActivity.skipped) && context === 'userResponse') {
    return '-'
  }
  const { type, title, isDocBased } = q
  let responses = data
  if (!Array.isArray(responses)) {
    responses = [responses]
  }

  const answer = responses.map((item) => {
    if (isDocBased) {
      return formatAnswerForDocBased(item, q, options)
    }
    if (type === questionType.MULTIPLE_CHOICE) {
      // to check if 'True or false' qType have more then 2 options and option label othern then 'True' or 'False'
      // then considering it as standard multipleChoice type
      if (
        title === 'True or false' &&
        Object.keys(options).length === 2 &&
        ['true', 'false'].includes(options[item]?.label?.toLowerCase())
      ) {
        return options[item].label || '-'
      }
      return String.fromCharCode(65 + Object.keys(options).indexOf(item))
    }
    if (type == questionType.MATH && title === 'Units') {
      if (context === 'userResponse') {
        if (typeof item === 'string') {
          return item
        }
        return `${item.expression || '-'}${item.unit || ''}`
      }
      const value = item?.value
      if (item.options) {
        const unit = Array.isArray(item.options)
          ? item.options.map((o) => o.unit).join(',')
          : item.options?.unit
        return `${value}${unit || ''}`
      }
      return value
    }
    if (item?.value) {
      return item?.value
    }
    if (options && item?.id && !isUndefined(item?.index)) {
      return options[item?.id][item?.index]
    }
    if (options && options[item]) {
      return options[item].label
    }
    if (typeof item === 'string') {
      return item
    }
    return '-'
  })

  let result = formatAnswertoDisplay(answer.length ? answer : '-', type, title)

  // for qType = math, needs to reformat latex to correct format, so using formatToMathAnswer util function do this.
  if (type === 'math' && result !== 'TEI') {
    result = Array.isArray(result)
      ? result.map((ans) => formatToMathAnswer(ans))
      : formatToMathAnswer(result)
  }

  if (!viewMode) {
    return Array.isArray(result) ? result.join(', ') : result
  }
  if (Array.isArray(result)) {
    switch (q.type) {
      case questionType.EDITING_TASK:
      case questionType.CLOZE_DROP_DOWN:
        return result.map((r, i) => `${String.fromCharCode(97 + i)}. ${r}`)
      case questionType.CLOZE_IMAGE_TEXT:
      case questionType.CLOZE_DRAG_DROP:
      case questionType.CLOZE_TEXT:
        return result.map((r, i) => `${i + 1}. ${r}`)
      default:
        return result.join(', ')
    }
  }
  return result
}

// use `replaceVariables` util function to replace variables from answers
export const formatOptions = (q) => {
  const formattedQuestion = replaceVariables(q)
  let options = formattedQuestion.options
  if (Array.isArray(options)) {
    options = keyBy(options, 'value')
  }
  return {
    options,
    validResponse: get(formattedQuestion, 'validation.validResponse.value', []),
    altResponse: get(formattedQuestion, 'validation.altResponses', []).flatMap(
      (res) => res.value
    ),
  }
}

export const getQuestionTableData = (
  studentResponse,
  author_classboard_testActivity
) => {
  const testItemsData = get(
    author_classboard_testActivity,
    'data.testItemsData',
    []
  )
  const questionActivities = get(studentResponse, 'data.questionActivities', [])
  const qActivityById = keyBy(questionActivities, 'qid')
  let totalScore = 0
  let obtainedScore = 0

  const questionTableData = testItemsData
    .map((item) => {
      const { itemLevelScoring, itemLevelScore } = item
      const questions = item.data.questions || []

      // for itemLevelScoring, all questions response needs to show in one row
      // so, converted to one row
      if (itemLevelScoring) {
        const data = questions.reduce(
          (acc, q) => {
            const qActivity = qActivityById[q.id]
            const { options, validResponse } = formatOptions(q)
            const correctAnswers =
              get(qActivity, 'correctAnswer.value') || validResponse
            const userResponse = qActivity?.userResponse
              ? qActivity.userResponse
              : []
            acc.yourAnswer = [
              ...acc.yourAnswer,
              formatAnswers(
                userResponse,
                options,
                q,
                qActivity,
                'userResponse'
              ),
            ]
            acc.correctAnswer = [
              ...acc.correctAnswer,
              formatAnswers(correctAnswers, options, q),
            ]
            acc.partialCorrect = acc.partialCorrect || qActivity?.partialCorrect
            acc.correct = acc.correct || qActivity?.correct
            acc.score += round(qActivity?.score || 0, 2)
            acc.itemLevelScoring = true
            return acc
          },
          { yourAnswer: [], correctAnswer: [], score: 0, maxScore: 0 }
        )

        totalScore += itemLevelScore || 0
        obtainedScore += data.score

        return {
          ...(questions[0] || {}),
          ...data,
          maxScore: itemLevelScore || 0,
          questionNumber: `${questions[0]?.barLabel?.substr(1)}`,
        }
      }

      // for other question type other the above mentioned
      return next(questions, (arr) => {
        for (let i = 0; i < arr.length; i++) {
          const q = arr[i]
          const qActivity = qActivityById[q.id]
          const { options, validResponse } = formatOptions(q)
          const correctAnswers =
            get(qActivity, 'correctAnswer.value') || validResponse
          const userResponse = qActivity?.userResponse
            ? qActivity.userResponse
            : []
          q.yourAnswer = [
            formatAnswers(userResponse, options, q, qActivity, 'userResponse'),
          ]
          q.correctAnswer = [formatAnswers(correctAnswers, options, q)]
          q.maxScore = get(q, 'validation.validResponse.score', 0)
          q.score = round(qActivity?.score || 0, 2)
          q.isCorrect = qActivity?.score
          q.correct = qActivity?.correct
          q.partialCorrect = qActivity?.partialCorrect
          q.questionNumber = `${q.barLabel?.substr(1)}`
          totalScore += q.maxScore
          obtainedScore += q.score
        }
      })
    })
    .flat()

  return { questionTableData, totalScore, obtainedScore }
}

export const getChartAndStandardTableData = (
  studentResponse,
  author_classboard_testActivity,
  interestedCurriculums = {}
) => {
  const testItems = get(
    author_classboard_testActivity,
    'data.testItemsData',
    []
  )
  const questionActivities = get(studentResponse, 'data.questionActivities', [])

  const interestedCrclmById = keyBy(interestedCurriculums, '_id')
  // formatting all mastery types
  const assignmentMastery = get(
    author_classboard_testActivity,
    'additionalData.assignmentMastery',
    []
  )
  const assignmentMasteryCopy = assignmentMastery.map((item) => ({
    ...item,
    count: 0,
    total: questionActivities.length,
    fill: item.color,
  }))
  const assignmentMasteryMap = keyBy(assignmentMasteryCopy, 'masteryLevel')

  // contains all test standards to display
  const standardsTableData = groupBy(
    testItems.reduce((acc, item) => {
      // filtering out unscored questions to hide them in standards table in student card
      const questions = item.data.questions.filter(
        (x) => !x?.validation?.unscored
      )

      // fetching all uniq standards from questions
      const allStandards = questions.flatMap((q) => {
        // finding all doamins from question alignment which are not multistandard mapped
        const domains = (q.alignment || [])
          .filter(
            (el) =>
              !el.isEquivalentStandard && interestedCrclmById[el.curriculumId]
          )
          .map((ali) => ali.domains || [])
          .flat()
        const qActivity =
          questionActivities.filter((qa) => qa.qid === q.id)[0] || {}

        // calculating performace percentage
        const { score = 0 } = qActivity
        let { maxScore } = qActivity
        if (!maxScore) {
          maxScore = q.validation?.validResponse?.score
        }

        // formatting uniq standards from each domain
        return domains.flatMap((d) => {
          return (d.standards || []).map((std) => ({
            ...std,
            domain: d.name,
            question:
              typeof q.qLabel === 'string'
                ? q.qLabel
                : `Q${q.barLabel?.substr(1)}`,
            performance,
            score: round(score, 2),
            maxScore,
          }))
        })
      })

      return [...acc, ...allStandards]
    }, []),
    'id'
  )

  const data = Object.values(standardsTableData).flatMap((std) => {
    // this is to add score or maxScore of all questions belongs to same standard
    let formatScore = std.reduce(
      (acc, s) => {
        acc.question.push(s.question)
        acc.score += s.score
        acc.maxScore += s.maxScore
        const performance = Number(
          ((acc.score / acc.maxScore) * 100).toFixed(2)
        )
        acc.performance = !Number.isNaN(performance) ? performance : 0

        // calculating mastery
        const mastery = assignmentMastery.find((_item) => {
          if (acc.performance >= _item.threshold) {
            return true
          }
          return false
        })
        if (mastery) {
          assignmentMasteryMap[mastery.masteryLevel].count++
        }
        acc.masterySummary = mastery ? mastery.masteryLevel : ''
        return acc
      },
      { question: [], score: 0, maxScore: 0 }
    )
    formatScore = { ...formatScore, question: uniq(formatScore.question) }
    return {
      ...std[0],
      ...formatScore,
    }
  })

  const chartData = values(assignmentMasteryMap)
  return { standardsTableData: data, chartData, assignmentMasteryMap }
}

import { map, get, find, round, sumBy, keyBy, isEmpty } from 'lodash'
import produce from 'immer'
import { formatDate } from '../../../../../common/util'
import { getQuestionLabels } from '../../../../../../ClassBoard/Transformer'

export const getData = (rawData = {}, tests = []) => {
  if (!tests.length) {
    return []
  }

  const { districtAvg = [], groupAvg = [], schoolAvg = [] } = rawData

  const parsedData = map(tests, (test) => {
    const { testId, assignments } = test

    const testInfo = { testId }

    const testDistrictAvg = round(
      get(find(districtAvg, testInfo), 'districtAvgPerf', 0)
    )
    const testGroupAvg = round(get(find(groupAvg, testInfo), 'groupAvgPerf', 0))
    const testSchoolAvg = round(
      get(find(schoolAvg, testInfo), 'schoolAvgPerf', 0)
    )
    const rawScore = `${
      sumBy(assignments, 'score')?.toFixed(2) || '0.00'
    } / ${round(sumBy(assignments, 'maxScore'), 2)}`

    const assignmentDateFormatted = formatDate(test.assignmentDate)

    return {
      totalQuestions: 0,
      ...test,
      assignmentDateFormatted,
      districtAvg: testDistrictAvg,
      groupAvg: testGroupAvg,
      schoolAvg: testSchoolAvg,
      rawScore,
    }
  })

  return parsedData
}

const transformTestItemsForAlgoVariables = (testItems, variablesSetIds) =>
  produce(testItems, (draft) => {
    if (!draft) {
      return
    }

    const qidSetIds = keyBy(variablesSetIds, 'qid')
    for (const [idxItem, item] of draft.entries()) {
      if (!item.algoVariablesEnabled) {
        continue
      }
      const questions = get(item, 'data.questions', [])
      for (const [idxQuestion, question] of questions.entries()) {
        const qid = question.id
        const setIds = qidSetIds[qid]
        if (!setIds) {
          continue
        }
        const setKeyId = setIds.setId
        const examples = get(question, 'variable.examples', [])
        const variables = get(question, 'variable.variables', {})
        const example = examples.find((x) => x.key === +setKeyId)
        if (!example) {
          continue
        }
        for (const variable of Object.keys(variables)) {
          draft[idxItem].data.questions[idxQuestion].variable.variables[
            variable
          ].exampleValue = example[variable]
        }
      }
    }
  })

export const transformTestItems = (props) => {
  const {
    questionActivities,
    filter,
    testActivityId,
    passages,
    variableSetIds,
    studentName,
  } = props
  if (!questionActivities) {
    return []
  }

  let { testItems } = props

  if (!testItems) {
    return []
  }

  const labels = getQuestionLabels(testItems)
  testItems = testItems
    .map((item) => {
      const { data, rows, ...others } = item
      if (!(data && !isEmpty(data.questions))) {
        return
      }
      if (item.itemLevelScoring) {
        const firstQid = data.questions[0].id
        const firstQAct = questionActivities.find(
          (x) => x.qid === firstQid && x.testItemId === item._id
        )
        if (firstQAct) {
          if (filter === 'unscoredItems' && !firstQAct.isPractice) {
            return false
          }

          if (filter && filter !== 'unscoredItems' && firstQAct.isPractice) {
            return false
          }

          if (filter === 'correct' && firstQAct.maxScore !== firstQAct.score) {
            return false
          }

          if (
            filter === 'wrong' &&
            (firstQAct.score > 0 ||
              firstQAct.skipped ||
              firstQAct.graded === false)
          ) {
            return false
          }

          if (
            filter === 'partial' &&
            !(firstQAct.score > 0 && firstQAct.score < firstQAct.maxScore)
          ) {
            return false
          }
          if (
            filter === 'skipped' &&
            !(firstQAct.skipped && firstQAct.score === 0)
          ) {
            return false
          }
          if (filter === 'notGraded' && !(firstQAct.graded === false)) {
            return false
          }
        }
      }

      let questions = data.questions
        .map((question) => {
          const { id } = question
          let qActivities = questionActivities.filter(
            ({ qid, id: altId, testItemId }) =>
              (qid === id || altId === id) && testItemId === item._id
          )
          if (qActivities.length > 1) {
            /**
             * taking latest qActivity for a qid
             */
            const qActivity = qActivities.find(
              (o) => o.testActivityId === testActivityId
            )
            if (qActivity) {
              qActivities = [qActivity]
            } else {
              qActivities = [qActivities[qActivities.length - 1]]
            }
          }
          qActivities = qActivities.map((q) => ({
            ...q,
            studentName,
          }))
          const label = labels[`${item._id}_${id}`] || {}
          if (!item.itemLevelScoring && qActivities[0]) {
            if (filter === 'unscoredItems' && !qActivities[0].isPractice) {
              return false
            }

            if (
              filter &&
              filter !== 'unscoredItems' &&
              qActivities[0].isPractice
            ) {
              return false
            }

            if (
              filter === 'correct' &&
              qActivities[0].score < qActivities[0].maxScore
            ) {
              return false
            }

            if (
              filter === 'wrong' &&
              (qActivities[0].score > 0 ||
                qActivities[0].skipped ||
                qActivities[0].graded === false)
            ) {
              return false
            }

            if (
              filter === 'skipped' &&
              !(qActivities[0].skipped && qActivities[0].score === 0)
            ) {
              return false
            }
            if (filter === 'notGraded' && !(qActivities[0].graded === false)) {
              return false
            }
            if (
              filter === 'partial' &&
              !(
                qActivities[0].score > 0 &&
                qActivities[0].score < qActivities[0].maxScore
              )
            ) {
              return false
            }
          }

          qActivities = qActivities.map((q) => {
            const userQuestion = questionActivities.find(
              ({ _id }) => _id === q.qid
            )
            if (userQuestion) {
              q.timespent = userQuestion.timeSpent
              q.disabled = userQuestion.disabled
            }
            return { ...q }
          })
          const [activity] = qActivities.length > 0 ? qActivities : [{}]
          return { ...question, activity, ...label }
        })
        .filter((x) => x)
      if (!questions.length) {
        return false
      }
      if (item.passageId && passages) {
        const passage = passages.find((p) => p._id === item.passageId)
        if (passage) {
          questions = [...questions, passage.data?.[0]]
        }
      }
      const resources = data.resources || []
      questions = [...questions, ...resources]
      return { ...others, rows, data: { questions } }
    })
    .filter((x) => x)
  return transformTestItemsForAlgoVariables([...testItems], variableSetIds)
}

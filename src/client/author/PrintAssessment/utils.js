import { keyBy, sortBy, get } from 'lodash'
import { questionType } from '@edulastic/constants'
import { markQuestionLabel } from '../ClassBoard/Transformer'
import {
  formatAnswers,
  formatOptions,
} from '../StudentsReportCard/utils/transformers'

const defaultManualGradedType = questionType.manuallyGradableQn

const TEI = 'Tech Enhanced Item'
const CR = 'Constructed Response Item'

export const getOrderedQuestionsAndAnswers = (
  testItems,
  passages,
  type,
  filterQs
) => {
  passages = keyBy(passages, '_id')
  markQuestionLabel(testItems)
  const questions = testItems?.reduce((acc, item, index) => {
    // if it's a passage type question, insert passage before the questions
    // also, if the current testItem has same passageId as previous one, dont insert the passage again!
    let ques = get(item, 'data.questions', [])
    ques = ques.map((que) => ({
      ...que,
      itemCollections: item.collections,
      premiumContentRestriction: !!item.premiumContentRestriction,
    }))
    const resources = get(item, 'data.resources', [])

    let qs = [...resources, ...ques]
    if (type === 'custom') {
      if (ques.length === 1) {
        qs = qs.filter((q) => filterQs.includes(q.qLabel))
      } else {
        /**
         * @see https://snapwiz.atlassian.net/browse/EV-32474
         * In item with more than one questions qLabel is only present for question at 1st index.
         * All other questions have qLabel null. Thus filter multipart item questions based on number from barLabel
         */
        qs = qs.filter((q) => {
          const { barLabel = '' } = q
          const charIndex = barLabel.indexOf('.')
          let questionqLabel = barLabel.substring(
            1,
            charIndex === -1 ? barLabel.length : charIndex
          )
          questionqLabel = parseInt(questionqLabel)
          return filterQs.includes(questionqLabel)
        })
      }
    } else if (type === 'manualGraded') {
      if (item.multipartItem || item.itemLevelScoring) {
        qs =
          qs.filter(
            (q) =>
              defaultManualGradedType.includes(q.type) ||
              q.validation?.automarkable === false
          ).length > 0
            ? qs
            : []
      } else {
        qs = qs.filter(
          (q) =>
            defaultManualGradedType.includes(q.type) ||
            q.validation?.automarkable === false
        )
      }
    }

    if (
      item.passageId &&
      item.passageId !== testItems?.[index - 1]?.passageId
    ) {
      const passageStructure = passages?.[item.passageId]?.structure
      if (passageStructure?.tabs?.length) {
        const sortedTabContentIds = sortBy(passageStructure.widgets || [], [
          'tabIndex',
        ]).map((con) => con.reference)
        const data = passages?.[item.passageId]?.data || []
        const sortedData = sortedTabContentIds.map((id) =>
          data.find((d) => d.id === id)
        )
        if (qs.length) {
          acc.push(...sortedData)
        }
      } else if (qs.length) {
        acc.push(...(passages?.[item.passageId]?.data || []))
      }
    }

    acc = [...acc, ...qs]
    return acc
  }, [])

  let answers = questions
    .filter((q) => q) // filtering out undefined question
    .map((q) => {
      const { itemCollections, premiumContentRestriction, ...ques } = q
      const { options, validResponse, altResponse } = formatOptions(ques)
      const answer = formatAnswers(
        validResponse,
        options,
        ques,
        null,
        '',
        'printAssessment'
      )
      const formatedAltResponse = altResponse.map((res) =>
        formatAnswers(res, options, ques, null, '', 'printAssessment')
      )
      return {
        qLabel: `${q.qLabel || q.barLabel?.substr(1) || ''}${
          q.qSubLabel || ''
        }`,
        answers: Array.isArray(answer)
          ? [...answer, ...formatedAltResponse]
          : [answer, ...formatedAltResponse],
      }
    })

  answers = answers.reduce((acc, a) => {
    if (!a.qLabel) {
      return [...acc]
    }
    const _answers = a.answers.map((ans) => {
      if (ans === 'TEI') {
        return TEI
      }
      if (ans === 'Constructed Response') {
        return CR
      }
      return ans
    })
    a.answers = _answers
    return [...acc, a]
  }, [])
  return {
    questions,
    answers,
  }
}

export const formatQuestionLists = (qs = '') =>
  qs
    .split(',')
    .map((q) => {
      const range = q.split('-')
      let start = parseInt(range[0], 10)
      let end = parseInt(range[1], 10)
      if (start > end) {
        const temp = start
        start = end
        end = temp
      }
      if (range.length > 1) {
        return Array.from(
          { length: (end || start) - start + 1 },
          (_, i) => i + start
        )
      }
      return [start, end]
    })
    .flat()
    .filter((q) => !Number.isNaN(q))

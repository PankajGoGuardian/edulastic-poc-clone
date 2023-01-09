import React, { Component, useMemo } from 'react'
import PropTypes from 'prop-types'
import Qs from 'qs'
import { withRouter } from 'react-router-dom'
import { keyBy as _keyBy, get, isEqual } from 'lodash'
import produce from 'immer'
import {
  questionType,
  collections as collectionConst,
} from '@edulastic/constants'
import memoizeOne from 'memoize-one'
import connect from 'react-redux/es/connect/connect'
import { compose } from 'redux'
import TestItemPreview from '../../../../assessment/components/TestItemPreview'
import { getRows } from '../../../sharedDucks/itemDetail'
import { QuestionDiv, Content } from './styled'
import { formatQuestionLists } from '../../../PrintAssessment/utils'
import { getDynamicVariablesSetIdForViewResponse } from '../../../ClassBoard/ducks'

const defaultManualGradedType = questionType.manuallyGradableQn

function Preview({ item, passages, evaluation }) {
  const rows = getRows(item)
  const questions = get(item, ['data', 'questions'], [])
  const resources = get(item, ['data', 'resources'], [])
  let questionsKeyed = {
    ..._keyBy(questions, 'id'),
    ..._keyBy(resources, 'id'),
  }
  if (item.passageId && passages.length) {
    const passage = passages.find((p) => p._id === item.passageId) || {}
    questionsKeyed = { ...questionsKeyed, ..._keyBy(passage.data, 'id') }
  }

  const { itemLevelScoring, isPassageWithQuestions, multipartItem } = item

  const premiumCollectionWithoutAccess = useMemo(
    () =>
      item?.premiumContentRestriction &&
      item?.collections
        ?.filter(({ type = '' }) => type === collectionConst.types.PREMIUM)
        .map(({ name }) => name),
    [item]
  )

  return (
    <Content key={item._id}>
      <TestItemPreview
        showFeedback
        cols={rows}
        preview="show"
        previewTab="show"
        questions={questionsKeyed}
        verticalDivider={item.verticalDivider}
        scrolling={item.scrolling}
        style={{ width: '100%' }}
        isPrintPreview
        evaluation={evaluation}
        isPassageWithQuestions={isPassageWithQuestions}
        itemLevelScoring={itemLevelScoring}
        multipartItem={multipartItem}
        isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
        premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
        itemIdKey={item._id}
      />
    </Content>
  )
}

Preview.propTypes = {
  item: PropTypes.object.isRequired,
}

class StudentQuestions extends Component {
  transformTestItemsForAlgoVariables = (testItems, variablesSetIds) =>
    produce(testItems, (draft) => {
      if (!draft) {
        return
      }

      const qidSetIds = _keyBy(variablesSetIds, 'qid')
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

  transformTestItems() {
    const {
      currentStudent,
      questionActivities,
      location,
      variableSetIds,
    } = this.props
    const { type, qs } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    // convert query string to array format
    const formattedFilteredQs = formatQuestionLists(qs)
    let {
      classResponse: { testItems },
    } = this.props
    const userQActivities =
      currentStudent && currentStudent.questionActivities
        ? currentStudent.questionActivities
        : []
    if (!testItems) {
      return []
    }
    // if search type passed as 'custom' in window location
    if (type === 'custom') {
      testItems = testItems.filter((item, index) => {
        if (item.isDocBased) return true
        return formattedFilteredQs.includes(index + 1)
      })
    }
    testItems = testItems.map((item) => {
      const { data, rows, isDocBased = false, ...others } = item
      if (!(data && data.questions)) {
        return
      }
      let filterQuestions = data.questions
      // IN  Case of docBased test if search type passed as 'custom' in window location
      if (isDocBased && type === 'custom') {
        filterQuestions = filterQuestions.filter(({ qLabel }) =>
          formattedFilteredQs.includes(qLabel)
        )
      }
      const questions = filterQuestions.map((question) => {
        const { id } = question
        let qIndex = 0
        let qActivities = questionActivities.filter(
          ({ qid, testItemId }) => qid === id && testItemId === item._id
        )
        qActivities = qActivities.map((q) => {
          const userQuestion = userQActivities.find(
            ({ _id, testItemId }) => _id === q.qid && testItemId === item._id
          )
          if (userQuestion) {
            q.qIndex = ++qIndex
            q.timespent = userQuestion.timespent
            q.studentName =
              currentStudent !== undefined ? currentStudent.studentName : null
          }
          return { ...q }
        })
        if (qActivities.length > 0) {
          ;[question.activity] = qActivities
        } else {
          question.activity = undefined
        }
        return { ...question }
      })
      return { ...others, rows, data: { questions } }
    })

    // Case Passage question type: if item don't have question, then hide the passage content also
    testItems = testItems.filter((ti) => !!ti.data?.questions?.length)

    // If search type is 'manualGraded', then accept manual graded items only
    if (type === 'manualGraded') {
      testItems = testItems.reduce((acc, ti) => {
        let _qs = ti.data?.questions
        if (ti.multipartItem || ti.itemLevelScoring) {
          _qs =
            _qs.filter(
              (q) =>
                defaultManualGradedType.includes(q.type) ||
                q.validation?.automarkable === false
            ).length > 0
              ? _qs
              : []
        } else {
          _qs = _qs.filter(
            (q) =>
              defaultManualGradedType.includes(q.type) ||
              q.validation?.automarkable === false
          )
        }
        if (_qs.length) {
          ti.data.questions = _qs
          return [...acc, ti]
        }
        return [...acc]
      }, [])
    }

    // merge items belongs to same passage
    testItems = testItems.reduce((acc, item) => {
      if (item.passageId && acc.length) {
        acc.forEach((i) => {
          if (i.passageId === item.passageId) {
            item.passageId = null
          }
        })
      }
      return [...acc, item]
    }, [])
    return this.transformTestItemsForAlgoVariables(
      [...testItems],
      variableSetIds
    )
  }

  getTestItems = memoizeOne(this.transformTestItems, isEqual)

  render() {
    const testItems = this.getTestItems()
    const { classResponse, questionActivities } = this.props
    const { passages = [] } = classResponse
    const evaluationStatus = questionActivities.reduce((acc, curr) => {
      if (curr.pendingEvaluation) {
        acc[curr.qid] = 'pending'
      } else {
        acc[curr.qid] = curr.evaluation
      }

      return acc
    }, {})

    const testItemsRender = testItems.map((item) => (
      <div>
        <div className="__print-question-main-wrapper">
          <Preview
            item={item}
            passages={passages}
            evaluation={evaluationStatus}
          />
        </div>
      </div>
    ))
    return <QuestionDiv>{testItemsRender}</QuestionDiv>
  }
}

const withConnect = connect((state, ownProps) => ({
  variableSetIds: getDynamicVariablesSetIdForViewResponse(state, {
    showMultipleAttempts: ownProps.isLCBView && !ownProps.isQuestionView,
    studentId: ownProps.currentStudent.studentId,
  }),
}))

export default compose(withConnect, withRouter)(React.memo(StudentQuestions))

StudentQuestions.propTypes = {
  classResponse: PropTypes.object.isRequired,
  questionActivities: PropTypes.array.isRequired,
  currentStudent: PropTypes.object.isRequired,
}

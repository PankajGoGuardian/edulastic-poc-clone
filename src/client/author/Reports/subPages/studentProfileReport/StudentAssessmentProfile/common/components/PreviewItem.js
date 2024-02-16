import React from 'react'
import { get, keyBy } from 'lodash'
import PropTypes from 'prop-types'
import { collections as collectionConst } from '@edulastic/constants'
import TestItemPreview from '../../../../../../../assessment/components/TestItemPreview'
import { getRows } from '../../../../../../sharedDucks/itemDetail'
import { StyledFlexContainer } from '../../../../../../StudentView/styled'

const PreviewItem = ({
  item,
  qIndex,
  studentId,
  studentName,
  evaluation,
  showStudentWork,
  passages,
  isQuestionView,
  isExpressGrader,
  isLCBView,
  questionActivity,
  userWork,
  scractchPadUsed,
  isStudentView,
  isStudentWorkCollapseOpen,
  toggleStudentWorkCollapse,
  hideCorrectAnswer,
  testActivityId: utaId,
  currentStudent,
  isExpandedView = false,
  saveScratchPadData,
  aiEvaluationStatus,
  disableAllInputs = false,
}) => {
  const rows = getRows(item, false)
  const questions = get(item, ['data', 'questions'], [])
  const resources = get(item, ['data', 'resources'], [])
  let questionsKeyed = {
    ...keyBy(questions, (q) => `${item._id}_${q.id}`),
    ...keyBy(resources, (r) => `${item._id}_${r.id}`),
  }
  let passage = {}
  if (item.passageId && passages.length) {
    passage = passages.find((p) => p._id === item.passageId) || {}
    questionsKeyed = { ...questionsKeyed, ...keyBy(passage.data, 'id') }
    rows[0] = passage.structure
  }
  const passageId = passage?._id
  const timeSpent = (get(questionActivity, 'timeSpent', 0) / 1000).toFixed(1)
  const { multipartItem, itemLevelScoring, isPassageWithQuestions } = item
  const isV1Multipart = (rows || []).some((row) => row.isV1Multipart)
  const scoringProps = {
    multipartItem: multipartItem || isV1Multipart,
    itemLevelScoring,
    isPassageWithQuestions,
  }
  const attachments = get(questionActivity, 'scratchPad.attachments', null)
  const scratchpadDimensions = get(
    questionActivity,
    'scratchPad.dimensions',
    null
  )

  const testActivityId = get(questionActivity, 'testActivityId', '')
  const highlights = get(
    userWork,
    `[${passageId}][${testActivityId}].resourceId`,
    {}
  )

  const premiumCollectionWithoutAccess =
    item?.premiumContentRestriction &&
    item?.collections
      ?.filter(({ type = '' }) => type === collectionConst.types.PREMIUM)
      .map(({ name }) => name)

  return (
    <StyledFlexContainer
      key={item._id}
      data-cy="student-question-container"
      className={`student-question-container-id-${studentId}`}
      height={isLCBView && isQuestionView && 'auto'}
      style={{ padding: '10px 0' }}
    >
      <TestItemPreview
        showCollapseBtn
        disableAllInputs={disableAllInputs}
        showFeedback
        cols={rows}
        isDocBased={item.isDocBased}
        preview="show"
        previewTab="show"
        questions={questionsKeyed}
        disableResponse
        verticalDivider={item.verticalDivider}
        scrolling={item.scrolling}
        style={{ width: '100%' }}
        qIndex={qIndex}
        evaluation={evaluation}
        showStudentWork={showStudentWork}
        isQuestionView={isQuestionView}
        isExpressGrader={isExpressGrader}
        isLCBView={isLCBView}
        timeSpent={timeSpent}
        attachments={attachments}
        userWork={scractchPadUsed && userWork} // used to determine show student work button
        highlights={highlights}
        scratchpadDimensions={scratchpadDimensions}
        saveUserWork={(data) => saveScratchPadData(data)}
        isStudentWorkCollapseOpen={isStudentWorkCollapseOpen}
        toggleStudentWorkCollapse={toggleStudentWorkCollapse}
        {...scoringProps}
        studentId={studentId}
        studentName={studentName}
        inLCB
        itemId={item._id}
        isStudentView={isStudentView}
        testActivityId={utaId}
        hideCorrectAnswer={hideCorrectAnswer}
        currentStudent={currentStudent}
        isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
        premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
        isExpandedView={isExpandedView}
        aiEvaluationStatus={aiEvaluationStatus}
      />
    </StyledFlexContainer>
  )
}

PreviewItem.propTypes = {
  item: PropTypes.object.isRequired,
  qIndex: PropTypes.number.isRequired,
  studentId: PropTypes.any.isRequired,
  evaluation: PropTypes.object,
}
PreviewItem.defaultProps = {
  evaluation: {},
}

export default PreviewItem

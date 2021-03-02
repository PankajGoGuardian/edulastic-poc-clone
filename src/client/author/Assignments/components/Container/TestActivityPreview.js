import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { compose } from 'redux'
import { get, keyBy } from 'lodash'
import { IconReport } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { MainContentWrapper, FlexContainer } from '@edulastic/common'
import ProgressGraph from '../../../../common/components/ProgressGraph'
import TestAcivityHeader from '../../../../student/sharedComponents/Header'
import TestItemPreview from '../../../../assessment/components/TestItemPreview'
import {
  previewTestActivitySelector,
  previewTestQuestionActivities,
} from '../../../../assessment/sharedDucks/previewTest'
import { TestItemPreviewContainer } from './styled'

const TestActivityPreview = ({
  title,
  testItems,
  test,
  testActivity,
  questionActivities,
  onClose,
  t,
  previewModal,
}) => {
  const passages = test?.passages || []
  const evaluations = questionActivities.reduce((acc, curr) => {
    acc[curr.qid] = curr.evaluation
    return acc
  }, {})

  const activities = keyBy(questionActivities, 'testItemId')
  const testItemsPreview = testItems.map((testItem, index) => {
    const questionActivity = activities[testItem._id]

    if (!questionActivity) {
      return null
    }
    const { userWork } = questionActivity
    const questions = get(testItem, ['data', 'questions'], [])
    const resources = get(testItem, ['data', 'resources'], [])
    const timeSpent = (get(questionActivity, 'timeSpent', 0) / 1000).toFixed(1)
    const attachments = get(questionActivity, 'scratchPad.attachments', null)
    const {
      multipartItem,
      itemLevelScoring,
      isPassageWithQuestions,
      passageContent,
      passageId,
    } = testItem
    const scoringProps = {
      multipartItem,
      itemLevelScoring,
      isPassageWithQuestions:
        isPassageWithQuestions || (passageContent && passageId),
    }
    let questionsKeyed = {
      ...keyBy(questions, 'id'),
      ...keyBy(resources, 'id'),
    }
    let itemRows = testItem.rows
    let passage = {}
    if (testItem.passageId && passages) {
      passage = passages.find((p) => p._id === testItem.passageId)
      questionsKeyed = { ...questionsKeyed, ...keyBy(passage?.data, 'id') }
      itemRows = [passage?.structure, ...itemRows]
    }

    return (
      <TestItemPreviewContainer
        key={testItem._id}
        data-cy="test-preview-question-container"
      >
        <TestItemPreview
          showCollapseBtn
          cols={itemRows}
          disableResponse
          isDocBased={testItem.isDocBased}
          preview="show"
          previewTab="show"
          questions={questionsKeyed}
          verticalDivider={testItem.verticalDivider}
          scrolling={testItem.scrolling}
          qIndex={index}
          evaluation={evaluations}
          isLCBView
          timeSpent={timeSpent}
          attachments={attachments}
          history={userWork?.scratchpad}
          saveHistory={() => {}}
          {...scoringProps}
          studentName={t('common.anonymous')}
          itemId={testItem._id}
        />
      </TestItemPreviewContainer>
    )
  })

  return (
    <FlexContainer height="100vh">
      <TestAcivityHeader
        showExit
        hideSideMenu
        onExit={onClose}
        isDocBased={false}
        titleIcon={IconReport}
        titleText={title}
        showReviewResponses={false}
        previewModal={previewModal}
      />
      <MainContentWrapper padding="0px 20px">
        <StudentPerformancePreview>
          <ProgressGraph
            testActivity={testActivity}
            questionActivities={questionActivities}
            testItems={testItems}
          />
        </StudentPerformancePreview>
        <div>{testItemsPreview}</div>
      </MainContentWrapper>
    </FlexContainer>
  )
}

const enhanced = compose(
  withNamespaces('student'),
  connect(
    (state) => ({
      test: state.test,
      title: state.test.title,
      testItems: state.test.items,
      testActivity: previewTestActivitySelector(state),
      questionActivities: previewTestQuestionActivities(state),
    }),
    null
  )
)

export default enhanced(TestActivityPreview)

const StudentPerformancePreview = styled.div`
  margin-top: ${(props) => `${props.theme.HeaderHeight.xs}px`};
`

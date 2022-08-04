import React, { useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { compose } from 'redux'
import { get, keyBy } from 'lodash'
import { scrollTo, MainContentWrapper, FlexContainer } from '@edulastic/common'
import { IconReport } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { collections as collectionConst } from '@edulastic/constants'
import ProgressGraph from '../../../../common/components/ProgressGraph'
import TestAcivityHeader from '../../../../student/sharedComponents/Header'
import TestItemPreview from '../../../../assessment/components/TestItemPreview'
import { changeDataToPreferredLanguage } from '../../../../assessment/utils/question'
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
  testPreviewLanguage,
}) => {
  const refForScroll = useRef('')

  const onClickBarHandler = (index, itemId, qid) => {
    const el = document.querySelector(`.question-container-id-${itemId}_${qid}`)
    scrollTo(
      el,
      (document.querySelector('.fixed-header')?.offsetHeight + 10) * 2 || 0,
      refForScroll.current
    )
  }

  const passages = test?.passages || []
  const evaluations = questionActivities.reduce((acc, curr) => {
    acc[`${curr.testItemId}_${curr.qid}`] = curr.evaluation
    return acc
  }, {})

  const activities = keyBy(questionActivities, 'testItemId')
  const testItemsPreview = testItems.map((testItem, index) => {
    const questionActivity =
      activities[testItem._id] || testItem.isDummyItem ? {} : false

    if (!questionActivity && !testItem.isDummyItem) {
      return null
    }

    const previewScore = {
      score: questionActivity.score,
      maxScore: questionActivity.maxScore,
      isGradedExternally: false,
    }

    const { userWork } = questionActivity
    const questions = get(testItem, ['data', 'questions'], []).map((q) =>
      changeDataToPreferredLanguage(q, testPreviewLanguage)
    )
    const resources = get(testItem, ['data', 'resources'], []).map((r) =>
      changeDataToPreferredLanguage(r, testPreviewLanguage)
    )
    const timeSpent = (get(questionActivity, 'timeSpent', 0) / 1000).toFixed(1)
    const attachments = get(questionActivity, 'scratchPad.attachments', null)
    const { multipartItem, itemLevelScoring, isPassageWithQuestions } = testItem
    const scoringProps = {
      multipartItem,
      itemLevelScoring,
      isPassageWithQuestions,
    }
    let questionsKeyed = {
      ...keyBy(questions, (q) => `${testItem._id}_${q.id}`),
      ...keyBy(resources, (r) => `${testItem._id}_${r.id}`),
    }
    let itemRows = testItem.rows
    let passage = {}
    if (testItem.passageId && passages) {
      passage = passages.find((p) => p._id === testItem.passageId)
      questionsKeyed = { ...questionsKeyed, ...keyBy(passage?.data, 'id') }
      itemRows = [passage?.structure, ...itemRows]
    }

    const premiumCollectionWithoutAccess =
      testItem?.premiumContentRestriction &&
      testItem?.collections
        ?.filter(({ type = '' }) => type === collectionConst.types.PREMIUM)
        .map(({ name }) => name)

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
          testPreviewScore={previewScore}
          isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
          premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
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
      <MainContentWrapper ref={refForScroll} padding="0px 20px">
        <StudentPerformancePreview>
          <ProgressGraph
            testActivity={testActivity}
            questionActivities={questionActivities}
            testItems={testItems}
            onClickBar={onClickBarHandler}
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
      testPreviewLanguage: state.test.languagePreference,
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

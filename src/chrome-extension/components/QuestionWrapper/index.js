import React from 'react'
import '../../../client/index.css'
import { connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

import { Hints } from '@edulastic/common'
import { mobileWidthMax } from '@edulastic/colors'

import MultipleChoice from '../Questions/MultipleChoice'
import MatrixChoice from '../Questions/MatrixChoice'
import { themes } from '../../../client/theme.js'
import { saveAnswerAction } from '../../reducers/ducks/edulastic'

const questionType = {
  MULTIPLE_CHOICE: 'multipleChoice',
  CHOICE_MATRIX: 'choiceMatrix',
}

const getQuestion = (type) => {
  switch (type) {
    case questionType.MULTIPLE_CHOICE:
      return MultipleChoice
    case questionType.CHOICE_MATRIX:
      return MatrixChoice
    default:
      return null
  }
}

const QuestionWrapper = ({
  data,
  type,
  view,
  qIndex,
  flowLayout,
  itemIndex,
  saveAnswer,
  userAnswer,
}) => {
  const Question = getQuestion(type)

  return (
    <QuestionContainer
      className={`fr-view question-container question-container-id-${data.id}`}
      noPadding
      isFlex
      style={{ width: '100%', height: '100%' }}
    >
      <ThemeProvider
        theme={{
          ...themes.default,
          isV1Migrated: data.isV1Migrated,
        }}
      >
        <>
          <Question
            item={data}
            view={view}
            qIndex={qIndex}
            showQuestionNumber={data.qLabel}
            flowLayout={flowLayout}
            itemIndex={itemIndex}
            saveAnswer={saveAnswer}
            userAnswer={userAnswer}
          />

          {/* <Hints
                        question={data}
                        enableMagnifier={false}
                        saveHintUsage={false}
                        isStudent
                        itemIndex={itemIndex}
                    /> */}

          {/* <Explanation question={data} /> */}
        </>
      </ThemeProvider>
    </QuestionContainer>
  )
}

export default connect(
  (state) => ({
    userAnswer: state.edulasticReducer.userAnswer,
  }),
  {
    saveAnswer: saveAnswerAction,
  }
)(QuestionWrapper)

const QuestionContainer = styled.div`
  padding: ${({ noPadding }) => (noPadding ? '0px' : null)};
  display: ${({ isFlex }) => (isFlex ? 'flex' : 'block')};
  justify-content: space-between;
  ${({ style }) => style};
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
  .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 3em;
  }
  .ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 3em;
  }
  .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 6em;
  }
  .ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 6em;
  }
  .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 9em;
  }
  .ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 9em;
  }
  .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 12em;
  }
  .ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 12em;
  }
  .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 15em;
  }
  .ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 15em;
  }
  .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 18em;
  }
  .ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 18em;
  }
  .ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 21em;
  }
  .ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 21em;
  }
  .ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 24em;
  }
  .ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 24em;
  }
  .ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 27em;
  }
  .ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 27em;
  }

  .print-preview-feedback {
    width: 100%;
    padding: 0 35px;
  }
`

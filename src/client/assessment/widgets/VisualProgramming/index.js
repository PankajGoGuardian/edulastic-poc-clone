import React from 'react'
import produce from 'immer'
import { connect } from 'react-redux'

import { CLEAR, EDIT } from '../../constants/constantsForQuestions'
import { ContentArea } from '../../styled/ContentArea'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import ComposeQuestion from './components/ComposeQuestion'
import TestCases from './components/TestCases'
// import CorrectAnswers from './components/CorrectAnswers'

const VisualProgramming = ({
  item,
  view,
  setQuestionData,
  //   advancedLink,
  fillSections,
  cleanSections,
  t,
}) => {
  return (
    <>
      {
        view === EDIT ? (
          <ContentArea>
            <ComposeQuestion
              fillSections={fillSections}
              cleanSections={cleanSections}
              t={t}
              stimulus={item.stimulus}
              setQuestionData={setQuestionData}
              produce={produce}
              item={item}
            />
            <TestCases
              setQuestionData={setQuestionData}
              t={t}
              fillSections={fillSections}
              cleanSections={cleanSections}
              produce={produce}
              item={item}
            />
            {/* <CorrectAnswers
              setQuestionData={setQuestionData}
              t={t}
              fillSections={fillSections}
              cleanSections={cleanSections}
              item={item}
            /> */}
            {/* {advancedLink} */}
          </ContentArea>
        ) : null
        //   (
        //     <Display
        //       saveAnswer={saveAnswer}
        //       item={item}
        //       t={t}
        //       stimulus={item.stimulus}
        //       evaluation={evaluation}
        //       previewTab={previewTab}
        //       showQuestionNumber={showQuestionNumber}
        //       userAnswer={userAnswer}
        //       disableResponse={disableResponse}
        //       changePreviewTab={changePreviewTab}
        //       isReviewTab={isReviewTab}
        //       view={view}
        //       hideCorrectAnswer={hideCorrectAnswer}
        //       showAnswerScore={showAnswerScore}
        //     />
        //   )
      }
    </>
  )
}

VisualProgramming.defaultProps = {
  previewTab: CLEAR,
  item: {},
  userAnswer: [],
  evaluation: [],
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {},
  showQuestionNumber: false,
}

export default connect(null, {
  setQuestionData: setQuestionDataAction,
})(VisualProgramming)

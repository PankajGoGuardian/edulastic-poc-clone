import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyledText, StyledWrapper } from './styled'
import QuestionScoreCell from './QuestionScoreCell'
import { Tooltip } from '../../../../common/utils/helpers'

class QuestionScore extends Component {
  render() {
    const {
      question,
      showQuestionModal,
      isTest,
      scoreMode = true,
      isGridEditOn,
      groupId,
      isSurveyTest,
    } = this.props
    const isQuestion =
      question &&
      question.score !== undefined &&
      question.maxScore !== undefined
    const { graded, skipped, maxScore, responseToDisplay, isPractice } =
      question || {}
    let { score: studentScore } = question || {} // score, maxScore,

    let answerStatus = null
    if (studentScore === maxScore && maxScore > 0) {
      answerStatus = 'correct'
    } else if (skipped) {
      answerStatus = 'skipped'
    } else if (graded === false) {
      answerStatus = 'ungraded'
    } else if (studentScore === 0 && maxScore > 0) {
      answerStatus = 'wrong'
    } else if (studentScore > 0 && studentScore < maxScore && maxScore > 0) {
      answerStatus = 'partiallyCorrect'
    }
    if (isSurveyTest) {
      answerStatus = null
    }

    if (!isQuestion) {
      // score = 0;
      // maxScore = 1;
      studentScore = '-'
    }
    const unscoredDisplay = scoreMode &&
      isPractice && {
        displayText: `Z`,
        tooltipdisplay: `Zero Point`,
      }
    if (skipped) studentScore = 0

    const onClickHandler = () => {
      if (!isGridEditOn) {
        showQuestionModal(question)
      }
    }
    return (
      <>
        {isTest ? (
          <StyledWrapper answerStatus={answerStatus} onClick={onClickHandler}>
            {/* color={getScoreColor(score, maxScore)} */}
            {scoreMode && !isPractice ? (
              <QuestionScoreCell
                groupId={groupId}
                question={question}
                studentScore={studentScore}
                isGridEditOn={isGridEditOn}
              />
            ) : (
              <Tooltip
                title={
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        unscoredDisplay?.tooltipdisplay ||
                        responseToDisplay ||
                        '-',
                    }}
                  />
                }
              >
                <StyledText
                  dangerouslySetInnerHTML={{
                    __html:
                      unscoredDisplay?.displayText || responseToDisplay || '-',
                  }}
                  responseView
                />
              </Tooltip>
            )}
          </StyledWrapper>
        ) : (
          <StyledWrapper>
            <StyledText>-</StyledText>
          </StyledWrapper>
        )}
      </>
    )
  }
}

QuestionScore.propTypes = {
  question: PropTypes.object.isRequired,
  showQuestionModal: PropTypes.func.isRequired,
  isTest: PropTypes.string,
}

QuestionScore.defaultProps = {
  isTest: '',
}

export default QuestionScore

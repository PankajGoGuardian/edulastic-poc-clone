import React from 'react'
import PropTypes from 'prop-types'
import { MathSpan, CorrectAnswersContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { getStemNumeration } from '../../../../utils/helpers'
import { AnswersWrapper } from './styled/AnswerWrapper'

const CorrectAnswerBoxLayout = ({
  fontSize,
  userAnswers,
  responseIds = [],
  t,
  stemNumeration,
  singleResponseBox,
  isAltAnswers,
  answerIndex,
  showAnswerScore,
  score,
}) => {
  const getLabel = (id) => userAnswers[id]

  return (
    <CorrectAnswersContainer
      fontSize={fontSize}
      padding="15px 25px 20px"
      titleMargin="0px 0px 12px"
      minHeight="auto"
      showAnswerScore={showAnswerScore}
      score={score}
      title={
        isAltAnswers
          ? `${t('component.cloze.altAnswers')} ${answerIndex}`
          : t('component.cloze.correctAnswer')
      }
    >
      <AnswersWrapper>
        {responseIds.map((response) => (
          <div key={response.index} className="correct-answer-item">
            {!singleResponseBox && (
              <div className="index">
                {getStemNumeration(stemNumeration, response.index)}
              </div>
            )}
            <div className="text">
              <MathSpan
                dangerouslySetInnerHTML={{ __html: getLabel(response.id) }}
              />
            </div>
          </div>
        ))}
      </AnswersWrapper>
    </CorrectAnswersContainer>
  )
}

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.object,
  stemNumeration: PropTypes.string.isRequired,
  responseIds: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  singleResponseBox: PropTypes.bool,
}

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: '13px',
  userAnswers: {},
  singleResponseBox: false,
}

export default React.memo(withNamespaces('assessment')(CorrectAnswerBoxLayout))

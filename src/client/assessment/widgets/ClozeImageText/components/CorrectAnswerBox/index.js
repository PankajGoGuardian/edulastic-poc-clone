import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'
import { CorrectAnswersContainer } from '@edulastic/common'
import { getStemNumeration } from '../../../../utils/helpers'
import { AnswerBox } from './styled/AnswerBox'
import { IndexBox } from './styled/IndexBox'
import { AnswerContent } from './styled/AnswerContent'

const CorrectAnswerBoxLayout = ({
  userAnswers,
  altAnsIndex,
  stemNumeration,
  responseContainers,
  t,
  singleResponseBox,
  showAnswerScore,
  score,
}) => (
  <CorrectAnswersContainer
    title={
      altAnsIndex
        ? `${t('component.cloze.altAnswers')} ${altAnsIndex}`
        : t('component.cloze.correctAnswer')
    }
    padding="15px 25px 20px"
    titleMargin="0px 0px 12px"
    showAnswerScore={showAnswerScore}
    score={score}
  >
    {responseContainers?.map(({ id }, index) => (
      <AnswerBox key={`correct-answer-${index}`}>
        {!singleResponseBox && (
          <IndexBox>{getStemNumeration(stemNumeration, index)}</IndexBox>
        )}
        <AnswerContent>{userAnswers[id]}</AnswerContent>
      </AnswerBox>
    ))}
  </CorrectAnswersContainer>
)

CorrectAnswerBoxLayout.propTypes = {
  userAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  altAnsIndex: PropTypes.number,
  stemNumeration: PropTypes.string,
  singleResponseBox: PropTypes.bool,
}

CorrectAnswerBoxLayout.defaultProps = {
  userAnswers: [],
  altAnsIndex: 0,
  stemNumeration: 'numerical',
  singleResponseBox: false,
}

export default React.memo(withNamespaces('assessment')(CorrectAnswerBoxLayout))

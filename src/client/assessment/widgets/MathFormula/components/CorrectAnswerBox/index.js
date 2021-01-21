import React from 'react'
import PropTypes from 'prop-types'
import { isArray } from 'lodash'
import { MathFormulaDisplay, CorrectAnswersContainer } from '@edulastic/common'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { Answer } from './styled/Answer'

export const formatToMathAnswer = (answer, template) => {
  let answerStr = answer
  if (isArray(answer) && template) {
    answerStr = template
    const matches = template.match(/\\embed\{response\}/g)
    if (isArray(matches)) {
      for (let i = 0; i < matches.length; i++) {
        answerStr = answerStr.replace(matches[i], answer[i])
      }
    }
  }

  return answerStr.search('input__math') !== -1
    ? answerStr
    : `<span class="input__math" data-latex="${answerStr}"></span>`
}

const CorrectAnswerBox = ({
  answer = '',
  t,
  altAnswers,
  theme,
  index,
  template = '',
}) => {
  const displayAnswer = formatToMathAnswer(answer, template)

  return (
    <CorrectAnswersContainer
      title={
        !altAnswers
          ? t('component.math.correctAnswers')
          : `${t('component.math.alternateAnswers')} ${index}`
      }
      minHeight="auto"
    >
      <Answer>
        <MathFormulaDisplay
          color={theme.answerBox.textColor}
          dangerouslySetInnerHTML={{ __html: displayAnswer }}
        />
      </Answer>
    </CorrectAnswersContainer>
  )
}

CorrectAnswerBox.propTypes = {
  answer: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  altAnswers: PropTypes.bool.isRequired,
  index: PropTypes.number,
}

CorrectAnswerBox.defaultProps = {
  index: 1,
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(CorrectAnswerBox)

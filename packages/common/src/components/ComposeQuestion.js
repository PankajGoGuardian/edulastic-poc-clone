import React from 'react'
import PropTypes from 'prop-types'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import QuestionTextArea from '../../../../src/client/assessment/components/QuestionTextArea'
import { Subtitle } from '../../../../src/client/assessment/styled/Subtitle'

import Question from '../../../../src/client/assessment/components/Question'

const ComposeQuestion = ({
  fillQuestionSections,
  clearQuestionSections,
  handleQuestionChange,
  composeQuestionLabel,
  stimulusContent,
  itemTitle,
}) => {
  return (
    <Question
      section="main"
      label={composeQuestionLabel}
      fillSections={fillQuestionSections}
      cleanSections={clearQuestionSections}
    >
      <Subtitle id={getFormattedAttrId(`${itemTitle}-${composeQuestionLabel}`)}>
        {composeQuestionLabel}
      </Subtitle>

      <QuestionTextArea
        onChange={handleQuestionChange}
        value={stimulusContent}
        border="border"
      />
    </Question>
  )
}

ComposeQuestion.propTypes = {
  handleQuestionChange: PropTypes.func.isRequired,
  composeQuestionLabel: PropTypes.string.isRequired,
  stimulusContent: PropTypes.string.isRequired,
  itemTitle: PropTypes.string.isRequired,
  fillQuestionSections: PropTypes.func,
  clearQuestionSections: PropTypes.func,
}

ComposeQuestion.defaultProps = {
  fillQuestionSections: () => {},
  clearQuestionSections: () => {},
}

export default ComposeQuestion

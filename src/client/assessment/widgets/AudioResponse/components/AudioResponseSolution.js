import React from 'react'
import PropTypes from 'prop-types'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import QuestionTextArea from '../../../components/QuestionTextArea'
import { Subtitle } from '../../../styled/Subtitle'
import Question from '../../../components/Question'

const AudioResponseSolution = ({
  i18translate,
  itemTitle,
  instructorStimulus,
  handleQuestionChange,
  fillQuestionSections,
  clearQuestionSections,
  advancedAreOpen,
}) => {
  return (
    <Question
      section="advanced"
      label={i18translate('component.options.solution')}
      fillSections={fillQuestionSections}
      cleanSections={clearQuestionSections}
      advancedAreOpen={advancedAreOpen}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${itemTitle}-${i18translate('component.options.solution')}`
        )}
      >
        {i18translate('component.options.solution')}
      </Subtitle>

      <QuestionTextArea
        toolbarId="instructor_stimulus"
        placeholder={i18translate(
          'component.options.enterDistractorRationaleQuestion'
        )}
        onChange={handleQuestionChange}
        value={instructorStimulus}
        border="border"
      />
    </Question>
  )
}

AudioResponseSolution.propTypes = {
  i18translate: PropTypes.func.isRequired,
  fillQuestionSections: PropTypes.func,
  clearQuestionSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  itemTitle: PropTypes.string.isRequired,
  instructorStimulus: PropTypes.string.isRequired,
  handleQuestionChange: PropTypes.func.isRequired,
}

AudioResponseSolution.defaultProps = {
  fillQuestionSections: () => {},
  clearQuestionSections: () => {},
  advancedAreOpen: false,
}

export default AudioResponseSolution

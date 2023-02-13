import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withTheme } from 'styled-components'

import { NumberInputStyled } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { maxAudioDurationLimit } from '../constants'
import { IsValidNumber } from '../utils'
import { Label } from '../../../styled/WidgetOptions/Label'
import { setQuestionDataAction } from '../../../../author/QuestionEditor/ducks'
import Question from '../../../components/Question'
import { StyledTimeDurationLimitContainer } from '../styledComponents/AudioRecorder'

const AudioResponseEdit = ({
  i18translate,
  fillSections,
  cleanSections,
  audioTimeLimitInMinutes,
  handleQuestionChange,
}) => {
  const onChangeAudioDurationLimit = (value) => {
    value = IsValidNumber(value) ? value : maxAudioDurationLimit
    handleQuestionChange('audioTimeLimitInMinutes', value)
  }
  return (
    <>
      <Question
        section="main"
        label={i18translate('component.audioResponse.maxResponseDurationLabel')}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen
      >
        <Label>
          {i18translate('component.audioResponse.maxResponseDurationAllowed')}
        </Label>
        <StyledTimeDurationLimitContainer>
          <NumberInputStyled
            onChange={(value) => onChangeAudioDurationLimit(value)}
            value={audioTimeLimitInMinutes}
            min={1}
            max={maxAudioDurationLimit}
            step={1}
          />
          <Label mt="auto" ml="10px">
            {i18translate('component.audioResponse.minutes')}
          </Label>
        </StyledTimeDurationLimitContainer>
      </Question>
    </>
  )
}

AudioResponseEdit.propTypes = {
  i18translate: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  audioTimeLimitInMinutes: PropTypes.number.isRequired,
  handleQuestionChange: PropTypes.func.isRequired,
}

AudioResponseEdit.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withNamespaces('assessment'),
  withTheme,
  connect(null, {
    setQuestionData: setQuestionDataAction,
  })
)

export default enhance(AudioResponseEdit)

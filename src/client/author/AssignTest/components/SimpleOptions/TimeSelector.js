import React from 'react'
import moment from 'moment'
import { TimePickerStyled } from '@edulastic/common'
import { IconDownEmptyArrow } from '@edulastic/icons'
import {
  ATTEMPT_WINDOW_DEFAULT_START_TIME,
  ATTEMPT_WINDOW_DEFAULT_END_TIME,
} from '@edulastic/constants/const/common'
import { StyledTimePickerContainer } from './styled'

const TimeSelector = ({ handleStartTimeChange, handleEndTimeChange }) => {
  return (
    <StyledTimePickerContainer>
      <TimePickerStyled
        onChange={handleStartTimeChange}
        allowClear={false}
        format="hh:mm A"
        minuteStep={15}
        use12Hours
        suffixIcon={<IconDownEmptyArrow />}
        style={{ width: '42%' }}
        defaultValue={moment(ATTEMPT_WINDOW_DEFAULT_START_TIME, 'hh:mm A')}
      />{' '}
      TO{' '}
      <TimePickerStyled
        onChange={handleEndTimeChange}
        allowClear={false}
        format="hh:mm A"
        use12Hours
        minuteStep={15}
        suffixIcon={<IconDownEmptyArrow />}
        style={{ width: '42%' }}
        defaultValue={moment(ATTEMPT_WINDOW_DEFAULT_END_TIME, 'hh:mm A')}
      />
    </StyledTimePickerContainer>
  )
}

export default TimeSelector

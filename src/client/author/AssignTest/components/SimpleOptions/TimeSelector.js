import React from 'react'
import moment from 'moment'
import { TimePickerStyled } from '@edulastic/common'
import { IconDownEmptyArrow } from '@edulastic/icons'
import {
  ATTEMPT_WINDOW_DEFAULT_START_TIME,
  ATTEMPT_WINDOW_DEFAULT_END_TIME,
  ONE_HOURS_IN_MILLISECONDS,
  ONE_MINUTES_IN_MILLISECONDS,
  TOTAL_MINUTE_IN_HOURS,
  TOTAL_HOURS_IN_ONE_DAY,
  TOTAL_HOURS_IN_HALF_DAY,
  ANTE_MERIDIEM,
  POST_MERIDIEM,
} from '@edulastic/constants/const/common'
import { StyledTimePickerContainer } from './styled'

const TimeSelector = ({
  handleStartTimeChange,
  handleEndTimeChange,
  assignmentStartTime,
  assignmentEndTime,
}) => {
  const getHrsAndMinsFromMilliSeconds = (milliseconds = 0) => {
    let amPm = ANTE_MERIDIEM
    const minutes = Math.floor(
      (milliseconds / ONE_MINUTES_IN_MILLISECONDS) % TOTAL_MINUTE_IN_HOURS
    )
    const hours = Math.floor(
      (milliseconds / ONE_HOURS_IN_MILLISECONDS) % TOTAL_HOURS_IN_ONE_DAY
    )
    let hrsIn12HrsFormat
    if (hours >= TOTAL_HOURS_IN_HALF_DAY) {
      hrsIn12HrsFormat = hours % TOTAL_HOURS_IN_HALF_DAY
      amPm = POST_MERIDIEM
    } else {
      hrsIn12HrsFormat = hours
    }
    return `${hrsIn12HrsFormat}:${minutes} ${amPm}`
  }
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
        value={moment(
          getHrsAndMinsFromMilliSeconds(assignmentStartTime),
          'hh:mm A'
        )}
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
        value={moment(
          getHrsAndMinsFromMilliSeconds(assignmentEndTime),
          'hh:mm A'
        )}
      />
    </StyledTimePickerContainer>
  )
}

export default TimeSelector

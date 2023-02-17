import React from 'react'
import { WEEK_DAYS } from '@edulastic/constants/const/common'
import { StyledDayPickerContainer } from './styled'
import CustomCheckbox from './CustomCheckBox'

const DaySelector = ({ isAdvancedView, selectedDays, handleDayChange }) => {
  return (
    <StyledDayPickerContainer isAdvancedView={isAdvancedView}>
      {Object.keys(WEEK_DAYS).map((day) => (
        <CustomCheckbox
          height="28px"
          width="28px"
          key={day}
          label={WEEK_DAYS[day][0]}
          checked={!!selectedDays[day.substring(0, 3)]}
          onChange={() => handleDayChange(WEEK_DAYS[day])}
        />
      ))}
    </StyledDayPickerContainer>
  )
}

export default DaySelector

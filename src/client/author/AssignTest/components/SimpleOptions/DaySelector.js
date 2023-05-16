import React from 'react'
import { WEEK_DAYS } from '@edulastic/constants/const/common'
import { StyledDayPickerContainer } from './styled'
import CustomCheckbox from './CustomCheckBox'

const DaySelector = ({ isAdvancedView, selectedDays, handleDayChange }) => {
  const handleDaySelection = (currentSelectedDay) => {
    const currentDayAlreadySelected = selectedDays[currentSelectedDay]
    const alreadySelectedDays = Object.keys(selectedDays).filter(
      (o) => selectedDays[o]
    )
    const isLastDayDeselected =
      alreadySelectedDays.length === 1 && currentDayAlreadySelected
    if (!isLastDayDeselected) {
      handleDayChange(currentSelectedDay)
    }
  }
  return (
    <StyledDayPickerContainer isAdvancedView={isAdvancedView}>
      {Object.keys(WEEK_DAYS).map((day) => (
        <CustomCheckbox
          height="28px"
          width="28px"
          key={day}
          title={day}
          label={WEEK_DAYS[day][0]}
          checked={!!selectedDays[day.substring(0, 3)]}
          onChange={() => handleDaySelection(WEEK_DAYS[day])}
        />
      ))}
    </StyledDayPickerContainer>
  )
}

export default DaySelector

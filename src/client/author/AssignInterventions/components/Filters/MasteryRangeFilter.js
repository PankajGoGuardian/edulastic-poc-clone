import React, { useCallback, useState } from 'react'
import { debounce } from 'lodash'
import { IconInfoCircle } from '@edulastic/icons'
import {
  FilterSubHeadingContainer,
  StyledSlider,
  SliderMarkContainer,
  MasteryRangeContainer,
} from './style'
import { CustomTableTooltip } from '../../../Reports/common/components/customTableTooltip'
import { TooltipContainer } from '../StudentList/style'

const MasteryRangeFilter = ({ masteryRange, setMasteryRange }) => {
  const [currentMasteryRange, setCurrentMasteryRange] = useState(masteryRange)

  const updateMasteryRange = useCallback((newMasteryRange) => {
    setCurrentMasteryRange(newMasteryRange)
    // Delay the mastery change update to reduce the number of rerenders of the page.
    debounce(setMasteryRange, 500)(newMasteryRange)
  }, [])

  const marks = {
    [currentMasteryRange[0]]: (
      <SliderMarkContainer>{currentMasteryRange[0]}%</SliderMarkContainer>
    ),
    [currentMasteryRange[1]]: (
      <SliderMarkContainer>{currentMasteryRange[1]}%</SliderMarkContainer>
    ),
  }

  return (
    <MasteryRangeContainer>
      <FilterSubHeadingContainer>
        Standards mastery range{' '}
        <CustomTableTooltip
          title={
            <TooltipContainer>
              Choose standards needing improvement by using the mastery range.
              For example, selecting 0-30% will filter and display standards
              with mastery below 30% for each student in the right-side table.
            </TooltipContainer>
          }
          getCellContents={() => <IconInfoCircle width="16px" height="16px" />}
        />
      </FilterSubHeadingContainer>
      <StyledSlider
        range
        value={currentMasteryRange}
        onChange={updateMasteryRange}
        min={0}
        max={100}
        marks={marks}
        open={false}
      />
    </MasteryRangeContainer>
  )
}

export default MasteryRangeFilter

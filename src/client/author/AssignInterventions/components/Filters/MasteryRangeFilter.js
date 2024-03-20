import React, { useCallback, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import { IconInfoCircle } from '@edulastic/icons'
import {
  FilterSubHeadingContainer,
  StyledSlider,
  SliderMarkContainer,
  MasteryRangeContainer,
  SLIDER_READING_MIN_SEPARATION,
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

  const marks = useMemo(() => {
    const separation = currentMasteryRange[1] - currentMasteryRange[0]

    if (separation >= SLIDER_READING_MIN_SEPARATION) {
      return {
        [currentMasteryRange[0]]: (
          <SliderMarkContainer>{currentMasteryRange[0]}%</SliderMarkContainer>
        ),
        [currentMasteryRange[1]]: (
          <SliderMarkContainer>{currentMasteryRange[1]}%</SliderMarkContainer>
        ),
      }
    }

    const averageValue = (currentMasteryRange[1] + currentMasteryRange[0]) / 2

    let lowerTickPosition = averageValue - SLIDER_READING_MIN_SEPARATION / 2
    let upperTickPosition = averageValue + SLIDER_READING_MIN_SEPARATION / 2

    if (lowerTickPosition < 0) {
      upperTickPosition -= lowerTickPosition
      lowerTickPosition = 0
    } else if (upperTickPosition > 100) {
      lowerTickPosition -= upperTickPosition - 100
      upperTickPosition = 100
    }

    return {
      [lowerTickPosition]: (
        <SliderMarkContainer>{currentMasteryRange[0]}%</SliderMarkContainer>
      ),
      [upperTickPosition]: (
        <SliderMarkContainer>{currentMasteryRange[1]}%</SliderMarkContainer>
      ),
    }
  }, [currentMasteryRange])

  return (
    <MasteryRangeContainer>
      <FilterSubHeadingContainer>
        Standards mastery range{' '}
        <CustomTableTooltip
          title={
            <TooltipContainer isLight>
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

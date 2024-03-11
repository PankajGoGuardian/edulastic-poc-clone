import React, { useCallback, useState } from 'react'
import { debounce } from 'lodash'
import {
  FilterSubHeadingContainer,
  StyledSlider,
  SliderMarkContainer,
  MasteryRangeContainer,
} from './style'

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
        Standards mastery range
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

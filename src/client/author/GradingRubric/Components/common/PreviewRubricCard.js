import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { FlexContainer, FieldLabel } from '@edulastic/common'
import {
  themeColorBlue,
  white,
  greyThemeDark1,
  darkOrange,
} from '@edulastic/colors'
import { calculateScore } from './helper'

const RatingComp = ({ data, selected, onClick }) => (
  <Tooltip title={data.name}>
    <RatingButton
      data-cy="ratingCard"
      isGhost
      isBlue
      width="38px"
      height="38px"
      ml="4px"
      selected={selected}
      onClick={onClick}
    >
      {data.points}
    </RatingButton>
  </Tooltip>
)

const PreviewRubricCard = ({
  rubricData,
  rubricFeedback,
  onChange,
  onChangeScore,
  clearRubricFeedback,
  InputType,
  inputScore,
  showWarningToClear,
}) => {
  const INITIAL_RUB_FEEDBACK = {}
  const [selectedRatings, setSelectedRatings] = useState(INITIAL_RUB_FEEDBACK)

  const { criteria, name } = rubricData

  const handleClickRatingBtn = (criteriaId, ratingId) => {
    const selectedData = { ...selectedRatings }
    if (selectedData[criteriaId] === ratingId) {
      delete selectedData[criteriaId]
    } else {
      selectedData[criteriaId] = ratingId
    }
    setSelectedRatings(selectedData)
    onChangeScore(
      calculateScore(rubricData, selectedData),
      InputType.RubricsScore
    )
  }

  useEffect(() => {
    if (isEmpty(rubricFeedback)) {
      setSelectedRatings(INITIAL_RUB_FEEDBACK)
    } else {
      setSelectedRatings(rubricFeedback)
    }
  }, [rubricFeedback])

  // clears rubric selection on score change by score-input
  useEffect(() => {
    if (clearRubricFeedback) {
      setSelectedRatings(INITIAL_RUB_FEEDBACK)
    }
  }, [clearRubricFeedback])

  /**
   * @see https://snapwiz.atlassian.net/browse/EV-26319
   * call update score api only after user moves out of rubric scoring block
   */
  const handleBlur = () => {
    // when input score exists or greater than zero keep the score
    if (inputScore > 0 && isEmpty(selectedRatings)) return
    onChange({
      score: calculateScore(rubricData, selectedRatings),
      rubricFeedback: selectedRatings,
      rubricId: rubricData._id,
    })
  }

  return (
    <div data-cy="rubric-ratings" onBlur={handleBlur} tabIndex={-1}>
      {/* show warning to clear rubric when score input is being used */}
      {showWarningToClear && !isEmpty(selectedRatings) && (
        <WarningLabel> This will clear the rubric selection. </WarningLabel>
      )}
      <RubrickName data-cy="rubricName">{name}</RubrickName>
      {(criteria || []).map((c) => (
        <CriteriaRow data-cy="criteriaRow" key={c.id}>
          <TwoLineEllipsis>{c.name}</TwoLineEllipsis>
          <FlexContainer justifyContent="flex-start" flexWrap="wrap">
            {(c.ratings || []).map((rating) => (
              <RatingComp
                key={rating.id}
                data={rating}
                selected={selectedRatings[c.id] === rating.id}
                onClick={() => handleClickRatingBtn(c.id, rating.id)}
              />
            ))}
          </FlexContainer>
        </CriteriaRow>
      ))}
    </div>
  )
}

export default PreviewRubricCard

const RatingButton = styled.div`
  min-width: 35px;
  height: 35px;
  margin-right: 4px;
  margin-bottom: 4px;
  font-weight: ${(props) => props.theme.bold};
  font-size: 18px;
  border-radius: 4px;
  border: 1px solid ${themeColorBlue};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  padding: 0px 4px;

  &:nth-child(5n) {
    margin-right: 0px;
  }

  color: ${({ selected }) => (selected ? white : greyThemeDark1)};
  background: ${({ selected }) => (selected ? themeColorBlue : white)};

  &:hover {
    color: ${white};
    background: ${themeColorBlue};
  }

  transition: all 0.3s;
`

const CriteriaRow = styled.div`
  margin-bottom: 8px;
`

const TwoLineEllipsis = styled(FieldLabel)`
  overflow: hidden;
  position: relative;
  line-height: 1.2em;
  max-height: 2.4em;
  white-space: normal;
  word-break: break-all;

  &::before {
    content: '...';
    position: absolute;
    right: -1px;
    bottom: 0px;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    width: 1em;
    height: 1em;
    margin-top: 0.2em;
    background: white;
  }
`

const RubrickName = styled(FieldLabel)`
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`
const WarningLabel = styled.p`
  font-size: 12px;
  font-style: italic;
  color: ${darkOrange};
  font-weight: 600;
  margin-bottom: 7px;
`

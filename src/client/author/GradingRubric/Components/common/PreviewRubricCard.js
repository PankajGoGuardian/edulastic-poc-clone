import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Tooltip } from 'antd'
import { FlexContainer, FieldLabel, Label } from '@edulastic/common'
import {
  themeColorBlue,
  lightGreen5,
  white,
  greyThemeDark1,
  lightGrey11,
  fadedGreen1,
} from '@edulastic/colors'
import { calculateScore } from './helper'

const RatingComp = ({ data, selected, onClick, isExpressGrader }) =>
  isExpressGrader ? (
    <RatingCard onClick={onClick} selected={selected}>
      <RatingLabel>{data.name}</RatingLabel>
      <RatingLabel dangerouslySetInnerHTML={{ __html: data.desc }} />
      <RatingPoints>{`${data.points} pts`}</RatingPoints>
    </RatingCard>
  ) : (
    <Tooltip title={data.name}>
      <RatingButton
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
  isExpressGrader,
}) => {
  const [selectedRatings, setSelectedRatings] = useState({})

  const { criteria, name } = rubricData

  const handleClickRatingBtn = (criteriaId, ratingId) => {
    const selectedData = { ...selectedRatings }
    if (selectedData[criteriaId] === ratingId) {
      delete selectedData[criteriaId]
    } else {
      selectedData[criteriaId] = ratingId
    }
    setSelectedRatings(selectedData)

    onChange({
      score: calculateScore(rubricData, selectedData),
      rubricFeedback: selectedData,
    })
  }

  useEffect(() => {
    if (rubricFeedback) {
      setSelectedRatings(rubricFeedback)
    }
  }, [rubricFeedback])

  return (
    <div data-cy="rubric-ratings">
      {isExpressGrader && <RubricName>{name}</RubricName>}
      {(criteria || []).map((c) => (
        <CriteriaRow key={c.id}>
          <FieldLabel color={isExpressGrader && lightGrey11}>
            {c.name}
          </FieldLabel>
          <FlexContainer justifyContent="flex-start" flexWrap="wrap">
            {(c.ratings || []).map((rating) => (
              <RatingComp
                key={rating.id}
                data={rating}
                isExpressGrader={isExpressGrader}
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
  width: 38px;
  height: 38px;
  margin-left: 4px;
  font-weight: ${(props) => props.theme.bold};
  font-size: 18px;
  border-radius: 4px;
  border: 1px solid ${themeColorBlue};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:first-child {
    margin-left: 0px;
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

const RubricName = styled(Label)`
  font-weight: ${(props) => props.theme.bold};
  color: ${greyThemeDark1};
  margin-bottom: 8px;
`

const selectedCard = css`
  box-shadow: none;
  background: ${fadedGreen1};
`
const RatingCard = styled.div`
  width: 90px;
  height: 65px;
  border-radius: 2px;
  margin-right: 8px;
  margin-bottom: 8px;
  user-select: none;
  cursor: pointer;
  padding: 10px 7px;
  box-shadow: 0px 2px 5px #00000029;
  ${({ selected }) => selected && selectedCard};

  &:hover {
    ${selectedCard}
  }
`

const RatingLabel = styled.div`
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 10px;

  & p {
    padding: 2px 0px !important;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`

const RatingPoints = styled.div`
  text-transform: uppercase;
  color: ${lightGreen5};
  font-size: 12px;
  font-weight: ${(props) => props.theme.bold};
`

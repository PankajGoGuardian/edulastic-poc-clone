import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  lightGreen3,
  themeColor,
  greyScoreCardTitleColor,
  boxShadowColor3,
  fadedRed,
  red,
} from '@edulastic/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { calculateScore } from './helper'

const RatingCards = ({
  criteria,
  isDisabled,
  selectedRatings,
  handleRatingSelection,
}) => {
  const [hasScroll, setHasScroll] = useState()
  const contRef = useRef()
  const psRef = contRef.current?._ps || {}
  const timerRef = useRef()

  const handleClickRating = (ratingId) => () => {
    !isDisabled && handleRatingSelection(criteria.id, ratingId)
  }

  const handleMouseUp = () => {
    clearInterval(timerRef.current)
  }

  const handleMouseDown = (dir) => () => {
    if (psRef?.element && psRef?.reach?.x !== dir) {
      timerRef.current = setInterval(() => {
        psRef.element.scrollBy({
          left: dir === 'end' ? 10 : -10,
        })
      }, 10)
    }
  }

  useEffect(() => {
    if (psRef) {
      setHasScroll(psRef?.contentWidth > psRef?.containerWidth)
    } else {
      setHasScroll(false)
    }
  }, [psRef?.contentWidth, psRef?.containerWidth])

  return (
    <RatingContainer>
      {hasScroll && (
        <PrevBtn
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown('start')}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </PrevBtn>
      )}
      <RatingScrollContainer
        options={{
          suppressScrollY: true,
          useBothWheelAxes: true,
        }}
        ref={contRef}
      >
        {criteria.ratings.map((rating) => (
          <RatingSection
            data-cy="ratingCards"
            onClick={handleClickRating(rating.id)}
            selected={selectedRatings[criteria.id] == rating.id}
            isDisabled={isDisabled}
            key={rating.id}
          >
            <div>
              <div data-cy="ratingName">{rating.name}</div>
              <div
                className="points"
                data-cy="ratingPoint"
              >{`${rating.points} pts`}</div>
            </div>
            <div
              data-cy="ratingDesc"
              dangerouslySetInnerHTML={{ __html: rating.desc }}
            />
          </RatingSection>
        ))}
      </RatingScrollContainer>
      {hasScroll && (
        <NextBtn onMouseUp={handleMouseUp} onMouseDown={handleMouseDown('end')}>
          <FontAwesomeIcon icon={faAngleRight} />
        </NextBtn>
      )}
    </RatingContainer>
  )
}

const PreviewRubricTable = ({
  data,
  handleChange,
  rubricFeedback,
  isDisabled = false,
  validateRubricResponse = false,
}) => {
  const [selectedRatings, setSelectedRatings] = useState({})

  const handleRatingSelection = (criteriaId, ratingId) => {
    const selectedData = { ...selectedRatings }
    selectedData[criteriaId] = ratingId
    setSelectedRatings(selectedData)
    handleChange({
      score: calculateScore(data, selectedData),
      rubricFeedback: selectedData,
      rubricId: data._id,
    })
  }

  useEffect(() => {
    if (rubricFeedback) {
      setSelectedRatings(rubricFeedback)
    }
  }, [rubricFeedback, isDisabled])

  const getContent = () =>
    data?.criteria?.map((c, i) => (
      <CriteriaWrapper
        data-cy="previewCriteria"
        key={c?.id || i}
        showError={
          !Object.keys(selectedRatings).includes(c?.id) &&
          validateRubricResponse
        }
      >
        <CriteriaSection>
          <div data-cy="criteriaName">{c?.name}</div>
        </CriteriaSection>
        <RatingCards
          criteria={c}
          isDisabled={isDisabled}
          selectedRatings={selectedRatings}
          handleRatingSelection={handleRatingSelection}
        />
      </CriteriaWrapper>
    ))

  return (
    <PerfectScrollbar
      options={{
        suppressScrollX: true,
      }}
      style={{ maxHeight: '600px', width: '100%' }}
    >
      <Container>{getContent()}</Container>
    </PerfectScrollbar>
  )
}

export default PreviewRubricTable

const CriteriaSection = styled.div`
  white-space: normal;
  text-align: left;
  padding: 0px 42px;
  color: ${greyScoreCardTitleColor};
  > div:first-child {
    margin-bottom: 15px;
    font-weight: ${(props) => props.theme.bold};
    text-transform: uppercase;
    font-size: ${(props) => props.theme.questionTextlargeFontSize};
  }
`

const RatingSection = styled.div`
  min-width: 175px;
  min-height: 100px;
  margin-right: 10px;
  padding: 5px 10px;
  white-space: normal;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  box-shadow: 0px 2px 5px ${boxShadowColor3};
  border-radius: 2px;
  background: ${({ selected }) => (selected ? lightGreen3 : 'inherit')};
  > div:first-child {
    font-weight: ${(props) => props.theme.semiBold};
    margin-bottom: 7px;
    font-size: ${(props) => props.theme.questionTextsmallFontSize};
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
  }
  .points {
    text-transform: uppercase;
    color: ${themeColor};
    font-size: ${(props) => props.theme.keyboardFontSize};
    font-weight: ${(props) => props.theme.bold};
    margin-left: 5px;
  }
`

const Container = styled.div`
  padding: 5px 0px;
`

const CriteriaWrapper = styled.div`
  box-shadow: ${({ showError }) =>
    showError ? `0px 0px 2px 2px ${fadedRed}` : 'none'};
  border: ${({ showError }) => (showError ? `1px solid ${red}` : 'none')};
  margin-bottom: 10px;
  border-radius: 8px;
`

const RatingContainer = styled.div`
  position: relative;
  padding: 0px 42px;
`

const RatingScrollContainer = styled(PerfectScrollbar)`
  padding: 2px 3px 12px 3px;
  white-space: nowrap;
  display: flex;
`

const NavBtn = styled.div`
  width: 35px;
  height: 35px;
  background-color: transparent;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  font-size: 26px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #878a91;

  &:hover {
    background-color: ${themeColor};
    color: #fff;
  }
`

const PrevBtn = styled(NavBtn)`
  left: 4px;
`

const NextBtn = styled(NavBtn)`
  right: 4px;
`

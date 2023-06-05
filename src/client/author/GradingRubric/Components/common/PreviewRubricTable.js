import React, { useState, useEffect, useRef } from 'react'
import { withNamespaces } from '@edulastic/localization'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { EduIf } from '@edulastic/common'
import { calculateScore } from './helper'
import {
  CriteriaSection,
  RatingSection,
  Container,
  CriteriaWrapper,
  RatingContainer,
  RatingScrollContainer,
  PrevBtn,
  NextBtn,
  MessageContainer,
} from './PreviewRubricStyledComponents'

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
  isGradedExternally,
  aiEvaluationStatus,
  t: i18translate,
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
    <>
      <EduIf
        condition={[aiEvaluationStatus, !isGradedExternally].every((o) => !!o)}
      >
        <MessageContainer>
          {i18translate('component.feedbackGradeHaveToBeSaved')}
        </MessageContainer>
      </EduIf>
      <PerfectScrollbar
        options={{
          suppressScrollX: true,
        }}
        style={{ maxHeight: '600px', width: '100%' }}
      >
        <Container>{getContent()}</Container>
      </PerfectScrollbar>
    </>
  )
}

export default withNamespaces('assessment')(PreviewRubricTable)

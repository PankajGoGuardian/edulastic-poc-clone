import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { v4 } from 'uuid'
import produce from 'immer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faTrash } from '@fortawesome/free-solid-svg-icons'
import {
  CriteriaContainer,
  CriteriaDetails,
  AddRatingSection,
  RatingSection,
  DeleteCriteria,
  CiteriaActionsContainer,
  CriteriaHeader,
  RatingWrapper,
} from '../styled'
import Rating from './Rating'
import TextInput from './common/TextInput'
import { updateRubricDataAction, getCurrentRubricDataSelector } from '../ducks'
import { CustomStyleBtn } from '../../../assessment/styled/ButtonStyles'

const Criteria = ({
  data,
  id,
  currentRubricData,
  updateRubricData,
  isEditable,
}) => {
  let scrollBarRef
  let intervalId = null
  const generateRatingData = (index) => ({
    name: `Rating ${index}`,
    desc: '',
    id: v4(),
    points: 0,
  })

  const [selectedRatingToExpand, setSelectedRatingToExpand] = useState('')

  const handleOnClickExpand = (ratingId) => {
    setSelectedRatingToExpand((prevState) => {
      if (prevState !== ratingId) {
        return ratingId
      }
      return ''
    })
  }

  const getRatings = () =>
    data.ratings.map((rating, index, arr) => (
      <Rating
        key={rating.id}
        id={rating.id}
        parentId={id}
        data={rating}
        isEditable={isEditable}
        className={index + 1 === arr.length ? 'last-rating' : ''}
        handleOnClickExpand={handleOnClickExpand}
        selectedRatingToExpand={selectedRatingToExpand}
        criteria={data}
      />
    ))

  const scrollToRight = () => {
    let diff =
      scrollBarRef._container.scrollWidth -
      scrollBarRef._container.clientWidth -
      scrollBarRef._container.scrollLeft
    if (diff) {
      const incrementValue = diff / 40
      intervalId = setInterval(() => {
        if (diff > 0 && scrollBarRef) {
          diff -= incrementValue
          if (diff <= 0)
            scrollBarRef._container.scrollLeft =
              scrollBarRef._container.scrollWidth -
              scrollBarRef._container.clientWidth
          else scrollBarRef._container.scrollLeft += incrementValue
        } else clearInterval(intervalId)
      }, 20)
    }
  }

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    scrollToRight()
  }, [data.ratings.length])

  useEffect(() => () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  })

  const handleAddRating = () => {
    const clonedRubricData = produce(currentRubricData, (draft) => {
      draft.criteria
        .find((c) => c.id === id)
        .ratings.push(generateRatingData(data.ratings.length + 1))
    })
    updateRubricData(clonedRubricData)
  }

  const handleDuplicate = () => {
    const copyData = {
      ...data,
      id: v4(),
      ratings: data.ratings.map((rating) => ({
        ...rating,
        id: v4(),
      })),
    }

    const updatedRubricData = produce(currentRubricData, (draft) => {
      draft.criteria.push(copyData)
    })
    updateRubricData(updatedRubricData)
  }

  const handleDelete = () => {
    const updatedRubricData = produce(currentRubricData, (draft) => {
      const criteria = draft.criteria.filter((c) => c.id !== id)
      draft.criteria = criteria
    })
    updateRubricData(updatedRubricData)
  }

  return (
    <CriteriaContainer isEditable={isEditable} data-cy="criteria">
      <CriteriaHeader>
        <CriteriaDetails>
          <div data-cy="criteriaName">
            <TextInput
              id={id}
              isEditable={isEditable}
              textType="text"
              componentFor="Criteria"
              value={data.name}
              width="100%"
            />
          </div>
        </CriteriaDetails>
        <CiteriaActionsContainer>
          {isEditable && (
            <CustomStyleBtn
              margin="0px"
              title="Clone"
              data-cy="cloneCriteria"
              onClick={handleDuplicate}
            >
              <FontAwesomeIcon icon={faClone} aria-hidden="true" />
              Clone Criteria
            </CustomStyleBtn>
          )}
          {currentRubricData.criteria.length > 1 && isEditable && (
            <DeleteCriteria
              className="delete-critera-button"
              title="Delete"
              data-cy="deleteCriteria"
              onClick={handleDelete}
            >
              <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
            </DeleteCriteria>
          )}
        </CiteriaActionsContainer>
      </CriteriaHeader>
      <RatingWrapper>
        <RatingSection
          isEditable={isEditable}
          ref={(ref) => {
            scrollBarRef = ref
          }}
        >
          {getRatings()}
        </RatingSection>
        {isEditable && (
          <AddRatingSection>
            <div
              className="add-rating-button"
              data-cy="addRating"
              onClick={handleAddRating}
            >
              <span>
                <Icon type="plus" />
              </span>
              <span>Add Rating</span>
            </div>
          </AddRatingSection>
        )}
      </RatingWrapper>
    </CriteriaContainer>
  )
}

export default connect(
  (state) => ({
    currentRubricData: getCurrentRubricDataSelector(state),
  }),
  {
    updateRubricData: updateRubricDataAction,
  }
)(Criteria)

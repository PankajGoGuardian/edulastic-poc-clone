import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import produce from 'immer'
import { RatingContaner, DeleteRating } from '../styled'
import TextInput from './common/TextInput'
import { updateRubricDataAction, getCurrentRubricDataSelector } from '../ducks'

const Rating = ({
  data,
  id,
  parentId,
  currentRubricData,
  updateRubricData,
  isEditable,
  className,
}) => {
  const ratingRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isExpand, setIsExpand] = useState(false)
  const allRatings = currentRubricData.criteria.find((c) => c.id === parentId)
    .ratings
  const handleDelete = () => {
    const updatedRubricData = produce(currentRubricData, (draft) => {
      draft.criteria.map((criteria) => {
        if (criteria.id === parentId) {
          const ratings = criteria.ratings.filter((r) => r.id !== id)
          criteria.ratings = ratings
        }
        return criteria
      })
    })
    updateRubricData(updatedRubricData)
  }

  const onExpand = () => {
    if (isFocused) {
      setIsExpand(true)
    }
  }

  const onCollapse = () => {
    ratingRef?.current?.click()
    ratingRef?.current?.focus()
    setIsExpand(false)
  }

  useEffect(() => {
    if (!isExpand) {
      ratingRef?.current?.click()
      ratingRef?.current?.focus()
    }
  }, [isExpand])

  const onFocus = () => {
    setIsFocused(true)
    setIsExpand(true)
  }
  const onBlur = () => {
    setIsFocused(false)
  }

  return (
    <RatingContaner
      className={className}
      data-cy="ratingContainer"
      onMouseLeave={onCollapse}
      style={{
        ...(isExpand
          ? { width: '800px', position: 'absolute', left: '0px', zIndex: 999 }
          : {}),
      }}
    >
      <div>
        <button style={{ position: 'absolute' }} ref={ratingRef}>
          Dummy
        </button>
        <span data-cy="ratingName">
          <TextInput
            id={id}
            parentId={parentId}
            isEditable={isEditable}
            textType="text"
            componentFor="Rating"
            value={data.name}
          />
        </span>
        {allRatings.length > 2 && isEditable && (
          <DeleteRating
            className="delete-rating-button"
            title="Delete"
            data-cy="deleteRating"
            onClick={handleDelete}
          >
            <Icon type="close" />
          </DeleteRating>
        )}
        <span data-cy="rating">
          <TextInput
            id={id}
            parentId={parentId}
            isEditable={isEditable}
            textType="number"
            componentFor="Rating"
            value={data.points}
          />
        </span>
      </div>
      <div data-cy="ratingDescription" onMouseEnter={onExpand}>
        <TextInput
          id={id}
          parentId={parentId}
          isEditable={isEditable}
          textType="textarea"
          componentFor="Rating"
          value={data.desc}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    </RatingContaner>
  )
}

export default connect(
  (state) => ({
    // questionData: getQuestionDataSelector(state)
    currentRubricData: getCurrentRubricDataSelector(state),
  }),
  {
    // setQuestionData: setQuestionDataAction
    updateRubricData: updateRubricDataAction,
  }
)(Rating)

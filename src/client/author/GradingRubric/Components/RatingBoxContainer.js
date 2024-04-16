import React from 'react'

import { Icon } from 'antd'

import { IconCollapse, IconExpand } from '@edulastic/icons'
import {
  EduButton,
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
} from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { RatingContainer, DeleteRating, IconExpandWrapper } from '../styled'
import TextInput from './common/TextInput'

const RatingBox = ({
  isFullScreen,
  className,
  id,
  parentId,
  isEditable,
  data,
  allRatings,
  handleDelete,
  selectedRatingToExpand,
  handleOnClickExpand,
  handleOnCancel,
}) => {
  return (
    <RatingContainer
      className={className}
      data-cy="ratingContainer"
      isFullScreen={isFullScreen}
    >
      <div>
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

        <EduIf condition={allRatings.length > 2 && isEditable}>
          <DeleteRating
            className="delete-rating-button"
            title="Delete"
            data-cy="deleteRating"
            onClick={handleDelete}
          >
            <Icon type="close" />
          </DeleteRating>
        </EduIf>

        <EduIf condition={isEditable}>
          <IconExpandWrapper>
            <EduIf condition={selectedRatingToExpand === id}>
              <EduThen>
                <IconCollapse
                  color={themeColor}
                  onClick={() => handleOnClickExpand(id)}
                />
              </EduThen>
              <EduElse>
                <IconExpand
                  color={themeColor}
                  onClick={() => handleOnClickExpand(id)}
                />
              </EduElse>
            </EduIf>
          </IconExpandWrapper>
        </EduIf>

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
      <div data-cy="ratingDescription">
        <TextInput
          id={id}
          parentId={parentId}
          isEditable={isEditable}
          textType="textarea"
          componentFor="Rating"
          value={data.desc}
          isFullScreen={isFullScreen}
        />
      </div>
      <EduIf condition={isFullScreen}>
        <FlexContainer justifyContent="flex-end" padding="0px 14px 14px 14px">
          <EduButton isGhost onClick={() => handleOnCancel()}>
            cancel
          </EduButton>
          <EduButton onClick={() => handleOnClickExpand(id)}>save</EduButton>
        </FlexContainer>
      </EduIf>
    </RatingContainer>
  )
}

export default RatingBox

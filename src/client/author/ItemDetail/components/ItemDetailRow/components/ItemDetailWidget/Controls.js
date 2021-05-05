import React, { useMemo } from 'react'
import { Button, Popover } from 'antd'
import { NumberInputStyled, FieldLabel } from '@edulastic/common'
import { IconMoveArrows, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { PointsInputWrapper, ItemLevelScoringDesc } from './styled'

const EditButton = ({ onEdit }) => {
  return (
    <Button onClick={onEdit} data-cy="editQuestion">
      <IconPencilEdit width={16} height={16} />
    </Button>
  )
}

const DeleteButton = ({ onDelete }) => {
  return (
    <Button onClick={onDelete} data-cy="deleteQuestion">
      <IconTrash width={16} height={16} />
    </Button>
  )
}

const MoveButton = () => {
  return (
    <Button data-cy="dragHandel">
      <IconMoveArrows width={16} height={16} />
    </Button>
  )
}

const PointInput = ({
  value,
  onChange,
  visible,
  disabled,
  isRubricQuestion,
  itemLevelScoring,
}) => {
  if (!visible) {
    return null
  }

  const desc = (
    <ItemLevelScoringDesc>
      {isRubricQuestion
        ? 'This Question has Grading Rubric attached to it, so points cannot be changed for this question, and it will be equal to the max score of the rubric.'
        : 'Total points will be divided equally among the below parts. If you want custom points for different parts, please click on Layout and Grading and switch to part level scoring.'}
    </ItemLevelScoringDesc>
  )

  const PopoverComponent = itemLevelScoring ? Popover : React.Fragment
  const popoverProps = useMemo(() => {
    return itemLevelScoring ? { content: desc, placement: 'bottomRight' } : {}
  }, [itemLevelScoring])

  return (
    <PointsInputWrapper itemLevelScoring={itemLevelScoring}>
      <FieldLabel marginBottom="0px" mr="10px">
        {itemLevelScoring && 'Total'} Points
      </FieldLabel>
      <PopoverComponent {...popoverProps}>
        <NumberInputStyled
          min={0.5}
          step={0.5}
          width="64px"
          padding="0px 2px"
          disabled={disabled}
          value={disabled && !isRubricQuestion ? '' : value}
          onChange={onChange}
          data-cy="point-update"
        />
      </PopoverComponent>
    </PointsInputWrapper>
  )
}

export default {
  Edit: EditButton,
  Delete: DeleteButton,
  Move: MoveButton,
  Point: PointInput,
}

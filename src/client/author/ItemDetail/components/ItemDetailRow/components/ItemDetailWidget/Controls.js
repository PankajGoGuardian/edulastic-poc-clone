import React, { useMemo } from 'react'
import { Button, Popover } from 'antd'
import { NumberInputStyled, FieldLabel } from '@edulastic/common'
import { IconMoveArrows, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { PointsInputWrapper, ItemLevelScoringDesc } from './styled'

const EditButton = ({ onEdit }) => {
  return (
    <Button onClick={onEdit}>
      <IconPencilEdit width={16} height={16} />
    </Button>
  )
}

const DeleteButton = ({ onDelete }) => {
  return (
    <Button onClick={onDelete}>
      <IconTrash width={16} height={16} />
    </Button>
  )
}

const MoveButton = () => {
  return (
    <Button>
      <IconMoveArrows width={16} height={16} />
    </Button>
  )
}

const PointInput = ({ value, onChange, visible, disabled }) => {
  if (!visible) {
    return null
  }

  const desc = (
    <ItemLevelScoringDesc>
      This item is graded as a whole, to grade parts change the option using the
      Layout &amp; Grading options button in the header
    </ItemLevelScoringDesc>
  )

  const PopoverComponent = disabled ? Popover : React.Fragment
  const popoverProps = useMemo(() => {
    return disabled ? { content: desc, placement: 'bottomRight' } : {}
  }, [disabled])

  return (
    <PointsInputWrapper>
      <FieldLabel marginBottom="0px" mr="10px">
        Points
      </FieldLabel>
      <PopoverComponent {...popoverProps}>
        <NumberInputStyled
          min={0.5}
          step={0.5}
          width="64px"
          padding="0px 2px"
          disabled={disabled}
          value={disabled ? '' : value}
          onChange={onChange}
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

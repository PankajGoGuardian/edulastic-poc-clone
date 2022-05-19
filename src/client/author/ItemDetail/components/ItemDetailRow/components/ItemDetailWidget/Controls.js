import React from 'react'
import { Button, Popover, Tooltip } from 'antd'
import { NumberInputStyled, FieldLabel } from '@edulastic/common'
import {
  IconInfo,
  IconMoveArrows,
  IconPencilEdit,
  IconTrash,
} from '@edulastic/icons'
import {
  PointsInputWrapper,
  ItemLevelScoringDesc,
  TotalPointsWrapper,
} from './styled'

const EditButton = ({ onEdit, disabled, disabledReason }) => {
  return (
    <Tooltip title={disabled && disabledReason}>
      <Button onClick={onEdit} data-cy="editQuestion" disabled={disabled}>
        <IconPencilEdit width={16} height={16} />
      </Button>
    </Tooltip>
  )
}

const DeleteButton = ({ onDelete, disabled, disabledReason }) => {
  return (
    <Tooltip title={disabled && disabledReason}>
      <Button onClick={onDelete} data-cy="deleteQuestion" disabled={disabled}>
        <IconTrash width={16} height={16} />
      </Button>
    </Tooltip>
  )
}

const MoveButton = ({ disabled, disabledReason }) => {
  return (
    <Tooltip title={disabled && disabledReason}>
      <Button data-cy="dragHandel" disabled={disabled}>
        <IconMoveArrows width={16} height={16} />
      </Button>
    </Tooltip>
  )
}

const TotalPointsInput = ({
  value,
  onChange,
  disabled,
  isPassage,
  visible,
  itemLevelScoring,
  onShowSettings = () => {},
}) => {
  if (!visible) {
    return null
  }

  const desc = (
    <ItemLevelScoringDesc data-cy="totalPointToolTipDesc">
      Total points will be divided equally among the below parts. If you want
      custom points for different parts, please switch to “Part Level Scores”
      from <a onClick={onShowSettings}>Layout and Grading.</a>
    </ItemLevelScoringDesc>
  )

  const PopoverComponent = itemLevelScoring ? Popover : React.Fragment
  return (
    <TotalPointsWrapper className="total-points-wrapper">
      <FieldLabel fs={isPassage ? '10px' : '11px'} marginBottom="0px" mr="10px">
        Total Points {isPassage && <br />} (All Parts)
      </FieldLabel>
      {itemLevelScoring && (
        <PopoverComponent
          content={desc}
          placement="bottomRight"
          getPopupContainer={(e) => e.parentNode}
        >
          <IconInfo />
        </PopoverComponent>
      )}
      <NumberInputStyled
        min={0.5}
        step={0.5}
        width="64px"
        padding="0px 2px"
        margin="0px 0px 0px 10px"
        disabled={disabled}
        value={disabled ? '' : value}
        onChange={onChange}
        data-cy="total-point-update"
      />
    </TotalPointsWrapper>
  )
}

const PointInput = ({
  value,
  pointInputMinValue,
  onChange,
  disabled,
  isRubricQuestion,
  itemLevelScoring,
  visible,
  onShowSettings = () => {},
}) => {
  if (!visible) {
    return null
  }
  const isDisabled = itemLevelScoring || isRubricQuestion
  const msgWithLink = (
    <>
      This item is evaluated as a whole, to evaluate parts separately and have
      custom points for different parts please switch to “Part Level Scores”
      from <a onClick={onShowSettings}>Layout and Grading.</a>
    </>
  )

  const desc = (
    <ItemLevelScoringDesc data-cy="partLevelScoringDesc">
      {isRubricQuestion
        ? 'This Question has Grading Rubric attached to it, so points cannot be changed for this question, and it will be equal to the max score of the rubric.'
        : msgWithLink}
    </ItemLevelScoringDesc>
  )

  return (
    <PointsInputWrapper
      className="points-input-wrapper"
      itemLevelScoring={itemLevelScoring}
    >
      <FieldLabel marginBottom="0px" mr="10px">
        Points
      </FieldLabel>
      {isDisabled && (
        <Popover content={desc} placement="bottomRight">
          <IconInfo />
        </Popover>
      )}
      <NumberInputStyled
        type="number"
        min={pointInputMinValue}
        step={0.5}
        width="64px"
        padding="0px 2px"
        margin="0px 0px 0px 10px"
        disabled={isDisabled}
        value={disabled && !isRubricQuestion ? '' : value}
        onChange={onChange}
        onBlur={(e) => onChange(parseFloat(e?.target?.value, 10), true)}
        data-cy="point-update"
      />
    </PointsInputWrapper>
  )
}

export default {
  Edit: EditButton,
  Delete: DeleteButton,
  Move: MoveButton,
  Point: PointInput,
  TotalPoints: TotalPointsInput,
}

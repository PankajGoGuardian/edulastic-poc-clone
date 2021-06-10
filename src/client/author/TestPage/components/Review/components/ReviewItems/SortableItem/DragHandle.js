import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'
import { QuestionNumberLabel } from '@edulastic/common'
import { lightGrey9 } from '@edulastic/colors'
import { IconMoveArrows } from '@edulastic/icons'
import { DragHandler } from '../styled'

export const DragHandleComponent = ({ isEditable, indx }) => (
  <DragHandler>
    <QuestionNumberLabel width={36} height={26} fontSize="11px">
      {indx}
    </QuestionNumberLabel>
    {isEditable && <IconMoveArrows color={lightGrey9} width={14} height={14} />}
  </DragHandler>
)

export default React.memo(SortableHandle(DragHandleComponent))

import React from 'react'
import { sortableHandle } from 'react-sortable-hoc'
import { IconMoveArrows } from '@edulastic/icons'
import { lightGrey9 } from '@edulastic/colors'
import { StyledVideoQuizHandleSpan } from '../styled-components/Questions'

const DragHandle = sortableHandle(({ questionIndex }) => {
  return (
    <StyledVideoQuizHandleSpan data-cy={`handel${questionIndex}`}>
      <IconMoveArrows color={lightGrey9} width={19} height={19} />
    </StyledVideoQuizHandleSpan>
  )
})

export default DragHandle

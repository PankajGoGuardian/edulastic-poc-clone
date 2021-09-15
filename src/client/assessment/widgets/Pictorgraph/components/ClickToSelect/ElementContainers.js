import React, { useContext } from 'react'

import { notification } from '@edulastic/common'

import DroppedChoices from './DroppedChoices'
import { ElementContainerWrapper } from './styled'
import ClickToSelectContext from '../../context/clickToSelect'
import ElementContainer from './ElementContainer'

export default function ElementContainers({
  droppedChoices,
  classificationId,
  responses,
  minHeight,
  elementContainers,
  answers,
  evaluationHighlights,
}) {
  const { handleClick: onClickCallback, currentSelection } = useContext(
    ClickToSelectContext
  )

  const handleClick = (index) => () => {
    if (onClickCallback) {
      if (!currentSelection) {
        notification({ msg: 'Please select a choice', duration: 1.0 })
        return null
      }

      onClickCallback(
        { from: index, fromColumnId: classificationId },
        { flag: 'clickToSelect' }
      )
    }
  }

  return (
    <ElementContainerWrapper
      bgColor={evaluationHighlights?.[classificationId]}
      minHeight={minHeight}
    >
      <DroppedChoices
        choices={droppedChoices}
        classificationId={classificationId}
        responses={responses}
      />
      {Array.from({ length: elementContainers }).map((_, index) => (
        <ElementContainer
          index={index}
          onClick={handleClick(index)}
          responses={responses}
          answers={answers}
        />
      ))}
    </ElementContainerWrapper>
  )
}

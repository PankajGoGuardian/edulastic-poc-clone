import React from 'react'
import keyBy from 'lodash/keyBy'

import { FlexContainer } from '@edulastic/common'

import { ColumnHeader, ColumnLabel } from '../../styled/Column'
import { ClickToSelectContainer } from './styled'
import ElementContainers from './ElementContainers'
import { IndexBox } from '../DragItem/styled/IndexBox'
import { getStemNumeration } from '../../../../utils/helpers'

export default function ClickToSelect({
  classifications,
  showClassName,
  droppedChoices,
  possibleResponses,
  elementContainers,
  answers,
  evaluationHighlights,
  isShowAnswer,
  stemNumeration,
}) {
  const responsesById = keyBy(possibleResponses, 'id')

  return (
    <FlexContainer>
      {classifications?.map(({ name, id, width, height, x, y }, index) => (
        <ClickToSelectContainer
          key={id}
          height="auto"
          width={width}
          x={x}
          y={y}
          isShowAnswer={isShowAnswer}
        >
          <FlexContainer>
            {isShowAnswer && (
              <IndexBox style={{ margin: 5 }}>
                {getStemNumeration(stemNumeration, index)}
              </IndexBox>
            )}
            {showClassName && (
              <ColumnHeader>
                <ColumnLabel dangerouslySetInnerHTML={{ __html: name || '' }} />
              </ColumnHeader>
            )}
          </FlexContainer>
          <ElementContainers
            droppedChoices={droppedChoices}
            classificationId={id}
            responses={responsesById}
            minHeight={height - 40}
            elementContainers={elementContainers}
            answers={answers[id]}
            evaluationHighlights={evaluationHighlights}
          />
        </ClickToSelectContainer>
      ))}
    </FlexContainer>
  )
}

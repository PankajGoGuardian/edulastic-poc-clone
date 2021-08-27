import { FlexContainer } from '@edulastic/common'
import React from 'react'
import { AnswerBox } from '../DragItem/styled/AnswerBox'
import { BorderedContainer } from './styled'

export default function DroppedChoices({
  choices,
  classificationId,
  responses,
}) {
  return (choices[classificationId] || []).map(({ id: choiceId }) => {
    const { image, unit, count } = responses[choiceId] || {}

    return (
      <BorderedContainer key={classificationId}>
        <FlexContainer
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <AnswerBox dangerouslySetInnerHTML={{ __html: image }} />
          <span>
            {count} {unit}
          </span>
        </FlexContainer>
      </BorderedContainer>
    )
  })
}

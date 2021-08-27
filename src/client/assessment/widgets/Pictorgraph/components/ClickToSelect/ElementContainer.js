import React, { useMemo } from 'react'

import { FlexContainer } from '@edulastic/common'

import { AnswerBox } from '../DragItem/styled/AnswerBox'
import { BorderedContainer } from './styled'

export default function ElementContainer({
  index,
  onClick,
  answers,
  responses,
}) {
  const fillValue = useMemo(() => {
    let value = null
    const answer = answers.find(
      ({ elementContainerIndex }) => elementContainerIndex === index
    )
    if (answer) {
      const { image, count, unit } = responses[answer.id]
      value = (
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
      )
    }

    return value
  }, [answers, responses])

  return (
    <BorderedContainer cursor="pointer" onClick={onClick}>
      {fillValue}
    </BorderedContainer>
  )
}

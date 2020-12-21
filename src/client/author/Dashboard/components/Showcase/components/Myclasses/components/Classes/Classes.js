import React from 'react'

// components
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'
import { CardContainer } from './styled'
import Card from '../Card'

const Classes = ({ activeClasses }) => {
  if (activeClasses.length === 0) {
    return null
  }

  return (
    <>
      <TextWrapper
        fw="bold"
        size="16px"
        color={title}
        style={{ marginBottom: '1rem' }}
      >
        My Classes
      </TextWrapper>
      <div>
        {activeClasses.map((item) => (
          <CardContainer key={item._id}>
            <Card data={item} />
          </CardContainer>
        ))}
      </div>
    </>
  )
}

export default Classes

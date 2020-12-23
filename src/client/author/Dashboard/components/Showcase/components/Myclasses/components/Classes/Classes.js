import { title } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import React from 'react'
import { TextWrapper } from '../../../../../styledComponents'
import Card from '../Card'
import { CardContainer } from './styled'

const Classes = ({ activeClasses, emptyBoxCount }) => {
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
      <FlexContainer justifyContent="space-between" flexWrap="wrap">
        {activeClasses.map((item) => (
          <CardContainer key={item._id}>
            <Card data={item} />
          </CardContainer>
        ))}
        {emptyBoxCount.map((index) => (
          <CardContainer emptyBox key={index} />
        ))}
      </FlexContainer>
    </>
  )
}

export default Classes

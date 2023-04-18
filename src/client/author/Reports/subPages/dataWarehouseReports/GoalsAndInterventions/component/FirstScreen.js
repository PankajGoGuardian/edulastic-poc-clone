import React from 'react'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { StyledEduButton } from '../../../../common/styled'

const FirstScreen = ({ content, onClick }) => {
  return (
    <Container>
      <h2>{content.list.join('\xa0\xa0>\xa0\xa0')}</h2>
      <p>{content.description}</p>
      <StyledEduButton data-cy="button" data-testid="button" onClick={onClick}>
        {content.buttonText}
      </StyledEduButton>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 500px;
  h2 {
    margin-bottom: 50px;
    font-weight: bold;
    color: ${themeColor};
  }
  p {
    margin-bottom: 10px;
  }
`

export default FirstScreen

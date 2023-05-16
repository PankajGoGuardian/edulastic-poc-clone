import React from 'react'
import styled from 'styled-components'
import { themeColor, greyThemeDark4 } from '@edulastic/colors'
import { StyledEduButton } from '../../../../../common/styled'

const FirstScreen = ({ content, onClick }) => {
  return (
    <>
      <p>{content.title}</p>
      <Container>
        <h2>{content.list.join('\xa0\xa0>\xa0\xa0')}</h2>
        <p>{content.description}</p>
        <StyledEduButton
          data-cy="button"
          data-testid="button"
          onClick={onClick}
        >
          {content.buttonText}
        </StyledEduButton>
      </Container>
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 500px;
  h2 {
    font-size: 16px;
    margin-bottom: 50px;
    font-weight: bold;
    color: ${themeColor};
  }
  p {
    margin-bottom: 10px;
    font-size: 14px;
    text-align: center;
    color: ${greyThemeDark4};
  }
`

export default FirstScreen

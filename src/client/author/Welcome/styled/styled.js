import { lightGreen11, pointColor } from '@edulastic/colors'
import styled from 'styled-components'

export const GreetingUser = styled.div`
  padding: 15px 0px;
  font-family: 'Open Sans';
  font-size: 36px;
  font-style: normal;
  font-weight: 800;
  margin-top: 10px;
  text-align: center;
  color: ${lightGreen11};
`

export const WelcomeHeader = styled.h3`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-top: 12px;
  margin-bottom: 0px;
  line-height: 33px;
`

export const WelcomeNote = styled.div`
  font-size: 16px;
  text-align: center;
  font-weight: 300;
  margin-bottom: 40px;
  line-height: 22px;
`

export const TitleHeader = styled.div`
  font-size: 24px;
  font-weight: 800;
  margin-top: 5px;
  margin-bottom: 0px;
  color: ${pointColor};
  line-height: 33px;
`

export const TitleParagraph = styled.div`
  font-size: 16px;
  font-weight: 300;
  line-height: 22px;
  color: #787878;
`

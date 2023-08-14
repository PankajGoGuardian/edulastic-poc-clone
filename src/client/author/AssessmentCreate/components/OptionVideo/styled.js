import styled from 'styled-components'
import { darkOrange1, themeColorBlue } from '@edulastic/colors'

export const Tag = styled.div`
  position: absolute;
  height: 23px;
  width: 44px;
  background-color: ${darkOrange1};
  color: #ffffff;
  left: 20px;
  top: 20px;
  border-radius: 2px;
  font: normal normal bold 10px/14px Open Sans;
  letter-spacing: 0.19px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const SnapQuiz = styled.div`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.largeFontSize};
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  span {
    color: ${(props) => props.theme.tagTextColor};
  }
`
export const StyledBetaTag = styled.div`
  height: 23px;
  width: 44px;
  font: normal normal bold 10px/14px Open Sans;
  letter-spacing: 0.19px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 5px;
  top: 0px;
  background-color: inherit;
  border: 1.5px solid ${themeColorBlue};
  color: ${themeColorBlue};
`

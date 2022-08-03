import styled from 'styled-components'

export const DynamicTestTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.largeFontSize};
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  span {
    color: ${(props) => props.theme.themeColorBlue};
  }
`

export const Tag = styled.div`
  position: absolute;
  height: 23px;
  width: 44px;
  background-color: #80ace9;
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
export const Footer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 30px;
  font: normal normal 600 11px/15px Open Sans;
  letter-spacing: 0.2px;
  color: #1ab395;
`

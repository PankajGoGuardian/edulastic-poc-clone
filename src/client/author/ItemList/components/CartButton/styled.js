import {
  mediumDesktopExactWidth,
  mobileWidthLarge,
  white,
  themeColorBlue,
  red,
} from '@edulastic/colors'
import { Tag } from 'antd'
import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  margin-left: 5px;
  ${(props) => (props.rightMargin ? 'margin-right: 5px;' : '')}
  display: flex;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'all')};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  transition: opacity 300ms ease-in-out;

  @media (min-width: ${mediumDesktopExactWidth}) {
    margin-left: 10px;
  }
`

export const ItemsAmount = styled.span`
  width: ${(props) => (props.threeDigit ? '30px' : '22px')};
  height: ${(props) => (props.threeDigit ? '25px' : '22px')};
  margin-left: 17px;
  text-align: center;
  border-radius: 50%;
  background: ${themeColorBlue};
  color: ${white};
  font-size: 14px;
  line-height: ${(props) => (props.threeDigit ? '25px' : '22px')};
  font-weight: bold;
  @media (max-width: ${mobileWidthLarge}) {
    display: block;
    position: absolute;
    top: -10px;
    right: -10px;
    margin: 0px;
    background: #42d184;
  }
`

export const StyledBetaTag = styled(Tag)`
  border-radius: 0px;
  top: -12px;
  right: -17px;
  background-color: ${white};
  border: 1.5px solid ${red};
  color: ${red};
  position: absolute;
  font-size: 10px;
`

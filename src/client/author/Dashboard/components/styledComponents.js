import styled from 'styled-components'
import Typography from "antd/es/typography";
import Icon from "antd/es/icon";
import { extraDesktopWidthMax } from '@edulastic/colors'

const { Text } = Typography

// shared styled components
export const TextWrapper = styled(Text)`
  color: ${(props) => (props.color ? props.color : '#444444')};
  font-size: ${(props) => (props.rfs ? props.rfs : '16px')};
  text-align: ${(props) => (props.textalign ? props.textalign : 'left')};
  display: inline-block;
  margin-bottom: ${(props) => (props.mb ? props.mb : '')};
  font-weight: ${(props) => (props.fw ? props.fw : 'normal')};
  padding: ${(props) => props.padding};
  line-height: ${(props) => props.lh || 'normal'};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${(props) => (props.size ? props.size : '18px')};
  }
  min-height: ${({ minTwo }) => (minTwo ? '44px' : '')};
`

export const LinkWrapper = styled.a`
  color: ${(props) => (props.color ? props.color : '')};
  font-size: ${(props) => props.size || '11px'};
  text-align: ${(props) => (props.textalign ? props.textalign : '')};
  display: ${(props) => (props.display ? props.display : 'inline-block')};
  font-weight: 600;
`

export const IconContainer = styled.span`
  width: ${(props) => (props.width ? props.width : '100%')};
  height: ${(props) => (props.height ? props.height : '100%')};
  opacity: ${(props) => (props.opacity ? props.opacity : '100%')};
  border-radius: 50%;
  background: ${(props) => (props.bgcolor ? props.bgcolor : 'white')};
  padding: ${(props) => (props.padding ? `${props.padding}rem` : '1rem')};
  text-align: center;
  margin-bottom: ${(props) => (props.mb ? props.mb : '')};
  margin-top: ${(props) => (props.mt ? props.mt : '')};
  margin-right: ${(props) => (props.mr ? props.mr : '')};
  margin-left: ${(props) => (props.ml ? props.ml : '')};
  cursor: pointer;
`

export const SvgWrapper = styled(Icon)`
  padding: 0;
`

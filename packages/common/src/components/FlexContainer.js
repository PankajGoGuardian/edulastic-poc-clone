import styled from 'styled-components'
import { mobileWidthMax } from '@edulastic/colors'

// Only add generic styles in this component. It is being used many places adding styles to its child component may have very bad impact.

const FlexContainer = styled.div`
  display: ${({ display }) => display || 'flex'};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'space-evenly'};
  align-items: ${({ alignItems }) => alignItems || null};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  margin-bottom: ${({ marginBottom }) => (!marginBottom ? null : marginBottom)};
  margin-left: ${({ marginLeft }) => marginLeft || '0px'};
  margin-top: ${({ mt }) => mt};
  margin-right: ${({ mr }) => mr};
  padding: ${(props) => (props.padding ? props.padding : '0px')};
  flex-wrap: ${({ flexWrap }) => flexWrap || null};
  width: ${({ width }) => width || 'auto'};
  max-width: ${({ maxWidth }) => maxWidth || null};
  height: ${({ height }) => height || null};
  flex: ${({ flex }) => flex || null};
  ${({ flexProps }) => flexProps};
  cursor: ${({ cursor }) => cursor || null};
  position: ${({ position }) => position || 'inherit'};
  @media (max-width: ${mobileWidthMax}) {
    flex-wrap: ${({ flexWrap }) => flexWrap || 'wrap'};
  }
`

export default FlexContainer

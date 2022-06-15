import styled from 'styled-components'
import { white } from '@edulastic/colors'

const Paper = styled.div`
  font-size: ${(props) => props.fontSize};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : '10px'};
  background: ${({ isDefaultTheme = true }) => isDefaultTheme && white};
  padding: ${(props) => (props.padding ? props.padding : '0px')};
  box-shadow: ${(props) => (props.boxShadow ? props.boxShadow : 'none')};
  overflow: ${({ overflow }) => overflow || ''};
  height: ${({ height }) => height || ''};
  width: ${({ width }) => (!width ? null : width)};
  @media (max-width: 480px) {
    padding: 28px;
  }
`

export default Paper

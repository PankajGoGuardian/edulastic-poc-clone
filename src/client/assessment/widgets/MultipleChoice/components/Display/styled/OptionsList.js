import styled from 'styled-components'
import { mobileWidth } from '@edulastic/colors'

export const OptionsList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: ${({ uiStyleType }) =>
    uiStyleType === 'radioBelow' ? 'flex-end' : 'flex-start'};
  margin-left: ${(props) => (props.styleType === 'primary' ? '0px' : '-25px')};
  width: ${({ width }) => width || 'auto'};
  @media (max-width: ${mobileWidth}) {
    margin-left: 0px;
  }
`

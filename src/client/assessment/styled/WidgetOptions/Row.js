import styled from 'styled-components'
import AntRow from "antd/es/row";

import { mobileWidth } from '@edulastic/colors'

export const Row = styled(AntRow)`
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}px` : 0)};
  margin-left: ${({ marginLeft }) => marginLeft};
  margin-bottom: ${({ marginBottom }) => `${marginBottom || 0}px`};
  ${(props) =>
    props.center &&
    `
    display: flex;
    align-items: center;
    margin-bottom: ${props.mb || '18'}px;
    
    > * {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
    
    @media(max-width: ${mobileWidth}) {
      margin-bottom: 15px;
      flex-wrap: wrap;
      
      > * {
        &:not(:last-child) {
          margin-bottom: 15px !important;
        }
      }
    }
  `}
`

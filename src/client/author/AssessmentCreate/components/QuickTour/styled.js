import { lightGreen10 } from '@edulastic/colors'
import styled from 'styled-components'

export const FooterLink = styled.div`
  cursor: pointer;
`

export const Footer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 30px;
  font: normal normal 600 11px/15px Open Sans;
  letter-spacing: 0.2px;
  color: ${lightGreen10};
`

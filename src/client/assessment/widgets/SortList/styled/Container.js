import styled from 'styled-components'
import { mobileWidthMax } from '@edulastic/colors'

export const Container = styled.div`
  @media (max-width: ${mobileWidthMax}) {
    min-width: auto !important;
  }
`

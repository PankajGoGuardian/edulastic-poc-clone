import styled from 'styled-components'
import { themeLightGrayBgColor } from '@edulastic/colors'

export const PdfDocument = styled.div`
  background: ${themeLightGrayBgColor};

  canvas + canvas {
    margin-top: 24px;
  }
`

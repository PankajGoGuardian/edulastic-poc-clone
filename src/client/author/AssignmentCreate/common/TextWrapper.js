import styled from 'styled-components'
import { textColor, extraDesktopWidthMax } from '@edulastic/colors'

const TextWrapper = styled.div`
  margin-bottom: 15px;
  text-align: center;
  color: ${textColor};
  line-height: 20px;
  font-size: 12px;
  @media (min-width: ${extraDesktopWidthMax}) {
    line-height: 26px;
  }
`
export default TextWrapper

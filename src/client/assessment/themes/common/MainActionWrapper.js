import styled from 'styled-components'
// import FlexContainer from "./FlexContainer";
import { FlexContainer } from '@edulastic/common'
import { MAX_MOBILE_WIDTH } from '../../constants/others'

const MainActionWrapper = styled(FlexContainer)`
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    margin-left: 0px;
    width: 100%;
    justify-content: space-between;
  }
`

export default MainActionWrapper

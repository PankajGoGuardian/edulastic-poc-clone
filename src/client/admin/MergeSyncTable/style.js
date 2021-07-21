import styled from 'styled-components'
import { lightFadedBlack } from '@edulastic/colors'
import { Table } from '../Common/StyledComponents'

export const MappingTable = styled(Table)`
  .duplicate-rows {
    background: #fac6bf !important;
  }
`

export const StyledSpinner = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  background: ${lightFadedBlack};
`

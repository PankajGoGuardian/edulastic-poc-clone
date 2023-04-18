import { darkGrey } from '@edulastic/colors'
import styled from 'styled-components'
import { StyledTable as CommonStyledTable } from '../../../../../../common/styled'

export const StyledTable = styled(CommonStyledTable)`
  .ant-table-body {
    font-weight: 600 !important;
  }
  th {
    background: transparent !important;
    border: none !important;
  }
  th .ant-table-column-title {
    text-transform: uppercase;
    color: ${darkGrey} !important;
    font-weight: bold !important;
  }
`

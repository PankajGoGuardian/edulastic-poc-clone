import { Button, Table } from 'antd'
import { themeColor, fadedWhite2 } from '@edulastic/colors'
import { IconInfoBlack } from '@edulastic/icons'
import styled from 'styled-components'

export const StyledBtn = styled(Button)`
  color: ${themeColor};
  border: none;

  :hover,
  :active {
    color: ${themeColor};
  }
`

export const StyledInfoIcon = styled(IconInfoBlack)`
  margin-left: 10px;
  cursor: pointer;
`

export const StyledText = styled.p`
  font-weight: ${(p) => (p.$bold ? 'bold' : 'normal')};
`
export const StyledTable = styled(Table)`
  .ant-table-thead {
    th {
      font-weight: bold;
    }
  }

  .ant-table-tbody {
    tr {
      color: black;
    }
  }
`

export const GreyText = styled.span`
  color: ${fadedWhite2};
`
export const DomainDetailsContainer = styled.div`
  margin-bottom: ${(p) => (p.$addMarginBottom ? '10px' : '0px')};
`

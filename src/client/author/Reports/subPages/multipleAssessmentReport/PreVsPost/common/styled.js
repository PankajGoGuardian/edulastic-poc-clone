import { extraDesktopWidthMax } from '@edulastic/colors'
import { Row } from 'antd'
import styled from 'styled-components'
import { StyledTable as Table } from '../../../../common/styled'

export const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
      }
      .ant-table-thead {
        th {
          white-space: nowrap;
        }
      }
      .ant-table-body {
        overflow-x: auto !important;
      }
      @media print {
        .ant-table-body {
          overflow-x: hidden !important;
        }
      }
    }
    .ant-table-fixed-left {
      .ant-table-thead {
        th {
          padding: 8px;
          color: #aaafb5;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 10px;
          border: 0px;
          .ant-table-column-sorter {
            vertical-align: top;
          }
        }
      }
      .ant-table-tbody {
        td {
          padding: 10px 0px 10px 8px;
          font-size: 11px;
          color: #434b5d;
          font-weight: 600;
          @media (min-width: ${extraDesktopWidthMax}) {
            font-size: 14px;
          }
        }
      }
    }
  }
`

export const CustomStyledCell = styled.div`
  border: 0.05px solid #e8e8e8;
  height: ${(props) => props.height || '33px'};
  line-height: ${(props) => props.height || '33px'};
  width: ${(props) => props.width};
  font-weight: ${(props) => props.font};
  font-size: 12px;
  padding: 0px 8px;
  background-color: ${(props) => props.color};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  text-overflow: ellipsis;
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    white-space: wrap;
  }
`
export const LegendWrapper = styled.div`
  display: flex;
  justify-content: right;
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    white-space: wrap;
  }
`

export const ArrowUp = styled.div`
  width: 0;
  height: 0;
  margin-top: ${({ large }) => (large ? '-50px' : '4px')};
  margin-left: 5px;
  border-left: ${({ large }) => (large ? '8px' : '5px')} solid transparent;
  border-right: ${({ large }) => (large ? '8px' : '5px')} solid transparent;
  border-bottom: ${({ large }) => (large ? '15px' : '9px')} solid #5fad5a;
`
export const ArrowDown = styled.div`
  width: 0;
  height: 0;
  margin-top: ${({ large }) => (large ? '-37px' : '5px')};
  margin-left: ${({ large }) => (large ? '150px' : '5px')};
  border-left: ${({ large }) => (large ? '8px' : '5px')} solid transparent;
  border-right: ${({ large }) => (large ? '8px' : '5px')} solid transparent;
  border-top: ${({ large }) => (large ? '15px' : '9px')} solid #e55c5c;
`
export const AssessmentNameContainer = styled.div`
  margin: 5px;
`
export const StyledSpan = styled.span`
  color: ${(props) =>
    props.color ? props.color : props.font ? '#000000' : '#AEB2B7'};
  font-weight: ${(props) => props.font};
`
export const StyledRow = styled(Row)`
  margin-top: -50px;
  font-weight: 600;
  font-size: 11px;
  color: #6a737f;
  display: flex;
`
export const StyledCard = styled.div`
  width: 260px;
  height: 88px;
  border-radius: 4px;
  margin: 20px 50px;
  @media print {
    margin: 20px 10px;
  }
`
export const StyledTitle = styled.div`
  height: 29px;
  background-color: #f8f8f8;
  border: 1px solid #b9b9b9;
  font-color: #000000;
  line-height: 29px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  align-items: center;
`
export const StyledValue = styled.div`
  height: 59px;
  line-height: 59px;
  border: 1px solid #b9b9b9;
  text-align: center;
  font-size: 18px;
`

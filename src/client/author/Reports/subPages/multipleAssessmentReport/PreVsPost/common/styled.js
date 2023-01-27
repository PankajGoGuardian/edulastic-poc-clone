import { extraDesktopWidthMax, lightGrey, grey } from '@edulastic/colors'
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

export const ArrowLarge = styled.div`
  width: 0;
  height: 0;
  margin-top: -38px;
  margin-left: 155px;
  border-collapse: separate;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-${(props) => props.type}: 15px solid ${(props) =>
  props.type === 'bottom' ? '#5fad5a' : '#e55c5c'};
`
export const ArrowSmall = styled.div`
  width: 0;
  height: 0;
  margin-top: 4px;
  margin-left: 5px;
  border-collapse: separate;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-${(props) => props.type}: 9px solid ${(props) =>
  props.type === 'bottom' ? '#5fad5a' : '#e55c5c'};
`
export const AssessmentNameContainer = styled.div`
  margin: 8px;
  & > div {
    font-weight: normal;
    font-size: 10px;
    margin-top: 5px;
  }
`
export const TestTypeTag = styled.span`
  background-color: ${grey};
  padding: 2px 4px;
  border-radius: 5px;
  font-size: 12px;
  margin-bottom: 10px;
`

export const StyledSpan = styled.span`
  color: ${(props) => (props.color ? props.color : '#AEB2B7')};
  font-weight: ${(props) => props.font};
`

export const SummaryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border: 0.5px solid ${grey};
  padding: 8px 0px;
  background-color: ${lightGrey};
  border-radius: 0px 0px 20px 20px;
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    white-space: wrap;
  }
`
export const LegendWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
  margin-right: 0px;
  margin-left: auto;
  border: 5px solid ${grey};
  border-width: 0.5px 0.5px 0px 0.5px;
  border-radius: 20px 20px 0px 0px;
  padding: 20px 20px;
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    white-space: wrap;
  }
`
export const StudentWrapper = styled.span`
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
  margin-right: auto;
  margin-left: 0px;
  border: 5px solid ${grey};
  background-color: ${lightGrey};
  border-width: 0.5px 0.5px 0px 0.5px;
  border-radius: 20px 20px 0px 0px;
  padding-inline: 20px;
  padding-block: auto;
  .icon-info {
    margin: auto 10px;
  }
  .icon-student {
    margin-right: -10px;
    margin-block: auto;
  }
  .student-count {
    margin-inline: 10px;
    align-self: center;
    font-size: 12px;
    font-weight: 600;
  }
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    white-space: wrap;
  }
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
  height: 95px;
  border-radius: 20px;
  background-color: #ffffff;
  margin: 20px 50px;
  .value {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
  }
  & div > span {
    font-weight: bold;
  }
  @media print {
    margin: 20px 10px;
  }
`
export const StyledTitle = styled.div`
  height: 35px;
  line-height: 35px;
  font-size: 10px;
  border-radius: 20px 20px 0px 0px;
  background-color: ${({ color }) => color};
  font-weight: bold;
  padding-inline: 10px;
  text-align: center;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media print {
    white-space: normal;
  }
`
export const StyledValue = styled.div`
  height: 59px;
  line-height: 59px;
  border: 1px solid #b9b9b9;
  text-align: center;
  font-size: 18px;
`
export const TooltipWrapper = styled.div`
  font-size: 10px;
  font-weight: bold;
`

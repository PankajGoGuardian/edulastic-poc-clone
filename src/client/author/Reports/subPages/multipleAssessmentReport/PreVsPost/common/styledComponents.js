import {
  extraDesktopWidthMax,
  lightGrey,
  grey,
  greyLight1,
  white,
  darkRed,
  greenDark4 as green,
} from '@edulastic/colors'
import { IconAlertCircle } from '@edulastic/icons'
import { Row } from 'antd'
import styled from 'styled-components'
import { StyledTable as Table } from '../../../../common/styled'

export const PreVsPostReportContainer = styled.div`
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`

export const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid ${greyLight1};
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
  border: 0.05px solid ${greyLight1};
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
    white-space: wrap;
  }
`

export const ArrowLarge = styled.div`
  width: 0;
  height: 0;
  margin-top: -36px;
  margin-left: 155px;
  border-collapse: separate;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-${(props) => props.type}: 15px solid ${(props) =>
  props.type === 'bottom' ? green : darkRed};
`

export const ArrowSmall = styled.div`
  width: 0;
  height: 0;
  margin-top: 5px;
  margin-left: 5px;
  border-collapse: separate;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-${(props) => props.type}: 9px solid ${(props) =>
  props.type === 'bottom' ? green : darkRed};
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
  font-weight: bold;
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
`

export const StudentWrapper = styled.span`
  display: flex;
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
`

export const StyledRow = styled(Row)`
  margin-block: 40px;
`

export const StyledCard = styled.div`
  width: 260px;
  height: 100px;
  border-radius: 20px;
  background-color: ${white};
  margin: 20px 50px;
  box-shadow: 0px 9px 10px #00000014;
  .value {
    height: 55px;
    line-height: 55px;
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
  height: 42px;
  font-size: 12px;
  border-radius: 20px 20px 0px 0px;
  background-color: ${({ color }) => color};
  font-weight: bold;
  padding-inline: 10px;
  padding-top: 12px;
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

export const StyledContainer = styled.div`
  display: flex;
  margin-top: 30px;
`

export const StyledHorizontalStackedBarChartContainer = styled.div`
  margin: 10px 30px;
`

export const StyledIconAlert = styled(IconAlertCircle)`
  align: center;
  margin-block: auto;
  margin-right: 12px;
`

export const PerformanceMatrixContainer = styled(Row)`
  padding: 50px;
  margin-top: -30px;
  .section-pre-test,
  .section-post-test {
    padding: 10px;
    font-size: 13px;
    .section-pre-test-tag,
    .section-post-test-tag {
      display: block;
      width: fit-content;
      height: fit-content;
      padding: 2px 8px;
      font-weight: bold;
      border-radius: 6px;
    }
    .section-pre-test-name,
    .section-post-test-name {
      padding: 4px;
    }
  }
  .section-pre-test {
    position: absolute;
    writing-mode: vertical-rl;
    transform: translate(-100%, -50%) scale(-1, -1);
    top: 50%;
    .section-pre-test-tag {
      padding: 8px 2px;
    }
  }
  .section-matrix-grid {
    display: grid;
    grid: ${({ matrixSize }) =>
      `50px repeat(${matrixSize}, 80px) / 50px repeat(${matrixSize}, 80px)`};
    width: fit-content;
    gaps: 1px;

    .section-matrix-row,
    .section-matrix-col {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 0px;
      .section-matrix-row-bar,
      .section-matrix-col-bar {
        min-width: 6px;
        min-height: 6px;
        border-radius: 5px;
        width: 6px;
        height: 54px;
      }
      .section-matrix-row-text,
      .section-matrix-col-text {
        padding: 0 5px;
        white-space: nowrap;
        font-size: 13px;
        font-weight: bold;
      }
    }
    .section-matrix-col {
      padding: 10px 0;
      flex-direction: column;
      .section-matrix-col-bar {
        width: 54px;
        height: 6px;
      }
    }

    .section-matrix-cell {
      place-items: center;
      place-content: center;
      aspect-ratio: 1/1;
      display: flex;
      outline: 1px solid ${greyLight1};
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 0.15px;
      color: #000000;
    }
    .section-matrix-cell.top.left {
      border-radius: 18px 0 0 0;
    }
    .section-matrix-cell.top.right {
      border-radius: 0 18px 0 0;
    }
    .section-matrix-cell.bottom.right {
      border-radius: 0 0 18px 0;
    }
    .section-matrix-cell.bottom.left {
      border-radius: 0 0 0 18px;
    }
  }
`

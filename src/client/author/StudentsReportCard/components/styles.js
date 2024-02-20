import styled from 'styled-components'
import { Row, Table } from 'antd'
import {
  grey,
  lightGrey9,
  someGreyColor1,
  lightGreen5,
  borderGrey4,
  secondaryTextColor,
  white,
  greenThird,
  backgroundGrey,
} from '@edulastic/colors'

import { StyledCard } from '../../Reports/common/styled'

export const StyledPage = styled.div`
  .hide-without-print {
    display: none;
  }
  @media print {
    @page {
      margin: 15px;
      height: 29.7cm;
      width: 25cm;
      size: A4;
    }
    .hide-on-print {
      display: none;
    }
    .hide-without-print {
      display: flex !important;
    }
    .embeddedServiceSidebar,
    .embeddedServiceHelpButton {
      display: none !important;
    }
  }
  table {
    th,
    td {
      background: ${white}!important;
      font-size: 12px !important;
      color: ${secondaryTextColor}!important;
      padding: 16px 5px;
    }
    th {
      .ant-table-column-title {
        font-weight: bold;
        color: ${secondaryTextColor};
      }
      padding-top: 20px !important;
    }
    td {
      font-weight: 500 !important;
      * {
        font-size: 14px;
        font-weight: 500;
      }
      p {
        padding-inline-end: 0 !important;
      }
    }
    td.column-score {
      text-align: center !important;
    }
    tbody tr {
      min-height: 50px;
    }
  }
  .ant-table-placeholder {
    border: 0;
  }
  .student-report-card-question-table-container,
  .student-report-card-standard-table-container {
    padding: 10px 10px;
  }
`

export const Container = styled(StyledCard)`
  margin-bottom: 20px;
  box-shadow: none;
  border: solid 1px ${grey};
`

export const PerformanceBrandWrapper = styled(StyledCard)`
  width: 100%;
  margin-bottom: 20px;
  .top-container {
    height: 60px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .test-name {
      font-size: 20px;
      color: ${greenThird};
      font-weight: 600;
    }
    p {
      padding: 0;
    }
  }
  .student-report-card-chart-container {
    padding: 27px 43px 14px 43px;
    page-break-after: auto;
    margin: 0;
    .ant-card-body {
      > .ant-row-flex {
        display: flex;
        justify-content: space-between;
      }
    }
    .student-name .student-report-card-value {
      text-align: right;
      font-size: 25px !important;
      font-weight: bold !important;
      margin-bottom: 7px;

      .edulastic-training-class {
        font-size: 12px;
        color: ${someGreyColor1};
      }
    }
    .student-report-card-score-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-end;
      margin-top: 21px;

      .ant-card-bordered {
        margin: 0;
        padding: 20px 20px 14px 20px;
        align-items: center;
        display: flex;
        justify-content: center;
        border: 1px solid ${borderGrey4};
        border-radius: 10px;
        width: 140px;
        margin-right: 43px;
      }
    }
    .student-report-card-description-area {
      width: 50%;
      .student-report-card-details {
        margin-bottom: 10px;
        color: ${secondaryTextColor};
        .student-report-card-key {
          font-size: 14px;
          font-weight: bold;
          white-space: pre;
        }
        .student-report-card-value {
          font-size: 14px;
          font-weight: 500;
          color: ${lightGrey9};
        }
      }
    }
    .student-report-card-total-score {
      width: 100%;
      flex-direction: column;
      font-size: 25px;
      font-weight: 900;
      text-align: center;
      .ant-col:first-child {
        font-size: 35px;
        border-bottom: solid 2px #dcdcdc;
      }
      .ant-col:last-child {
        font-size: 35px;
        padding: 0 20px;
        p {
          color: ${someGreyColor1};
          font-size: 14px;
        }
      }
    }
    .student-report-card-chart-area {
      .student-report-card-chart-area-score {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 35px;
        font-weight: bold;
        margin: 20px auto;
      }
      margin: 0 26px 0 26px;
    }
  }
`

export const StyledTitle = styled.p`
  font-size: 30px;
  text-align: left;
  font-weight: normal;
  padding: 15px 0 0 25px;
  margin: 0;
`

export const Color = styled.span`
  color: ${lightGreen5};
`

export const StyledPerformancePercent = styled.div`
  .student-report-card-chart-area-score {
    background-color: ${({ backGroundcolor }) => backGroundcolor};
    color: white;
  }
`
export const PerformanceTitle = styled(Row)`
  font-size: 13px;
  color: ${secondaryTextColor};
  font-weight: bold;
  text-transform: uppercase;
  width: 192px;
  text-align: center;
`

export const StyledTableWrapper = styled(StyledCard)`
  margin-bottom: 20px;
  box-shadow: none;
  border: solid 1px ${grey};
`

export const StyledTable = styled(Table)`
  .math-formula-display {
    table {
      display: flex;
      flex-direction: column;
      align-items: center;
      thead,
      tbody {
        width: 100%;
      }
      td {
        padding: 2px 10px;
      }
    }
  }
  .ant-table-body {
    overflow: auto;
    table {
      thead {
        tr {
          th {
            text-align: center;
            font-weight: 900;
            border: 0;
          }
        }
      }

      tbody {
        tr {
          td {
            text-align: center;
            font-weight: 900;
            border: 0;
            ${({ tdPadding }) =>
              tdPadding
                ? `padding-top: ${tdPadding};padding-bottom: ${tdPadding};`
                : ''}
          }
        }
      }
    }
  }
  .ant-pagination {
    display: none;
  }
`

export const StyledPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${grey};
  padding: 8px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 30px;
  span {
    font-weight: bold;
  }
`

export const StyledLegendContainer = styled.div`
  display: flex;
  margin: 0 0 5px 33px;
  div {
    margin: 0 3px;
    padding: 8px 12px;
    background: ${backgroundGrey};
    font-size: 12px;
    font-weight: bold;
    span {
      margin-right: 10px;
    }
  }
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`

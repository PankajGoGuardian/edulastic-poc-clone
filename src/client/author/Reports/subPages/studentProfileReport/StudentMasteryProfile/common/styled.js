import styled from 'styled-components'
import {
  extraDesktopWidthMax,
  themeColor,
  themeColorLight,
  greyThemeDark1,
} from '@edulastic/colors'
import { StyledTable as Table, StyledTag } from '../../../../common/styled'

export const ReStyledTag = styled(StyledTag)`
  cursor: ${(props) => props.cursor || 'default'};
  &:hover {
    color: #ffffff;
  }
`

export const StyledSpan = styled.span`
  cursor: ${(props) => props.cursor || 'default'};
  font: 12px/17px Open Sans;
  font-weight: 600;
  letter-spacing: 0px;
  color: ${greyThemeDark1};
  text-align: ${(props) => props.alignment || 'left'};
  &:hover {
    color: ${(props) => props.hoverColor || greyThemeDark1};
  }
`

export const OnClick = styled.span`
  color: ${themeColor};
  cursor: pointer;
  &:hover {
    color: ${themeColorLight};
  }
`

export const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
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
      th.ant-table-selection-column {
        visibility: hidden;
      }
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
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            background: white;
            font: Bold 10px/10px Open Sans;
            .ant-table-column-sorters {
              .ant-table-column-sorter {
                .ant-table-column-sorter-inner {
                  .ant-icon {
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
      }
      tbody {
        tr.ant-table-expanded-row {
          background-color: white;
        }
        tr {
          td:nth-child(3) {
            font-weight: normal;
          }
        }
      }
    }
  }
`

import {
  greyThemeLighter,
  lightGrey9,
  white,
  extraDesktopWidthMax,
  lightGrey8,
  fadedBlack,
  themeColor,
} from '@edulastic/colors'
import { Row } from 'antd'
import styled from 'styled-components'
import { StyledTable } from '../../../../../common/styled'

export const StyledRow = styled(Row)`
  justify-content: ${(p) => p.justifyContent || 'center'};
  align-items: ${(p) => p.alignItems || 'center'};
  flex-wrap: ${(p) => (p.wrap ? 'wrap' : 'nowrap')};
  flex-grow: ${(p) => p.flexGrow};
  padding-inline: 20px;
  margin: ${(p) => p.margin || '20px'};
`

export const StyledText = styled.div`
  font-size: ${(props) => props.fontSize || '12px'};
  margin: ${(props) => props.margin};
  color: ${(props) => props.color || lightGrey9};
  text-transform: ${(props) => props.textTransform};
`

export const TableContainer = styled.div`
  background-color: ${greyThemeLighter};
  min-height: 300px;
  justify-content: center;
  padding-inline: 15px;
  padding-block: 15px 40px;
  border-radius: 25px;
`

export const TableHeaderCellWrapper = styled.div`
  display: flex;
  margin-right: 30px;
  box-shadow: ${({ isSelected }) =>
    isSelected ? '0px 10px 13px #0000000f' : 'inherit'};
  opacity: ${({ isSelected }) => (isSelected ? '1' : '0.5')};
  height: 42px;
  align-items: center;
  border-radius: 10px;
  border-width: ${({ isSelected }) => (isSelected ? '1px' : '0px')};
  border-style: solid;
  border-color: ${({ borderColor }) => borderColor};
  div {
    height: 40px;
    line-height: 14px;
    &:first-child {
      padding: 13px 32px;
      font-weight: 600;
      font-size: 14px;
      background-color: ${white};
      border-radius: 10px 0px 0px 10px;
    }
    &:last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      font-weight: bold;
      background-color: ${({ color }) => color};
      cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'not-allowed')};
      border-radius: 0px 10px 10px 0px;
    }
  }
`

export const CustomStyledTable = styled(StyledTable)`
  .ant-table-column-title {
    white-space: nowrap !important;
  }

  .ant-table-thead {
    th {
      padding: 8px;
      color: #aaafb5;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 10px;
      .ant-table-column-sorter {
        vertical-align: top;
      }
    }
    .avg-attendance {
      border-right: 1px dashed ${lightGrey8};
    }
    .avg-score {
      .ant-table-column-sorter {
        padding-top: 32px;
      }
    }
    .performance-distribution {
      border-right: 1px dashed ${lightGrey8};
      padding: ${(p) =>
        p.isStudentCompareBy ? '35px 0 0 55px' : '35px 0 0 20px'};
    }
    .external-link {
      border-width: 0px;
      background-color: white;
    }
    .ant-table-fixed-columns-in-body.dimension {
      border-radius: 15px;
    }
    .ant-table-fixed-columns-in-body.ant-table-selection-column {
      border-radius: 15px;
    }
    .dimension {
      span {
        margin-inline: 20px;
      }
    }
    .ant-tag {
      text-transform: capitalize;
    }
  }

  .ant-table-fixed-left {
    .ant-table-fixed {
      background-color: #efefef;
      padding-bottom: 25px;
      border-radius: 15px;
      thead {
        th {
          background-color: #efefef;
          border-radius: 15px 15px 0px 0px;
        }
      }
    }
  }

  .ant-table-tbody {
    td {
      padding: 2px 0px 2px 8px;
      color: #434b5d;
      font-weight: 600;
      font-size: 12px;
      @media (min-width: ${extraDesktopWidthMax}) {
        font-size: 14px;
      }
    }
    .avg-attendance {
      border-right: 1px dashed ${lightGrey8};
    }
    .avg-score {
      border-right: 1px dashed ${lightGrey8};
    }
    .performance-distribution {
      border-right: 1px dashed ${lightGrey8};
      div > span {
        text-align: center;
      }
      .styled-cell {
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
      }
    }
    .external-link {
      border-width: 0px;
    }
  }
`

export const CompareByContainer = styled.div`
  color: ${themeColor};
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
@media print {
  .test-name-container {
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
  }
}
`

export const DataSizeExceededContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 120px;
  font-size: 25px;
  font-weight: bold;
  color: ${fadedBlack};
`

export const StyledDiv = styled.div`
  display: flex;
  width: fit-content;
  padding: 2px;
  border: 1px solid;
  margin-left: 80px;
  border-radius: 5px;
  .link {
    font-size: 20px;
  }
`

export const CustomStyledCell = styled.div`
  padding: 5px 10px;
  width: 120px;
  height: 30px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${(p) => p.color};
  margin: 0px 40px;
  border-radius: 8px;
`

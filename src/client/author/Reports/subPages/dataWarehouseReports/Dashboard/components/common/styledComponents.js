import {
  greyThemeLighter,
  lightGrey9,
  white,
  extraDesktopWidthMax,
  lightGrey8,
  fadedBlack,
  themeColor,
} from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
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
  justify-content: center;
  align-items: center;
  margin: 12px 25px;
  box-shadow: ${(props) =>
    props.isSelected ? '0px 10px 13px #0000000f' : 'inherit'};
  opacity: ${(props) => (props.isSelected ? '1' : '0.5')};
  span {
    &:first-child {
      padding: 13px 32px;
      width: 200px;
      font-weight: 600;
      font-size: 11px;
      background-color: ${white};
      border-radius: 10px 0px 0px 10px;
    }
    &:last-child {
      padding: 10px 40px;
      width: 80px;
      font-weight: bold;
      background-color: ${({ color }) => color};
      cursor: pointer;
      border-radius: 0px 10px 10px 0px;
    }
  }
`

export const CustomStyledTable = styled(StyledTable)`
  .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px dashed ${lightGrey8};
  }
  .ant-table-thead .avg-attendance-column-header {
    border-right: 1px dashed ${lightGrey8};
  }
  .ant-table-thead .performance-distribution-column-header {
    padding-top: 40px;
    padding-right: 90px;
  }
  table {
    tbody {
      border-radius: 15px;
      tr {
        td {
          font-weight: bold;
          color: ${lightGrey9};
        }
      }
    }
  }
  .ant-table-column-title {
    white-space: nowrap !important;
    .ant-tag {
      font-size: 10px;
    }
  }
  .ant-table-fixed-left,
  .ant-table-fixed-right {
    .ant-table-thead {
      th {
        padding: 8px;
        color: #aaafb5;
        background-color: white;
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
        color: #434b5d;
        font-weight: 600;
        font-size: 12px;
        @media (min-width: ${extraDesktopWidthMax}) {
          font-size: 14px;
        }
      }
    }
  }
  .ant-table-fixed-left {
    .ant-table-fixed {
      background-color: #efefef;
      border: 1px solid #e2e2e2;
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

export const StyledEduButton = styled(EduButton)`
  &.ant-btn {
    height: 32px;
    padding: 0 15px 0 10px;
    margin-right: 10px;
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

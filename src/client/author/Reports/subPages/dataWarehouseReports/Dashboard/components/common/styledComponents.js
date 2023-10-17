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
import { FlexContainer } from '@edulastic/common'
import { IconCaretDown } from '@edulastic/icons'
import { StyledTable } from '../../../../../common/styled'
import { getFGColor } from '../../../../../../src/utils/util'

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
  padding: 20px;
  border-radius: 25px;
  .based-on-test-type {
    .ant-btn.ant-dropdown-trigger {
      background-color: white;
    }
  }
`

export const FilterCellWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding-inline: 20px 20px;
  height: ${(p) => p.$cellHeight}px;
  margin-right: 20px;
  align-items: center;
  font-size: 16px;
  border-width: ${({ isSelected }) => (isSelected ? '1px' : '0px')};
  border-style: solid;
  border-color: ${({ isSelected }) => (isSelected ? themeColor : '')};
  background-color: ${({ isSelected }) => (isSelected ? white : '')};
  .filter-text {
      cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'not-allowed')};
      opacity: ${({ isClickable }) => (isClickable ? 1 : 0.5)};
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
    .test-type {
      border-left: 1px dashed ${lightGrey8};
    }
    .avg-score {
      border-right: 1px dashed ${lightGrey8};
    }
    .avg-attendance {
      border-right: 1px dashed ${lightGrey8};
    }
    .performance-distribution {
      border-right: 1px dashed ${lightGrey8};
      padding: ${(p) => (p.isStudentCompareBy ? '0 0 0 55px' : '0 0 0 20px')};
    }
    .external-link {
      border-width: 0px;
      background-color: white;
      border-left: 1px dashed ${lightGrey8};
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
  ${({ color }) => (color ? `color: ${getFGColor(color)};` : '')}
  margin: 0px auto;
  border-radius: 8px;
`
export const StyledContainer = styled.div`
  text-align: left;
  padding: 8px;
  ul {
    list-style-type: lower-alpha;
  }
`
export const OverallAverageWrapper = styled(FlexContainer)`
  min-height: 80px;
  background-color: ${greyThemeLighter};
  gap: 10px;
  padding: 10px 0 10px 20px;
  border-radius: 25px;
  margin-bottom: 10px;
  white-space: nowrap;
  .based-on-test-type {
    .ant-btn.ant-dropdown-trigger {
      background-color: white;
    }
  }
`
export const StyledIconCaretDown = styled(IconCaretDown)`
  position: relative;
  width: ${(p) => p.$arrowWidth}px;
  top: ${(p) => p.$arrowTopPosition}px;
  left: -50%;
`

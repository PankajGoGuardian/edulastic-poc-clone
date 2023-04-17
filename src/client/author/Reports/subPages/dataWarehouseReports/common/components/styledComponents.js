import styled from 'styled-components'
import { Empty, Tag } from 'antd'
import {
  lightGrey9,
  extraDesktopWidthMax,
  greyThemeLighter,
  themeColorLighter1,
  white,
  fadedBlack,
} from '@edulastic/colors'
import { IconCarets } from '@edulastic/icons'
import { StyledTable } from '../../../../common/styled'

const { IconCaretUp, IconCaretDown } = IconCarets
export const StyledIconCaretUp = styled(IconCaretUp)`
  color: ${(props) => props.color};
`
export const StyledIconCaretDown = styled(IconCaretDown)`
  color: ${(props) => props.color};
`
export const StyledTag = styled(Tag)`
  text-tranform: uppercase;
  border-radius: 20px;
  border: ${(props) => props.border};
  margin-block: ${(props) => props.marginBlock};
  font-weight: ${(props) => props.font || 'normal'}
  font-size: 0.6rem;
  font-weight: bold;
`
export const CustomStyledTable = styled(StyledTable)`
  table {
    tbody {
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
`
export const AssessmentName = styled.div`
  color: ${(props) => props.color} !important;
`
export const TableContainer = styled.div`
  margin-top: 20px;
`

export const WidgetsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 30px;
  gap: 30px;
  background-color: ${greyThemeLighter};
`
export const Widget = styled.div`
  border-radius: 20px;
  width: ${(p) => p.width || '40%'};
  aspect-ratio: ${(p) => p.aspectRatio || '16 / 9'};
  margin: ${(p) => p.margin || '0 auto'};
  min-width: ${(p) => p.minWidth || '650px'};
  max-width: 850px;
  flex-grow: 1;
  background-color: ${white};
  box-shadow: 0px 3px 8px #00000029;
`
export const WidgetHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
  .title {
    font-size: 15px;
    font-weight: bold;
    width: fit-content;
    padding: 11px 40px;
    background-color: ${themeColorLighter1};
    border-radius: 20px 0px;
  }
`
export const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: auto;
  justify-content: space-between;
  align-items: center;
  padding: 30px 50px;
  margin: ${(p) => p.margin};
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  .small-header {
    margin-top: -14px;
    font-size: 11px;
  }
`
const cellStyles = {
  large: { padding: '18px 30px', font: '24px' },
  medium: { padding: '10px 15px', font: '18px' },
  small: { padding: '12px 17px', font: '14px' },
}

export const StyledCell = styled.div`
  padding: ${(props) => cellStyles[props.cellType].padding};
  width: fit-content;
  font-size: ${(props) => cellStyles[props.cellType].font};
  margin: 10px auto;
  background-color: ${(props) => props.color};
  border-radius: 10px;
`
export const StyledText = styled.div`
  font-size: ${(props) => props.fontSize || '12px'};
  font-weight: 600;
  white-space: nowrap;
  margin: ${(props) => props.margin};
  color: ${(props) => props.color || lightGrey9};
  text-transform: ${(props) => props.textTransform};
`
export const CompareByContainer = styled.div`
width: fit-content;
.dimension-name {
  color: ${(p) => p.color};
  width: fit-content;
  margin-bottom: 4px;
  margin: 0 15px;
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
}
`
export const StyledEmptyContainer = styled(Empty)`
  margin: ${(p) => p.margin || '60px 0'};
`
export const ReportDescription = styled.div`
  margin-block: -60px 47px;
  color: ${fadedBlack};
  > div {
    display: flex;
    font-size: 25px;
    font-weight: bold;
    align-items: center;
  }
`
export const StyledDiv = styled.div`
  flex-grow: 1;
`

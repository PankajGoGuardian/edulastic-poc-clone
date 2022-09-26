import styled from 'styled-components'
import { Tag } from 'antd'
import { IconStudent } from '@edulastic/icons'
import {
  lightGrey9,
  extraDesktopWidthMax,
  fadedGrey,
  themeLightGrayBgColor,
  greyThemeDark1,
  themeColor,
  themeLightGrayColor,
} from '@edulastic/colors'
import { StyledTable } from '../../../../common/styled'

export const StyledTag = styled(Tag)`
  text-tranform: uppercase;
  border-radius: 20px;
  font-size: 0.6rem;
  font-weight: bold;
`

export const CustomStyledTable = styled(StyledTable)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      .ant-table-thead {
        th {
          white-space: nowrap;
        }
      }

      @media print {
        .ant-table-body {
          overflow-x: hidden !important;
        }
      }
    }
  }
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

export const AssementNameContainer = styled.div`
  span {
    font-weight: bold;
  }
`
export const TableContainer = styled.div`
  margin-top: 20px;
`
export const Details = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 5px;
  justify-content: center;
  align-items: center;
`

export const DetailsWrapper = styled.div`
  padding: 10px 5px;
  background-color: ${themeLightGrayBgColor};
  border-radius: 10px 10px 0px 0px;
`

export const Demographics = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px 5px;
  background-color: ${fadedGrey};
  border-radius: 0px 0px 10px 10px;
  & > div.demographic-item {
    display: flex;
    margin: 0px 30px;
    align-items: center;
    svg {
      margin-right: 10px;
    }
    span {
      font-weight: bold;
    }
  }
`

export const StudentName = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 20px;
  margin-right: 20px;
  gap: 24px;
  & > span {
    text-align: left;
    font: normal normal bold 18px/24px Open Sans;
    letter-spacing: 0px;
    color: ${greyThemeDark1};
  }
`
export const StudentMetaData = styled.div`
  display: flex;
  flex-wrap: wrap;
  color: ${greyThemeDark1};
  & > div {
    padding-left: 20px;
    & > span:first-child {
      text-align: left;
      font: normal normal normal 12px/17px Open Sans;
      letter-spacing: 0px;
    }
    & > span:last-child {
      text-align: left;
      font: normal normal bold 12px/17px Open Sans;
      letter-spacing: 0px;
    }
  }
`

export const StyledLine = styled.div`
  border-left: 4px solid ${themeLightGrayColor};
  height: 25px;
  border-radius: 1px;
`

export const StyledIcon = styled(IconStudent)`
  margin-right: 10px;
  align-self: center;
  color: ${themeColor};
`

export const UserIcon = styled.div`
  width: 30px;
  height: 30px;
  ${({ src }) => (src ? `background-image: url(${src});` : '')}
  border-radius: 50%;
`

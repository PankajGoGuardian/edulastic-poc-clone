import { greyThemeDark1, mobileWidthMax, title } from '@edulastic/colors'
import { IconLogoCompact } from '@edulastic/icons'
import {
  Button as AntdButton,
  Dropdown,
  Input,
  Layout,
  Pagination,
  Spin,
} from 'antd'
import styled from 'styled-components'
import { StyledTable as AntdTable } from '../../../common/styled'
import IconPearAssessLogoCompact from '@edulastic/icons/src/IconPearAssessLogoCompact'

const { Search } = Input
const { Content } = Layout

export const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 22px;
  margin: ${(props) => props.margin || '14px 0 9px 19px'};
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`

export const AssessPeardeckLogoCompact = styled(IconPearAssessLogoCompact)`
  width: 40px;
  height: 40px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`

export const Button = styled.button`
  ${(props) =>
    props.noStyle &&
    `
    background:none;
    border:none;
    border:0;
    border-radius:0
  `}
  opacity: ${(props) => (props.disabled ? '0.2' : '1')};
  cursor: pointer;
`

export const FlexDiv = styled.div`
  display: flex;
`

export const FlexColumn = styled(FlexDiv)`
  flex-direction: column;
`

export const MainDiv = styled.div`
  padding: 15px;
  width: 100%;
`

export const FirstDiv = styled(FlexDiv)`
  margin: 15px;
`

export const Table = styled(AntdTable)`
  .ant-table table {
    table-layout: fixed;
    word-break: break-word;
    .ant-select-selection-selected-value {
      font-size: 12px;
    }
    .ant-calendar-picker-input.ant-input {
      font-size: 12px;
    }
  }
`

export const H2 = styled.h2`
  background-color: #1ab394;
  border-color: #1ab394;
  color: #fff;
  padding: 15px;
`

export const OuterDiv = styled.div`
  border: 1px solid #1ab394;
  background: #fff;
  margin-bottom: 20px;
`

// Manage District common components
export const StyledControlDiv = styled.div`
  display: flex;
  margin: 10px 0px;
  .ant-btn-primary {
    color: white;
  }
`
export const TabTitle = styled.h3`
  width: 200px;
  text-transform: capitalize;
  color: ${title};
  font-size: 16px;
  font-weight: bold;
  margin: 0px;
  padding-left: 10px;
  align-self: center;
`

export const TableFilters = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const StyledFilterDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0px 0.75rem;
  align-items: center;
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`

export const RightFilterDiv = styled.div`
  display: flex;
  align-items: center;
`

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .ant-table-wrapper {
    width: 100%;
  }

  input {
    border: 1px solid #d9d9d9;
  }
`

export const StyledTable = styled(AntdTable)`
  .ant-table-row {
    &: hover {
      a {
        opacity: 100;
      }
    }
  }

  .ant-table-body,
  .ant-table-scroll {
    .ant-table-header {
      table {
        thead {
          tr {
            th {
              word-break: break-all;
              padding: 10px;
              min-width: 75px;
            }
            @media only screen and (min-width: 1px) and (max-width: 600px) {
              th {
                padding: 10px;
                font-size: 8px;
              }
            }

            @media only screen and (min-width: 601px) and (max-width: 767px) {
              th {
                padding: 10px;
                font-size: 9px;
              }
            }

            @media only screen and (min-width: 768px) and (max-width: 991px) {
              th {
                padding: 10px;
                font-size: 10px;
              }
            }

            @media only screen and (min-width: 992px) and (max-width: 1199px) {
              th {
                padding: 10px;
                font-size: 11px;
              }
            }

            @media only screen and (min-width: 1200px) {
              th {
                padding: 10px;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
    table {
      tbody {
        tr {
          td {
            word-break: break-all;
            min-width: 75px;
          }
        }
      }
    }
  }
`
export const StyledAddFilterButton = styled(AntdButton)`
  margin-left: 20px;
  font-size: ${(props) => props.theme.manageDistrict.filterButtonFontSize};
  font-weight: ${(props) => props.theme.manageDistrict.filterButtonFontWeight};
  background: ${(props) => props.theme.manageDistrict.filterButtonBgColor};
  color: ${(props) => props.theme.manageDistrict.filterButtonTextColor};
  text-transform: uppercase;
`

export const StyledTableButton = styled.a``

export const StyledFilterInput = styled(Search)`
  margin-left: 20px;
  width: 300px;
`
export const StyledSchoolSearch = styled(Search)`
  margin-left: 20px;
  width: 350px;
`
export const StyledActionDropDown = styled(Dropdown)`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const StyledClassName = styled.p`
  text-align: center;
  color: #1890ff;
  font-weight: bold;
  margin-bottom: 5px;
`
export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  .manage-district-headerLeft {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`

export const StyledContent = styled(Content)`
  width: 80%;
  padding: 85px 30px 20px;
`

export const StyledLayout = styled(Layout)`
  position: relative;
  display: flex;
  flex-direction: column;
  pointer-events: ${(props) => (props.loading === 'true' ? 'none' : 'auto')};
  min-height: 400px;
  background: transparent;
`

export const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  background: ${(props) =>
    props.loading ? 'rgb(255, 255, 255, 0.7)' : 'transparent'};
`

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`

export const StyledDiv = styled.div`
  display: inline;
  text-align: left;
  font: ${(props) => props.fontStyle || '14px/19px Open Sans'};
  font-weight: ${(props) => props.fontWeight || 600};
  color: ${(props) => props.color || greyThemeDark1};
`
export const HeaderSaveButton = styled.div`
  position: fixed;
  top: 15px;
  right: 30px;
  z-index: 999;
`

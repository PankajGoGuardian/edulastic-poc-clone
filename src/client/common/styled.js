import {
  extraDesktopWidth,
  fadedGrey,
  mobileWidthMax,
  smallDesktopWidth,
  themeColor,
  themeColorLighter,
  title,
  white,
} from '@edulastic/colors'
import { Card } from '@edulastic/common'
import { Button, Form, Input, Modal, Pagination, Select, Table } from 'antd'
import styled from 'styled-components'

export const StyledCard = styled(Card)`
  // when u change this u have to change "StyledCard" in "src/client/author/Reports/common/styled.js" to make every css in sync
  // DO NOT ADD USE CASE SPECIFIC CSS HERE, ONLY ADD GENERIC CSS
  // Import this and add USE CASE SPECIFIC CSS
  margin: ${(props) => (props.margin ? props.margin : '8px')};

  .ant-card-body {
    padding: 18px;
  }

  @media only screen and (min-width: 1px) and (max-width: 600px) {
    .ant-card-body {
      padding: 12px;
    }
  }

  @media only screen and (min-width: 601px) and (max-width: 767px) {
    .ant-card-body {
      padding: 15px;
    }
  }

  @media only screen and (min-width: 768px) and (max-width: 991px) {
    .ant-card-body {
      padding: 18px;
    }
  }

  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    .ant-card-body {
      padding: 18px;
    }
  }

  @media only screen and (min-width: 1200px) {
    .ant-card-body {
      padding: 18px;
    }
  }

  @media print {
    box-shadow: none !important;

    .ant-card-body {
      padding: 0px !important;
    }
  }
`

//  manage district common components' styles
export const MainContainer = styled.div``

export const TableContainer = styled.div`
  padding: 1rem 0;
`

export const SubHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  .ant-breadcrumb {
    @media (max-width: ${extraDesktopWidth}) {
      .ant-breadcrumb-link,
      .ant-breadcrumb-separator {
        font-size: 9px;
        a {
          font-size: 9px;
        }
      }
    }
  }
`

export const StyledSchoolSearch = styled(Input.Search)`
  max-width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
  margin-right: 20px;
  .ant-input {
    border-radius: ${(props) =>
      props.theme.manageDistrict.inputFieldBorderRadius};
    background: ${(props) => props.theme.manageDistrict.inputFieldBgColor};
    border: 1px solid
      ${(props) => props.theme.manageDistrict.inputFieldBorderColor};
  }
  .ant-input-search-icon {
    color: ${(props) => props.theme.manageDistrict.iconColor};
    font-weight: ${(props) => props.theme.manageDistrict.iconFontWeight};
  }
`

export const StyledContentBucketSearch = styled(Input.Search)`
  max-width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
  margin-right: ${({ marginRight }) => marginRight}px;
  .ant-input {
    border-radius: ${(props) =>
      props.theme.manageDistrict.inputFieldBorderRadius};
    background: ${(props) => props.theme.manageDistrict.inputFieldBgColor};
    border: 1px solid
      ${(props) => props.theme.manageDistrict.inputFieldBorderColor};
    height: 40px;
    padding: 11px 17.3px;
  }
  .ant-input-search-icon {
    color: ${(props) => props.theme.manageDistrict.iconColor};
    font-weight: ${(props) => props.theme.manageDistrict.iconFontWeight};
    svg {
      width: 14px;
      height: 14px;
    }
  }
`

export const StyledButton = styled(Button)`
  &.ant-btn {
    font-size: ${(props) =>
      props.theme.manageDistrict.refineResultsButtonTextFontSize};
    font-weight: ${(props) =>
      props.theme.manageDistrict.refineResultsButtonTextFontWeight};
    border-radius: ${(props) =>
      props.theme.manageDistrict.refineResultsButtonBorderRadius};
    box-shadow: ${(props) =>
      props.theme.manageDistrict.refineResultsButtonBoxShadow};
    color: ${(props) =>
      props.theme.manageDistrict.refineResultsButtonTextColor};
    border: none;
    width: 170px;
    height: 30px;
    &:hover,
    &:active,
    &:focus {
      color: ${(props) =>
        props.theme.manageDistrict.refineResultsButtonTextColor};
      box-shadow: ${(props) =>
        props.theme.manageDistrict.refineResultsButtonBoxShadow};
    }
    &::after {
      display: none !important;
    }
  }
`
export const FilterWrapper = styled.div`
  background: ${(props) => props.theme.manageDistrict.filterDivBgcolor};
  border-radius: ${(props) => props.theme.manageDistrict.filterDivBorderRadius};
  padding: 10px 10px 0px;
`

export const StyledTable = styled(Table)`
  .ant-table {
    overflow: auto;
    &-thead {
      & > tr > th {
        color: ${(props) => props.theme?.manageDistrict?.tableHeaderTxtColor};
        font-size: 10px;
        font-weight: bold;
        padding: 20px 10px;
        text-transform: uppercase;
        border-bottom: none;
        background: white;
        &.ant-table-column-has-actions.ant-table-column-has-sorters:hover,
        & .ant-table-header-column .ant-table-column-sorters::before {
          background: ${white};
        }
        &.ant-table-column-has-actions.ant-table-column-has-filters
          &.ant-table-column-has-actions.ant-table-column-has-sorters {
          text-align: center;
        }
        .ant-table-column-sorters {
          display: flex;
          justify-content: center;

          .ant-table-column-sorter-inner {
            &.ant-table-column-sorter-inner-full {
              margin-top: 0em;
            }
            .ant-table-column-sorter {
              &-up,
              &-down {
                font-size: 10px;
              }
            }
          }
        }
        @media (min-width: ${extraDesktopWidth}) {
          font-size: ${(props) =>
            props.theme?.manageDistrict?.tableHeaderTxtSize};
        }
      }
    }
    &-tbody {
      & > tr {
        background: ${white};
        font-family: Open Sans;
        letter-spacing: 0.26px;
        color: ${(props) => props.theme?.manageDistrict?.tableRowTxtColor};
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        border-bottom: 15px solid white;
        & > td {
          padding: 10px 10px;
          &.ant-table-column-sort {
            background: none;
          }
          font-weight: 550;
        }
        @media (min-width: ${extraDesktopWidth}) {
          font-size: ${(props) => props?.theme?.manageDistrict?.tableRowTxtSize};
        }
      }
    }
  }
  .ant-table-row {
    &:hover {
      a {
        opacity: 100;
      }
    }
  }
`

export const StyledTableButton = styled.a`
  opacity: 0;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
`
export const StyledPagination = styled(Pagination)`
  align-self: flex-end;
  margin-top: 15px;
  margin-right: ${(props) =>
    props.marginRight ? `${props.marginRight}px` : '55px'};
`

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`

const CommonStyledButton = styled(Button)`
  border-radius: 4px;
  text-transform: uppercase;
  font-size: ${(props) =>
    props.theme.manageDistrict.modalFooterBtnTextFontSize};
  min-width: 150px;
  height: 40px;
  white-space: nowrap;
`
export const CancelButton = styled(CommonStyledButton)`
  background: ${(props) => props.theme.manageDistrict.modalFooterBtnColor2};
  color: ${(props) => props.theme.manageDistrict.modalFooterBtnTxtColor2};
  border: 1px solid
    ${(props) => props.theme.manageDistrict.modalFooterBtnTxtColor2};
`

export const OkButton = styled(CommonStyledButton)`
  background: ${(props) => props.theme.manageDistrict.modalFooterBtnColor1};
  color: ${(props) => props.theme.manageDistrict.modalFooterBtnTxtColor1};
  border: none;
`
export const StyledModal = styled(Modal)`
  .ant-modal {
    &-content {
      background: ${(props) => props.theme.manageDistrict.modalBgcolor};
      .ant-modal-close-x {
        font-size: 22px;
        font-weight: 600;
      }
    }
    &-header {
      .ant-modal-title {
        font-size: ${(props) => props.theme.manageDistrict.modalTitleFontSize};
        font-family: Open Sans;
        color: ${(props) => props.theme.manageDistrict.modalTitleColor};
        font-weight: ${(props) =>
          props.theme.manageDistrict.modalTitleFontWeight};
      }
      background: transparent;
      border-bottom: none;
    }
    &-body {
      background: ${(props) => props.theme.manageDistrict.modalBodyBgcolor};
      margin: 10px 25px;
      border-radius: ${(props) =>
        props.theme.manageDistrict.modalBodyBorderRadius};
      box-shadow: ${(props) => props.theme.manageDistrict.modalBodyBoxShadow};
      padding: 20px 30px;
    }
    &-footer {
      border-top: none;
      padding: 10px;
    }
  }
`
export const ModalFormItem = styled(Form.Item)`
  margin-bottom: 20px;
  .ant-form-item-control-wrapper {
    width: 100%;
  }
  .ant-form-item-label {
    text-transform: uppercase;
    color: ${(props) => props.theme?.manageDistrict?.formLabelColor};
    font-weight: 600;
    font-size: ${(props) => props.theme?.manageDistrict?.formLabelFontSize};
    margin-bottom: 5px;
    line-height: 1;
  }
  .ant-form-item-label > label::after {
    display: none;
  }
  .ant-form-item-label > label::before {
    display: none;
  }
`

export const LeftFilterDiv = styled.div`
  display: flex;
  width: ${(props) => (props.width ? `${props.width}%` : 'auto')};
  @media (max-width: ${mobileWidthMax}) {
    width: 90%;
    margin-bottom: 10px;
  }
`
export const RightFilterDiv = styled.div`
  display: flex;
  width: ${(props) => (props.width ? `${props.width}%` : 'auto')};
  justify-content: flex-end;
  align-items: center;
  margin-left: 10px;
  .ant-checkbox-wrapper {
    .ant-checkbox + span {
      font-size: 10px;
      @media (min-width: ${extraDesktopWidth}) {
        font-size: 12px;
      }
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 90%;
    justify-content: space-between;
  }
`

export const StyledSelect = styled(Select)`
  .ant-select-selection {
    background: ${white};
    border: none;
    border-radius: 0px;
    padding: 2px 3px;
    border-radius: 4px;
    box-shadow: 0px 0px 5px 1px ${fadedGrey};
  }
  .ant-select,
  .ant-input,
  .ant-input-number {
    min-width: 100px;
    width: 100%;
    margin-bottom: 10px;
  }
  .ant-select-lg {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: ${title};
    .ant-select-selection--multiple {
      .ant-select-selection__rendered {
        li.ant-select-selection__choice {
          height: 24px;
          line-height: 24px;
          margin-top: 7px;

          @media (max-width: ${smallDesktopWidth}) {
            height: 20px;
            line-height: 20px;
          }
        }
      }
    }
  }

  .ant-select-selection__choice {
    border-radius: 4px;
    border: solid 1px ${themeColorLighter}22;
    background-color: ${themeColor}20;
    height: 24px;
  }

  .ant-select-selection__choice__content {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: ${themeColor};
    opacity: 1;
    text-transform: uppercase;
  }

  .ant-select-remove-icon {
    svg {
      fill: ${themeColor};
    }
  }

  .ant-select-arrow-icon {
    font-size: 14px;
    svg {
      fill: ${themeColor};
    }
  }
`

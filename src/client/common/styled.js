import styled from "styled-components";
import { Card } from "@edulastic/common";
import { Table, Button, Pagination, Input, Row, Modal, Form } from "antd";
import {
  cardTitleColor,
  white,
  lightGreySecondary,
  secondaryTextColor,
  boxShadowDefault,
  themeColor,
  lightGrey,
  title,
  mobileWidthMax
} from "@edulastic/colors";

export const StyledCard = styled(Card)`
  // when u change this u have to change "StyledCard" in "src/client/author/Reports/common/styled.js" to make every css in sync
  // DO NOT ADD USE CASE SPECIFIC CSS HERE, ONLY ADD GENERIC CSS
  // Import this and add USE CASE SPECIFIC CSS
  margin: ${props => (props.margin ? props.margin : "8px")};

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
`;

//  manage district common table

export const MainContainer = styled.div``;

export const TableContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: ${boxShadowDefault};
`;

export const SubHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  margin-bottom: 5px;
`;

export const StyledSchoolSearch = styled(Input.Search)`
  max-width: ${props => (props.width ? `${props.width}px` : "auto")};
  margin-right: 20px;
  .ant-input {
    border-radius: 2px;
    background: ${lightGrey};
    border: 1px solid #e1e1e1;
  }
  .ant-input-search-icon {
    color: ${themeColor};
    font-weight: bold;
  }
`;

export const StyledButton = styled(Button)`
  &.ant-btn {
    margin-left: 10px;
    font-size: 11px;
    text-shadow: none;
    font-weight: 600;
    border-radius: 3px;
    border-color: transparent;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    color: ${themeColor};
    width: 180px;
    &:hover,
    &:active,
    &:focus {
      color: ${themeColor};
      border-color: transparent;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    }
    &::after {
      display: none !important;
    }
  }
`;
export const FilterWrapper = styled.div`
  background: ${white};
  border-radius: 5px;
  box-shadow: ${boxShadowDefault};
  padding: 1rem;
  margin-bottom: 15px;
`;

export const StyledTable = styled(Table)`
  .ant-table {
    overflow: auto;
    &-thead {
      & > tr > th {
        padding: 20px 10px;
        background: green;
        border-bottom: none;
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
        color: ${cardTitleColor};
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
      }
    }
    &-tbody {
      & > tr {
        background: ${lightGreySecondary};
        font-family: Open Sans, SemiBold;
        letter-spacing: 0.26px;
        color: ${secondaryTextColor};
        font-size: 14px;
        cursor: pointer;
        border-bottom: 15px solid white;
        & > td {
          padding: 10px 10px;
          &.ant-table-column-sort {
            background: none;
          }
          font-weight: 550;
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
`;

export const StyledTableButton = styled.a`
  opacity: 0;
  margin-right: 20px;
  font-size: 20px;
  &:last-child {
    margin-right: 0;
  }
`;
export const StyledPagination = styled(Pagination)`
  align-self: flex-end;
  margin-top: 15px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`;

const CommonStyledButton = styled(Button)`
  border-radius: 4px;
  text-transform: uppercase;
  font-size: 11px;
  min-width: 150px;
  height: 40px;
  white-space: nowrap;
`;
export const CancelButton = styled(CommonStyledButton)`
  background: transparent;
  color: ${themeColor};
  border: 1px solid ${themeColor};
`;

export const OkButton = styled(CommonStyledButton)`
  background: ${themeColor};
  color: ${white};
  border: none;
`;
export const StyledModal = styled(Modal)`
  .ant-modal {
    &-content {
      background: ${lightGrey};
      .ant-modal-close-x {
        font-size: 22px;
        font-weight: 600;
      }
    }
    &-header {
      .ant-modal-title {
        font-size: 20px;
        font-family: Bold, Open Sans;
        color: ${secondaryTextColor};
        font-weight: 550;
      }
      background: transparent;
      border-bottom: none;
    }
    &-body {
      background: ${white};
      margin: 10px 25px;
      border-radius: 4px;
      box-shadow: ${boxShadowDefault};
      padding: 20px 30px;
    }
    &-footer {
      border-top: none;
      padding: 10px;
    }
  }
`;
export const ModalFormItem = styled(Form.Item)`
  margin-bottom: 20px;
  .ant-form-item-control-wrapper {
    width: 100%;
  }

  .ant-input,
  .ant-select {
    width: 100%;
    max-width: 100%;
    padding: 5px;
  }
  .ant-form-item-label {
    font-family: Open Sans, SemiBold;
    letter-spacing: 0.22px;
    text-transform: uppercase;
    color: ${title};
    font-weight: 510;
    line-height: 1;
    font-size: 12px;
    padding-bottom: 10px;
  }
  .ant-form-item-control-wrapper {
    width: 100%;
  }
  .ant-form-item-label > label::after {
    content: "";
  }
  .ant-form-item-label > label::before {
    content: "";
  }

  .ant-input {
    width: 100%;
    max-width: 100%;
    background: ${lightGreySecondary};
    border-radius: 2px;
    border: 1px solid #e1e1e1;
  }
  .ant-select-selection {
    background: ${lightGrey};
    border-radius: 2px;
  }
`;

export const LeftFilterDiv = styled.div`
  display: flex;
  width: ${props => (props.width ? `${props.width}%` : "auto")};
  @media (max-width: ${mobileWidthMax}) {
    width: 90%;
    margin-bottom: 10px;
  }
`;
export const RightFilterDiv = styled.div`
  display: flex;
  width: ${props => (props.width ? `${props.width}%` : "auto")};
  justify-content: flex-end;
  @media (max-width: ${mobileWidthMax}) {
    width: 90%;
    justify-content: space-between;
  }
`;

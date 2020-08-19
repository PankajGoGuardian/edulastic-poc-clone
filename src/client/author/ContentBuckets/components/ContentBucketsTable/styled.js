import styled from "styled-components";
import { white, secondaryTextColor } from "@edulastic/colors";
import { IconPencilEdit, IconCheck, IconClose } from "@edulastic/icons";
import { Checkbox } from "antd";
import { StyledTable, StyledModal, OkButton, CancelButton } from "../../../../common/styled";

export const StyledContentBucketsTable = styled(StyledTable)`
  .ant-table {
    min-height: 500px;
  }
  .ant-table-tbody > tr > td {
    text-align: center;
  }
  .ant-table-tbody > tr {
    background: ${white};
  }
  .ant-table-thead > tr > th {
    text-align: center;
    font-size: 11px;
  }
  .column-align-left {
    text-align: start !important;
  }
  .status-column {
    text-transform: uppercase;
  }
`;

export const StyledUpsertModal = styled(StyledModal)`
  input[type="text"] {
    height: 40px;
  }
  .ant-input {
    padding: 10px 15px;
  }
  .ant-select {
    padding: 0;
    &-selection__rendered {
      line-height: 40px;
    }
  }
  .ant-form-item-label {
    margin-bottom: 8px;
    & > label {
      color: ${secondaryTextColor};
    }
  }
  .ant-form-item-required::before {
    content: "*" !important;
  }
  .ant-checkbox-wrapper {
    span {
      color: ${secondaryTextColor};
      font-size: 12px;
    }
  }
  .ant-modal {
    font-size: 12px;
    &-header {
      padding: 25px 24px;
    }
    &-close {
      padding-top: 7px;
    }
    &-body {
      margin: 10px 28.7px;
      .content-bucket-item-no-margin {
        margin: 0;
      }
    }
    &-content {
      .content-bucket-status {
        display: flex;
        .ant-form-item-control-wrapper {
          width: auto;
          margin-left: 43px;
        }
        .ant-form-item-label {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }
      }
    }
    &-footer {
      button + button {
        margin-left: 20px;
      }
    }
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  text-transform: uppercase;
  .ant-checkbox + span {
    padding-left: 22px;
    font-weight: 600;
  }
`;
export const StyledOkBtn = styled(OkButton)`
  min-width: 200px;
  margin-left: 20px;
  font-weight: 600;
  :hover {
    background: green;
    color: ${white};
  }
`;

export const StyledCancelBtn = styled(CancelButton)`
  min-width: 200px;
  font-weight: 600;
  :hover {
    background: green;
    color: ${white};
  }
`;

export const StyledIconCheck = styled(IconCheck)`
  width: 18px;
  height: 15px;
`;

export const StyledIconClose = styled(IconClose)`
  width: 13px;
  height: 13px;
`;

export const StyledIconPencilEdit = styled(IconPencilEdit)`
  width: 13px;
  height: 13px;
`;

export const Owner = styled.div `
  width:120px;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

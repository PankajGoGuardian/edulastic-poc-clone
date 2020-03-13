import styled from "styled-components";
import { TextField } from "@edulastic/common";
import {
  themeColor,
  white,
  borderGrey,
  fadedGrey,
  greyThemeLighter,
  lightGreySecondary,
  green
} from "@edulastic/colors";
import { Button, Table, Tabs, Radio, Modal, Form } from "antd";
import { StyledPaperWrapper } from "../../styled/Widget";

export const SubtitleContainer = styled.div`
  padding: 10px 20px;
  background: #f8f8fb;
  borderradius: 4px;
  ${({ style }) => style};
  button {
    text-transform: uppercase;
    &:hover {
      background: green;
      color: ${white};
    }
  }
`;

export const EditorHeader = styled.div`
  width: 100%;
  background: ${greyThemeLighter};
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
// export const StyledFroalaEditor = styled(FroalaEditor)`
//   .fr-element {
//     background: #f8f8fb !important;
//     padding: 20px 20px;
//   }
//   .fr-placeholder {
//     color: #c1bebe;
//     letter-spacing: 1px;
//     z-index: 2;
//   }
// `;

export const StyledSectionContainer = styled.div`
  padding: 15px 30px 0 30px;
  ${({ style }) => style};
`;

export const StyledTextField = styled(TextField)`
  padding: 5px 15px;
  width: 100%;
  height: 38px;
  margin-bottom: 15px;
  margin-right: 0px;
  text-align: left;
  ::placeholder {
    font-style: normal;
    color: #b1b1b1;
  }
`;

export const StyledTitle = styled.div`
  padding: 5px 0;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
`;

export const StyledButton = styled(Button)`
  background: ${themeColor};
  color: ${white};
  padding: 6px 30px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  display: inline-block;
  float: right;
  padding: 6px 29px;
  ${({ style }) => style};
`;

export const StyledCodeEditorWrapper = styled.div`
  border: 2px solid ${borderGrey};
  border-bottom: none;
  border-radius: 4px 4px 0px 0px;
  ${({ style }) => style};
`;

export const StyledActionWrapper = styled.div`
  float: right;
  padding: 4.5px 0;
`;

export const StyledTable = styled(Table)`
  .ant-table {
    overflow: auto;
    ${({ border }) => border && { border: `1px solid ${borderGrey}`, borderTop: "none", borderRadius: "0 0 4px 4px" }};
    &-thead {
      & > tr > th {
        color: ${props => props.theme.manageDistrict.tableHeaderTxtColor};
        font-size: ${props => props.theme.manageDistrict.tableHeaderTxtSize};
        font-weight: bold;
        padding: 20px 10px;
        text-transform: uppercase;
        border: none;
        background: white;
        & > span {
          width: 100%;
        }
      }
      th.column-visibility {
        text-align: center;
      }
    }
    &-tbody {
      & > tr {
        background: ${white};
        font-family: Open Sans;
        letter-spacing: 0.26px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        & > td {
          border: none;
          border-bottom: 1px solid ${fadedGrey};
          padding: 10px 10px;
          font-weight: 550;
        }
        td.column-visibility {
          text-align: center;
        }
      }
    }
  }
`;

export const StyledTableButton = styled.a`
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
`;

export const StyledTableHeader = styled.div`
  text-align: center;
`;

export const StyledTabs = styled(Tabs)`
  border: 2px solid ${borderGrey};
  height: 250px;
  .ant-tabs {
    &-bar {
      border: none;
      margin: 0;
      text-transform: uppercase;
    }
    &-tab {
      font-size: 13px;
      font-weight: 600;
      padding: 16px 38px;
    }
  }
`;

export const StyledRadio = styled(Radio)`
  padding: 0 100px 0 0;
`;

export const StyledRadioGroup = styled(Radio.Group)`
  text-transform: uppercase;
  font-weight: 600;
  label {
    font-size: ${({ fontSize }) => fontSize};
  }
`;

export const EmptyWrapper = styled.div``;

export const CodeReviewWrapper = styled(StyledPaperWrapper)`
  border-radius: ${({ flowLayout }) => (flowLayout ? 0 : 10)}px;
  ${({ flowLayout }) => flowLayout && "background: transparent"};
  padding: ${props => (props.padding ? props.padding : "0px")};
  box-shadow: ${props => (props.boxShadow ? props.boxShadow : "none")};
`;

export const StyledModal = styled(Modal)`
  .ant {
    &-modal {
      &-content {
        padding: 0 30px;
        background: ${lightGreySecondary};
      }
      &-header {
        padding: 25px 24px 25px 0;
        background: ${lightGreySecondary};
        font-size: 20px;
        font-weight: bold;
        border: none;
      }
      &-title {
        font-weight: bold;
        font-size: 20px;
      }
      &-body {
        background: ${white};
        border-radius: 10px;
        box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid #f3f3f3;
      }
      &-footer {
        border: none;
        padding: 30px 30px 20px 30px;
        text-align: center;
        .ant-btn {
          height: 40px;
          padding: 0px 50px;
          border-color: ${green};
          text-transform: uppercase;
          min-width: 200px;
          &-primary {
            background: ${green};
            &:hover {
              background: green;
            }
          }
          &-secondary {
            color: ${green};
            &:hover {
              background: ${green};
              color: ${white};
            }
          }
        }
        button + button {
          margin-left: 15px;
        }
      }
      &-close-x {
        font-size: 20px;
        line-height: 61px;
        color: black;
      }
    }
  }
`;

export const StyledForm = styled(Form)`
  .ant-row {
    padding: 5px 0px;
    .ant-radio-group {
      height: 50px;
    }
  }
  .ant-select-selection,
  .ant-radio-inner,
  textarea,
  input,
  select {
    background: ${lightGreySecondary};
  }
  .ant-select-selection,
  textarea,
  input {
    height: 40px;
    border-radius: 0;
  }
  .ant-select-selection__rendered {
    line-height: 40px;
  }
  .ant-select-dropdown,
  .ant-dropdown {
    z-index: 10000;
  }
`;

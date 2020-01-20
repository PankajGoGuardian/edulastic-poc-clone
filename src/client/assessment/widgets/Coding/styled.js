import styled from "styled-components";
import { TextField, FroalaEditor } from "@edulastic/common";
import { themeColor, white, borderGrey, black, fadedGrey } from "@edulastic/colors";
import { Button, Table, Tabs, Radio } from "antd";
import { StyledPaperWrapper } from "../../styled/Widget";

export const SubtitleContainer = styled.div`
  padding: 10px 20px;
  background: #f8f8fb;
  borderradius: 4px;
  ${({ style }) => style};
`;

export const StyledFroalaEditor = styled(FroalaEditor)`
  .froala-wrapper {
    .fr-element {
      background: #f8f8fb !important;
      padding: 20px 20px;
    }
  }
`;

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
  border: 1px solid ${borderGrey};
  border-bottom: none;
  border-radius: 4px;
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
  border: 1px solid ${borderGrey};
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
`;

export const EmptyWrapper = styled.div``;

export const CodeReviewWrapper = styled(StyledPaperWrapper)`
  border-radius: ${({ flowLayout }) => (flowLayout ? 0 : 10)}px;
  ${({ flowLayout }) => flowLayout && "background: transparent"};
  padding: ${props => (props.padding ? props.padding : "0px")};
  box-shadow: ${props => (props.boxShadow ? props.boxShadow : "none")};
`;

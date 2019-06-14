import styled from "styled-components";

import { desktopWidth, fadedBlack, extraDesktopWidthMax, white, dashBorderColor, selectColor } from "@edulastic/colors";

export const WidgetWrapper = styled.div`
  margin-top: 30px;
`;

export const Widget = styled.div`
  position: relative;
  padding: 30px;
  background: #f8f8fb;
  border-radius: 4px;

  &:not(:first-child) {
    margin-top: 30px;
  }

  .ant-checkbox-wrapper + span,
  .ant-checkbox + span {
    padding-left: 20px;
    padding-right: 20px;
    font-size: 12px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .ql-editor {
    padding: ${props => (props.questionTextArea ? "0 !important" : "inherit")};
    font-size: ${props => (props.questionTextArea ? "14px" : "inherit")};
    color: ${props => (props.questionTextArea ? "#6A737F" : "inherit")};
    position: ${props => (props.questionTextArea ? "relative" : "inherit")};
    top: ${props => (props.questionTextArea ? "-7px" : "inherit")};

    &.ql-blank::before {
      color: ${props => (props.questionTextArea ? "#6A737F" : "inherit")};
      font-style: ${props => (props.questionTextArea ? "normal" : "inherit")};
    }
  }

  .passage_toolbar {
    top: -75px !important;
    left: 0 !important;
    z-index: 5 !important;
  }

  .ant-select {
    &-selection-selected-value {
      font-size: 12px;
      padding-left: 10px;
      letter-spacing: 0.3px;
      color: ${selectColor};
      font-weight: 600;
    }
  }

  @media (max-width: ${desktopWidth}) {
    padding: 20px;
    display: block !important;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }
`;

export const WidgetSubHeading = styled.div`
  color: ${fadedBlack};
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 1.333;
  list-style: none;
  display: block;
  font-weight: 600;

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 15px;
  }
`;

export const WidgetFRContainer = styled.div`
  .fr {
    &-box {
      background: ${white};
      min-height: 134px;
      border-radius: 4px;
      border: 1px solid ${dashBorderColor};
      display: flex;
    }
    &-wrapper {
      width: 100%;
      min-height: 100%;
      display: flex;
    }
    &-view {
      width: 100%;
      min-height: 100%;
      padding: 20px 23px;
    }
  }
`;

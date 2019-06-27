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
  ${({ visible }) =>
    typeof visible !== "undefined" &&
    !visible &&
    `
        position: absolute;
        top: -300000; 
        width: 0;
        height: 0;
        overflow: hidden;
      `}}

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
      max-height: 40px;
    }

    &-lg {
      .ant-select-selection__rendered {
        max-height: 40px;
        line-height: 42px;
      }

      .ant-select-selection--single {
        height: 42px;
      }
    }
  }

  .ant-input {
    border: 1px solid ${dashBorderColor};
  }

  div.main {
    box-shadow: none !important;
  }

  .ant-input {
    font-size: 12px;
    padding-left: 21px;
    letter-spacing: 0.3px;
    color: ${selectColor};
    font-weight: 600;
    min-height: 42px;
  }

  .ql-container {
    font-size: 12px;
    letter-spacing: 0.3px;
    font-weight: 600;
    margin-top: 6px !important;
  }

  .ql-editor {
    padding-left: 6px !important;
  }

  .text-editor {
    min-height: 42px !important;
  }

  .input__math {
    padding: 12px 2px;
  }

  .mq-root-block,
  .mq-math-mode .mq-root-block {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: ${selectColor};
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

export const WidgetMethods = styled.div`
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 50%;
    margin-top: 26px;
    order: 1;

    &:nth-child(1),
    &:nth-child(2) {
      margin-top: 0;
    }
  }

  .ant-checkbox-wrapper {
    width: 100%;
  }

  .ant-input {
    margin-left: 35px;
    width: calc(100% - 35px) !important;
    max-width: 295px;
  }
`;

export const WidgetSecondMethod = styled.div`
  order: 2 !important;
`;

export const WidgetFRInput = styled.div`
  .fr {
    &-box {
      background: ${white};
      border-radius: 4px;
      border: 1px solid ${dashBorderColor};
      display: flex;
      min-height: 42px;
    }
    &-wrapper {
      width: 100%;
      min-height: 100%;
      display: flex;
    }
    &-view {
      width: 100%;
      min-height: 100%;
      padding: 9px 21px;
    }
  }
`;

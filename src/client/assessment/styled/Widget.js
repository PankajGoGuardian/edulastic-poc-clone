import styled from "styled-components";

import {
  desktopWidth,
  mediumDesktopWidth,
  fadedBlack,
  extraDesktopWidthMax,
  white,
  dashBorderColor,
  selectColor,
  mediumDesktopExactWidth
} from "@edulastic/colors";

import { Paper } from "@edulastic/common";
import { createStandardTextStyle } from "../utils/helpers";

export const WidgetWrapper = styled.div`
  margin-top: 30px;
`;

export const Widget = styled.div`
  position: ${({ position }) => position || "relative"};
  padding: 25px 30px 30px;
  background: #f8f8fb;
  border-radius: 4px;
  min-height: 200px;
  ${({ overflowHandlers }) => overflowHandlers};
  display: ${({ advancedAreOpen }) => (advancedAreOpen !== null ? (advancedAreOpen ? "block" : "none") : "block")};
  ${({ visible }) =>
    typeof visible !== "undefined" &&
    !visible &&
    `
      position: absolute;
      top: -300000px; 
      width: 0;
      height: 0;
      overflow: hidden;
    `}
  ${({ styles }) => styles};
  &:not(:first-child) {
    margin-top: 30px;

    @media (max-width: ${mediumDesktopWidth}) {
      margin-top: 10px;
    }
  }

  .ant-checkbox-wrapper + span,
  .ant-checkbox + span {
    padding-left: 20px;
    padding-right: 20px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    ${props => createStandardTextStyle(props)}
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
      ${props => createStandardTextStyle(props)}
      padding-left: 10px;
      letter-spacing: 0.3px;
      color: ${selectColor};
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
    ${props => createStandardTextStyle(props)}
    padding-left: 21px;
    letter-spacing: 0.3px;
    color: ${selectColor};
    min-height: 42px;
  }

  .ql-container {
    ${props => createStandardTextStyle(props)}
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

  .mq-root-block,
  .mq-math-mode .mq-root-block {
    margin: 0;
    font-size: inherit;
    font-weight: 600;
    color: ${selectColor};
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    .ql-container,
    .ant-input,
    .ant-input-selection-selected-value {
      font-size: ${props => props.theme.smallFontSize};
    }
  }
  @media (max-width: ${desktopWidth}) {
    padding: 20px;
    min-height: 0;
    display: block !important;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }
`;

export const WidgetSubHeading = styled.div`
  color: ${fadedBlack};
  margin-bottom: 10px;
  font-size: ${props => props.theme.standardFont};
  line-height: 1.333;
  list-style: none;
  display: block;
  font-weight: 600;

  @media (min-width: ${extraDesktopWidthMax}) {
    line-height: 1.5;
    margin-bottom: 15px;
  }
  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;

export const WidgetMethods = styled.div`
  columns: 2;

  > div {
    width: 100%;
    margin-top: 26px;
    display: inline-block;
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

export const WidgetFRInput = styled.div`
  div.mig {
    /* 
      in case of migrated question
      there is an extra div for which we need to add width explicitly
      it is generic so cannot apply style there directly
     */
    width: 100%;
  }
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
      ${props => createStandardTextStyle(props)}
    }
  }
`;

export const StyledPaperWrapper = styled(Paper)`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainContentBgColor};
  ${({ overflowProps, paddingProps }) => ({ ...overflowProps, ...paddingProps })};

  textarea {
    user-select: text;
  }
`;

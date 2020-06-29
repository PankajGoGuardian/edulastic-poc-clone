import {
  dashBorderColor,
  desktopWidth,
  extraDesktopWidthMax,
  fadedBlack,
  greyThemeLight,
  greyThemeLighter,
  mediumDesktopExactWidth,
  selectColor,
  title
} from "@edulastic/colors";
import { Paper } from "@edulastic/common";
import styled from "styled-components";
import { createStandardTextStyle } from "../utils/helpers";

export const WidgetWrapper = styled.div`
  margin-top: 30px;
`;

export const Widget = styled.div`
  position: ${({ position }) => position || "relative"};
  padding: 0px 20px 40px;
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
    color: ${props => (props.questionTextArea ? title : "inherit")};
    position: ${props => (props.questionTextArea ? "relative" : "inherit")};
    top: ${props => (props.questionTextArea ? "-7px" : "inherit")};

    &.ql-blank::before {
      color: ${props => (props.questionTextArea ? title : "inherit")};
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
        line-height: 38px;
      }

      .ant-select-selection--single {
        height: 40px;
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
    padding-top: 5px;
  }

  .ql-container,
  .ant-input,
  .ant-input-selection-selected-value {
    font-size: ${props => props.theme.smallFontSize};

    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: ${props => props.theme.bodyFontSize};
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
  font-size: ${props => props.theme.smallFontSize};
  line-height: 1.333;
  list-style: none;
  display: block;
  font-weight: 600;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.standardFont};
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    line-height: 1.5;
    margin-bottom: 15px;
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
      background-color: ${greyThemeLighter};
      border: 1px solid ${greyThemeLight};
      font-size: ${props => props.fontSize || "13px"};
      width: 100%;
      min-height: 40px;
      padding: 0 15px;
      border-radius: 5px;
      font-weight: normal;
    }
    &-wrapper {
      width: 100%;
      min-height: 100%;
      display: flex;
    }
    &-view {
      width: 100%;
      min-height: 40px;
      padding: 10px 0px;
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

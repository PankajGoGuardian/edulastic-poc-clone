import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";

export const Widget = styled.div`
  padding: 30px;
  background: #f8f8fb;
  border-radius: 4px;

  &:not(:first-child) {
    margin-top: 30px;
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

  .toolbars {
    top: -75px !important;
    left: 0 !important;
    z-index: 5 !important;
  }

  @media (max-width: ${desktopWidth}) {
    padding: 20px;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }
`;

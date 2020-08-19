import styled from "styled-components";
import { white, green, mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";

export const WorksheetWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  overflow: auto;
  padding-top: ${({ editMode }) => editMode && "40px"};
  background: #f3f3f4;
  height: ${props =>
    `calc(100vh - 65px - ${
    (props.testMode
      ? `${70 + props.extraPaddingTop}`
      : props.reportMode
        ? props.theme.HeaderHeight.xs + 41 + props.extraPaddingTop
        : props.theme.HeaderHeight.xs + props.extraPaddingTop) || 0
    }px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props =>
    `calc(100vh - 65px  - ${
    (props.testMode
      ? `${70 + props.extraPaddingTop}`
      : props.reportMode
        ? props.theme.HeaderHeight.md + 41 + props.extraPaddingTop
        : props.theme.HeaderHeight.md + props.extraPaddingTop) || 0
    }px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props =>
    `calc(100vh - 65px - ${
    (props.testMode
      ? `${70 + props.extraPaddingTop}`
      : props.reportMode
        ? props.theme.HeaderHeight.xl + 41 + props.extraPaddingTop
        : props.theme.HeaderHeight.xl + props.extraPaddingTop) || 0
    }px)`};
  }
`;

export const MinimizeButton = styled.div`
  position: absolute;
  z-index: 1;
  left: ${({ minimized }) => (minimized ? "15px" : "auto")};
  right: ${({ minimized }) => (minimized ? "auto" : "0px")};
  top: 31px;
  width: 27px;
  height: 27px;
  background: ${white};
  border-radius: 4px 0px 0px 4px;
  cursor: pointer;
  transition: left 300ms ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    fill: ${green};
    transform: rotate(${({ minimized }) => (minimized ? 0 : "-180deg")});
    transition: transform 300ms ease-in-out;

    &:hover,
    &:active,
    &:focus {
      fill: ${green};
    }
  }
`;

export const PDFAnnotationToolsWrapper = styled.div`
  width: 100%;
  height: 40px;
  background: ${white};
  position: absolute;
  z-index: 1;
  border: 1px solid #D8D8D8;
  box-shadow: 0px 2px 2px #f0f0f0;
`;
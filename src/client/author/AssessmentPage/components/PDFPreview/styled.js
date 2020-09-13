import styled from "styled-components";
import { DragDrop } from "@edulastic/common";

import { white, mediumDesktopExactWidth, themeColor } from "@edulastic/colors";

const { DropContainer } = DragDrop;

export const PDFPreviewWrapper = styled.div`
  position: relative;
  padding-top: ${props => (props.reportMode ? "0px" : "15px")};
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: ${props => (props.testMode ? "15px" : props.review ? "60px" : "15px")};
  overflow-y: auto;
  width: 100%;
  transition: padding 0.2s ease-in;
  .scrollbar-container {
    border-radius: 5px;
  }
`;

export const Preview = styled.div`
  min-height: 90vh;
  width: 100%;
  background: ${white};
  position: relative;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 99%;
  }
`;

export const ZoomControlCotainer = styled.div`
  position: fixed;
  bottom: 70px;
  margin-left: -12px;
  display: flex;
  flex-direction: column;

  svg {
    fill: ${white};
    &:hover {
      fill: ${white};
    }
  }
`;

export const PDFZoomControl = styled.div`
  background: ${themeColor};
  width: 30px;
  height: 30px;
  font-size: 28px;
  font-weight: bolder;
  border-radius: 50%;
  color: ${white};
  display: flex;
  line-height: 0px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 5px;
`;

export const AnnotationsContainer = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  pointer-events: ${({ enableDrag }) => (enableDrag ? "" : "none")};
`;

export const Droppable = styled(DropContainer)`
  top: 0;
  display: block;
  width: fit-content;
  height: fit-content;
  margin: auto;
  position: relative;
`;

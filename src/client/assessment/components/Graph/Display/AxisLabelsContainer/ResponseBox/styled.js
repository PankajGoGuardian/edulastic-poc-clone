import styled from "styled-components";
import { Rnd } from "react-rnd";
import { themeColorHoverBlue } from "@edulastic/colors";

export const Container = styled.div`
  width: ${({ width }) => width};
  text-align: ${({ isHorizontal }) => (isHorizontal ? "" : "center")};
  margin-top: ${({ isHorizontal }) => (isHorizontal ? "24px" : "")};
  background-color: ${props => props.theme.widgets.axisLabels.responseBoxBgColor};
  padding: 15px 25px 25px;
  border-radius: 4px;
`;

export const Title = styled.div`
  margin: 0 auto 12px 0px;
  color: ${({ theme }) => theme.textColor};
  font-weight: ${({ theme }) => theme.bold};
  font-size: ${({ theme }) => theme.smallFontSize};
  line-height: ${({ theme }) => theme.headerLineHeight};
`;

export const MarkContainer = styled.div`
  margin: auto 0;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  height: 100%;

  .index-box {
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    margin-right: 8px;
    ${({ theme }) => `
      background: ${theme.widgets.axisLabels.indexBoxBgColor};
      color: ${theme.widgets.axisLabels.indexBoxColor};
      font-size: ${theme.widgets.axisLabels.indexBoxFontSize};
      font-weight: ${theme.widgets.axisLabels.indexBoxFontWeight};
    `};
  }
  .drag-item-cotent {
    display: flex;
    align-items: center;
  }
`;

export const DraggableOptionsContainer = styled.div`
  min-height: 50px;
  width: 100%;
  position: relative;
`;

export const StyledRnd = styled(Rnd).attrs({
  disableDragging: false,
  enableResizing: false
})`
  z-index: 10;
  &:hover {
    border-color: ${themeColorHoverBlue} !important;
    background: ${themeColorHoverBlue};
    .drag-item-cotent {
      color: white !important;
    }
  }
`;

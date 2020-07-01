import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";

export const Container = styled.div`
  position: relative;
  width: ${({ width }) => width};
  text-align: ${({ isHorizontal }) => (isHorizontal ? "" : "center")};
  background-color: ${props => props.theme.widgets.axisLabels.responseBoxBgColor};
`;

export const Title = styled.div`
  font-size: ${props => props.theme.widgets.axisLabels.responseBoxTitleFontSize};
  font-weight: ${props => props.theme.widgets.axisLabels.responseBoxTitleFontWeight};
  padding-left: 10px;
`;

export const MarkContainer = WithMathFormula(
  styled.div`
    margin: auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    height: 100%;

    .mark-content {
      div {
        margin: auto;
      }

      p {
        margin: auto;
      }
    }
  `
);

export const DraggableOptionsContainer = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  position: relative;
`;

import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";

export const Container = styled.div`
  position: relative;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  background-color: rgba(230, 230, 230, 0.23);
`;

export const Title = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
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
  `
);

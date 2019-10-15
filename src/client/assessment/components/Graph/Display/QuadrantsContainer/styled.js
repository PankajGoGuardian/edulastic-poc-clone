import styled from "styled-components";
import { white } from "@edulastic/colors";
import { WithMathFormula, Button } from "@edulastic/common";

export const StyledToolsContainer = styled.div`
  zoom: ${({ theme }) => theme?.widgets?.chart?.chartZoom};
`;

export const GraphWrapper = styled.div`
  width: ${props => (props.width ? `${props.width}px` : "100%")};
  border-radius: 4px;
  border: ${props => (props.border ? 1 : 0)}px solid ${props => props.borderColor};
`;

export const PrevColor = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 4px;
  background-color: ${props => props.color || "transparent"};
  margin-left: 10px;
`;

export const JSXBox = styled.div`
  background-color: ${props => props.theme.widgets.chart.bgColor} !important;
  position: relative;
  overflow: hidden;

  border: 1px solid #e8e8e8;
  border-radius: 0;
  border-color: ${props => props.theme.widgets.chart.axisBorderColor} !important;
  margin: ${props => (props.margin ? props.margin : 0)}px;

  line,
  path,
  ellipse {
    stroke: ${props => props.theme.widgets.chart.labelStrokeColor};
    fill: ${props => props.theme.widgets.chart.labelStrokeColor};
  }

  text {
    fill: ${props => props.theme.widgets.chart.labelStrokeColor};
    font-size: ${({ theme }) => theme?.fontSize}px !important;
  }

  div {
    color: ${props => props.theme.widgets.chart.labelStrokeColor} !important;
    background-color: ${props => props.theme.widgets.chart.bgColor} !important;
  }

  ${({ theme }) => theme.zoomedCss`
    .graph-shape-label {
      font-size: ${theme?.fontSize}px !important;
      background-color: transparent !important;
    }
  `}
`;
export const LabelTop = WithMathFormula(styled.div`
  height: 20px;
  line-height: 20px;
  top: 0;
  left: 0;
  text-align: center;
  position: absolute;
  width: 100%;
`);
export const LabelBottom = WithMathFormula(styled.div`
  height: 20px;
  line-height: 20px;
  bottom: 0;
  left: 0;
  text-align: center;
  position: absolute;
  width: 100%;
`);
export const LabelRight = WithMathFormula(styled.div`
  height: 20px;
  line-height: 20px;
  transform: rotate(90deg);
  transform-origin: top right;
  bottom: 0;
  left: 0;
  text-align: center;
  position: absolute;
  width: 100%;
  padding-left: 40px;
`);
export const LabelLeft = WithMathFormula(styled.div`
  height: 20px;
  line-height: 20px;
  transform: rotate(-90deg);
  transform-origin: top left;
  bottom: 0;
  left: 0;
  text-align: center;
  position: absolute;
  width: 100%;
  padding-right: 40px;
`);

export const Title = WithMathFormula(styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 1.5em;
  display: block;
  padding: 1em 0;
`);

export const JSXBoxWrapper = styled.div`
  position: relative;
  overflow: auto;
  width: ${props => `${props.width}px`};
`;

export const JSXBoxWithDrawingObjectsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

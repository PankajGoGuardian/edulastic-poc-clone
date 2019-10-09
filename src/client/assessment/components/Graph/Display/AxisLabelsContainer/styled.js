import styled from "styled-components";

export const GraphWrapper = styled.div`
  width: ${props => (props.width ? `${props.width}px` : "100%")};
  border-radius: 4px;
  border: ${props => (props.border ? 1 : 0)}px solid ${props => props.borderColor};
  zoom: ${props => props.theme.widgets.chart.chartZoom};
`;

export const JSXBox = styled.div`
  background-color: ${props => props.theme.widgets.chart.bgColor};
  position: relative;
  overflow: hidden;

  border: 1px solid #e8e8e8;
  border-radius: 0;
  border-color: ${props => props.theme.widgets.chart.axisBorderColor} !important;
  margin: ${props => (props.margin ? props.margin : 0)}px;

  line,
  path {
    stroke: ${props => props.theme.widgets.chart.labelStrokeColor};
  }

  div {
    color: ${props => props.theme.widgets.chart.labelStrokeColor};
  }
`;

export const ContainerWithResponses = styled.div`
  .mark {
    color: ${props => props.theme.widgets.chart.labelStrokeColor};
    border-color: ${props => props.theme.widgets.chart.labelStrokeColor};
    &.mounted::after {
      border-color: ${props => props.theme.widgets.chart.labelStrokeColor} transparent transparent transparent;
    }
  }
  display: flex;
  flex-direction: ${({ responseBoxPosition }) =>
    responseBoxPosition === "top"
      ? "column"
      : responseBoxPosition === "bottom"
      ? "column-reverse"
      : responseBoxPosition === "left"
      ? "row"
      : "row-reverse"};
  justify-content: ${({ responseBoxPosition }) =>
    responseBoxPosition === "top" || responseBoxPosition === "left" ? "flex-start" : "flex-end"};
`;

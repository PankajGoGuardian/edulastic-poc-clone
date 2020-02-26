import styled from "styled-components";

export const StyledToolsContainer = styled.div`
  zoom: ${({ theme }) => theme?.widgets?.chart?.chartZoom};
  width: ${props => (props.width && `${props.width}px`) || "100%"};
`;

export const GraphWrapper = styled.div`
  width: ${props => (props.width ? `${props.width}px` : "100%")};
  border-radius: 4px;
  border: ${props => (props.border ? 1 : 0)}px solid ${props => props.borderColor};
`;

export const JSXBox = styled.div`
  background-color: ${props => props.theme.widgets.chart.bgColor};
  position: relative;
  overflow: hidden;

  border: 1px solid #e8e8e8;
  border-radius: 0;
  border-color: ${props => props.theme.widgets.chart.axisBorderColor} !important;
  margin: ${props => (props.margin ? props.margin : 0)}px;

  div {
    color: ${props => props.theme.widgets.chart.labelStrokeColor};
  }

  .fr-box.mark.mounted {
    .mark-content {
      div {
        margin: auto;
      }
      p {
        margin: auto;
      }
    }
  }
`;

export const ContainerWithResponses = styled.div`
  overflow: auto;
  width: 100%;
  .mark {
    color: ${props => props.theme.widgets.chart.labelStrokeColor};
    border-color: ${props => props.theme.widgets.chart.labelStrokeColor};
    &.mounted::after {
      border-color: ${props => props.theme.widgets.chart.labelStrokeColor} transparent transparent
        transparent;
    }
  }
  display: flex;

  .jsxbox-with-response-box-response-options {
    width: 100%;
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
  }
`;

import styled from "styled-components";
import { greenDark, secondaryTextColor, white, green } from "@edulastic/colors";
import { WithMathFormula } from "@edulastic/common";

export const StyledToolsContainer = styled.div`
  zoom: ${({ theme }) => theme?.widgets?.chart?.chartZoom};
`;

export const GraphToolbar = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 88px;
  padding: 0;
  background-color: rgba(230, 230, 230, 0.23);
  font-size: ${props => (props.fontSize ? props.fontSize : 14)}px;

  ul {
    list-style: none;
  }

  ul li {
    margin: 2px 1px 0 0;
  }
`;

export const ToolbarLeft = styled.ul`
  display: flex;
  max-width: 100%;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

export const ToolbarRight = styled.ul`
  display: flex;
  align-items: center;
  min-width: 93px;
  height: 100%;
  margin: 0;
  margin-left: auto;
  padding: 0;
`;

export const ToolbarItem = styled.div`
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ToolbarItemLabel = styled.span`
  color: ${props => (props.color ? props.color : `${secondaryTextColor}`)}
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
`;

export const ToolbarItemIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  width: auto;
  height: auto;
  min-width: 23px;
  min-height: 24px;
  margin-bottom: 5px;
`;

export const ToolBtn = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 93px;
  height: 84px;
  background-color: ${white};
  color: #878a91;
  cursor: pointer;
  display: inline-block;
  line-height: 1.5em;
  transition: background-color 0.1s ease-in;
  user-select: none;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0);
  svg {
    stroke: #878a91;
    fill: #878a91;
    &:hover {
      stroke: #878a91;
      fill: #878a91;
    }
  }

  &.active {
    background-color: #878a91;
    color: ${white};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);
    svg {
      stroke: #878a91;
      fill: #878a91;
    }
  }
`;

export const GraphWrapper = styled.div`
  width: ${props => (props.width ? `${props.width}px` : "100%")};
  border-radius: 4px;
  border: ${props => (props.border ? 1 : 0)}px solid ${props => props.borderColor};

  .jxgbox {
    .fr-box {
      min-width: 50px;
      min-height: 13px;
      border: dotted 1px black;
    }
  }
`;

export const JSXBox = styled.div`
  // IMPORTANT: TRY NOT TO WRITE SVG ELEMENTS STYLE HERE CUZ ATTRIBUTES GET OVERRIDEN

  background-color: ${props => props.theme.widgets.chart.bgColor} !important;
  position: relative;
  overflow: hidden;

  border: 1px solid #e8e8e8;
  border-radius: 0;
  border-color: ${props => props.theme.widgets.chart.axisBorderColor} !important;
  margin: ${props => (props.margin ? props.margin : 0)}px;

  text {
    fill: ${props => props.theme.widgets.chart.labelStrokeColor};
  }

  div {
    color: ${props => props.theme.widgets.chart.labelStrokeColor};
    background-color: ${props => props.theme.widgets.chart.bgColor};
  }

  .drag-drop-content {
    p {
      font-size: 10px;
      line-height: 1;
    }

    .drag-drop-icon {
      height: 18px;
      width: 18px;
      border-radius: 9px;

      position: relative;
    }
  }

  .drag-drop-content-correct {
    > :first-child {
      width: calc(100% - 18px);
    }

    background-color: ${props => props.theme.widgets.graphPlacement.rightBgColor};
    color: ${props => props.theme.widgets.graphPlacement.descriptionColor};

    .drag-drop-icon {
      background-color: transparent;
      fill: ${props => props.theme.widgets.graphPlacement.rightIconColor};
      margin: 0 2px;
    }
  }

  .drag-drop-content-incorrect {
    > :first-child {
      width: calc(100% - 18px);
    }

    background-color: ${props => props.theme.widgets.graphPlacement.wrongBgColor};
    color: ${props => props.theme.widgets.graphPlacement.descriptionColor};

    .drag-drop-icon {
      background-color: transparent;
      fill: ${props => props.theme.widgets.graphPlacement.wrongIconColor};
      margin: 0 2px;
    }
  }
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

export const JSXBoxWithDropValues = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const DragDropValuesContainer = styled.div`
  position: relative;
  min-width: ${props => props.width}px;
  min-height: ${props => props.minHeight}px;
  height: ${props => props.height}px;
  background-color: ${props => props.theme.widgets.axisLabels.responseBoxBgColor};

  .drag-drop-value {
    background: ${props => props.theme.widgets.axisLabels.responseBoxBgColor};
    white-space: nowrap;
    border-radius: 4px;
    padding: 0 5px;
    display: flex !important;
    overflow: hidden;

    p {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    img.fr-dii {
      max-height: 50px !important;
      width: 100%;
      max-width: 120px !important;
      user-drag: none;
      user-select: none;
    }
  }

  .froala-wrapper {
    margin: auto;
  }
`;

export const DragDropTitle = styled.div`
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  font-size: ${props => props.theme.widgets.graphPlacement.dragDropTitleFontSize};
  font-weight: ${props => props.theme.widgets.graphPlacement.dragDropTitleFontWeight};
  width: 100%;
  text-align: center;
`;

export const DragDropContainer = WithMathFormula(
  styled.div`
    margin: auto 0;
    width: 100%;
  `
);

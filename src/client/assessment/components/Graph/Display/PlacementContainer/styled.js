import styled, { css } from "styled-components";
import { secondaryTextColor, white, greyishBorder } from "@edulastic/colors";
import { WithMathFormula } from "@edulastic/common";

export const StyledToolsContainer = styled.div`
  zoom: ${({ theme }) => theme?.widgets?.chart?.chartZoom};
  margin-bottom: 12px;
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
  color: ${props => (props.color ? props.color : `${secondaryTextColor}`)};
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
`;

const borderStyle = css`
  border-radius: 0;
  border-style: solid;
  border-width: ${({ showBorder }) => (showBorder ? 1 : 0)}px;
  border-color: ${props => props.theme.widgets.chart.axisBorderColor} !important;
`;

export const JSXBoxWrapper = styled.div`
  position: relative;
  overflow: ${({ showBorder }) => (showBorder ? "hidden" : "auto")};
  width: ${props => `${props.width + 5}px`};
  ${borderStyle}
`;

export const JSXBox = styled.div`
  // IMPORTANT: TRY NOT TO WRITE SVG ELEMENTS STYLE HERE CUZ ATTRIBUTES GET OVERRIDEN

  background-color: ${props => props.theme.widgets.chart.bgColor} !important;
  position: relative;
  overflow: hidden;
  margin: ${props => (props.margin ? props.margin : 0)}px;
  ${borderStyle}

  .fr-box {
    border-radius: 4px;
    &.drag-drop {
      border: 1px solid ${greyishBorder};
      &.incorrect {
        border: 1px solid ${props => props.theme.widgets.graphPlacement.wrongBgColor};
      }
      &.correct {
        border: 1px solid ${props => props.theme.widgets.graphPlacement.rightBgColor};
      }
    }
  }

  text {
    fill: ${props => props.theme.widgets.chart.labelStrokeColor};
  }

  div {
    color: ${props => props.theme.widgets.chart.labelStrokeColor};
    background-color: ${props => props.theme.widgets.chart.bgColor};
  }

  .drag-drop-content {
    p {
      font-size: 14px;
      line-height: 1;
    }
  }

  .drag-drop-content-correct {
    > :first-child {
      width: calc(100% - 18px);
    }

    background-color: ${props => !props.isPrintPreview && props.theme.widgets.graphPlacement.rightBgColor};
    color: ${props => props.theme.widgets.graphPlacement.descriptionColor};

    .drag-drop-icon {
      fill: ${props => props.theme.widgets.graphPlacement.rightIconColor};
    }
    .drag-drop-content-triangle::before {
      border-top: 8px solid ${props => !props.isPrintPreview && props.theme.widgets.graphPlacement.rightBgColor};
    }
    .drag-drop-content-triangle::after {
      border-top: 7px solid ${props => !props.isPrintPreview && props.theme.widgets.graphPlacement.rightBgColor};
    }
  }

  .drag-drop-content-incorrect {
    > :first-child {
      width: calc(100% - 18px);
    }
    background-color: ${props => !props.isPrintPreview && props.theme.widgets.graphPlacement.wrongBgColor};
    color: ${props => props.theme.widgets.graphPlacement.descriptionColor};
    .drag-drop-icon {
      fill: ${props => props.theme.widgets.graphPlacement.wrongIconColor};
    }
    .drag-drop-content-triangle::before {
      border-top: 8px solid ${props => !props.isPrintPreview && props.theme.widgets.graphPlacement.wrongBgColor};
    }
    .drag-drop-content-triangle::after {
      border-top: 7px solid ${props => !props.isPrintPreview && props.theme.widgets.graphPlacement.wrongBgColor};
    }
  }
`;

export const JSXBoxWithDropValues = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const DragDropValuesContainer = styled.div`
  position: relative;
  min-height: 100px;
  min-width: 100%;
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  background-color: ${props => props.theme.widgets.axisLabels.responseBoxBgColor};
  padding: 15px 25px 22px;
  margin-top: 20px;

  .drag-drop-value {
    overflow: hidden;
    p {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    img.fr-dii {
      max-height: 50px !important;
      width: 100%;
      max-width: 120px !important;
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

export const LabelTop = WithMathFormula(styled.div`
  height: 1.4rem;
  line-height: 1rem;
  top: 0;
  left: 0;
  text-align: center;
  vertical-align: middle;
  position: absolute;
  width: 100%;
`);
export const LabelBottom = WithMathFormula(styled.div`
  height: 1.4rem;
  line-height: 1rem;
  bottom: 0;
  left: 0;
  text-align: center;
  vertical-align: middle;
  position: absolute;
  width: 100%;
`);
export const LabelRight = WithMathFormula(styled.div`
  height: 1.4rem;
  line-height: 1rem;
  transform: rotate(90deg);
  transform-origin: top right;
  bottom: 0;
  left: 0;
  text-align: center;
  vertical-align: middle;
  position: absolute;
  width: 100%;
  padding-left: 40px;
`);

export const DragDropContainer = WithMathFormula(
  styled.div`
    margin: auto 0;
    width: 100%;
  `
);

export const Title = WithMathFormula(styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 1.5em;
  display: block;
  padding: 1em 0;
`);

export const LabelLeft = WithMathFormula(styled.div`
  height: 1.4rem;
  line-height: 1rem;
  transform: rotate(-90deg);
  transform-origin: top left;
  bottom: 0;
  left: 0;
  text-align: center;
  vertical-align: middle;
  position: absolute;
  width: 100%;
  padding-right: 40px;
`);

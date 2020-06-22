import React from "react";
import styled from "styled-components";
import { isEmpty } from "lodash";
import { FlexContainer } from "@edulastic/common";
import { drawTools } from "@edulastic/constants";
import FillColor from "./components/FillColor";
import StrokeOption from "./components/StrokeOption";
import FontOption from "./components/FontOption";
import EditingOption from "./components/EditingOption";

const SubOptions = ({ activeMode, selectedNodes, ...rest }) => {
  let options = [];

  if (isEmpty(selectedNodes)) {
    switch (activeMode) {
      case drawTools.FREE_DRAW:
      case drawTools.DRAW_BREAKING_LINE:
      case drawTools.DRAW_CURVE_LINE:
        options = [<StrokeOption {...rest} />];
        break;
      case drawTools.DRAW_SQUARE:
      case drawTools.DRAW_CIRCLE:
      case drawTools.DRAW_TRIANGLE:
        options = [<FontOption {...rest} />, <FillColor {...rest} />, <StrokeOption {...rest} />];
        break;
      case drawTools.DRAW_TEXT:
      case drawTools.DRAW_MATH:
        options = [<FontOption {...rest} />];
        break;
      default:
        break;
    }
  } else if (selectedNodes?.includes("PathNode")) {
    options = [<FontOption {...rest} />, <FillColor {...rest} />, <StrokeOption {...rest} />];
  } else {
    if (selectedNodes?.includes("TextNode")) {
      options.push(<FontOption {...rest} />);
    }
    if (selectedNodes?.includes("BrushNode")) {
      options.push(<StrokeOption {...rest} />);
    }
  }

  if (drawTools.EDITING_TOOL === activeMode) {
    options = [<EditingOption {...rest} disabled={isEmpty(selectedNodes)} />];
  }

  return (
    <SubOptionsContainer flex={1} justifyContent="flex-start">
      {options}
    </SubOptionsContainer>
  );
};

export default SubOptions;

const SubOptionsContainer = styled(FlexContainer)`
  position: relative;

  &::before {
    content: "";
    height: 34px;
    line-height: 35px;
    width: 1px;
    position: absolute;
    left: -5px;
    border-left: 1px solid #ffffff;
    border-right: 1px solid #ccc;
  }

  .ant-select-dropdown-menu-item {
    padding: 5px 8px;
  }
`;

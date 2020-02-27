import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  IconPencilEdit,
  IconTrash,
  IconRedo,
  IconUndo,
  IconLine,
  IconBreakingLine,
  IconSquare,
  IconTriangle,
  IconCircleWithPoints,
  IconLetters,
  IconRoot,
  IconSquareTriangle,
  IconSelected,
  IconMoveArrows,
  IconCurveLine,
  IconChevronLeft
} from "@edulastic/icons";
import { drawTools } from "@edulastic/constants";
import { white, greenDark5 } from "@edulastic/colors";
import { Tooltip } from "../../../../common/utils/helpers";
import { customizeIcon, StyledButton, Separate } from "./styled";

export const Trash = customizeIcon(IconTrash);

export const Redo = customizeIcon(IconRedo);

export const Undo = customizeIcon(IconUndo);

export const Back = customizeIcon(IconChevronLeft);

const Move = customizeIcon(IconMoveArrows);

const Pencil = customizeIcon(IconPencilEdit);

const LineIcon = customizeIcon(IconLine);

const BreakingLineIcon = customizeIcon(IconBreakingLine);

const CurveLine = customizeIcon(IconCurveLine);

const SquareIcon = customizeIcon(IconSquare);

const TriangleIcon = customizeIcon(IconTriangle);

const CircleWithPointsIcon = customizeIcon(IconCircleWithPoints);

const LettersIcon = customizeIcon(IconLetters);

const RootIcon = customizeIcon(IconRoot);

const SquareTriangleIcon = customizeIcon(IconSquareTriangle);

const SelectedIcon = customizeIcon(IconSelected);

export const buttonsList = [
  { mode: drawTools.MOVE_ITEM, icon: Move, label: "Move" },
  { mode: drawTools.FREE_DRAW, icon: Pencil, label: "Pencil" },
  { mode: drawTools.DRAW_SIMPLE_LINE, icon: LineIcon, label: "Draw Line" },
  { mode: drawTools.DRAW_BREAKING_LINE, icon: BreakingLineIcon, label: "Draw Breaking Line" },
  { mode: drawTools.DRAW_CURVE_LINE, icon: CurveLine, label: "Draw Curve Line" },
  { mode: drawTools.DRAW_SQUARE, icon: SquareIcon, label: "Draw Square" },
  { mode: drawTools.DRAW_TRIANGLE, icon: TriangleIcon, label: "Draw Triangle" },
  { mode: drawTools.DRAW_CIRCLE, icon: CircleWithPointsIcon, label: "Draw Circle" },
  { mode: drawTools.DRAW_TEXT, icon: LettersIcon, label: "Text" },
  { mode: drawTools.DRAW_MATH, icon: RootIcon, label: "Math Equation" },
  { mode: drawTools.DRAW_MEASURE_TOOL, icon: SquareTriangleIcon, label: "Measure Tool" },
  { mode: drawTools.SELECT_TOOL, icon: SelectedIcon, label: "Select" }
];

export const BackButton = ({ onClick }) => (
  <StyledButton onClick={onClick("")}>
    <Back />
    <Separate />
  </StyledButton>
);

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export const ActiveTool = ({ activeMode }) => {
  const activeTool = buttonsList.find(button => button.mode === activeMode);
  return (
    <StyledButton active>
      <activeTool.icon color={greenDark5} />
      <Separate />
    </StyledButton>
  );
};

ActiveTool.propTypes = {
  activeMode: PropTypes.string.isRequired
};

const DrawingTools = ({ onChange, isTestMode, className }) => {
  const [active, setActive] = useState(null);
  const availableBtns = isTestMode ? buttonsList.filter(obj => obj.mode !== "none") : buttonsList;

  const handleMouseEnter = i => () => setActive(i);
  const handleMouseLeave = () => setActive(null);

  return availableBtns.map((button, i) => (
    <Tooltip placement="right" title={button.label} key={button.mode}>
      <StyledButton
        key={i}
        onClick={onChange(button.mode)}
        onMouseEnter={handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
      >
        <button.icon color={active === i ? greenDark5 : white} />
      </StyledButton>
    </Tooltip>
  ));
};

DrawingTools.propTypes = {
  onChange: PropTypes.func.isRequired,
  isTestMode: PropTypes.bool
};

DrawingTools.defaultProps = {
  isTestMode: false
};

export default DrawingTools;

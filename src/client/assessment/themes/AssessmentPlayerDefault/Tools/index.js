/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { white, greenDark5 } from "@edulastic/colors";
import { FlexContainer, FontPicker } from "@edulastic/common";
import { drawTools } from "@edulastic/constants";
import { Tooltip } from "../../../../common/utils/helpers";
import Size from "./Size";
import ColorPicker from "./color";
import BottomTools from "./BottomTools";
import tools, { Back } from "./tools";
import { StyledButton, ToolBox, ActiveToolBoxContainer } from "./styled";

const showFontArr = [drawTools.DRAW_TEXT, drawTools.DRAW_MATH, drawTools.MOVE_ITEM];

const Tools = ({
  isWorksheet,
  onToolChange,
  activeMode,
  onFillColorChange,
  fillColor,
  currentColor,
  deleteMode,
  onColorChange,
  undo,
  redo,
  testMode,
  review,
  isToolBarVisible,
  isDocBased = false,
  className,
  lineWidth,
  onChangeSize,
  containerStyle,
  onChangeFont,
  currentFont
}) => {
  let buttonsList = tools;

  if (isDocBased || testMode) {
    buttonsList = tools.filter(obj => obj.mode !== "none");
  }

  const activeTool = buttonsList.find(button => button.mode === activeMode);

  return (
    <ToolBox
      activeMode={activeMode}
      isWorksheet={isWorksheet}
      justifyContent="space-around"
      review={review}
      testMode={testMode}
      flexDirection="column"
      isToolBarVisible={isToolBarVisible}
      className={className}
      style={containerStyle}
    >
      {activeMode === "" &&
        buttonsList.map((button, i) => (
          <Tooltip placement="right" title={button.label}>
            <StyledButton key={i} onClick={onToolChange(button.mode)} enable={activeMode === button.mode}>
              <button.icon color={white} />
            </StyledButton>
          </Tooltip>
        ))}

      {activeMode !== "" && (
        <ActiveToolBoxContainer flexDirection="column" justifyContent="space-between">
          <FlexContainer flexDirection="column">
            <StyledButton onClick={onToolChange("")} separateLine>
              <Back />
            </StyledButton>

            {activeTool && (
              <StyledButton enable onClick={onToolChange("")} separateLine>
                <activeTool.icon color={greenDark5} />
              </StyledButton>
            )}
            <FlexContainer flexDirection="column" childMarginRight={0} id="tool">
              <Size value={lineWidth} onChangeSize={onChangeSize} />
              {showFontArr.includes(activeMode) && <FontPicker onChange={onChangeFont} currentFont={currentFont} />}
              <ColorPicker
                activeMode={activeMode}
                fillColor={fillColor}
                currentColor={currentColor}
                onFillColorChange={onFillColorChange}
                onColorChange={onColorChange}
              />
            </FlexContainer>
          </FlexContainer>

          <BottomTools undo={undo} redo={redo} onToolChange={onToolChange} deleteMode={deleteMode} />
        </ActiveToolBoxContainer>
      )}
    </ToolBox>
  );
};

Tools.propTypes = {
  onToolChange: PropTypes.func.isRequired,
  activeMode: PropTypes.string.isRequired,
  currentColor: PropTypes.string.isRequired,
  onChangeSize: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
  onFillColorChange: PropTypes.func.isRequired,
  fillColor: PropTypes.string.isRequired,
  deleteMode: PropTypes.bool.isRequired,
  lineWidth: PropTypes.number.isRequired,
  containerStyle: PropTypes.object,
  onChangeFont: PropTypes.func,
  currentFont: PropTypes.string
};

Tools.defaultProps = {
  containerStyle: {},
  onChangeFont: () => null,
  currentFont: ""
};

export default Tools;

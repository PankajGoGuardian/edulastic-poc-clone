import React, { useContext } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { FlexContainer, FontPicker, ScrollContext } from "@edulastic/common";
import { drawTools } from "@edulastic/constants";
import Size from "./Size";
import ColorPicker from "./color";
import BottomTools from "./BottomTools";
import SelectToolOptions from "./SelectToolOptions";
import DrawingTools, { ActiveTool, BackButton } from "./tools";
import { ToolBox, ActiveToolBoxContainer, toolBoxDimension } from "./styled";

const showFontArr = [drawTools.DRAW_TEXT, drawTools.DRAW_MATH, drawTools.MOVE_ITEM];

const Tools = ({
  isWorksheet,
  onToolChange,
  onChangeEditTool,
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
  currentFont,
  style = {}
}) => {
  /**
   * for positioning of drawing toolbox,
   * we should use scroll container from Scroll Context.
   * if scroll container is window, will use default height
   */
  const { getScrollElement } = useContext(ScrollContext);
  const scrollContainer = getScrollElement();
  let containerHeight = get(scrollContainer, "clientHeight", 0);
  if (scrollContainer && !containerHeight) {
    containerHeight = toolBoxDimension.height;
  }

  return (
    <ToolBox
      activeMode={activeMode}
      isWorksheet={isWorksheet}
      justifyContent="center"
      alignItems="flex-start"
      review={review}
      testMode={testMode}
      flexDirection="column"
      isToolBarVisible={isToolBarVisible || containerHeight}
      className={className}
      height={containerHeight}
      style={{ ...containerStyle, ...style }}
    >
      {activeMode === "" && (
        <DrawingTools onChange={onToolChange} isTestMode={isDocBased || testMode} containerHeight={containerHeight} />
      )}

      {/* id "tool" was needed to handle the width of rc-color-picker. */}
      {activeMode !== "" && (
        <ActiveToolBoxContainer flexDirection="column" id="tool" justifyContent="space-between">
          <FlexContainer flexDirection="column">
            <BackButton onClick={onToolChange} />
            <ActiveTool activeMode={activeMode} />
            {drawTools.SELECT_TOOL !== activeMode && (
              <>
                <Size value={lineWidth} onChangeSize={onChangeSize} />
                {showFontArr.includes(activeMode) && <FontPicker onChange={onChangeFont} currentFont={currentFont} />}
                <ColorPicker
                  activeMode={activeMode}
                  fillColor={fillColor}
                  currentColor={currentColor}
                  onFillColorChange={onFillColorChange}
                  onColorChange={onColorChange}
                />
              </>
            )}
            {drawTools.SELECT_TOOL === activeMode && <SelectToolOptions onChangeEditTool={onChangeEditTool} />}
          </FlexContainer>
          <BottomTools undo={undo} redo={redo} onToolChange={onToolChange} deleteMode={deleteMode} />
        </ActiveToolBoxContainer>
      )}
    </ToolBox>
  );
};

Tools.propTypes = {
  onToolChange: PropTypes.func.isRequired,
  onChangeEditTool: PropTypes.func,
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
  onChangeEditTool: () => null,
  currentFont: ""
};

export default Tools;

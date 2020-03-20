/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { FlexContainer, FontPicker } from "@edulastic/common";
import { drawTools } from "@edulastic/constants";
import Size from "./Size";
import ColorPicker from "./color";
import BottomTools from "./BottomTools";
import SelectToolOptions from "./SelectToolOptions";
import DrawingTools, { ActiveTool, BackButton } from "./tools";
import { ToolBox, ActiveToolBoxContainer, ExpandWrapper, StyledButton } from "./styled";
import { Tooltip } from "../../../../common/utils/helpers";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isUndefined } from "lodash";

const showFontArr = [drawTools.DRAW_TEXT, drawTools.DRAW_MATH, drawTools.MOVE_ITEM];
const buttonsHeights = {
  showBackButton: 48,
  showActiveTool: 48,
  showFontPicker: 67,
  showColorPicker: 134,
  showToolOptions: 48 * 5,
  showButtomTools: 50 * 3
};

const moreButtonHeight = 56;
const scratchPadPaddingTop = 58;

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
  currentFont,
  scratchpadResponsiveHeight,
  style = {}
}) => {
  const [expandMore, setExpandMore] = useState(false);
  const expandMoreButtons = () => setExpandMore(true);
  const collapseMoreButtons = () => setExpandMore(false);
  const getSetting = () => {
    const setting = {};
    let remainingHeight = scratchpadResponsiveHeight - scratchPadPaddingTop;
    Object.keys(buttonsHeights).forEach(key => {
      const anyItemNotToShow = Object.values(setting).filter(s => s === false).length > 0;
      if (!anyItemNotToShow) {
        if (key === "showFontPicker" || key === "showColorPicker") {
          if (drawTools.SELECT_TOOL !== activeMode) {
            setting[key] = remainingHeight > buttonsHeights[key];
            if (setting[key]) {
              remainingHeight = remainingHeight - buttonsHeights[key];
            }
          }
        } else if (key === "showToolOptions") {
          if (drawTools.SELECT_TOOL === activeMode) {
            setting[key] = remainingHeight > buttonsHeights[key];
            if (setting[key]) {
              remainingHeight = remainingHeight - buttonsHeights[key];
            }
          }
        } else {
          setting[key] = remainingHeight > buttonsHeights[key];
          if (setting[key]) {
            remainingHeight = remainingHeight - buttonsHeights[key];
          }
        }
      } else {
        setting[key] = false;
      }
    })
    const anyButtonNotTodisplayIndex = Object.values(setting).filter(s => s).length - 1;
    if (anyButtonNotTodisplayIndex !== -1) {
      if (remainingHeight < moreButtonHeight) {
        const btn = Object.keys(setting)[anyButtonNotTodisplayIndex];
        setting[btn] = false;
      }
    }
    return setting;
  }

  const renderShowMore = setting => {
    const {showBackButton, showActiveTool, showFontPicker, showColorPicker, showToolOptions, showButtomTools } = setting;
    return <ExpandWrapper
      onMouseEnter={expandMoreButtons}
      onMouseLeave={collapseMoreButtons}
      style={{bottom: "-56px", alignItems: "flex-end"}}
      >
      <FlexContainer style={{alignItems: "flex-end"}}>
        <Tooltip placement="right">
          <StyledButton
          >
            <FontAwesomeIcon icon={faEllipsisV} style={{transform: "rotate(90deg)", color: "#ffffff"}} />
          </StyledButton>
        </Tooltip>
        {expandMore && <>
          {!showBackButton && <BackButton onClick={onToolChange} />}
          {!showActiveTool && <ActiveTool activeMode={activeMode} />}
          <FlexContainer childMarginRight={0} id="tool">
            {drawTools.SELECT_TOOL !== activeMode && (
              <>
                {!showFontPicker && <Size value={lineWidth} onChangeSize={onChangeSize} style={{marginRight: "8px"}} />}
                {showFontArr.includes(activeMode) && !showFontPicker && <FontPicker onChange={onChangeFont} currentFont={currentFont} style={{marginRight: "8px"}} />}
                {!showColorPicker && <ColorPicker
                  activeMode={activeMode}
                  fillColor={fillColor}
                  currentColor={currentColor}
                  onFillColorChange={onFillColorChange}
                  onColorChange={onColorChange}
                  style={{marginRight: "8px"}}
                />}
              </>
            )}
            {drawTools.SELECT_TOOL === activeMode && !showToolOptions && <SelectToolOptions />}
          </FlexContainer>
          </>
        }
      </FlexContainer>

      {!showButtomTools && expandMore && <BottomTools undo={undo} redo={redo} onToolChange={onToolChange} deleteMode={deleteMode} />}
    </ExpandWrapper>
  }
  const setting = isUndefined(scratchpadResponsiveHeight) ? {} : getSetting();
  const showMore = Object.values(setting).filter(s => !s).length > 0;
  const {
    showBackButton = true,
    showActiveTool = true, 
    showFontPicker = true,
    showColorPicker = true,
    showToolOptions = true,
    showButtomTools = true
  } = setting;

  return <ToolBox
    activeMode={activeMode}
    isWorksheet={isWorksheet}
    justifyContent="space-around"
    review={review}
    testMode={testMode}
    flexDirection="column"
    isToolBarVisible={isToolBarVisible}
    className={className}
    style={{...containerStyle, ...style}}
  >
    {activeMode === "" && <DrawingTools onChange={onToolChange} isTestMode={isDocBased || testMode} scratchpadResponsiveHeight={scratchpadResponsiveHeight} />}

    {activeMode !== "" && (
      <ActiveToolBoxContainer flexDirection="column" justifyContent="space-between" style={ scratchpadResponsiveHeight && {minHeight: "auto"}}>
        <FlexContainer flexDirection="column">
          {showBackButton && <BackButton onClick={onToolChange} />}
          {showActiveTool && <ActiveTool activeMode={activeMode} />}
          <FlexContainer flexDirection="column" childMarginRight={0} id="tool">
            {drawTools.SELECT_TOOL !== activeMode && (
              <>
                {showFontPicker && <Size value={lineWidth} onChangeSize={onChangeSize} />}
                {showFontArr.includes(activeMode) && showFontPicker && <FontPicker onChange={onChangeFont} currentFont={currentFont} />}
                {showColorPicker && <ColorPicker
                  activeMode={activeMode}
                  fillColor={fillColor}
                  currentColor={currentColor}
                  onFillColorChange={onFillColorChange}
                  onColorChange={onColorChange}
                />}
              </>
            )}
            {drawTools.SELECT_TOOL === activeMode && showToolOptions && <SelectToolOptions />}
          </FlexContainer>
        </FlexContainer>

        {showButtomTools && <BottomTools undo={undo} redo={redo} onToolChange={onToolChange} deleteMode={deleteMode} />}
      </ActiveToolBoxContainer>
    )}
    {activeMode !== "" && showMore && renderShowMore(setting)}
  </ToolBox>
}

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

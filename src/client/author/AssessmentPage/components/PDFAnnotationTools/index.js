import React from "react";
import ColorPicker from 'rc-color-picker';
import { InputNumber } from "antd";
import { FlexContainer } from "@edulastic/common";
import { ANNOTATION_TOOLS } from "./ToolsData";
import { ToolsWrapper, ToolWrapper, ColorPickerWrapper, FontPickerWrapper } from "./styled";

const PDFAnnotationTools = ({
  currentTool,
  setCurrentTool,
  minimized,
  togglePdfThumbnails,
  annotationToolsProperties,
  updateToolProperties,
  undoAnnotationsOperation,
  redoAnnotationsOperation,
  isAnnotationsStackEmpty = false,
  isAnnotationsEmpty = false
}) => {

  const handleClick = key => {
    if (key === "thumbnails") {
      setCurrentTool("");
      togglePdfThumbnails();
      return;
    }

    if (key == "undo") {
      if (!isAnnotationsEmpty) undoAnnotationsOperation();
      return;
    }

    if (key == "redo") {
      if (!isAnnotationsStackEmpty) redoAnnotationsOperation();
      return;
    }

    setCurrentTool(key === currentTool ? "" : key);
  }

  const updateColorForTool = (key, { color, alpha }) => {
    updateToolProperties({ key, value: { color, alpha } });
  }

  const updateFontForTool = (key, prop) => {
    updateToolProperties({ key, value: { size: prop } });
  }

  return (
    <FlexContainer justifyContent="flex-start" alignItems="center">
      {
        ANNOTATION_TOOLS.map(({ key, title, icon, showColorPicker, showSizeSelection }, index) => (
          <ToolsWrapper border={['draw', 'text'].includes(key)}>
            <ToolWrapper
              key={key || title}
              title={title}
              active={(currentTool === key && !["undo", "redo"].includes(key)) || (!minimized && index === 0)}
              onClick={() => handleClick(key)}
              disabled={(isAnnotationsStackEmpty && key === "redo") || (isAnnotationsEmpty && key === "undo")}
            >
              {icon}
            </ToolWrapper>
            {
              showSizeSelection && currentTool === key && (
                <FontPickerWrapper>
                  <InputNumber
                    size="small"
                    min={1}
                    value={annotationToolsProperties[key]?.size || (key === "draw" ? 1 : 12)}
                    onChange={prop => updateFontForTool(key, prop)}
                  />
                </FontPickerWrapper>
              )
            }
            {
              showColorPicker && currentTool === key && (
                <ColorPickerWrapper>
                  <ColorPicker
                    animation="slide-up"
                    color={annotationToolsProperties[key]?.color}
                    alpha={annotationToolsProperties[key]?.alpha}
                    onChange={prop => updateColorForTool(key, prop)}
                  />
                </ColorPickerWrapper>
              )
            }
          </ToolsWrapper>
        ))
      }
    </FlexContainer>);
};

export default PDFAnnotationTools;

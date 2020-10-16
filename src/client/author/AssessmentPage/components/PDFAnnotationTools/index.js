import React from 'react'
import ColorPicker from 'rc-color-picker'
import { Dropdown, InputNumber, Menu } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { ANNOTATION_TOOLS } from './ToolsData'
import {
  ToolsWrapper,
  ToolWrapper,
  ColorPickerWrapper,
  FontPickerWrapper,
} from './styled'

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
  isAnnotationsEmpty = false,
  pdfAnnotations,
  onHighlightQuestion,
}) => {
  const handleClick = (key) => {
    if (key === 'thumbnails') {
      setCurrentTool('')
      togglePdfThumbnails()
      return
    }

    if (key == 'undo') {
      if (!isAnnotationsEmpty) undoAnnotationsOperation()
      return
    }

    if (key == 'redo') {
      if (!isAnnotationsStackEmpty) redoAnnotationsOperation()
      return
    }

    setCurrentTool(key === currentTool ? '' : key)
  }

  const updateColorForTool = (key, { color, alpha }) => {
    updateToolProperties({ key, value: { color, alpha } })
  }

  const updateFontForTool = (key, prop) => {
    updateToolProperties({ key, value: { size: prop } })
  }

  const getAnnotationCustomList = () => {
    const data = {}
    pdfAnnotations.forEach((o) => {
      data[o.qIndex] = o.questionId
    })
    return data
  }

  const annotationList = (
    <Menu>
      {Object.keys(getAnnotationCustomList()).map((key) => (
        <Menu.Item
          key={key}
          onClick={() => onHighlightQuestion(getAnnotationCustomList()[key])}
        >
          Question {key}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <FlexContainer justifyContent="flex-start" alignItems="center">
      {ANNOTATION_TOOLS.map(
        ({ key, title, icon, showColorPicker, showSizeSelection }, index) => (
          <ToolsWrapper border={['draw', 'text'].includes(key)}>
            {key === 'list' ? (
              <Dropdown
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                overlay={annotationList}
                trigger={['click']}
              >
                <ToolWrapper
                  key={key || title}
                  title={title}
                  active={currentTool === key || (!minimized && index === 0)}
                >
                  {icon}
                </ToolWrapper>
              </Dropdown>
            ) : (
              <ToolWrapper
                key={key || title}
                title={title}
                active={
                  (currentTool === key && !['undo', 'redo'].includes(key)) ||
                  (!minimized && index === 0)
                }
                onClick={() => handleClick(key)}
                disabled={
                  (isAnnotationsStackEmpty && key === 'redo') ||
                  (isAnnotationsEmpty && key === 'undo')
                }
              >
                {icon}
              </ToolWrapper>
            )}
            {showSizeSelection && currentTool === key && (
              <FontPickerWrapper>
                <InputNumber
                  size="small"
                  min={1}
                  value={
                    annotationToolsProperties[key]?.size ||
                    (key === 'draw' ? 1 : 12)
                  }
                  onChange={(prop) => updateFontForTool(key, prop)}
                />
              </FontPickerWrapper>
            )}
            {showColorPicker && currentTool === key && (
              <ColorPickerWrapper>
                <ColorPicker
                  animation="slide-up"
                  color={annotationToolsProperties[key]?.color}
                  alpha={annotationToolsProperties[key]?.alpha}
                  onChange={(prop) => updateColorForTool(key, prop)}
                />
              </ColorPickerWrapper>
            )}
          </ToolsWrapper>
        )
      )}
    </FlexContainer>
  )
}

export default PDFAnnotationTools

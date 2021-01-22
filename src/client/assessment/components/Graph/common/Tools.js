import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  IconGraphCircle as IconCircle,
  IconGraphLine as IconLine,
  IconGraphParabola as IconParabola,
  IconGraphParabola2 as IconParabola2,
  IconGraphPoint as IconPoint,
  IconGraphPolygon as IconPolygon,
  IconGraphRay as IconRay,
  IconGraphSegment as IconSegment,
  IconGraphSine as IconSine,
  IconGraphVector as IconVector,
  IconGraphEllipse as IconEllipse,
  IconGraphHyperbola as IconHyperbola,
  IconGraphTangent as IconTangent,
  IconGraphSecant as IconSecant,
  IconGraphExponent as IconExponent,
  IconGraphLogarithm as IconLogarithm,
  IconGraphPolynom as IconPolynom,
  IconGraphArea as IconArea,
  IconGraphDashed as IconDashed,
  IconGraphCos as IconCos,
  IconEraseText,
  IconRedo,
  IconTrash,
  IconUndo,
  IconPlusCircle,
} from '@edulastic/icons'
import PopupTools from './PopupTools'
import {
  GraphToolbar,
  ToolbarLeft,
  ToolbarRight,
  ToolBtn,
  ToolbarItem,
  ToolbarItemLabel,
  PopupToolsContainer,
  PopupContent,
} from './styled_components'
import utils from './utils'

const allTools = [
  'point',
  'segment',
  'polygon',
  'ray',
  'vector',
  'line',
  'circle',
  'ellipse',
  'parabola',
  'parabola2',
  'hyperbola',
  'polynom',
  'exp',
  'logarithm',
  'sine',
  'cos',
  'tangent',
  'area',
  'dashed',
  'secant',
]

const iconsByToolName = {
  point: <IconPoint width={11} height={11} />,
  segment: <IconSegment width={26} height={16} />,
  polygon: <IconPolygon width={26} height={14} />,
  ray: <IconRay width={34} height={18} />,
  vector: <IconVector width={24} height={20} />,
  line: <IconLine width={22} height={15} />,
  circle: <IconCircle width={16} height={16} />,
  ellipse: <IconEllipse width={27} height={16} />,
  parabola: <IconParabola width={35} height={19} />,
  parabola2: <IconParabola2 width={40} height={25} />,
  hyperbola: <IconHyperbola width={40} height={25} />,
  polynom: <IconPolynom width={58} height={19} />,
  exp: <IconExponent width={37} height={21} />,
  logarithm: <IconLogarithm width={37} height={21} />,
  sine: <IconSine width={27} height={24} />,
  cos: <IconCos width={23} height={27} />,
  tangent: <IconTangent width={24} height={24} />,
  area: <IconArea width={25} height={16} />,
  dashed: <IconDashed width={27} height={16} />,
  secant: <IconSecant width={40} height={24} />,
  undo: <IconUndo width={16} height={15} />,
  redo: <IconRedo width={16} height={15} />,
  clear: (
    <IconEraseText width={13} height={16} stroke="transparent !important" />
  ),
  reset: (
    <IconEraseText width={16} height={15} stroke="transparent !important" />
  ),
  trash: <IconTrash width={13} height={15} stroke="transparent !important" />,
  delete: <IconTrash width={13} height={15} stroke="transparent !important" />,
  add: (
    <IconPlusCircle width={16} height={15} stroke="transparent !important" />
  ),
}
export default function Tools(props) {
  const {
    toolsAreVisible,
    selected,
    tools,
    controls,
    onSelectControl,
    onSelect,
    fontSize,
    setTools,
    canEditTools,
  } = props

  const [toolsPopupExpanded, setToolsPopupExpanded] = useState(false)
  const [popupTools, setPopupTools] = useState(tools)

  const isActive = (tool) => selected.includes(tool)

  const onSelectPopupTool = (tool) => {
    let newTools = [...popupTools]
    if (newTools.includes(tool)) {
      newTools = newTools.filter((item) => item !== tool)
    } else {
      newTools.push(tool)
    }
    setPopupTools(newTools)
    setTools(newTools)
  }

  const isSelectedPopupTool = (tool) => popupTools.includes(tool)

  const addTools = () => {
    setToolsPopupExpanded(true)
  }

  const hideToolsPopup = () => {
    if (popupTools && popupTools.length > 0) {
      setToolsPopupExpanded(false)
    }
  }

  const buttonSize = { width: '70px', height: '50px' }

  return (
    <GraphToolbar fontSize={fontSize} data-cy="graphTools">
      {toolsAreVisible && (
        <ToolbarLeft className="graph-toolbar-left">
          {tools.map((item) => (
            <ToolBtn
              width={buttonSize.width}
              height={buttonSize.height}
              className={isActive(item) ? 'active' : ''}
              onClick={() => onSelect(item)}
              key={`tool-btn-${item}`}
            >
              <ToolbarItem>
                {iconsByToolName[item]}
                <ToolbarItemLabel className={`icon-${item}-label`}>
                  {utils.capitalizeFirstLetter(
                    item === 'parabola2' ? 'parabola' : item
                  )}
                </ToolbarItemLabel>
              </ToolbarItem>
            </ToolBtn>
          ))}
          {canEditTools && (
            <ToolBtn
              zIndex={40}
              width="60px"
              height="50px"
              className={toolsPopupExpanded ? 'active' : ''}
              onClick={addTools}
              key="tool-btn-add"
            >
              <ToolbarItem justifyContent="center">
                {iconsByToolName.add}
              </ToolbarItem>
              {toolsPopupExpanded && (
                <PopupTools onHide={hideToolsPopup}>
                  <PopupContent>
                    <PopupToolsContainer>
                      {allTools.map((item) => (
                        <ToolBtn
                          bordered
                          width={buttonSize.width}
                          height={buttonSize.height}
                          className={isSelectedPopupTool(item) ? 'active' : ''}
                          onClick={() => onSelectPopupTool(item)}
                          key={`popup-tool-btn-${item}`}
                        >
                          <ToolbarItem>
                            {iconsByToolName[item]}
                            <ToolbarItemLabel className={`icon-${item}-label`}>
                              {utils.capitalizeFirstLetter(
                                item === 'parabola2' ? 'parabola' : item
                              )}
                            </ToolbarItemLabel>
                          </ToolbarItem>
                        </ToolBtn>
                      ))}
                    </PopupToolsContainer>
                  </PopupContent>
                </PopupTools>
              )}
            </ToolBtn>
          )}
        </ToolbarLeft>
      )}
      <ToolbarRight className="graph-toolbar-right">
        {controls.map((control) => (
          <ToolBtn
            key={`control-${control}`}
            className={isActive(control) ? 'active' : ''}
            onClick={() => onSelectControl(control)}
            width={buttonSize.width}
            height={buttonSize.height}
          >
            <ToolbarItem>
              {iconsByToolName[control]}
              <ToolbarItemLabel>
                {utils.capitalizeFirstLetter(control)}
              </ToolbarItemLabel>
            </ToolbarItem>
          </ToolBtn>
        ))}
      </ToolbarRight>
    </GraphToolbar>
  )
}

Tools.propTypes = {
  toolsAreVisible: PropTypes.bool,
  selected: PropTypes.array,
  tools: PropTypes.array,
  controls: PropTypes.array,
  onSelectControl: PropTypes.func,
  onSelect: PropTypes.func,
  fontSize: PropTypes.number,
  canEditTools: PropTypes.bool,
  setTools: PropTypes.func,
}

Tools.defaultProps = {
  toolsAreVisible: true,
  selected: [],
  tools: [],
  controls: [],
  onSelectControl: () => {},
  onSelect: () => {},
  fontSize: 14,
  canEditTools: false,
  setTools: () => {},
}

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  IconGraphCircle as IconCircle,
  IconGraphLine as IconLine,
  IconGraphLineCut as IconLineCut,
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
  IconGraphExponential as IconExponential,
  IconGraphLogarithm as IconLogarithm,
  IconGraphPolynom as IconPolynom,
  IconGraphArea as IconArea,
  IconGraphArea2 as IconArea2,
  IconGraphPiecewiseLine as IconPiecewiseLine,
  IconGraphDashed as IconDashed,
  IconGraphCos as IconCos,
  IconEraseText,
  IconRedo,
  IconTrash,
  IconUndo,
  IconPlusCircle,
  IconEdit,
  IconGraphRose,
  IconGraphCardioid,
} from '@edulastic/icons'
import ToolsContiner from './ToolsContiner'
import {
  GraphToolbar,
  ToolbarLeft,
  ToolbarRight,
  ToolBtn,
  ToolGroup,
  ToolbarItem,
  ToolbarItemLabel,
  ToolGroupLabel,
} from './styled_components'
import { CONSTANT, getToolOptsByGrid } from '../Builder/config'
import HelpTooltip from './HelpTooltip'

const iconsByToolName = {
  [CONSTANT.TOOLS.POINT]: <IconPoint width={11} height={11} data-cy="point" />,
  [CONSTANT.TOOLS.SEGMENT]: (
    <IconSegment width={26} height={16} data-cy="segment" />
  ),
  [CONSTANT.TOOLS.POLYGON]: (
    <IconPolygon width={26} height={14} data-cy="polygon" />
  ),
  [CONSTANT.TOOLS.RAY]: <IconRay width={34} height={18} data-cy="ray" />,
  [CONSTANT.TOOLS.VECTOR]: (
    <IconVector width={24} height={20} data-cy="vector" />
  ),
  [CONSTANT.TOOLS.LINE]: <IconLine width={22} height={15} data-cy="line" />,
  [CONSTANT.TOOLS.CIRCLE]: (
    <IconCircle width={16} height={16} data-cy="circle" />
  ),
  [CONSTANT.TOOLS.ELLIPSE]: (
    <IconEllipse width={27} height={16} data-cy="ellipse" />
  ),
  [CONSTANT.TOOLS.PARABOLA]: (
    <IconParabola width={35} height={19} data-cy="parabola" />
  ),
  [CONSTANT.TOOLS.PARABOLA2]: <IconParabola2 width={40} height={25} />,
  [CONSTANT.TOOLS.HYPERBOLA]: (
    <IconHyperbola width={40} height={25} data-cy="hyperbola" />
  ),
  [CONSTANT.TOOLS.POLYNOM]: (
    <IconPolynom width={58} height={19} data-cy="polynomial" />
  ),
  [CONSTANT.TOOLS.EXPONENT]: (
    <IconExponential width={37} height={21} data-cy="exponent" />
  ),
  [CONSTANT.TOOLS.EXPONENTIAL2]: (
    <IconExponent width={37} height={21} data-cy="exponential2" />
  ),
  [CONSTANT.TOOLS.LOGARITHM]: (
    <IconLogarithm width={37} height={21} data-cy="logarithm" />
  ),
  [CONSTANT.TOOLS.SIN]: <IconSine width={27} height={24} data-cy="sin" />,
  [CONSTANT.TOOLS.COS]: <IconCos width={23} height={27} data-cy="cod" />,
  [CONSTANT.TOOLS.TANGENT]: (
    <IconTangent width={24} height={24} data-cy="tangent" />
  ),
  [CONSTANT.TOOLS.AREA]: <IconArea width={25} height={16} data-cy="area" />,
  [CONSTANT.TOOLS.DASHED]: (
    <IconDashed width={27} height={16} data-cy="dashed" />
  ),
  [CONSTANT.TOOLS.SECANT]: (
    <IconSecant width={40} height={24} data-cy="decant" />
  ),
  [CONSTANT.TOOLS.AREA2]: <IconArea2 width={29} height={25} />,
  [CONSTANT.TOOLS.PIECEWISE_LINE]: <IconPiecewiseLine />,
  [CONSTANT.TOOLS.PIECEWISE_POINT]: <IconPoint width={11} height={11} />,
  [CONSTANT.TOOLS.EDIT_LABEL]: <IconEdit data-cy="editLabel" />,
  [CONSTANT.TOOLS.LINE_CUT]: <IconLineCut />,
  [CONSTANT.TOOLS.ROSE]: <IconGraphRose height={22} />,
  [CONSTANT.TOOLS.CARDIOID]: <IconGraphCardioid height={22} />,
  [CONSTANT.TOOLS.UNDO]: <IconUndo width={16} height={15} data-cy="undo" />,
  [CONSTANT.TOOLS.REDO]: <IconRedo width={16} height={15} data-cy="redo" />,
  [CONSTANT.TOOLS.CLEAR]: (
    <IconEraseText
      width={13}
      height={16}
      data-cy="clear"
      stroke="transparent !important"
    />
  ),
  [CONSTANT.TOOLS.RESET]: (
    <IconEraseText
      width={16}
      height={15}
      stroke="transparent !important"
      data-cy="reset"
    />
  ),
  [CONSTANT.TOOLS.TRASH]: (
    <IconTrash
      width={13}
      height={15}
      stroke="transparent !important"
      data-cy="remove"
    />
  ),
  [CONSTANT.TOOLS.DELETE]: (
    <IconTrash
      width={13}
      height={15}
      stroke="transparent !important"
      data-cy="delete"
    />
  ),
  add: (
    <IconPlusCircle width={16} height={15} stroke="transparent !important" />
  ),
}

const labelsByToolName = {
  [CONSTANT.TOOLS.POINT]: 'Point',
  [CONSTANT.TOOLS.SEGMENT]: 'Segment',
  [CONSTANT.TOOLS.POLYGON]: 'Polygon',
  [CONSTANT.TOOLS.RAY]: 'Ray',
  [CONSTANT.TOOLS.VECTOR]: 'Vector',
  [CONSTANT.TOOLS.LINE]: 'Line',
  [CONSTANT.TOOLS.CIRCLE]: 'Circle',
  [CONSTANT.TOOLS.ELLIPSE]: 'Ellipse',
  [CONSTANT.TOOLS.PARABOLA]: 'Parabola',
  [CONSTANT.TOOLS.PARABOLA2]: 'Parabola',
  [CONSTANT.TOOLS.HYPERBOLA]: 'Hyperbola',
  [CONSTANT.TOOLS.SIN]: 'Sin',
  [CONSTANT.TOOLS.COS]: 'Cos',
  [CONSTANT.TOOLS.TANGENT]: 'Tan',
  [CONSTANT.TOOLS.SECANT]: 'Secant',
  [CONSTANT.TOOLS.POLYNOM]: 'Polynomial',
  [CONSTANT.TOOLS.EXPONENT]: 'Exponential',
  [CONSTANT.TOOLS.EXPONENTIAL2]: 'Exponent',
  [CONSTANT.TOOLS.LOGARITHM]: 'Logarithm',
  [CONSTANT.TOOLS.AREA]: 'Area',
  [CONSTANT.TOOLS.DASHED]: 'Dashed',
  [CONSTANT.TOOLS.PIECEWISE_LINE]: 'Piecewise Line',
  [CONSTANT.TOOLS.PIECEWISE_POINT]: 'Piecewise Point',
  [CONSTANT.TOOLS.NO_SOLUTION]: 'No Solution',
  [CONSTANT.TOOLS.LINE_CUT]: 'Line Cut',
  [CONSTANT.TOOLS.AREA2]: 'Area',
  [CONSTANT.TOOLS.ROSE]: 'Rose',
  [CONSTANT.TOOLS.CARDIOID]: 'Cardioid',
  [CONSTANT.TOOLS.EDIT_LABEL]: 'Edit Label',
  [CONSTANT.TOOLS.UNDO]: 'Undo',
  [CONSTANT.TOOLS.REDO]: 'Redo',
  [CONSTANT.TOOLS.CLEAR]: 'Clear',
  [CONSTANT.TOOLS.RESET]: 'Reset',
  [CONSTANT.TOOLS.TRASH]: 'Remove',
  [CONSTANT.TOOLS.DELETE]: 'Delete',
  add: '',
}

const buttonSize = { width: '72px', height: '50px' }

const Tools = ({
  toolsAreVisible,
  selected,
  tools,
  controls,
  onSelectControl,
  onSelect,
  fontSize,
  setTools,
  canEditTools,
  gridType,
}) => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)

  const onSelectTool = (tool) => {
    let newTools = [...tools]
    let isNew = false
    if (newTools.includes(tool)) {
      newTools = newTools.filter((item) => item !== tool)
    } else {
      isNew = true
      newTools.push(tool)
    }
    setTools(newTools)

    if (onSelect && isNew) {
      onSelect(tool)
    } else if (selected.includes(tool)) {
      onSelect(newTools[0])
    }
  }

  const openDrawer = () => {
    setIsOpenDrawer(true)
  }

  const hideDrawer = () => {
    if (tools && tools.length > 0) {
      setIsOpenDrawer(false)
    }
  }

  return (
    <GraphToolbar fontSize={fontSize} data-cy="graphTools">
      {toolsAreVisible && (
        <ToolbarLeft className="graph-toolbar-left">
          {tools.map((item) => (
            <ToolBtn
              width={buttonSize.width}
              height={buttonSize.height}
              className={selected?.includes(item) ? 'active' : ''}
              onClick={() => onSelect(item)}
              key={`tool-btn-${item}`}
            >
              <ToolbarItem>
                {iconsByToolName[item]}
                <ToolbarItemLabel className={`icon-${item}-label`}>
                  {labelsByToolName[item]}
                </ToolbarItemLabel>
              </ToolbarItem>
            </ToolBtn>
          ))}
          {canEditTools && (
            <ToolBtn
              zIndex={40}
              width={buttonSize.width}
              height={buttonSize.height}
              className={isOpenDrawer ? 'active' : ''}
              onClick={openDrawer}
              data-cy="addTool"
              key="tool-btn-add"
            >
              <ToolbarItem justifyContent="center">
                {iconsByToolName.add}
              </ToolbarItem>
            </ToolBtn>
          )}
        </ToolbarLeft>
      )}
      <ToolbarRight className="graph-toolbar-right">
        {controls.map((control) => (
          <ToolBtn
            width={buttonSize.width}
            height={buttonSize.height}
            key={`control-${control}`}
            className={selected?.includes(control) ? 'active' : ''}
            onClick={() => onSelectControl(control)}
          >
            <ToolbarItem>
              {iconsByToolName[control]}
              <ToolbarItemLabel>{labelsByToolName[control]}</ToolbarItemLabel>
            </ToolbarItem>
          </ToolBtn>
        ))}
      </ToolbarRight>

      {isOpenDrawer && canEditTools && toolsAreVisible && (
        <ToolsContiner visible={isOpenDrawer} onClose={hideDrawer}>
          {getToolOptsByGrid(gridType).map((group, groupIdx) => (
            <div key={groupIdx}>
              <ToolGroupLabel>{group.title}</ToolGroupLabel>
              <ToolGroup>
                {group.items.map((item) => (
                  <ToolBtn
                    bordered
                    className={tools?.includes(item) ? 'active' : ''}
                    key={`popup-tool-btn-${item}`}
                  >
                    <HelpTooltip toolName={item}>
                      <ToolbarItem
                        justifyContent="space-evenly"
                        onClick={() => onSelectTool(item)}
                      >
                        {iconsByToolName[item]}
                        <ToolbarItemLabel
                          noMargin
                          className={`icon-${item}-label`}
                        >
                          {labelsByToolName[item]}
                        </ToolbarItemLabel>
                      </ToolbarItem>
                    </HelpTooltip>
                  </ToolBtn>
                ))}
              </ToolGroup>
            </div>
          ))}
        </ToolsContiner>
      )}
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
  fontSize: PropTypes.string,
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
  fontSize: '14px',
  canEditTools: false,
  setTools: () => {},
}

export default Tools

import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
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
  IconEraseText,
  IconRedo,
  IconTrash,
  IconUndo,
  IconPlusCircle
} from "@edulastic/icons";
import {
  GraphToolbar,
  ToolbarLeft,
  ToolbarRight,
  ToolBtn,
  ToolbarItem,
  ToolbarItemLabel,
  Popup,
  PopupToolsContainer,
  PopupContent
} from "./styled_components";
import utils from "./utils";

const allTools = [
  "point",
  "line",
  "ray",
  "segment",
  "vector",
  "circle",
  "ellipse",
  "sine",
  "tangent",
  "secant",
  "exponent",
  "logarithm",
  "polynom",
  "hyperbola",
  "polygon",
  "parabola",
  "parabola2",
  "area",
  "dashed"
];

const iconsByToolName = {
  point: <IconPoint width={16} height={16} />,
  line: <IconLine width={16} height={16} />,
  ray: <IconRay width={26} height={21} />,
  segment: <IconSegment width={26} height={21} />,
  vector: <IconVector width={26} height={21} />,
  circle: <IconCircle width={14} height={14} />,
  ellipse: <IconEllipse width={20} height={14} />,
  sine: <IconSine width={16} height={16} />,
  tangent: <IconTangent width={30} height={28} />,
  secant: <IconSecant width={22} height={22} />,
  logarithm: <IconLogarithm width={20} height={13} />,
  exponent: <IconExponent width={16} height={16} />,
  polynom: <IconPolynom width={40} height={16} />,
  parabola: <IconParabola width={16} height={16} />,
  parabola2: <IconParabola2 width={18} height={20} />,
  hyperbola: <IconHyperbola width={30} height={20} />,
  polygon: <IconPolygon width={16} height={16} />,
  area: <IconArea width={16} height={16} />,
  dashed: <IconDashed width={26} height={16} />,
  undo: <IconUndo width={16} height={15} />,
  redo: <IconRedo width={16} height={15} />,
  clear: <IconEraseText width={13} height={16} stroke="transparent !important" />,
  reset: <IconEraseText width={16} height={15} stroke="transparent !important" />,
  trash: <IconTrash width={13} height={15} stroke="transparent !important" />,
  delete: <IconTrash width={13} height={15} stroke="transparent !important" />,
  add: <IconPlusCircle width={16} height={15} stroke="transparent !important" />
};
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
    canEditTools
  } = props;

  const [toolsPopupExpanded, setToolsPopupExpanded] = useState(false);
  const [popupTools, setPopupTools] = useState(tools);
  let choosed = false;

  const isActive = tool => selected.includes(tool);

  const onSelectPopupTool = tool => {
    let newTools = [...popupTools];
    if (newTools.includes(tool)) {
      newTools = newTools.filter(item => item !== tool);
    } else {
      newTools.push(tool);
    }
    setPopupTools(newTools);
    setTools(newTools);
    choosed = true;
  };

  const isSelectedPopupTool = tool => popupTools.includes(tool);

  const addTools = () => {
    if (!choosed) setToolsPopupExpanded(!toolsPopupExpanded);
  };

  const buttonSize = { width: "60px", height: "50px" };

  return (
    <GraphToolbar fontSize={fontSize} data-cy="graphTools">
      {toolsAreVisible && (
        <ToolbarLeft className="graph-toolbar-left">
          {tools.map(item => (
            <ToolBtn
              width={buttonSize.width}
              height={buttonSize.height}
              className={isActive(item) ? "active" : ""}
              onClick={() => onSelect(item)}
              key={`tool-btn-${item}`}
            >
              <ToolbarItem>
                {iconsByToolName[item]}
                <ToolbarItemLabel>
                  {utils.capitalizeFirstLetter(item === "parabola2" ? "parabola" : item)}
                </ToolbarItemLabel>
              </ToolbarItem>
            </ToolBtn>
          ))}
          {canEditTools && (
            <ToolBtn
              zIndex={40}
              width={buttonSize.width}
              height={buttonSize.height}
              className={toolsPopupExpanded ? "active" : ""}
              onClick={addTools}
              key="tool-btn-add"
            >
              <ToolbarItem>{iconsByToolName.add}</ToolbarItem>
              {toolsPopupExpanded && (
                <Fragment>
                  <Popup bottom>
                    <PopupContent>
                      <PopupToolsContainer>
                        {allTools.map(item => (
                          <ToolBtn
                            bordered
                            width={buttonSize.width}
                            height={buttonSize.height}
                            className={isSelectedPopupTool(item) ? "active" : ""}
                            onClick={() => onSelectPopupTool(item)}
                            key={`popup-tool-btn-${item}`}
                          >
                            <ToolbarItem>
                              {iconsByToolName[item]}
                              <ToolbarItemLabel>
                                {utils.capitalizeFirstLetter(item === "parabola2" ? "parabola" : item)}
                              </ToolbarItemLabel>
                            </ToolbarItem>
                          </ToolBtn>
                        ))}
                      </PopupToolsContainer>
                    </PopupContent>
                  </Popup>
                </Fragment>
              )}
            </ToolBtn>
          )}
        </ToolbarLeft>
      )}
      <ToolbarRight className="graph-toolbar-right">
        {controls.map(control => (
          <ToolBtn
            key={`control-${control}`}
            className={isActive(control) ? "active" : ""}
            onClick={() => onSelectControl(control)}
            width={buttonSize.width}
            height={buttonSize.height}
          >
            <ToolbarItem>
              {iconsByToolName[control]}
              <ToolbarItemLabel>{utils.capitalizeFirstLetter(control)}</ToolbarItemLabel>
            </ToolbarItem>
          </ToolBtn>
        ))}
      </ToolbarRight>
    </GraphToolbar>
  );
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
  setTools: PropTypes.func
};

Tools.defaultProps = {
  toolsAreVisible: true,
  selected: [],
  tools: [],
  controls: [],
  onSelectControl: () => {},
  onSelect: () => {},
  fontSize: 14,
  canEditTools: false,
  setTools: () => {}
};

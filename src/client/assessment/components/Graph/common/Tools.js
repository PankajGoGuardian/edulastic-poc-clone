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
  ToolbarItemIcon,
  Popup,
  PopupToolsContainer,
  PopupContent
} from "./styled_components";
import utils from "./utils";

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

  const [toolsPopupExpanded, setToolsPopupExpanded] = useState(false);
  const [popupTools, setPopupTools] = useState(tools);
  let choosed = false;

  const isActive = tool => selected.includes(tool);

  const getSize = () => {
    const size = fontSize < 17 ? 70 : fontSize < 20 ? 88 : fontSize < 24 ? 105 : 120;
    return {
      width: size,
      height: size
    };
  };

  const getIconByToolName = (toolName = "point") => {
    const options = {
      width: fontSize + 2,
      height: fontSize + 2
    };
    const { width, height } = options;

    const iconsByToolName = {
      point: () => <IconPoint {...options} />,
      line: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconLine {...newOptions} />;
      },
      ray: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconRay {...newOptions} />;
      },
      segment: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconSegment {...newOptions} />;
      },
      vector: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconVector {...newOptions} />;
      },
      circle: () => <IconCircle {...options} />,
      ellipse: () => {
        const newOptions = {
          ...options,
          width: width + 4
        };

        return <IconEllipse {...newOptions} />;
      },
      hyperbola: () => <IconHyperbola {...options} />,
      tangent: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 16
        };

        return <IconTangent {...newOptions} />;
      },
      secant: () => {
        const newOptions = {
          ...options,
          width: width + 6,
          height: height + 6
        };

        return <IconSecant {...newOptions} />;
      },
      exponent: () => <IconExponent {...options} />,
      logarithm: () => {
        const newOptions = {
          ...options,
          width: width + 4
        };

        return <IconLogarithm {...newOptions} />;
      },
      polynom: () => {
        const newOptions = {
          ...options,
          width: width + 30
        };

        return <IconPolynom {...newOptions} />;
      },
      parabola: () => {
        const newOptions = {
          ...options,
          width: width + 14,
          height: height + 4
        };

        return <IconParabola {...newOptions} />;
      },
      parabola2: () => {
        const newOptions = {
          ...options,
          width: width + 14,
          height: height + 4
        };

        return <IconParabola2 {...newOptions} />;
      },
      sine: () => {
        const newOptions = {
          ...options,
          width: width + 10
        };

        return <IconSine {...newOptions} />;
      },
      polygon: () => <IconPolygon {...options} />,
      area: () => <IconArea {...options} />,
      dashed: () => {
        const newOptions = {
          ...options,
          width: width + 10
        };

        return <IconDashed {...newOptions} />;
      },
      undo: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconUndo {...newOptions} />;
      },
      redo: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconRedo {...newOptions} />;
      },
      clear: () => {
        const newOptions = {
          ...options,
          stroke: "transparent !important",
          width: width + 10,
          height: height + 5
        };

        return <IconEraseText {...newOptions} />;
      },
      reset: () => {
        const newOptions = {
          ...options,
          stroke: "transparent !important",
          width: width + 10,
          height: height + 5
        };

        return <IconEraseText {...newOptions} />;
      },
      trash: () => {
        const newOptions = {
          ...options,
          stroke: "transparent !important",
          height: height + 5
        };

        return <IconTrash {...newOptions} />;
      },
      delete: () => {
        const newOptions = {
          ...options,
          stroke: "transparent !important",
          height: height + 5
        };

        return <IconTrash {...newOptions} />;
      },
      add: () => {
        const newOptions = {
          ...options,
          stroke: "transparent !important",
          height: height + 5,
          width: width + 5
        };

        return <IconPlusCircle {...newOptions} />;
      }
    };

    return iconsByToolName[toolName]();
  };

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

  const isSelectedPopupTool = tool => {
    return popupTools.includes(tool);
  };

  const addTools = () => {
    if (!choosed) setToolsPopupExpanded(toolsPopupExpanded ? false : true);
  };

  return (
    <GraphToolbar fontSize={fontSize} data-cy="graphTools">
      {toolsAreVisible && (
        <ToolbarLeft className="graph-toolbar-left">
          {tools.map(item => (
            <ToolBtn
              style={{ ...getSize() }}
              className={isActive(item) ? "active" : ""}
              onClick={() => onSelect(item)}
              key={`tool-btn-${item}`}
            >
              <ToolbarItem>
                <ToolbarItemIcon
                  className="tool-btn-icon"
                  style={{
                    marginBottom: item === "tangent" ? 0 : fontSize / 2
                  }}
                >
                  {getIconByToolName(item)}
                </ToolbarItemIcon>
                <ToolbarItemLabel style={{ fontSize }}>
                  {utils.capitalizeFirstLetter(item === "parabola2" ? "parabola" : item)}
                </ToolbarItemLabel>
              </ToolbarItem>
            </ToolBtn>
          ))}
          {canEditTools && (
            <ToolBtn
              style={{ ...getSize(), zIndex: 40 }}
              className={toolsPopupExpanded ? "active" : ""}
              onClick={addTools}
              key="tool-btn-add"
            >
              <ToolbarItem>
                <ToolbarItemIcon className="tool-btn-icon" style={{ marginBottom: 0 }}>
                  {getIconByToolName("add")}
                </ToolbarItemIcon>
              </ToolbarItem>
              {toolsPopupExpanded && (
                <Fragment>
                  <Popup bottom>
                    <PopupContent>
                      <PopupToolsContainer>
                        {allTools.map(item => (
                          <ToolBtn
                            bordered
                            style={{ ...getSize() }}
                            className={isSelectedPopupTool(item) ? "active" : ""}
                            onClick={() => onSelectPopupTool(item)}
                            key={`popup-tool-btn-${item}`}
                          >
                            <ToolbarItem>
                              <ToolbarItemIcon
                                className="tool-btn-icon"
                                style={{
                                  marginBottom: item === "tangent" ? 0 : fontSize / 2
                                }}
                              >
                                {getIconByToolName(item)}
                              </ToolbarItemIcon>
                              <ToolbarItemLabel style={{ fontSize }}>
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
      <ToolbarRight  className="graph-toolbar-right">
        {controls.map(control => (
          <ToolBtn
            key={`control-${control}`}
            className={isActive(control) ? "active" : ""}
            onClick={() => onSelectControl(control)}
            style={{ ...getSize() }}
          >
            <ToolbarItem>
              <ToolbarItemIcon className="tool-btn-icon" style={{ marginBottom: fontSize / 2 }}>
                {getIconByToolName(control)}
              </ToolbarItemIcon>
              <ToolbarItemLabel style={{ fontSize }}>{utils.capitalizeFirstLetter(control)}</ToolbarItemLabel>
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

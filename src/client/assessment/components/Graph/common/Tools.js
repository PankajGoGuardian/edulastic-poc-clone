import React from "react";
import PropTypes from "prop-types";
import { IconGraphClear as IconClear } from "@edulastic/icons";
import {
  GraphToolbar,
  ToolbarLeft,
  ToolbarRight,
  ToolBtn,
  ToolbarItem,
  ToolbarItemLabel,
  ToolbarItemIcon
} from "./styled_components";
import Dropdown from "./Dropdown";
import utils from "./utils";

export default function Tools(props) {
  const {
    tools,
    tool,
    bgShapes,
    controls,
    onSelect,
    fontSize,
    getIconByToolName,
    getHandlerByControlName,
    toolsAreVisible
  } = props;

  const uiTools = tools.map((_tool, index) => {
    if (Array.isArray(_tool)) {
      const group = _tool.map((item, toolInnerIndex) => ({
        name: item,
        index: toolInnerIndex,
        groupIndex: index
      }));

      return { group };
    }

    return {
      name: _tool,
      index,
      groupIndex: -1
    };
  });

  const isActive = uiTool => uiTool.index === tool.index && uiTool.groupIndex === tool.groupIndex;

  const isActiveControl = control => control === tool.name;

  const resetThenSet = newTool => {
    onSelect(newTool);
  };

  const getIconTemplate = (toolName = "point", options) => getIconByToolName(toolName.toLowerCase(), options);

  // todo: delete this after equations developing
  const areaToolIsEnabled = () => {
    if (tools.includes("hyperbola")) return false;
    if (tools.includes("segment")) return false;
    if (tools.includes("ray")) return false;
    if (tools.includes("vector")) return false;
    return true;
  };

  return (
    <GraphToolbar fontSize={fontSize} data-cy="graphTools">
      {toolsAreVisible && (
        <ToolbarLeft>
          {uiTools.map(
            (uiTool, i) =>
              !uiTool.group && (
                <ToolBtn
                  style={{
                    width: bgShapes ? 70 : fontSize > 20 ? 105 : 93,
                    backgroundColor: uiTool.name === "area" && !areaToolIsEnabled() ? "#f5f5f5" : undefined
                  }}
                  className={isActive(uiTool) ? "active" : ""}
                  onClick={uiTool.name === "area" && !areaToolIsEnabled() ? () => {} : () => onSelect(uiTool)}
                  key={`tool-btn-${i}`}
                >
                  <ToolbarItem>
                    <ToolbarItemIcon className="tool-btn-icon" style={{ marginBottom: fontSize / 2 }}>
                      {getIconTemplate(uiTool.name, {
                        width: fontSize + 2,
                        height: fontSize + 2,
                        color: ""
                      })}
                    </ToolbarItemIcon>
                    <ToolbarItemLabel style={{ fontSize }}>{utils.capitalizeFirstLetter(uiTool.name)}</ToolbarItemLabel>
                  </ToolbarItem>
                </ToolBtn>
              )
          )}
          {uiTools.map((uiTool, i) =>
            uiTool.group
              ? uiTool.group[0] && (
                  <Dropdown
                    key={`tools-group-${i}`}
                    list={uiTool.group}
                    resetThenSet={resetThenSet}
                    currentTool={tool}
                    fontSize={fontSize}
                    getIconTemplate={getIconTemplate}
                  />
                )
              : null
          )}
        </ToolbarLeft>
      )}
      <ToolbarRight>
        {controls.map((control, i) => (
          <ToolBtn
            key={`control-${i}`}
            className={isActiveControl(control) ? "active" : ""}
            onClick={() => getHandlerByControlName(control)}
            style={{ width: fontSize > 20 ? 105 : 93 }}
          >
            <ToolbarItem>
              <ToolbarItemIcon style={{ marginBottom: fontSize / 2 }}>
                <IconClear
                  width={fontSize + 2}
                  height={fontSize}
                  style={{
                    color: "#4aac8b",
                    fill: "#4aac8b",
                    stroke: "#4aac8b"
                  }}
                />
              </ToolbarItemIcon>
              <ToolbarItemLabel style={{ fontSize }} color="#4aac8b">
                {utils.capitalizeFirstLetter(control)}
              </ToolbarItemLabel>
            </ToolbarItem>
          </ToolBtn>
        ))}
      </ToolbarRight>
    </GraphToolbar>
  );
}

Tools.propTypes = {
  toolsAreVisible: PropTypes.bool.isRequired,
  tool: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tools: PropTypes.array,
  bgShapes: PropTypes.bool.isRequired,
  controls: PropTypes.shape.isRequired,
  getIconByToolName: PropTypes.func.isRequired,
  getHandlerByControlName: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  fontSize: PropTypes.number
};

Tools.defaultProps = {
  tools: [],
  fontSize: 14,
  tool: {
    toolIndex: 0,
    innerIndex: 0,
    toolName: "point"
  }
};

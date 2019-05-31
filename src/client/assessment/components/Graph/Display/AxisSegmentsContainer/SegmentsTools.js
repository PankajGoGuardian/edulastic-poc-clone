import React from "react";
import PropTypes from "prop-types";
import { GraphToolbar, SegmentsToolBtn, SegmentsToolbarItem, ToolbarItemIcon } from "./styled";

const SegmentsTools = ({
  tool,
  onSelect,
  fontSize,
  getIconByToolName,
  graphType,
  responsesAllowed,
  elementsNumber,
  toolbar
}) => {
  const segmentsTools = [
    "segments_point",
    "segment_both_point_included",
    "segment_both_points_hollow",
    "segment_left_point_hollow",
    "segment_right_point_hollow",
    "ray_left_direction",
    "ray_right_direction",
    "ray_left_direction_right_hollow",
    "ray_right_direction_left_hollow"
  ];

  const uiTools =
    toolbar.length > 0
      ? toolbar.map((item, index) => ({
          name: item,
          index,
          groupIndex: -1
        }))
      : segmentsTools.map((item, index) => ({
          name: item,
          index,
          groupIndex: -1
        }));

  const serviceTools = ["undo", "redo", "trash"];

  const isActive = uiTool => uiTool.index === tool.index && uiTool.groupIndex === tool.groupIndex;

  const getToolClassName = uiTool => {
    if (uiTool.name === "undo" || uiTool.name === "redo") {
      return "";
    }
    if (uiTool.name === "trash") {
      if (isActive(uiTool)) {
        return "active";
      }
      return "";
    }
    if (elementsNumber >= responsesAllowed) {
      return "disabled";
    }
    if (isActive(uiTool)) {
      return "active";
    }
    return "";
  };

  const getToolClickHandler = uiTool => {
    if (serviceTools.includes(uiTool.name)) {
      return () => onSelect(uiTool, graphType);
    }
    if (elementsNumber >= responsesAllowed) {
      return null;
    }
    return () => onSelect(uiTool, graphType);
  };

  const getIconTemplate = (toolName = "point", options) => getIconByToolName(toolName, options);

  return (
    <GraphToolbar data-cy="segmentsToolbar" fontSize={fontSize}>
      {uiTools.map(
        (uiTool, i) =>
          !uiTool.group && (
            <SegmentsToolBtn
              style={{ width: fontSize > 20 ? 105 : 93 }}
              className={getToolClassName(uiTool)}
              onClick={getToolClickHandler(uiTool)}
              key={`segments-tool-btn-${i}`}
            >
              <SegmentsToolbarItem>
                <ToolbarItemIcon className="tool-btn-icon" style={{ marginBottom: fontSize / 2 }}>
                  {getIconTemplate(uiTool.name, {
                    width: fontSize + 2,
                    height: fontSize + 2,
                    color: ""
                  })}
                </ToolbarItemIcon>
              </SegmentsToolbarItem>
            </SegmentsToolBtn>
          )
      )}
      {serviceTools.map((serviceTool, i) => (
        <SegmentsToolBtn
          style={{ width: fontSize > 20 ? 105 : 93, marginLeft: i === 0 ? "auto" : "" }}
          className={getToolClassName({ name: serviceTool, groupIndex: -1, index: uiTools.length })}
          onClick={getToolClickHandler({ name: serviceTool, groupIndex: -1, index: uiTools.length })}
          key={`segments-service-tool-btn-${i}`}
        >
          <SegmentsToolbarItem>
            <ToolbarItemIcon className="tool-btn-icon" style={{ marginBottom: fontSize / 2 }}>
              {getIconTemplate(serviceTool, {
                width: fontSize + 2,
                height: fontSize + 2,
                color: ""
              })}
            </ToolbarItemIcon>
          </SegmentsToolbarItem>
        </SegmentsToolBtn>
      ))}
    </GraphToolbar>
  );
};

SegmentsTools.propTypes = {
  tool: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  graphType: PropTypes.string.isRequired,
  responsesAllowed: PropTypes.number.isRequired,
  getIconByToolName: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  fontSize: PropTypes.number,
  elementsNumber: PropTypes.number.isRequired,
  toolbar: PropTypes.array
};

SegmentsTools.defaultProps = {
  fontSize: 14,
  tool: {
    toolIndex: 0,
    innerIndex: 0,
    toolName: "segmentsPoint"
  },
  toolbar: []
};

export default SegmentsTools;

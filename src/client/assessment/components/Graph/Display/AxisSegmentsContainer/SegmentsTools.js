import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { GraphToolbar, SegmentsToolBtn, SegmentsToolbarItem, ToolbarItemIcon } from "./styled";
import { ifZoomed } from "../../../../../common/utils/helpers";

const SegmentsTools = ({
  tool,
  onSelect,
  fontSize,
  getIconByToolName,
  responsesAllowed,
  elementsNumber,
  toolbar,
  vertical,
  theme
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

  const serviceTools = ["undo", "redo", "reset", "trash"];

  const isActive = uiTool => uiTool.index === tool.index && uiTool.groupIndex === tool.groupIndex;

  const getToolClassName = uiTool => {
    if (uiTool.name === "undo" || uiTool.name === "redo" || uiTool.name === "reset") {
      return "";
    }
    if (uiTool.name === "trash") {
      if (isActive(uiTool)) {
        return "active";
      }
      return "";
    }
    // if (elementsNumber >= responsesAllowed) {
    //   return "disabled";
    // }
    if (isActive(uiTool)) {
      return "active";
    }
    return "";
  };

  const getToolClickHandler = uiTool => {
    if (serviceTools.includes(uiTool.name)) {
      return () => onSelect(uiTool);
    }
    // if (elementsNumber >= responsesAllowed) {
    //   return null;
    // }
    return () => onSelect(uiTool);
  };

  const getIconTemplate = (toolName = "point", options) => getIconByToolName(toolName, options);

  const getStyle = (_theme, _fontSize) => {
    if (ifZoomed(_theme?.zoomLevel)) {
      return {
        width: "auto",
        padding: "0px 10px",
        zoom: _theme?.widgets?.graphPlacement?.toolsZoom
      };
    }

    return !vertical
      ? {
          width: _fontSize > 20 ? 105 : 93
        }
      : {};
  };

  const toolBtnStyle = getStyle(theme, fontSize);
  const zoomLevel = theme?.zoomLevel || localStorage.getItem("zoomLevel");
  return (
    <GraphToolbar data-cy="segmentsToolbar" fontSize={fontSize} vertical={vertical}>
      {uiTools.map(
        (uiTool, i) =>
          !uiTool.group && (
            <SegmentsToolBtn
              style={toolBtnStyle}
              zoomLevel={zoomLevel}
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
          style={toolBtnStyle}
          zoomLevel={zoomLevel}
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
  responsesAllowed: PropTypes.number.isRequired,
  getIconByToolName: PropTypes.func.isRequired,
  vertical: PropTypes.bool.isRequired,
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

export default withTheme(SegmentsTools);

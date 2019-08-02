import React from "react";
import PropTypes from "prop-types";
import { IconGraphClear as IconClear } from "@edulastic/icons";
import { ToolbarRight, ToolBtn, ToolbarItem, ToolbarItemLabel, ToolbarItemIcon } from "../styled/Tools";

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

export const Tools = ({ controls, tool, setTool, getHandlerByControlName, fontSize }) => (
  <ToolbarRight>
    {controls.map((control, index) => (
      <ToolBtn
        key={`control-${index}`}
        className={index === 3 && tool === 3 ? "active" : ""}
        onClick={() => {
          setTool(index);
          getHandlerByControlName(control);
        }}
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
            {capitalizeFirstLetter(control)}
          </ToolbarItemLabel>
        </ToolbarItem>
      </ToolBtn>
    ))}
  </ToolbarRight>
);

Tools.propTypes = {
  tool: PropTypes.number.isRequired,
  setTool: PropTypes.func.isRequired,
  controls: PropTypes.shape.isRequired,
  getHandlerByControlName: PropTypes.func.isRequired,
  fontSize: PropTypes.number
};

Tools.defaultProps = {
  tool: 0,
  controls: [],
  fontSize: 14
};

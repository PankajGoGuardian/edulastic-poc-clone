import React from "react";
import PropTypes from "prop-types";
import { IconTrash, IconUndo, IconRedo, IconGraphClear } from "@edulastic/icons";

import { ToolbarContainer, ToolBtn, ToolbarItem, ToolbarItemLabel, ToolbarItemIcon } from "../styled/Tools";

export const Tools = ({ controls, tools, setTool, getHandlerByControlName, justifyContent }) => {
  const getIcon = ctrl => {
    switch (ctrl) {
      case "trash":
      case "delete":
        return <IconTrash />;
      case "undo":
        return <IconUndo />;
      case "redo":
        return <IconRedo />;
      case "reset":
      case "clear":
        return <IconGraphClear />;
      default:
        break;
    }
  };

  const isActive = control => tools.includes(control);

  return (
    <ToolbarContainer justifyContent={justifyContent}>
      {controls.map((control, index) => (
        <ToolBtn
          key={`control-${index}`}
          className={isActive(control) ? "active" : ""}
          onClick={() => {
            setTool(control);
            getHandlerByControlName(control);
          }}
        >
          <ToolbarItem>
            <ToolbarItemIcon>{getIcon(control)}</ToolbarItemIcon>
            <ToolbarItemLabel>{control}</ToolbarItemLabel>
          </ToolbarItem>
        </ToolBtn>
      ))}
    </ToolbarContainer>
  );
};

Tools.propTypes = {
  tools: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  controls: PropTypes.array,
  justifyContent: PropTypes.string,
  getHandlerByControlName: PropTypes.func,
  setTool: PropTypes.func.isRequired
};

Tools.defaultProps = {
  tools: [],
  controls: [],
  justifyContent: "flex-start",
  getHandlerByControlName: () => {}
};

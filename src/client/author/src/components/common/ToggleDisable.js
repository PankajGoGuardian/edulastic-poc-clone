import React from "react";
import { message, Tooltip } from "antd";

const WithDisableMessage = ({ children, disabled, errMessage }) => {
  const handleClick = () => {
    if (disabled) {
      message.warn(errMessage || "This assignment has random items for every student.", 1);
    }
  };
  return disabled ? (
    <Tooltip title={errMessage || "This assignment has random items for every student."}>
      <span onClick={handleClick}>{children}</span>
    </Tooltip>
  ) : (
    children
  );
};

export default WithDisableMessage;

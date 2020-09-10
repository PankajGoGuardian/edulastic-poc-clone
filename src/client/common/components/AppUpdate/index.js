import React, { useEffect } from "react";
import { notification } from "@edulastic/common";
import "./notification.scss";

const AppUpdate = ({ visible }) => {
  const handleOk = () => {
    setTimeout(() => {
      window.location.reload(true);
    }, 100);
  };

  const btn = (
    <span style={{ whiteSpace: "nowrap" }}>
      A New update is available &nbsp;<a onClick={() => handleOk()}>Refresh</a>
    </span>
  );

  useEffect(() => {
    if (visible) {
      notification({ msg: btn, bottom: 100, placement: "bottomRight", duration: 0, className: "notification" });
    }
  }, [visible]);

  return null;
};

export default AppUpdate;

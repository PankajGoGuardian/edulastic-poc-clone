import React from "react";
import { Tag } from "antd";
import { greenDark, darkBlue, lightBlue } from "@edulastic/colors";

export default function SubTypeTag({ children }) {
  const color = {
    free: greenDark,
    enterprise: darkBlue,
    partial_premium: lightBlue,
    premium: "#FFC400"
  };
  return <Tag color={color[children]}>{children}</Tag>;
}

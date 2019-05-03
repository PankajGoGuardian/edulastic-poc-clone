import React, { useState } from "react";
import { Layout } from "antd";
import PropTypes from "prop-types";

const { Sider } = Layout;

export default function CustomSider({ initialCollapseState = false, children }) {
  const [collapse, setcollapsibility] = useState(initialCollapseState);

  return (
    <Sider theme="light" collapsible trigger={null} collapsed={collapse}>
      {children([collapse, setcollapsibility])}
    </Sider>
  );
}

CustomSider.propTypes = {
  initialCollapseState: PropTypes.bool,
  children: PropTypes.func.isRequired
};

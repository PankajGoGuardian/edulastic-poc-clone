import React from "react";
import PropTypes from "prop-types";

const TemplateBox = ({ children, maxHeight, maxWidth, margin }) => (
  <div
    className="imagedragdrop_template_box"
    style={{
      maxHeight: !maxHeight ? null : maxHeight,
      maxWidth: !maxWidth ? null : maxWidth,
      margin: !margin ? null : margin
    }}
  >
    {children}
  </div>
);

TemplateBox.propTypes = {
  children: PropTypes.any.isRequired
};

export default TemplateBox;

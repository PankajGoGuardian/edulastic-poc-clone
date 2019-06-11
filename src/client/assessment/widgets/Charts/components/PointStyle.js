import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import i18n, { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../styled/WidgetOptions/Label";

const PointStyle = ({ t, onChange, value, size, options, ...restProps }) => (
  <Fragment>
    <Label>{t("component.options.pointStyle")}</Label>
    <Select
      data-cy="pointStyleSelect"
      size="large"
      value={value}
      style={{ width: "100%" }}
      onChange={onChange}
      {...restProps}
    >
      {options.map(({ value: val, label }) => (
        <Select.Option data-cy={val} key={val} value={val}>
          {label}
        </Select.Option>
      ))}
    </Select>
  </Fragment>
);

PointStyle.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  size: PropTypes.oneOf(["default", "large", "small"]),
  value: PropTypes.oneOf(["dot", "cross"])
};

PointStyle.defaultProps = {
  value: "dot",
  size: "large",
  options: [
    { value: "dot", label: i18n.t("assessment:component.options.dot") },
    { value: "cross", label: i18n.t("assessment:component.options.cross") }
  ]
};

export default withNamespaces("assessment")(PointStyle);

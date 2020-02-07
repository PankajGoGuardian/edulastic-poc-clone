import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import i18n, { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../styled/WidgetOptions/Label";
import { SelectInputStyled } from "../../../styled/InputStyles";

const ListStyle = ({ t, onChange, value, size, options, ...restProps }) => (
  <Fragment>
    <Label>{t("component.options.listStyle")}</Label>
    <SelectInputStyled
      data-cy="listStyleOption"
      size="large"
      value={value}
      style={{ width: "100%" }}
      onChange={onChange}
      getPopupContainer={triggerNode => triggerNode.parentNode}
      {...restProps}
    >
      {options.map(({ value: val, label }) => (
        <Select.Option data-cy={val} key={val} value={val}>
          {label}
        </Select.Option>
      ))}
    </SelectInputStyled>
  </Fragment>
);

ListStyle.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  size: PropTypes.oneOf(["default", "large", "small"]),
  value: PropTypes.oneOf(["button", "list", "inline"])
};

ListStyle.defaultProps = {
  value: "button",
  size: "large",
  options: [
    { value: "button", label: i18n.t("assessment:component.options.button") },
    { value: "list", label: i18n.t("assessment:component.options.list") },
    { value: "inline", label: i18n.t("assessment:component.options.inline") }
  ]
};

export default withNamespaces("assessment")(ListStyle);

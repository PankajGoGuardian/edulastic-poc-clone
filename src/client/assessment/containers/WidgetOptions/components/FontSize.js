import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import i18n, { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../styled/WidgetOptions/Label";
import { SelectInputStyled } from "../../../styled/InputStyles";

const FontSize = ({ t, onChange, value, size, options, ...restProps }) => (
  <Fragment>
    <Label>{t("component.options.fontSize")}</Label>
    <SelectInputStyled
      data-cy="fontSizeSelect"
      size="large"
      value={value}
      getPopupContainer={triggerNode => triggerNode.parentNode}
      onChange={onChange}
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

FontSize.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  size: PropTypes.oneOf(["default", "large", "small"]),
  value: PropTypes.oneOf(["small", "normal", "large", "xlarge", "xxlarge"])
};

FontSize.defaultProps = {
  value: "normal",
  size: "large",
  options: [
    { value: "small", label: i18n.t("assessment:component.options.small") },
    { value: "normal", label: i18n.t("assessment:component.options.normal") },
    { value: "large", label: i18n.t("assessment:component.options.large") },
    { value: "xlarge", label: i18n.t("assessment:component.options.extraLarge") },
    { value: "xxlarge", label: i18n.t("assessment:component.options.huge") }
  ]
};

export default withNamespaces("assessment")(FontSize);

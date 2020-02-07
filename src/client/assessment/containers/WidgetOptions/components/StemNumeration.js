import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import i18n, { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../styled/WidgetOptions/Label";
import { SelectInputStyled } from "../../../styled/InputStyles";

const StemNumeration = ({ t, onChange, value, size, options, ...restProps }) => (
  <Fragment>
    <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
    <SelectInputStyled
      data-cy="stemNumerationSelect"
      size="large"
      value={value}
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

StemNumeration.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  size: PropTypes.oneOf(["default", "large", "small"]),
  value: PropTypes.oneOf(["numerical", "uppercase", "lowercase"])
};

StemNumeration.defaultProps = {
  value: "bottom",
  size: "large",
  options: [
    { value: "numerical", label: i18n.t("assessment:component.options.numerical") },
    { value: "uppercase", label: i18n.t("assessment:component.options.uppercasealphabet") },
    { value: "lowercase", label: i18n.t("assessment:component.options.lowercasealphabet") }
  ]
};

export default withNamespaces("assessment")(StemNumeration);

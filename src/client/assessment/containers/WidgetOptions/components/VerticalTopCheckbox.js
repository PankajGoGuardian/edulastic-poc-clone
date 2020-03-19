import { CheckboxLabel } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React from "react";

const VerticalTopCheckbox = ({ onChange, checked, t, ...restProps }) => (
  <CheckboxLabel checked={checked} onChange={e => onChange(e.target.checked)} {...restProps}>
    {t("component.options.verticaltop")}
  </CheckboxLabel>
);

VerticalTopCheckbox.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired
};

export default withNamespaces("assessment")(VerticalTopCheckbox);

import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";

const HoverStateCheckbox = ({ onChange, checked, t, ...restProps }) => (
  <CheckboxLabel data-cy="hoverStateOption" checked={checked} onChange={e => onChange(e.target.checked)} {...restProps}>
    {t("component.options.hoverState")}
  </CheckboxLabel>
);

HoverStateCheckbox.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired
};

export default withNamespaces("assessment")(HoverStateCheckbox);

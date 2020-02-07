import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";

const BrowserSpellcheckCheckbox = ({ onChange, checked, t, ...restProps }) => (
  <CheckboxLabel checked={checked} onChange={e => onChange(e.target.checked)} {...restProps}>
    {t("component.options.browserspellcheck")}
  </CheckboxLabel>
);

BrowserSpellcheckCheckbox.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired
};

export default withNamespaces("assessment")(BrowserSpellcheckCheckbox);

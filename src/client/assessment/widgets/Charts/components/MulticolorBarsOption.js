import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";

const MulticolorBarsOption = ({ t, onChange, value, size, ...restProps }) => (
  <Fragment>
    <CheckboxLabel
      data-cy="multicolorBars"
      checked={value}
      onChange={e => onChange(e.target.checked)}
      size={size}
      {...restProps}
    >
      {t("component.options.multicolorBars")}
    </CheckboxLabel>
  </Fragment>
);

MulticolorBarsOption.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["default", "large", "small"]),
  value: PropTypes.bool
};

MulticolorBarsOption.defaultProps = {
  value: true,
  size: "large"
};

export default withNamespaces("assessment")(MulticolorBarsOption);

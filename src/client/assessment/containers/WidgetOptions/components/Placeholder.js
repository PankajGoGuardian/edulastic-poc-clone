import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";

import { Label } from "../../../styled/WidgetOptions/Label";
import CommonInput from "./common/CommonInput";

const Placeholder = ({ t, ...restProps }) => (
  <Fragment>
    <Label data-cy="placeholder">{t("component.options.placeholder")}</Label>
    <CommonInput {...restProps} />
  </Fragment>
);

Placeholder.propTypes = {
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(Placeholder);

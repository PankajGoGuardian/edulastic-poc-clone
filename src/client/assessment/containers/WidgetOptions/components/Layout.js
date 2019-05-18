import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Subtitle } from "../../../styled/Subtitle";

const Layout = ({ children, t }) => (
  <div data-cy="layout">
    <Subtitle>{t("component.options.layout")}</Subtitle>
    {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.any.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(Layout);

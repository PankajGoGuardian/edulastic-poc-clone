import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Block } from "../../../styled/WidgetOptions/Block";
import { Subtitle } from "../../../styled/Subtitle";

const Layout = ({ children, t }) => (
  <Block style={{ paddingTop: 0 }} data-cy="layout">
    <Subtitle>{t("component.options.layout")}</Subtitle>
    {children}
  </Block>
);

Layout.propTypes = {
  children: PropTypes.any.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(Layout);

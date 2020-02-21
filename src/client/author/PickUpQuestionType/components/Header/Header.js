import { MainHeader } from "@edulastic/common";
import PropTypes from "prop-types";
import React from "react";

const Header = ({ title, renderExtra, noEllipsis }) => (
  <MainHeader headingText={title} noEllipsis={noEllipsis}>
    {renderExtra()}
  </MainHeader>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  renderExtra: PropTypes.func,
  noEllipsis: PropTypes.bool.isRequired
};

Header.defaultProps = {
  renderExtra: () => null
};

export default Header;

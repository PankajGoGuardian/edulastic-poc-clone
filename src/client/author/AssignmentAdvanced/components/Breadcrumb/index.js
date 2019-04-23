import React from "react";
import PropTypes from "prop-types";
import { cardTitleColor } from "@edulastic/colors";
import { Container, Mid, After, Before } from "./styled";

export const Breadcrumb = ({ children, color, first }) => (
  <Container>
    {!first && <Before bgColor={color} />}
    <Mid bgColor={color}>{children}</Mid>
    <After bgColor={color} />
  </Container>
);

Breadcrumb.propTypes = {
  children: PropTypes.any.isRequired,
  color: PropTypes.string,
  first: PropTypes.bool
};

Breadcrumb.defaultProps = {
  color: cardTitleColor,
  first: false
};

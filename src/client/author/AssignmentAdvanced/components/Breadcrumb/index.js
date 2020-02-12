import React from "react";
import PropTypes from "prop-types";
import { cardTitleColor } from "@edulastic/colors";
import { Container, Mid, After, Before } from "./styled";

export const Breadcrumb = ({ children, color, first, handleClick, bgColor = "" }) => (
  <Container onClick={handleClick} style={{ cursor: "pointer" }}>
    <Mid bgColor={bgColor} color={color}>
      {children}
    </Mid>
    <After bgColor={bgColor} color={color} />
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

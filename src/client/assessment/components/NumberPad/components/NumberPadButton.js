import React from "react";
import PropTypes from "prop-types";

import { Item } from "../styled/Item";

const NumberPadButton = ({ children, onClick }) => <Item onClick={onClick}>{children}</Item>;

NumberPadButton.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func
};

NumberPadButton.defaultProps = {
  onClick: () => {}
};

export default NumberPadButton;

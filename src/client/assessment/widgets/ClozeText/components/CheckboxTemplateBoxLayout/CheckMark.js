import React from "react";
import PropTypes from "prop-types";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { IconWrapper } from "./styled/IconWrapper";

const CheckMark = ({ correct }) => (
  <IconWrapper>
    {correct && <RightIcon />}
    {!correct && <WrongIcon />}
  </IconWrapper>
);

CheckMark.propTypes = {
  correct: PropTypes.bool.isRequired
};

export default CheckMark;

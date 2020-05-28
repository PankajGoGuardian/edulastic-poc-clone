import React from "react";
import PropTypes from "prop-types";
import { RightIcon } from "./RightIcon";
import { WrongIcon } from "./WrongIcon";
import { IconWrapper } from "./IconWrapper";

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

import React from "react";
import PropTypes from "prop-types";
import { AlternateAnswerLink } from "../styled/ButtonStyles";

const AddAlternateAnswerButton = ({ onClickHandler, text }) => (
  <AlternateAnswerLink onClick={onClickHandler} variant="extendedFab" data-cy="alternative">
    {text}
  </AlternateAnswerLink>
);

AddAlternateAnswerButton.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default AddAlternateAnswerButton;

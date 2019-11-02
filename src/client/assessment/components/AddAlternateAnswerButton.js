import React from "react";
import PropTypes from "prop-types";

import { themeColor } from "@edulastic/colors";
import { Button } from "@edulastic/common";

const AddAlternateAnswerButton = ({ onClickHandler, text }) => (
  <Button
    style={{
      minWidth: 130,
      minHeight: 40,
      padding: 0,
      marginLeft: "auto",
      background: "transparent",
      color: themeColor,
      borderRadius: 0,
      boxShadow: "none",
      outline: "none"
    }}
    onClick={onClickHandler}
    color="primary"
    variant="extendedFab"
    data-cy="alternative"
  >
    {text}
  </Button>
);

AddAlternateAnswerButton.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default AddAlternateAnswerButton;

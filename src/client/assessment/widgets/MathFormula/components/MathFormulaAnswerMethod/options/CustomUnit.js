import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { TextInputStyled } from "../../../../../styled/InputStyles";

const CustomUnitPure = ({
  onChange,
  customUnits,
  theme: {
    default: { textFieldHeight = "" }
  }
}) => {
  const [keys, updateKeys] = useState(customUnits);
  const onBlurHandler = e => {
    onChange("customUnits", e.target.value);
  };

  // this will need to restrict special characters in the future.
  // eslint-disable-next-line no-unused-vars
  const onKeyPressHandler = e => {
    const isSpecialChar = !(e.key.length > 1 || e.key.match(/[^a-zA-Z,\s]/g));
    const isArrowOrShift = (e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 16 || e.keyCode === 8;
    if (!(isSpecialChar || isArrowOrShift)) {
      const isValidKey = customUnits.includes(e.key);
      if (!isValidKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  const onChangeHandler = e => {
    updateKeys(e.target.value);
  };

  useEffect(() => {
    updateKeys(customUnits);
  }, [customUnits]);

  return (
    <TextInputStyled
      // onKeyPress={onKeyPressHandler}
      data-cy="custom-unit"
      size="large"
      value={keys}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      height={textFieldHeight}
    />
  );
};

CustomUnitPure.propTypes = {
  onChange: PropTypes.func.isRequired,
  customUnits: PropTypes.func.isRequired
};

export const CustomUnit = withTheme(CustomUnitPure);

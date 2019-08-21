import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input } from "antd";

export const CustomUnit = ({ onChange, customUnits }) => {
  const [keys, updateKeys] = useState(customUnits);
  const onBlurHandler = e => {
    onChange("customUnits", e.target.value);
  };
  const onKeyPressHandler = e => {
    const isSpecialChar = !(e.key.length > 1 || e.key.match(/[^a-zA-Z,]/g));
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
    <StyledInput
      onKeyPress={onKeyPressHandler}
      data-cy="custom-unit"
      size="large"
      value={keys}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
    />
  );
};

CustomUnit.propTypes = {
  onChange: PropTypes.func.isRequired,
  customUnits: PropTypes.func.isRequired
};

const StyledInput = styled(Input)`
  width: 100%;
`;

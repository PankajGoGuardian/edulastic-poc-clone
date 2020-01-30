import React, { useState } from "react";
import PropTypes from "prop-types";

import { Input } from "antd";

export const CustomInput = ({ type, value: propsValue, index, handleChange }) => {
  /**
   * Basically trying to simulate getDerviedStateFromProps
   * value comes in as props from store
   *
   * since we are clamping values in the handleChange function
   * we need to keep value in local state to display
   * and then update the current value with the value in props,  if currentValue got clamped
   *
   * this is to let users type in values
   * update the value in the input field with the curent store value
   *  if value gets clamped in the handleChange function
   */

  const [updatedExplicitly, setUpdatedExplicitly] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);

  if (!updatedExplicitly && currentValue !== propsValue) {
    // simulating getDerivedStateProps
    setUpdatedExplicitly(true);
    setCurrentValue(propsValue);
  }

  const handleBlur = () => {
    setUpdatedExplicitly(false);
    handleChange(index)("value", currentValue);
  };

  return (
    <Input
      type={type}
      value={currentValue}
      onChange={e => setCurrentValue(+e.target.value)}
      onBlur={handleBlur}
      disabled={false}
    />
  );
};

CustomInput.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.oneOfType(PropTypes.number, PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired
};

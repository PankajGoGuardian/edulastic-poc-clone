import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input } from "antd";

const inputBoxWidth = 200;
const inputBoxHeight = 45;

const TextInput = ({ text, onBlur, setCurrentPosition, bounded }) => {
  const [localText, setText] = useState(text);
  const [inputPos, setPosition] = useState(null);
  const handleInputChange = e => setText({ ...localText, value: e.target.value });

  const handleInputBluer = () => {
    onBlur(localText);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleInputBluer();
      setCurrentPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (text) {
      setText(text);

      let inputX = text.x;
      let inputY = text.y;
      const xDiff = inputX + inputBoxWidth - bounded.width;
      const yDiff = inputY + inputBoxHeight - bounded.height;
      if (xDiff > 0) {
        inputX -= xDiff;
      }
      if (inputX < 0) {
        inputX = 0;
      }
      if (yDiff > 0) {
        inputY -= yDiff;
      }
      if (inputY < 0) {
        inputY = 0;
      }
      setPosition({ x: inputX, y: inputY });
    }
  }, [text, bounded]);

  return (
    inputPos && (
      <ControlInput
        onChange={handleInputChange}
        onBlur={handleInputBluer}
        onKeyPress={handleKeyPress}
        value={localText?.value}
        x={inputPos.x}
        y={inputPos.y}
        size="large"
        autoFocus
      />
    )
  );
};

TextInput.propTypes = {
  bounded: PropTypes.object.isRequired,
  setCurrentPosition: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  text: PropTypes.object.isRequired
};

export default TextInput;

const ControlInput = styled(Input)`
  position: absolute;
  display: block;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  width: ${inputBoxWidth}px;
  height: ${inputBoxHeight}px;
  z-index: 1002;
`;

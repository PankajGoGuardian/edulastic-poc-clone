import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input, Popover } from "antd";
import { measureText } from "@edulastic/common";

const { TextArea } = Input;

const AutoExpandInput = ({ onChange, onBlur, multipleLine, value, style = {}, inputRef = useRef(), type, ...rest }) => {
  const [largWidth, toggleLargWidth] = useState(false);
  const [show, toggleShow] = useState(false);
  const [focused, toggleFocuse] = useState(false);
  const [lastWidth, updateWidth] = useState(style.width);

  const MInput = multipleLine ? TextArea : Input;
  const changeInputWidth = (em, val) => {
    const { width } = measureText(val, getComputedStyle(em));
    const _w = width + (type === "number" ? 14 : 2);
    if (width < 600 && width > (parseInt(style.width, 10) || 140)) {
      em.style.width = `${_w}px`;
    }
    if (width > 600) {
      em.style.overflow = "hidden";
      em.style.textOverflow = "ellipsis";
      em.style.whiteSpace = "nowrap";
      toggleLargWidth(true);
    } else {
      em.style.overflow = "";
      em.style.textOverflow = "";
      em.style.whiteSpace = "";
      toggleLargWidth(false);
    }
    updateWidth(_w);
  };

  const handleInputChange = e => {
    const em = e.target;
    const { value: changedValue } = em;
    changeInputWidth(em, changedValue);
    onChange(changedValue);
  };

  const showPopover = () => {
    toggleShow(true);
  };

  const hidePopover = () => {
    toggleShow(false);
  };

  const handleFocuse = () => {
    toggleFocuse(true);
  };

  const handleBuler = e => {
    toggleFocuse(false);
    onBlur(e, lastWidth);
  };

  useEffect(() => {
    if (inputRef.current) {
      const em = multipleLine ? inputRef.current.textAreaRef : inputRef.current.input;
      changeInputWidth(em, value);
    }
  }, []);

  const popoverContent = <PopoverContent>{value}</PopoverContent>;
  return (
    <Popover visible={show && largWidth && !focused} content={popoverContent}>
      <MInput
        ref={inputRef}
        onMouseEnter={showPopover}
        onMouseLeave={hidePopover}
        onFocus={handleFocuse}
        onChange={handleInputChange}
        onBlur={handleBuler}
        wrap={multipleLine ? "" : "off"}
        value={value || ""}
        style={style}
        type={type}
        {...rest}
      />
    </Popover>
  );
};

AutoExpandInput.propTypes = {
  multipleLine: PropTypes.bool,
  style: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputRef: PropTypes.any
};

AutoExpandInput.defaultProps = {
  multipleLine: false,
  onChange: () => {},
  onBlur: () => {},
  style: {},
  value: "",
  type: "text",
  inputRef: null
};

export default AutoExpandInput;

const PopoverContent = styled.div`
  max-width: 600px;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: normal;
`;

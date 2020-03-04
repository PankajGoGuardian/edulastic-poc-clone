import PropTypes from "prop-types";
import React from "react";
import { Prompt } from "react-router-dom";
import useUnload from "../customHooks/useUnload";

// NOTE: message can be seen only when react-router-dom detects changes
// or else this component will show default message from the browser (on reload)
const CustomPrompt = ({ when = false, onUnload = false, message = "" }) => {
  useUnload(e => {
    if (onUnload) {
      e = window.event;
      e.preventDefault();
      e.returnValue = "";
    }
  });
  if (when) {
    return <Prompt when={when} message={message} />;
  }
  return null;
};

CustomPrompt.propTypes = {
  when: PropTypes.bool.isRequired
};

export default CustomPrompt;

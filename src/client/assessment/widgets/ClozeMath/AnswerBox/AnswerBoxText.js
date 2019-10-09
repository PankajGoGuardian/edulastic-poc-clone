import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { white } from "@edulastic/colors";
import MathSpanWrapper from "../../../components/MathSpanWrapper";

const AnswerBoxText = ({ children, isMath }) => {
  const latexEscape = str => {
    const specialCharMap = {
      "#": "\\#",
      $: "\\$",
      "%": "\\%",
      "&": "\\&",
      "~": "\\~{}",
      _: "\\_"
    };
    Object.keys(specialCharMap).forEach(key => {
      str = str.replace(key, specialCharMap[key]);
      return null;
    });
    return str;
  };
  return (
    <Text data-cy="correct-answer-box">
      {isMath ? <MathSpanWrapper latex={latexEscape(children)} /> : <span>{children}</span>}
    </Text>
  );
};

AnswerBoxText.propTypes = {
  children: PropTypes.string.isRequired,
  isMath: PropTypes.bool.isRequired
};

export default AnswerBoxText;

const Text = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${white};
  min-width: 80px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;

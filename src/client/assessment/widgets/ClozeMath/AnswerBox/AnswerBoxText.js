import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { white } from "@edulastic/colors";

const AnswerBoxText = ({ children }) => {
  const elemRef = useRef();

  useEffect(() => {
    const MQ = window.MathQuill.getInterface(2);
    const mQuill = MQ.StaticMath(elemRef.current);
    mQuill.latex(children);
  }, []);

  return (
    <Text data-cy="correct-answer-box">
      <span ref={elemRef}>{children}</span>
    </Text>
  );
};

AnswerBoxText.propTypes = {
  children: PropTypes.string.isRequired
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

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { lightBlue, lightGrey } from '@edulastic/colors';

const CorrectAnswerBox = ({ children }) => {
  const answerRef = useRef();

  useEffect(() => {
    window.MathQuill.StaticMath(answerRef.current).latex(children);
  }, []);

  return (
    <Wrapper>
      <div>Correct answers:</div>
      <Answer>
        <div ref={answerRef} />
      </Answer>
    </Wrapper>
  );
};

CorrectAnswerBox.propTypes = {
  children: PropTypes.any.isRequired
};

export default CorrectAnswerBox;

const Wrapper = styled.div`
  padding: 15px;
  background: ${lightBlue};
  border-radius: 5px;
  margin: 15px 0;
`;

const Answer = styled.div`
  padding: 5px;
  background: ${lightGrey};
  display: inline-block;
  border-radius: 5px;
`;

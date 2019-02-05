import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { withNamespaces } from '@edulastic/localization';

import { Wrapper } from './styled/Wrapper';
import { Answer } from './styled/Answer';

const CorrectAnswerBox = ({ children, t }) => {
  const answerRef = useRef();

  useEffect(() => {
    window.MathQuill.StaticMath(answerRef.current).latex(children);
  }, []);

  return (
    <Wrapper>
      <div>{t('component.math.correctAnswers')}:</div>
      <Answer>
        <div ref={answerRef} />
      </Answer>
    </Wrapper>
  );
};

CorrectAnswerBox.propTypes = {
  children: PropTypes.any.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(CorrectAnswerBox);

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { evaluateApi } from '@edulastic/api';
import { math } from '@edulastic/constants';

import { MathInput } from '../common';
import { SHOW, CHECK, CLEAR } from '../../../constants/constantsForQuestions';
import CorrectAnswerBox from './CorrectAnswerBox';

const { mathInputTypes } = math;

const MathFormulaPreview = ({ item, studentTemplate, type: previewType }) => {
  const [type, setType] = useState(mathInputTypes.CLEAR);
  const [userAnswer, setUserAnswer] = useState(studentTemplate);

  const checkAnswer = async (input) => {
    if (previewType === CHECK) {
      const data = {
        input,
        expected: item.validation.valid_response.value[0].value,
        checks: item.validation.valid_response.value[0].method
      };
      try {
        const { result } = await evaluateApi.evaluate(data);
        if (result === 'error') {
          setType(mathInputTypes.WRONG);
        } else if (result === 'false') {
          setType(mathInputTypes.WRONG);
        } else {
          setType(mathInputTypes.SUCCESS);
        }
      } catch (err) {
        setType(mathInputTypes.WRONG);
      }
    }
  };

  useEffect(
    () => {
      if (previewType === CLEAR) {
        setUserAnswer(studentTemplate);
        setType(mathInputTypes.CLEAR);
      }

      if (previewType === SHOW) {
        setType(mathInputTypes.CLEAR);
      }

      checkAnswer(userAnswer);
    },
    [studentTemplate, previewType]
  );

  return (
    <div>
      <div style={{ marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />

      <MathInput showResponse={false} type={type} value={userAnswer} onInput={setUserAnswer} />

      {previewType === SHOW && (
        <CorrectAnswerBox>{item.validation.valid_response.value[0].value}</CorrectAnswerBox>
      )}
    </div>
  );
};
MathFormulaPreview.propTypes = {
  item: PropTypes.object.isRequired,
  studentTemplate: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default MathFormulaPreview;

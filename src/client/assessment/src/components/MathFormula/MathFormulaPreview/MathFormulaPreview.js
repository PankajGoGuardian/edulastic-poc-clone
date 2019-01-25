import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { math } from '@edulastic/constants';

import { SHOW, /* CHECK, */ CLEAR } from '../../../constants/constantsForQuestions';
import CorrectAnswerBox from './CorrectAnswerBox';
import StaticMath from '../common/StaticMath';
import MathInput from '../common/MathInput';

const { mathInputTypes } = math;

const MathFormulaPreview = ({ item, studentTemplate, type: previewType, saveAnswer }) => {
  const [type, setType] = useState(mathInputTypes.CLEAR);
  const studentRef = useRef();
  const isStatic = studentTemplate.search(/\\MathQuillMathField\{(.*)\}/g) !== -1;

  const [latex, setLatex] = useState(studentTemplate);

  const onUserResponse = (latexv) => {
    setLatex(latexv);
    saveAnswer(isStatic ? studentRef.current.getLatex() : latex);
  };

  useEffect(
    () => {
      if (previewType === CLEAR) {
        setType(mathInputTypes.CLEAR);
        setLatex(studentTemplate);
        if (studentRef.current) {
          studentRef.current.setLatex(studentTemplate);
        }
      }
    },
    [studentTemplate, previewType]
  );

  useEffect(
    () => {
      setTimeout(() => {
        if (!studentRef.current) return;
        studentRef.current.setLatex(studentTemplate);
      }, 0);
    },
    [studentTemplate]
  );
  return (
    <div>
      <div style={{ marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />

      {isStatic && (
        <StaticMath
          symbols={item.symbols}
          numberPad={item.numberPad}
          ref={studentRef}
          onInput={onUserResponse}
          type={type}
        />
      )}
      {!isStatic && (
        <MathInput
          symbols={item.symbols}
          numberPad={item.numberPad}
          value={latex}
          onInput={onUserResponse}
          type={type}
        />
      )}

      {previewType === SHOW && item.validation.valid_response.value[0].value !== undefined && (
        <CorrectAnswerBox>{item.validation.valid_response.value[0].value}</CorrectAnswerBox>
      )}
    </div>
  );
};
MathFormulaPreview.propTypes = {
  item: PropTypes.object.isRequired,
  studentTemplate: PropTypes.string,
  type: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired
};
MathFormulaPreview.defaultProps = {
  studentTemplate: ''
};

export default MathFormulaPreview;

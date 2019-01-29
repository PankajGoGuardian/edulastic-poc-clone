import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { math } from '@edulastic/constants';

import { SHOW, CHECK, CLEAR } from '../../../constants/constantsForQuestions';
import CorrectAnswerBox from './CorrectAnswerBox';
import StaticMath from '../common/StaticMath';
import MathInput from '../common/MathInput';
import MathInputWrapper from './MathInputWrapper';
import MathInputStatus from './MathInputStatus';

const { mathInputTypes } = math;

const MathFormulaPreview = ({ item, studentTemplate, type: previewType, evaluation, saveAnswer }) => {
  const [type, setType] = useState(mathInputTypes.CLEAR);
  const studentRef = useRef();
  const isStatic = studentTemplate.search(/\\MathQuillMathField\{(.*)\}/g) !== -1;

  const [latex, setLatex] = useState(studentTemplate);

  const onUserResponse = (latexv) => {
    setLatex(latexv);
    saveAnswer(isStatic ? studentRef.current.getLatex() : latexv);
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

  let statusColor = '#fff';
  if (previewType === SHOW || previewType === CHECK) {
    statusColor = evaluation ? (evaluation[0] ? '#e1fbf2' : '#fce0e8') : '#fce0e8';
  }
  return (
    <div>
      <div style={{ marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />

      <MathInputWrapper>
        {isStatic && (
          <StaticMath
            symbols={item.symbols}
            numberPad={item.numberPad}
            ref={studentRef}
            onInput={onUserResponse}
            type={type}
            style={{ background: statusColor }}
          />
        )}
        {!isStatic && (
          <MathInput
            symbols={item.symbols}
            numberPad={item.numberPad}
            value={latex}
            onInput={onUserResponse}
            type={type}
            disabled={evaluation && !evaluation[0]}
            style={{ background: statusColor }}
          />
        )}
        {
          (previewType === SHOW || previewType === CHECK) && (
            <MathInputStatus valid={!!evaluation && !!evaluation[0]} />
          )
        }
      </MathInputWrapper>

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
  saveAnswer: PropTypes.func.isRequired,
  evaluation: PropTypes.object.isRequired
};
MathFormulaPreview.defaultProps = {
  studentTemplate: ''
};

export default MathFormulaPreview;

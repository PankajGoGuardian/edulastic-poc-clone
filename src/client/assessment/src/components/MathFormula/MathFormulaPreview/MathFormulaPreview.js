import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { evaluateApi } from '@edulastic/api';
import { math } from '@edulastic/constants';
import { omitBy } from 'lodash';

import { SHOW, CHECK, CLEAR } from '../../../constants/constantsForQuestions';
import CorrectAnswerBox from './CorrectAnswerBox';
import StaticMath from '../common/StaticMath';

const { mathInputTypes } = math;

const getChecks = (validation) => {
  const altResponses = validation.alt_responses || [];

  const values = [
    ...validation.valid_response.value,
    ...altResponses.reduce((acc, res) => [...acc, ...res.value], [])
  ];

  return values.reduce((valAcc, val, valIndex) => {
    let options = val.options || {};
    options = omitBy(options, f => f === false);

    let midRes = Object.keys(options).reduce((acc, key, i) => {
      const fieldVal = options[key];

      acc += i === 0 ? ':' : '';

      if (key === 'argument') {
        return acc;
      }

      if (fieldVal === false) {
        return acc;
      }

      if (key === 'setThousandsSeparator') {
        if (fieldVal.length) {
          const stringArr = `[${fieldVal.map(f => `'${f}'`)}]`;
          acc += `${key}=${stringArr}`;
        } else {
          return acc;
        }
      } else if (key === 'allowThousandsSeparator') {
        return acc;
      } else if (key === 'setDecimalSeparator') {
        acc += `${key}='${fieldVal}'`;
      } else if (key === 'allowedUnits') {
        acc += `${key}=[${fieldVal}]`;
      } else if (key === 'syntax') {
        acc += options.argument === undefined ? fieldVal : `${fieldVal}=${options.argument}`;
      } else {
        acc += `${key}=${fieldVal}`;
      }

      return `${acc},`;
    }, val.method);

    if (midRes[midRes.length - 1] === ',') {
      midRes = midRes.slice(0, midRes.length - 1);
    }

    valAcc += midRes;

    valAcc += valIndex + 1 === values.length ? '' : ';';

    return valAcc;
  }, '');
};

const MathFormulaPreview = ({
  item,
  studentTemplate,
  type: previewType,
  saveAnswer,
  check,
  smallSize
}) => {
  const [type, setType] = useState(mathInputTypes.CLEAR);
  const studentRef = useRef();

  const checkAnswer = async () => {
    if (previewType === CHECK) {
      saveAnswer(studentRef.current.getLatex());
      let input = studentRef.current.getLatex();
      let expected = item.validation.valid_response.value[0].value;

      if (input) {
        input = input.replace(/\\ /g, ' ');
      }

      if (expected) {
        expected = expected.replace(/\\ /g, ' ');
      }

      const data = {
        input,
        expected: expected || ':""',
        checks: getChecks(item.validation)
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
        check();
      } catch (err) {
        setType(mathInputTypes.WRONG);
      }
    }
  };

  useEffect(
    () => {
      if (previewType === CLEAR) {
        setType(mathInputTypes.CLEAR);
        studentRef.current.setLatex(studentTemplate);
      }

      if (previewType === SHOW) {
        setType(mathInputTypes.CLEAR);
      }

      if (previewType === CHECK) {
        checkAnswer();
      }
    },
    [studentTemplate, previewType]
  );

  useEffect(
    () => {
      setTimeout(() => {
        if (!studentRef.current) return;

        if (smallSize) {
          studentRef.current.setLatex(item.validation.valid_response.value[0].value);
        } else {
          studentRef.current.setLatex(studentTemplate);
        }
      }, 0);
    },
    [studentTemplate]
  );

  return (
    <div>
      <div style={{ marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />

      <StaticMath onBlur={() => checkAnswer()} ref={studentRef} type={type} />

      {previewType === SHOW && item.validation.valid_response.value[0].value !== undefined && (
        <CorrectAnswerBox>{item.validation.valid_response.value[0].value}</CorrectAnswerBox>
      )}
    </div>
  );
};
MathFormulaPreview.propTypes = {
  item: PropTypes.object.isRequired,
  studentTemplate: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  check: PropTypes.func.isRequired,
  smallSize: PropTypes.bool.isRequired
};

export default MathFormulaPreview;

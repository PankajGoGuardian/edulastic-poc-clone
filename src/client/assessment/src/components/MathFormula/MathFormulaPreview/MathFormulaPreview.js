import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { MathInput } from '../common';

const MathFormulaPreview = ({ item, userAnswer, saveAnswer }) => {
  const [type, setType] = useState('clear');

  useEffect(
    () => {
      const responses = [item.validation.valid_response, ...(item.validation.alt_responses || [])];
      const correctAnswers = responses.reduce((acc, res) => {
        if (res.value && res.value.length) {
          return [...acc, ...res.value.map(val => val.value)];
        }

        return acc;
      }, []);

      if (!userAnswer) {
        setType('clear');
      } else if (correctAnswers.includes(userAnswer)) {
        setType('success');
      } else {
        setType('wrong');
      }
    },
    [userAnswer]
  );

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      <MathInput type={type} value={userAnswer} onInput={saveAnswer} />
    </div>
  );
};
MathFormulaPreview.propTypes = {
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string.isRequired
};

export default MathFormulaPreview;

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { EduButton } from '@edulastic/common';
import MathFormulaAnswerMethod from './MathFormulaAnswerMethod';

const MathFormulaAnswer = ({ answer, onChange, onAdd, onDelete, item }) => {
  const handleChangeMethod = index => (prop, val) => {
    onChange({ index, prop, value: val });
  };

  return (
    <Fragment>
      {answer.map((method, i) => (
        <MathFormulaAnswerMethod
          onDelete={() => onDelete(i)}
          key={i}
          item={item}
          onChange={handleChangeMethod(i)}
          {...method}
        >
          MathFormulaAnswer
        </MathFormulaAnswerMethod>
      ))}
      <EduButton onClick={onAdd} type="primary" size="large">
        Add new method
      </EduButton>
    </Fragment>
  );
};

MathFormulaAnswer.propTypes = {
  answer: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default MathFormulaAnswer;

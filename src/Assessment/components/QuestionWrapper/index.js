import PropTypes from 'prop-types';
import React from 'react';

import MultiChoice from './MultiChoice';

const QuestionWrapper = ({
  options,
  question,
  type,
  setAnswers,
  showAnswer,
  answers,
  onChange,
  userSelections = [],
}) => (
  <div>
    {type === 'mcq' && (
      <MultiChoice
        setAnswers={setAnswers}
        showAnswer={showAnswer}
        answers={answers}
        userSelections={userSelections}
        options={options}
        question={question}
        onChange={onChange}
      />
    )}
  </div>
);

QuestionWrapper.propTypes = {
  type: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  answers: PropTypes.array.isRequired,
  userSelections: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  setAnswers: PropTypes.bool.isRequired,
};

export default QuestionWrapper;

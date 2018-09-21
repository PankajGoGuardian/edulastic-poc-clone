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
  showAnswer: PropTypes.bool,
  answers: PropTypes.array,
  userSelections: PropTypes.array,
  onChange: PropTypes.func,
  setAnswers: PropTypes.func,
};

QuestionWrapper.defaultProps = {
  showAnswer: false,
  answers: [],
  userSelections: [],
  onChange: () => {},
  setAnswers: () => {},
};

export default QuestionWrapper;

import PropTypes from 'prop-types';
import React from 'react';

import MultipleChoiceDisplay from '../MultipleChoice/Display';

const QuestionWrapper = (props) => {
  const {
    options,
    question,
    type,
    setAnswers,
    showAnswer,
    answers,
    onChange,
    userSelections = [],
  } = props;
  return (
    <div>
      {type === 'mcq' && (
        <MultipleChoiceDisplay
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
};

QuestionWrapper.propTypes = {
  type: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  question: PropTypes.string,
  showAnswer: PropTypes.bool,
  answers: PropTypes.array,
  userSelections: PropTypes.array,
  onChange: PropTypes.func,
  setAnswers: PropTypes.bool,
};

QuestionWrapper.defaultProps = {
  showAnswer: false,
  answers: [],
  userSelections: [],
  onChange: () => {},
  setAnswers: false,
  question: null,
};

export default QuestionWrapper;

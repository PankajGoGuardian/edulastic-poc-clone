import PropTypes from 'prop-types';
import React from 'react';

import MultiChoice from './MultiChoice';

const QuestionWrapper = (props) => {
  const { options, question, type, setAnswers, showAnswer, answers, userSelections=[] } = props;
  return (
    <div>
      { type === 'mcq' &&
        <MultiChoice
          setAnswers={setAnswers}
          showAnswer={showAnswer}
          answers={answers}
          userSelections={userSelections}
          options={options}
          question={question}
          onChange={props.onChange}
        />
      }
    </div>
  );
}

QuestionWrapper.propTypes = {
  type: PropTypes.string,
  options: PropTypes.array,
  question: PropTypes.string,
  showAnswer: PropTypes.bool,
  answers: PropTypes.array,
  userSelections: PropTypes.array,
  onChange: PropTypes.func,
  setAnswers: PropTypes.bool,
};

export default QuestionWrapper;

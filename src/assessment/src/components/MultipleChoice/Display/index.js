import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { PaddingDiv } from '@edulastic/common';

import QuestionDisplay from '../../Base/QuestionDisplay';
import FlexContainer from './FlexContainer';
import MultiChoiceContent from './MultiChoiceContent';
import CheckboxContainter from './CheckboxContainer';
import Label from './Label';
import ProblemContainer from './ProblemContainer';
import { ALPHABET } from '../constants/others';

const Option = ({
  index,
  checkAnswer,
  setAnswers,
  item,
  showAnswer,
  userSelections,
  answers,
  onChange,
  smallSize,
  answer,
}) => {
  let className =
    checkAnswer || showAnswer
      ? userSelections[index]
        ? answer === item.value
          ? 'right'
          : 'wrong'
        : ''
      : '';

  if (showAnswer && answers[index]) {
    className = 'right';
  }

  return (
    <Label smallSize={smallSize} setAnswers={setAnswers} showAnswer className={className}>
      <PaddingDiv
        top={setAnswers ? 15 : smallSize ? 0 : 20}
        bottom={setAnswers ? 15 : smallSize ? 0 : 20}
      >
        <FlexContainer>
          <CheckboxContainter smallSize={smallSize}>
            <input
              type="radio"
              name="mcq_group"
              value={index}
              defaultChecked={answer === item.value}
              onClick={onChange}
            />
            <span>{ALPHABET[index]}</span>
            <div />
          </CheckboxContainter>
          <MultiChoiceContent smallSize={smallSize}>{item.label}</MultiChoiceContent>
          <PaddingDiv right={15} height={20}>
            {className === 'right' && <i className="fa fa-check" />}
            {className === 'wrong' && <i className="fa fa-times" />}
          </PaddingDiv>
        </FlexContainer>
      </PaddingDiv>
    </Label>
  );
};

const Options = (props) => {
  const {
    options,
    checkAnswer,
    showAnswer,
    setAnswers,
    userSelections,
    answers,
    smallSize,
    answer,
    addAnswer,
  } = props;

  return (
    <div>
      {options.map((option, index) => (
        <Option
          key={index}
          smallSize={smallSize}
          checkAnswer={checkAnswer}
          index={index}
          setAnswers={setAnswers}
          item={option}
          answer={answer}
          showAnswer={showAnswer}
          userSelections={userSelections}
          answers={answers}
          onChange={() => addAnswer(index)}
        />
      ))}
    </div>
  );
};

class MultipleChoiceDisplay extends Component {
  selectAnswer = (answer) => {
    const { data, addAnswer } = this.props;

    const id = data._id;
    addAnswer(id, answer);
  };

  render() {
    const { onChange, options, question } = this.props;

    const {
      showAnswer,
      userSelections = [],
      answers = [],
      smallSize,
      checkAnswer,
      setAnswers,
      data,
    } = this.props;

    return (
      <QuestionDisplay
        onRef={(ref) => {
          this.baseQuestion = ref;
        }}
      >
        {!setAnswers && (
          <ProblemContainer smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        )}
        <Options
          key={checkAnswer && showAnswer}
          smallSize={smallSize}
          setAnswers={setAnswers}
          addAnswer={this.selectAnswer}
          answer={data.answer}
          checkAnswer={checkAnswer}
          options={options}
          showAnswer={showAnswer}
          userSelections={userSelections}
          answers={answers}
          onChange={onChange}
        />
      </QuestionDisplay>
    );
  }
}

Option.defaultProps = {
  setAnswers: false,
  showAnswer: false,
  smallSize: false,
  userSelections: [],
  answers: [],
};

Option.propTypes = {
  index: PropTypes.number.isRequired,
  setAnswers: PropTypes.bool,
  showAnswer: PropTypes.bool,
  item: PropTypes.object.isRequired,
  userSelections: PropTypes.array,
  answers: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool.isRequired,
  answer: PropTypes.any.isRequired,
};

Options.defaultProps = {
  setAnswers: false,
  showAnswer: false,
  userSelections: [],
  answers: [],
  options: [],
  smallSize: false,
};

Options.propTypes = {
  setAnswers: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  answers: PropTypes.array,
  options: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool.isRequired,
  answer: PropTypes.any.isRequired,
  addAnswer: PropTypes.func.isRequired,
};

MultipleChoiceDisplay.propTypes = {
  setAnswers: PropTypes.bool,
  options: PropTypes.array,
  question: PropTypes.string,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  answers: PropTypes.array,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  data: PropTypes.any.isRequired,
  addAnswer: PropTypes.func.isRequired,
};

MultipleChoiceDisplay.defaultProps = {
  options: [],
  question: '',
  onChange: () => {},
  showAnswer: false,
  answers: [],
  userSelections: [],
  smallSize: false,
  checkAnswer: false,
  setAnswers: false,
};

export default MultipleChoiceDisplay;

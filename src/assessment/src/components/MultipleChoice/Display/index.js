import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { PaddingDiv } from '@edulastic/common';

import FlexContainer from './FlexContainer';
import MultiChoiceContent from './MultiChoiceContent';
import CheckboxContainter from './CheckboxContainer';
import Label from './Label';
import { ALPHABET } from '../constants/others';

const Option = ({
  index,
  checkAnswer,
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
    <Label smallSize={smallSize} showAnswer className={className}>
      <PaddingDiv top={10} bottom={10}>
        <FlexContainer>
          <CheckboxContainter smallSize={smallSize}>
            <input
              type="checkbox"
              name="mcq_group"
              value={index}
              defaultChecked={answer === item.value}
              onChange={onChange}
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
    userSelections,
    answers,
    smallSize,
    answer,
    onChange,
  } = props;

  return (
    <div>
      {options.map((option, index) => (
        <Option
          key={index}
          smallSize={smallSize}
          checkAnswer={checkAnswer}
          index={index}
          item={option}
          answer={answer}
          showAnswer={showAnswer}
          userSelections={userSelections}
          answers={answers}
          onChange={() => onChange(index)}
        />
      ))}
    </div>
  );
};

class MultipleChoiceDisplay extends Component {
  render() {
    const { onChange, options } = this.props;

    const {
      showAnswer,
      userSelections = [],
      answers = [],
      smallSize,
      checkAnswer,
      data,
    } = this.props;

    return (
      <div>
        <Options
          key={checkAnswer && showAnswer}
          smallSize={smallSize}
          addAnswer={this.selectAnswer}
          answer={data.answer}
          checkAnswer={onChange}
          options={options}
          showAnswer={showAnswer}
          userSelections={userSelections}
          answers={answers}
          onChange={onChange}
        />
      </div>
    );
  }
}

Option.defaultProps = {
  showAnswer: false,
  smallSize: false,
  userSelections: [],
  answers: [],
};

Option.propTypes = {
  index: PropTypes.number.isRequired,
  showAnswer: PropTypes.bool,
  item: PropTypes.any.isRequired,
  userSelections: PropTypes.array,
  answers: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool.isRequired,
  answer: PropTypes.any.isRequired,
};

Options.defaultProps = {
  showAnswer: false,
  userSelections: [],
  answers: [],
  options: [],
  smallSize: false,
  answer: {},
};

Options.propTypes = {
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  answers: PropTypes.array,
  options: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool.isRequired,
  answer: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

MultipleChoiceDisplay.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  answers: PropTypes.array,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  data: PropTypes.any,
};

MultipleChoiceDisplay.defaultProps = {
  options: [],
  onChange: () => {},
  showAnswer: false,
  answers: [],
  userSelections: [],
  smallSize: false,
  checkAnswer: false,
  data: {},
};

export default MultipleChoiceDisplay;

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
  item,
  showAnswer,
  checkAnswer,
  userSelections,
  validation,
  onChange,
  smallSize,
}) => {
  const isValidUserSelections = userSelections.includes(item.value);
  const isValidAltResponses = () => {
    const values = [];
    validation.alt_responses.forEach((res) => {
      values.push(...res.value);
    });

    return values.includes(parseInt(item.value, 10)) && isValidUserSelections;
  };

  let className = '';
  const isValidResponse =
    validation &&
    validation.valid_response &&
    validation.valid_response.value.includes(parseInt(item.value, 10));

  if (isValidUserSelections && checkAnswer) {
    if (isValidResponse) {
      className = 'right';
    } else if (validation.alt_responses.length && isValidAltResponses()) {
      className = 'right';
    } else {
      className = 'wrong';
    }
  }

  if (userSelections && userSelections.length === 0) {
    className = '';
  }

  if (showAnswer && isValidResponse) {
    className = 'right';
  }

  return (
    <Label smallSize={smallSize} showAnswer className={className}>
      <PaddingDiv top={0} bottom={0}>
        <FlexContainer>
          <CheckboxContainter smallSize={smallSize}>
            <input
              type="checkbox"
              name="mcq_group"
              value={index}
              checked={isValidUserSelections}
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
    smallSize,
    onChange,
    validation,
  } = props;

  return (
    <div>
      {options.map((option, index) => (
        <Option
          key={index}
          smallSize={smallSize}
          checkAnswer={checkAnswer}
          showAnswer={showAnswer}
          index={index}
          item={option}
          userSelections={userSelections}
          validation={validation}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  );
};

class MultipleChoiceDisplay extends Component {
  render() {
    const {
      showAnswer,
      checkAnswer,
      userSelections,
      smallSize,
      onChange,
      options,
      validation,
      question,
    } = this.props;

    return (
      <div>
        <h5>{question}</h5>
        <Options
          smallSize={smallSize}
          addAnswer={this.selectAnswer}
          options={options}
          showAnswer={showAnswer}
          checkAnswer={checkAnswer}
          userSelections={userSelections}
          validation={validation}
          onChange={onChange}
        />
      </div>
    );
  }
}

Option.defaultProps = {
  showAnswer: false,
  smallSize: false,
  checkAnswer: false,
  userSelections: [],
  validation: {},
};

Option.propTypes = {
  index: PropTypes.number.isRequired,
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  item: PropTypes.any.isRequired,
  userSelections: PropTypes.array,
  validation: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
};

Options.defaultProps = {
  showAnswer: false,
  checkAnswer: false,
  userSelections: [],
  validation: {},
  options: [],
  smallSize: false,
};

Options.propTypes = {
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  validation: PropTypes.object,
  options: PropTypes.array,
  smallSize: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

MultipleChoiceDisplay.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  validation: PropTypes.object,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  question: PropTypes.string.isRequired,
};

MultipleChoiceDisplay.defaultProps = {
  options: [],
  onChange: () => {},
  showAnswer: false,
  checkAnswer: false,
  validation: {},
  userSelections: [],
  smallSize: false,
};

export default MultipleChoiceDisplay;

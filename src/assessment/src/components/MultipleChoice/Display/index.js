import PropTypes from 'prop-types';
import React from 'react';
import { PaddingDiv } from '@edulastic/common';

import QuestionDisplay from '../../Base/QuestionDisplay';
import FlexContainer from './FlexContainer';
import MultiChoiceContent from './MultiChoiceContent';
import CheckboxContainter from './CheckboxContainer';
import Label from './Label';
import ProblemContainer from './ProblemContainer';

const Option = (props) => {
  const {
    index, setAnswers, item, showAnswer, userSelections, answers, onChange, smallSize,
  } = props;
  return (
    <Label
      smallSize={smallSize}
      setAnswers={setAnswers}
      showAnswer
      className={showAnswer ? answers[index] ? 'right' : 'wrong' : ''}
    >
      <PaddingDiv top={setAnswers ? 15 : smallSize ? 0 : 20} bottom={setAnswers ? 15 : smallSize ? 0 : 20}>
        <FlexContainer>
          <CheckboxContainter>
            <input type="checkbox" value={index} defaultChecked={userSelections[index]} onClick={onChange} />
            <span />
          </CheckboxContainter>
          <MultiChoiceContent smallSize={smallSize}>
            {item.label}
          </MultiChoiceContent>
          <PaddingDiv right={15} height={20}>
            {showAnswer && answers[index] &&
              <i className="fa fa-check" />
            }
            {showAnswer && !answers[index] &&
              <i className="fa fa-times" />
            }
          </PaddingDiv>
        </FlexContainer>
      </PaddingDiv>
    </Label>
  );
};

const Options = (props) => {
  const {
    options, showAnswer, setAnswers, userSelections, answers, onChange, smallSize,
  } = props;
  return (
    <div>
      {options.map((option, index) => (
        <Option
          key={index}
          smallSize={smallSize}
          index={index}
          setAnswers={setAnswers}
          item={option}
          showAnswer={showAnswer}
          userSelections={userSelections}
          answers={answers}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

class MultipleChoiceDisplay extends QuestionDisplay {
  render() {
    let { options, question } = this.props;
    if (this.props.preview) {
      const { options: responseOpt, question: responseQues } = this.getResponse();
      options = responseOpt;
      question = responseQues;
    }
    const {
      setAnswers, showAnswer, userSelections = [], answers = [], smallSize,
    } = this.props;
    return (
      <div>
        {!setAnswers && (
          <ProblemContainer
            smallSize={smallSize}
            dangerouslySetInnerHTML={{ __html: question }}
          />
        )}
        <Options
          smallSize={smallSize}
          options={options}
          setAnswers={setAnswers}
          showAnswer={showAnswer}
          userSelections={userSelections}
          answers={answers}
          onChange={this.props.onChange}
        />
      </div>
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
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
};

MultipleChoiceDisplay.propTypes = {
  options: PropTypes.array,
  question: PropTypes.string,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  answers: PropTypes.array,
  setAnswers: PropTypes.bool,
  preview: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
};

export default MultipleChoiceDisplay;

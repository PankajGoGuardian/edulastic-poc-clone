import PropTypes from 'prop-types';
import React from 'react';

import QuestionDisplay from '../Base/QuestionDisplay';
import FlexContainer from '../common/FlexContainer';
import PaddingDiv from '../common/PaddingDiv';
import MultiChoiceContent from './components/MultiChoiceContent';
import CheckboxContainter from './components/CheckboxContainer';
import Label from './components/Label';
import ProblemContainer from './components/ProblemContainer';


const Option = (props) => {
  const { index, setAnswers, item, showAnswer, userSelections, answers } = props;
  return (
    <Label setAnswers={setAnswers} showAnswer className={showAnswer ? answers[index] ? 'right' : 'wrong' : ''} >
      <PaddingDiv top={setAnswers ? 10 : 20} bottom={20} >
        <FlexContainer>
          <CheckboxContainter>
            <input type="checkbox" value={index} defaultChecked={userSelections[index]} onClick={props.onChange} />
            <span />
          </CheckboxContainter>
          <MultiChoiceContent>
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
  const { options, showAnswer, setAnswers, userSelections, answers } = props;
  return (
    <div>
      {options.map((option, index) => (
        <Option
          key={index}
          index={index}
          setAnswers={setAnswers}
          item={option}
          showAnswer={showAnswer}
          userSelections={userSelections}
          answers={answers}
          onChange={props.onChange}
        />
      ))}
    </div>
  );
};

class MultipleChoiceDisplay extends QuestionDisplay {
  render() {
    let { options, question } = this.props;
    if (this.props.preview) {
      const response = this.getResponse();
      options = response.options;
      question = response.question;
    }
    const { setAnswers, showAnswer, userSelections = [], answers = [] } = this.props;
    return (
      <div>
        { !setAnswers &&
          <ProblemContainer dangerouslySetInnerHTML={{ __html: question }} />
        }
        <Options
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

Option.propTypes = {
  index: PropTypes.number,
  setAnswers: PropTypes.bool,
  showAnswer: PropTypes.bool,
  item: PropTypes.object,
  userSelections: PropTypes.array,
  answers: PropTypes.array,
  onChange: PropTypes.func,
};

Options.propTypes = {
  setAnswers: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  answers: PropTypes.array,
  options: PropTypes.array,
  onChange: PropTypes.func,
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
};

export default MultipleChoiceDisplay;

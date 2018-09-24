import PropTypes from 'prop-types';
import React from 'react';

import QuestionDisplay from '../Base/QuestionDisplay';
import FlexContainer from '../common/FlexContainer';
import PaddingDiv from '../common/PaddingDiv';
import MultiChoiceContent from './components/MultiChoiceContent';
import CheckboxContainter from './components/CheckboxContainer';
import Label from './components/Label';
import ProblemContainer from './components/ProblemContainer';

const Option = ({
  index, setAnswers, item, showAnswer, userSelections, answers, onChange,
}) => (
  <Label
    setAnswers={setAnswers}
    showAnswer
    className={showAnswer ? (answers[index] ? 'right' : 'wrong') : ''}
  >
    <PaddingDiv top={setAnswers ? 10 : 20} bottom={20}>
      <FlexContainer>
        <CheckboxContainter>
          <input
            type="checkbox"
            value={index}
            defaultChecked={userSelections[index]}
            onClick={onChange}
          />
          <span />
        </CheckboxContainter>
        <MultiChoiceContent>{item.label}</MultiChoiceContent>
        <PaddingDiv right={15} height={20}>
          {showAnswer && answers[index] && <i className="fa fa-check" />}
          {showAnswer && !answers[index] && <i className="fa fa-times" />}
        </PaddingDiv>
      </FlexContainer>
    </PaddingDiv>
  </Label>
);

const Options = ({
  options, showAnswer, setAnswers, userSelections, answers, onChange,
}) => (
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
        onChange={onChange}
      />
    ))}
  </div>
);

class MultipleChoiceDisplay extends QuestionDisplay {
  render() {
    let { options, question } = this.props;
    const { preview } = this.props;

    if (preview) {
      const response = this.getResponse();
      // eslint-disable-next-line
      options = response.options;
      // eslint-disable-next-line
      question = response.question;
    }
    const {
      setAnswers, showAnswer, userSelections = [], answers = [],
    } = this.props;
    return (
      <div>
        {!setAnswers && <ProblemContainer dangerouslySetInnerHTML={{ __html: question }} />}
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

Options.propTypes = {
  options: PropTypes.array.isRequired,
  setAnswers: PropTypes.bool.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  userSelections: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

Option.propTypes = {
  index: PropTypes.number.isRequired,
  setAnswers: PropTypes.bool.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  userSelections: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
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

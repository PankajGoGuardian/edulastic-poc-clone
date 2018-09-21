import PropTypes from 'prop-types';
import React from 'react';
import { withTheme } from 'styled-components';

import FlexContainer from '../../common/FlexContainer';
import CheckboxContainter from './CheckboxContainer';
import PaddingDiv from '../../common/PaddingDiv';
import MultiChoiceContent from './MultiChoiceContent';
import ProblemContainer from './ProblemContainer';
import Label from './Label';

const Option = ({
  index, setAnswers, item, showAnswer, userSelections, answers, onChange,
}) => (
  <Label
    setAnswers={setAnswers}
    showAnswer
    // eslint-disable-next-line
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

Option.propTypes = {
  index: PropTypes.number.isRequired,
  setAnswers: PropTypes.func.isRequired,
  item: PropTypes.any.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  userSelections: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

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

Options.propTypes = {
  options: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  setAnswers: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  userSelections: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
};

const MultiChoice = (props) => {
  const {
    options,
    question,
    setAnswers,
    showAnswer,
    userSelections = [],
    answers = [],
    onChange,
  } = props;
  return (
    <div>
      {!setAnswers && <ProblemContainer dangerouslySetInnerHTML={{ __html: question }} />}
      <Options
        options={options}
        setAnswers={setAnswers}
        showAnswer={showAnswer}
        userSelections={userSelections}
        answers={answers}
        onChange={onChange}
      />
    </div>
  );
};

MultiChoice.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  answers: PropTypes.array.isRequired,
  setAnswers: PropTypes.bool.isRequired,
  userSelections: PropTypes.array.isRequired,
};

export default withTheme(MultiChoice);

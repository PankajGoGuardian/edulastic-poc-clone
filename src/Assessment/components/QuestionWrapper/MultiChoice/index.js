import PropTypes from 'prop-types';
import React from 'react';
import { withTheme } from 'styled-components';

import FlexContainer from '../../common/FlexContainer';
import CheckboxContainter from './CheckboxContainer';
import PaddingDiv from '../../common/PaddingDiv';
import MultiChoiceContent from './MultiChoiceContent';
import ProblemContainer from './ProblemContainer';
import Label from './Label';

const Option = (props) => {
  const { index, setAnswers, item, showAnswer, userSelections, answers } = props;
  return (
    <Label setAnswers={setAnswers} showAnswer className={ showAnswer ? answers[index] ? 'right' : 'wrong' : ''} >
      <PaddingDiv top={setAnswers ? 10 : 20} bottom={20} >
        <FlexContainer>
          <CheckboxContainter>
            <input type="checkbox" value={index} defaultChecked={userSelections[index]} onClick={props.onChange}/>
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
        <Option key={index} index={index} setAnswers={setAnswers} item={option} showAnswer={showAnswer} userSelections={userSelections} answers={answers} onChange={props.onChange} />
      ))}
    </div>
  );
}

const MultiChoice = (props) => {
  const { options, question, setAnswers, showAnswer, userSelections = [], answers = [] } = props;
  return (
    <div>
      { !setAnswers && 
        <ProblemContainer dangerouslySetInnerHTML={{__html: question}} />
      }
      <Options options={options} setAnswers={setAnswers} showAnswer={showAnswer} userSelections={userSelections} answers={answers} onChange={props.onChange}/>
    </div>
  );
};

MultiChoice.propTypes = {
  skin: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array,
  question: PropTypes.string,
  showAnswer: PropTypes.bool,
  answers: PropTypes.array,
  setAnswers: PropTypes.bool,
  userSelections: PropTypes.array,
}

export default withTheme(MultiChoice);

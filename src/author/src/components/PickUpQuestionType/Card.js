import React from 'react';
import PropTypes from 'prop-types';
import { IconPlus } from '@edulastic/icons';

import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';
import { Content, Header, RoundDiv } from './components';

const Card = ({ title, type, onSelectQuestionType, userSelections, question, options }) => {
  const data = {
    smallSize: true,
    stimulus: question,
    list: options,
    userSelections,
    type,
  };

  return (
    <React.Fragment>
      <RoundDiv borderRadius={10}>
        <Header borderRadius={10}>{title}</Header>
        <Content borderRadius={10} onClick={() => onSelectQuestionType(type, data)}>
          <div className="add-icon">
            <IconPlus color="#fff" width={50} height={50} />
          </div>
          <QuestionWrapper type={type} view="preview" isNew data={data} />
        </Content>
      </RoundDiv>
    </React.Fragment>
  );
};

Card.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  userSelections: PropTypes.array,
  options: PropTypes.array,
  question: PropTypes.string,
  onSelectQuestionType: PropTypes.func.isRequired,
};

Card.defaultProps = {
  userSelections: [],
  question: '',
  options: [],
};

export default Card;

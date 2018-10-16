import React from 'react';
import PropTypes from 'prop-types';
import { IconPlus } from '@edulastic/icons';

import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';
import { Content, Header, RoundDiv } from './components';

const Card = ({ title, onSelectQuestionType, data }) => {
  const smallData = {
    ...data,
    smallSize: true,
  };

  return (
    <React.Fragment>
      <RoundDiv borderRadius={10}>
        <Header borderRadius={10}>{title}</Header>
        <Content borderRadius={10} onClick={() => onSelectQuestionType(smallData)}>
          <div className="add-icon">
            <IconPlus color="#fff" width={50} height={50} />
          </div>
          <QuestionWrapper type={smallData.type} view="preview" data={smallData} />
        </Content>
      </RoundDiv>
    </React.Fragment>
  );
};

Card.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  onSelectQuestionType: PropTypes.func.isRequired,
};

export default Card;

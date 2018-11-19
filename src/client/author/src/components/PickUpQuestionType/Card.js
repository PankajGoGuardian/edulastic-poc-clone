import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { IconPlus } from '@edulastic/icons';
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';

import { white } from '@edulastic/colors';
import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';
import { Content, Header, RoundDiv } from './components';
import { setUserAnswerAction } from '../../../../assessment/src/actions/answers';

const Card = ({ title, onSelectQuestionType, data, setUserAnswer }) => {
  const smallData = {
    ...data,
    smallSize: true,
  };

  const questionId = uuidv4();

  useEffect(
    () => {
      setUserAnswer(questionId, data.validation.valid_response.value);
    },
    [questionId],
  );

  return (
    <Fragment>
      <RoundDiv borderRadius={10}>
        <Header borderRadius={10}>{title}</Header>
        <Content borderRadius={10} onClick={() => onSelectQuestionType(smallData)}>
          <div className="hover-block">
            <IconPlus color={white} width={70} height={70} />
          </div>
          <div className="add-icon">
            <IconPlus color="#fff" width={50} height={50} />
          </div>
          <QuestionWrapper
            testItem
            type={smallData.type}
            smallSize
            view="preview"
            questionId={questionId}
            data={smallData}
          />
        </Content>
      </RoundDiv>
    </Fragment>
  );
};

Card.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  onSelectQuestionType: PropTypes.func.isRequired,
  setUserAnswer: PropTypes.func.isRequired,
};

export default connect(
  null,
  { setUserAnswer: setUserAnswerAction },
)(Card);

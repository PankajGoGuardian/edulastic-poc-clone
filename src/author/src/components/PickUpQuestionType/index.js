import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { PaddingDiv } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import { Container } from '../common';
import QuestionTypes from './questionTypes';
import { getItemSelector } from '../../selectors/items';
import Header from './Header';
import { createQuestionAction } from '../../actions/questions';

const makeQuestion = (questionType, data) => {
  let question = {
    regionId: '1',
    widgetType: 'response',
  };

  switch (questionType) {
    case 'orderList':
      question = {
        ...question,
        data: {
          stimulus: data.stimulus,
          type: questionType,
          options: data.list.map((label, i) => ({ value: i, label })),
        },
      };
      break;
    case 'multipleChoice':
      question = {
        ...question,
        data: {
          stimulus: data.stimulus,
          type: questionType,
          options: data.list.map((label, i) => ({ value: i, label })),
        },
      };
      break;
    default:
  }

  return question;
};

class PickUpQuestionType extends Component {
  selectQuestionType = (questionType, data) => {
    const { createQuestion } = this.props;
    createQuestion(makeQuestion(questionType, data));
  };

  render() {
    const { t, history } = this.props;

    return (
      <Container>
        <Header
          title={t('component.pickupcomponent.headertitle')}
          link={{
            url: history.location.state.backUrl,
            text: history.location.state.backText,
          }}
        />
        <PaddingDiv top={30}>
          <QuestionTypes onSelectQuestionType={this.selectQuestionType} />
        </PaddingDiv>
      </Container>
    );
  }
}

const enhance = compose(
  withNamespaces('author'),
  connect(
    state => ({
      item: getItemSelector(state),
    }),
    {
      createQuestion: createQuestionAction,
    },
  ),
);

PickUpQuestionType.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  createQuestion: PropTypes.func.isRequired,
};

export default enhance(PickUpQuestionType);

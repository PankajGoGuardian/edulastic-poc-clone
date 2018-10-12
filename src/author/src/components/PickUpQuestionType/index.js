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
import { setQuestionAction } from '../../actions/question';

const makeQuestion = (questionType, data) => {
  let question = {
    regionId: '1',
    widgetType: 'question',
  };

  switch (questionType) {
    case 'orderList':
      question = {
        ...question,
        data: {
          stimulus: data.stimulus,
          type: questionType,
          list: data.list,
          validation: {
            scoring_type: 'exactMatch',
            valid_response: {
              score: 1,
              value: [0, 1, 2],
            },
            alt_responses: [],
          },
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
    const { setQuestion, history, match, t } = this.props;
    const question = makeQuestion(questionType, data);

    setQuestion(question.data);

    history.push({
      pathname: '/author/questions/create',
      state: {
        ...history.location.state,
        backUrl: match.url,
        backText: t('component.pickupcomponent.headertitle'),
      },
    });
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
      setQuestion: setQuestionAction,
    },
  ),
);

PickUpQuestionType.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  setQuestion: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default enhance(PickUpQuestionType);

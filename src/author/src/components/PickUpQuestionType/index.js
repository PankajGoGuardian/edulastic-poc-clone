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

const makeQuestion = data => ({
  regionId: '1',
  widgetType: 'question',
  data,
});

class PickUpQuestionType extends Component {
  selectQuestionType = (data) => {
    const { setQuestion, history, match, t } = this.props;
    const question = makeQuestion(data);

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

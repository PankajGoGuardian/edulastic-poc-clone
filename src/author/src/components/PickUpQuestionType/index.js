import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { updateItemByIdAction } from '../../actions/items';
import { Container, PaddingDiv } from '../common';
import QuestionTypes from './questionTypes';
import { getItemSelector } from '../../selectors/items';
import Header from './Header';
import { translate } from '../../utils/localization';

class PickUpQuestionType extends Component {
  selectQuestionType = (questionType) => {
    const { item, updateItemById, history } = this.props;
    updateItemById({ ...item, id: item._id, type: questionType, reference: item.id });
    localStorage.setItem('PickUpQuestionType', true);
    history.push(`/author/items/${item._id}`);
  }

  render() {
    return (
      <Container>
        <Header
          title={translate('component.pickupcomponent.headertitle')}
          link={{ url: '/author/items', text: translate('component.pickupcomponent.backToAddNew') }}
        />
        <PaddingDiv top={30}>
          <QuestionTypes onSelectQuestionType={this.selectQuestionType} />
        </PaddingDiv>
      </Container>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      item: getItemSelector(state),
    }),
    {
      updateItemById: updateItemByIdAction,
    },
  ),
);

PickUpQuestionType.propTypes = {
  item: PropTypes.object.isRequired,
  updateItemById: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default enhance(PickUpQuestionType);

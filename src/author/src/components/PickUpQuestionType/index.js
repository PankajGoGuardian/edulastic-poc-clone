import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { PaddingDiv } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import { updateItemByIdAction } from '../../actions/items';
import { Container } from '../common';
import QuestionTypes from './questionTypes';
import { getItemSelector } from '../../selectors/items';
import Header from './Header';

class PickUpQuestionType extends Component {
  selectQuestionType = (questionType) => {
    const { item, updateItemById, history, t } = this.props;
    updateItemById({ ...item, id: item._id, type: questionType, reference: item.id });
    history.push({
      pathname: `/author/items/${item._id}`,
      state: {
        backText: t('component.backToItemList'),
        backUrl: '/author/items',
        itemDetail: false,
      },
    });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        <Header
          title={t('component.pickupcomponent.headertitle')}
          link={{
            url: '/author/add-item',
            text: t('component.pickupcomponent.backToAddNew'),
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
      updateItemById: updateItemByIdAction,
    },
  ),
);

PickUpQuestionType.propTypes = {
  item: PropTypes.object,
  updateItemById: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

PickUpQuestionType.defaultProps = {
  item: {},
};

export default enhance(PickUpQuestionType);

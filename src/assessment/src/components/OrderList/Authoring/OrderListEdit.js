import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';

import OrderListItem from './OrderListItem';
import { Button } from '../../common';

class OrderListEdit extends Component {
  render() {
    const { questions, onQuestionsChange, onDeleteQuestion, onAddQuestion, t } = this.props;

    return (
      <div>
        {questions.map((q, i) => (
          <OrderListItem
            key={i}
            index={i}
            onQuestionsChange={value => onQuestionsChange(value, i)}
            onDeleteQuestion={() => onDeleteQuestion(i)}
          >
            {q}
          </OrderListItem>
        ))}
        <Button
          onClick={onAddQuestion}
          variant="extendedFab"
          outlined
          type="button"
          color="primary"
        >
          {t('component.orderlist.orderlistedit.addnewchoicebtn')}
        </Button>
      </div>
    );
  }
}

OrderListEdit.propTypes = {
  questions: PropTypes.array.isRequired,
  onQuestionsChange: PropTypes.func.isRequired,
  onDeleteQuestion: PropTypes.func.isRequired,
  onAddQuestion: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const enhance = compose(
  withNamespaces('assessment'),
  SortableContainer,
);

export default enhance(OrderListEdit);

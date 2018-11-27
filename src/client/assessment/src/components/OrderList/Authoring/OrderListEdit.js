import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';

import { Button, withWindowSizes } from '@edulastic/common';
import OrderListItem from './OrderListItem';

class OrderListEdit extends Component {
  render() {
    const {
      questions,
      onQuestionsChange,
      onDeleteQuestion,
      onAddQuestion,
      t,
      style,
      windowWidth,
    } = this.props;

    console.log(questions);

    return (
      <div style={style}>
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
          style={{ minWidth: windowWidth <= 480 ? '100%' : 130 }}
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
  style: PropTypes.object,
  windowWidth: PropTypes.number.isRequired,
};

OrderListEdit.defaultProps = {
  style: {},
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('assessment'),
  SortableContainer,
);

export default enhance(OrderListEdit);

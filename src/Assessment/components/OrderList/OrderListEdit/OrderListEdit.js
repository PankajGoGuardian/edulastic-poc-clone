import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';

import OrderListItem from './OrderListItem';
import Button from '../../common/Button';
import { translate } from '../../../utilities/localization';

class OrderListEdit extends Component {
  render() {
    const {
      questions, onQuestionsChange, onDeleteQuestion, onAddQuestion,
    } = this.props;

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
          {translate('component.orderlist.orderlistedit.addnewchoicebtn')}
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
};

export default SortableContainer(OrderListEdit);

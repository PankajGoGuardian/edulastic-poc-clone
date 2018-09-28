import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import { compose } from 'redux';

import OrderListPreviewItem from './OrderListPreviewItem';

class OrderListPreview extends Component {
  render() {
    const { questions } = this.props;

    return (
      <div>
        {questions.map((q, i) => (
          <OrderListPreviewItem key={i} index={i}>
            {q}
          </OrderListPreviewItem>
        ))}
      </div>
    );
  }
}

OrderListPreview.propTypes = {
  questions: PropTypes.array.isRequired,
};

const enhance = compose(SortableContainer);

export default enhance(OrderListPreview);

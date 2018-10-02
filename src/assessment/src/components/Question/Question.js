import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';

import OrderList from '../../../../author/src/components/OrderList';
import MultipleChoice from '../../../../author/src/components/MultipleChoice';

export default class Question extends Component {
  render() {
    const { type, view, isNew } = this.props;

    return (
      <Paper>
        {type === 'orderList' && <OrderList view={view} />}
        {type === 'mcq' && <MultipleChoice view={view} isNew={isNew} />}
      </Paper>
    );
  }
}

Question.propTypes = {
  type: PropTypes.oneOf(['orderList', 'mcq']),
  view: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
};

Question.defaultProps = {
  type: null,
};

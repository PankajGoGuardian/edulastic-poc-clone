import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';

import { OrderList } from '../OrderList';
import { MultipleChoice } from '../MultipleChoice';

export default class QuestionWrapper extends Component {
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

QuestionWrapper.propTypes = {
  type: PropTypes.oneOf(['orderList', 'mcq']),
  view: PropTypes.string.isRequired,
  isNew: PropTypes.bool,
};

QuestionWrapper.defaultProps = {
  isNew: false,
  type: null,
};

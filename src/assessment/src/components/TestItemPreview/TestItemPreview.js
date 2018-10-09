import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import { mainBgColor } from '@edulastic/colors';

import TestItemCol from './TestItemCol';

export default class TestItemPreview extends Component {
  static propTypes = {
    cols: PropTypes.array.isRequired,
  };

  render() {
    const { cols } = this.props;

    const colStyle = {
      borderRight: `3px solid ${mainBgColor}`,
    };

    return (
      <Paper style={{ padding: 0, display: 'flex' }}>
        {cols &&
          !!cols.length &&
          cols.map((col, i) => (
            <TestItemCol key={i} col={col} style={i !== cols.length - 1 ? colStyle : {}} />
          ))}
      </Paper>
    );
  }
}

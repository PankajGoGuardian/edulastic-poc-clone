import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import { mainBgColor } from '@edulastic/colors';

import TestItemCol from './TestItemCol';

export default class TestItemPreview extends Component {
  static propTypes = {
    cols: PropTypes.array.isRequired,
    verticalDivider: PropTypes.bool,
    scrolling: PropTypes.bool,
    previewTab: PropTypes.string.isRequired,
  };

  static defaultProps = {
    verticalDivider: false,
    scrolling: false,
  };

  getStyle = (first) => {
    const { verticalDivider, scrolling } = this.props;

    const style = {};

    if (first && verticalDivider) {
      style.borderRight = `3px solid ${mainBgColor}`;
    }

    if (scrolling) {
      style.height = 'calc(100vh - 200px)';
      style.overflowY = 'auto';
    }

    return style;
  };

  render() {
    const { cols, previewTab } = this.props;
    return (
      <Paper style={{ padding: 0, display: 'flex' }}>
        {cols &&
          !!cols.length &&
          cols.map((col, i) => (
            <TestItemCol
              key={i}
              col={col}
              view="preview"
              previewTab={previewTab}
              style={this.getStyle(i !== cols.length - 1)}
            />
          ))}
      </Paper>
    );
  }
}

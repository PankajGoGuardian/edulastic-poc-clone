import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Paper, withWindowSizes } from '@edulastic/common';
import { mainBgColor } from '@edulastic/colors';
import styled from 'styled-components';

import TestItemCol from './TestItemCol';
import { SMALL_DESKTOP_WIDTH } from '../../constants/others';

class TestItemPreview extends Component {
  static propTypes = {
    cols: PropTypes.array.isRequired,
    verticalDivider: PropTypes.bool,
    scrolling: PropTypes.bool,
    previewTab: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    verticalDivider: false,
    scrolling: false,
    style: { padding: 0, display: 'flex' }
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
    const { cols, previewTab, style, windowWidth } = this.props;
    return (
      <Container width={windowWidth} style={style}>
        {cols &&
          cols.length &&
          cols.map((col, i) => (
            <TestItemCol
              key={i}
              col={col}
              view="preview"
              previewTab={previewTab}
              style={this.getStyle(i !== cols.length - 1)}
              windowWidth={windowWidth}
            />
          ))}
      </Container>
    );
  }
}

const enhance = compose(withWindowSizes);

export default enhance(TestItemPreview);

const Container = styled(Paper)`
  display: ${props => (props.width > SMALL_DESKTOP_WIDTH ? 'flex' : 'block !important')};
`;

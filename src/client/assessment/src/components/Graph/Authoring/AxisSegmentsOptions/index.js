import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import {
  MoreOptions, MoreOptionsHeading
} from '../../common/styled_components';
import { Toggler } from '../../../common/Options/styles';
import AxisSegmentsMoreOptions from './AxisSegmentsMoreOptions';

class AxisSegmentsOptions extends Component {
  state = {
    isMoreOptionsOpen: false
  }

  updateClickOnMoreOptions = () => this.setState({ isMoreOptionsOpen: !this.state.isMoreOptionsOpen })

  getFontSizeList = () => (
    [
      {
        id: 'small',
        label: 'Small',
        value: 10,
        selected: false
      },
      {
        id: 'normal',
        label: 'Normal',
        value: 12,
        selected: true
      },
      {
        id: 'large',
        label: 'Large',
        value: 16,
        selected: false
      },
      {
        id: 'extra_large',
        label: 'Extra large',
        value: 20,
        selected: false
      },
      {
        id: 'huge',
        label: 'Huge',
        value: 24,
        selected: false
      }
    ]
  );

  getOrientationList = () => (
    [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' }
    ]
  );

  getRenderingBaseList = () => (
    [
      { value: '', label: '' },
      { value: 'lineMinValue', label: 'Line minimum value' },
      { value: 'zero', label: 'Zero' }
    ]
  );

  render() {
    const { t, setCanvas, setOptions, setNumberline } = this.props;
    const { canvas, ui_style, numberlineAxis } = this.props.graphData;
    return (
      <Fragment>
        <MoreOptions>
          <MoreOptionsHeading
            onClick={this.updateClickOnMoreOptions}
            isOpen={this.state.isMoreOptionsOpen}
          >
            <span>{t('component.graphing.optionstitle')}</span>
            <Toggler isOpen={this.state.isMoreOptionsOpen} />
          </MoreOptionsHeading>
          {
            this.state.isMoreOptionsOpen && (
              <AxisSegmentsMoreOptions
                setNumberline={setNumberline}
                setCanvas={setCanvas}
                setOptions={setOptions}
                numberlineAxis={numberlineAxis}
                options={ui_style}
                canvasConfig={canvas}
                orientationList={this.getOrientationList()}
                fontSizeList={this.getFontSizeList()}
                renderingBaseList={this.getRenderingBaseList()}
              />
            )}
        </MoreOptions>
      </Fragment>
    );
  }
}

AxisSegmentsOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onClickMoreOptions: PropTypes.func.isRequired,
  isMoreOptionsOpen: PropTypes.bool.isRequired,
  orientationList: PropTypes.array.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  renderingBaseList: PropTypes.array.isRequired
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(AxisSegmentsOptions);

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import {
  MoreOptions, MoreOptionsHeading
} from '../../common/styled_components';
import { Toggler } from '../../../../styled/WidgetOptions/Toggler';
import AxisSegmentsMoreOptions from './AxisSegmentsMoreOptions';
import { RENDERING_BASE } from '../../Builder/config/constants';

class AxisSegmentsOptions extends Component {
  state = {
    isMoreOptionsOpen: false
  };

  updateClickOnMoreOptions = () => {
    const { isMoreOptionsOpen } = this.state;
    this.setState({ isMoreOptionsOpen: !isMoreOptionsOpen });
  };

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
      {
        id: RENDERING_BASE.LINE_MINIMUM_VALUE,
        value: 'Line minimum value',
        selected: true
      },
      {
        id: RENDERING_BASE.ZERO_BASED,
        value: 'Zero',
        selected: false
      }

    ]
  );

  render() {
    const { t, setCanvas, setOptions, setNumberline, graphData } = this.props;
    const { canvas, ui_style, numberlineAxis } = graphData;
    const { isMoreOptionsOpen } = this.state;
    return (
      <Fragment>
        <MoreOptions>
          <MoreOptionsHeading
            onClick={this.updateClickOnMoreOptions}
            isOpen={isMoreOptionsOpen}
          >
            <span>{t('component.graphing.optionstitle')}</span>
            <Toggler isOpen={isMoreOptionsOpen} />
          </MoreOptionsHeading>
          {
            isMoreOptionsOpen && (
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
  setCanvas: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setOptions: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(AxisSegmentsOptions);

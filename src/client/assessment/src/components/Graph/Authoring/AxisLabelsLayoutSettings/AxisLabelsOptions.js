import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import {
  MoreOptions, MoreOptionsHeading
} from '../../common/styled_components';
import { Toggler } from '../../../common/Options/styles';
import AxisLabelsMoreOptions from './AxisLabelsMoreOptions';
import { RENDERING_BASE } from '../../Builder/config/constants';

class AxisLabelsOptions extends Component {
  state = {
    isMoreOptionsOpen: false,
    fontSizeList: [
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
    ],
    fractionsFormatList: [
      {
        id: 'not-normalized-fractions',
        value: 'Not normalized and mixed fractions',
        selected: true
      },
      {
        id: 'normalized-fractions',
        value: 'Normalized and mixed fractions',
        selected: false
      },
      {
        id: 'improper-fractions',
        value: 'Improper fractions',
        selected: false
      }
    ],
    renderingBaseList: [
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
  };

  updateClickOnMoreOptions = () => {
    const { isMoreOptionsOpen } = this.state;
    this.setState({
      isMoreOptionsOpen: !isMoreOptionsOpen
    });
  };

  render() {
    const {
      t,
      graphData,
      setOptions,
      setNumberline,
      setCanvas
    } = this.props;

    const {
      isMoreOptionsOpen,
      fontSizeList,
      fractionsFormatList,
      renderingBaseList
    } = this.state;

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
            <AxisLabelsMoreOptions
              t={t}
              graphData={graphData}
              setOptions={setOptions}
              setNumberline={setNumberline}
              setCanvas={setCanvas}
              fontSizeList={fontSizeList}
              fractionsFormatList={fractionsFormatList}
              renderingBaseList={renderingBaseList}
            />
            )}
        </MoreOptions>
      </Fragment>
    );
  }
}

AxisLabelsOptions.propTypes = {
  t: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setOptions: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(AxisLabelsOptions);

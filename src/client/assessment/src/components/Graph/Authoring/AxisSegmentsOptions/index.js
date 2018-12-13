import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import {
  MoreOptions, MoreOptionsHeading,
} from '../../common/styled_components';
import AxisSegmentsMoreOptions from './AxisSegmentsMoreOptions';

class AxisSegmentsOptions extends Component {
  updateClickOnMoreOptions = () => {
    const { onClickMoreOptions, isMoreOptionsOpen } = this.props;

    onClickMoreOptions(!isMoreOptionsOpen);
  };

  render() {
    const {
      isMoreOptionsOpen,
      t,
      orientationList,
      fontSizeList,
      renderingBaseList,
    } = this.props;
    return (
      <Fragment>
        <MoreOptions>
          <MoreOptionsHeading
            onClick={this.updateClickOnMoreOptions}
            isOpen={isMoreOptionsOpen}
          >
            {t('component.graphing.optionstitle')}
          </MoreOptionsHeading>
          {
            isMoreOptionsOpen && (
              <AxisSegmentsMoreOptions
                orientationList={orientationList}
                fontSizeList={fontSizeList}
                renderingBaseList={renderingBaseList}
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
  renderingBaseList: PropTypes.array.isRequired,
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(AxisSegmentsOptions);

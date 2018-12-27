import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import {
  MoreOptions, MoreOptionsHeading
} from '../../../common/styled_components';
import { Toggler } from '../../../../common/Options/styles';
import QuadrantsMoreOptions from './QuadrantsMoreOptions';

class GraphQuadrantsOptions extends Component {
  state = {
    isMoreOptionsOpen: false
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
      fontSizeList,
      stemNumerationList,
      options,
      canvasConfig,
      setOptions,
      bgImgOptions,
      setBgImg,
      backgroundShapes,
      setBgShapes
    } = this.props;
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
            <QuadrantsMoreOptions
              stemNumerationList={stemNumerationList}
              fontSizeList={fontSizeList}
              options={options}
              canvasConfig={canvasConfig}
              setOptions={setOptions}
              bgImgOptions={bgImgOptions}
              setBgImg={setBgImg}
              backgroundShapes={backgroundShapes}
              setBgShapes={setBgShapes}
            />
            )}
        </MoreOptions>
      </Fragment>
    );
  }
}

GraphQuadrantsOptions.propTypes = {
  t: PropTypes.func.isRequired,
  stemNumerationList: PropTypes.array.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  setOptions: PropTypes.func.isRequired,
  bgImgOptions: PropTypes.object.isRequired,
  setBgImg: PropTypes.func.isRequired,
  canvasConfig: PropTypes.object.isRequired,
  backgroundShapes: PropTypes.array,
  setBgShapes: PropTypes.func
};

GraphQuadrantsOptions.defaultProps = {
  backgroundShapes: [],
  setBgShapes: () => {}
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(GraphQuadrantsOptions);

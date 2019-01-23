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
      graphData,
      fontSizeList,
      stemNumerationList,
      setOptions,
      setBgImg,
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
              graphData={graphData}
              stemNumerationList={stemNumerationList}
              fontSizeList={fontSizeList}
              // options={options}
              // canvasConfig={canvasConfig}
              setOptions={setOptions}
              // bgImgOptions={bgImgOptions}
              setBgImg={setBgImg}
              // backgroundShapes={backgroundShapes}
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
  graphData: PropTypes.object.isRequired,
  stemNumerationList: PropTypes.array.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  setOptions: PropTypes.func.isRequired,
  setBgImg: PropTypes.func.isRequired,
  setBgShapes: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(GraphQuadrantsOptions);

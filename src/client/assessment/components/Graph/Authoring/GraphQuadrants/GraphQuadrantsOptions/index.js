import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import {
  MoreOptionsHeading
} from '../../../common/styled_components';
import { Toggler } from '../../../../../styled/WidgetOptions/Toggler';
import QuadrantsMoreOptions from './QuadrantsMoreOptions';
import { ScoreSettings, ControlsSettings, AnnotationSettings } from '../../';

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
      setBgShapes,
      setValidation,
      setControls,
      setAnnotation
    } = this.props;
    const { isMoreOptionsOpen } = this.state;

    return (
      <Fragment>
        <MoreOptionsHeading
          onClick={this.updateClickOnMoreOptions}
          isOpen={isMoreOptionsOpen}
        >
          <span>{t('component.graphing.optionstitle')}</span>
          <Toggler isOpen={isMoreOptionsOpen} />
        </MoreOptionsHeading>
        {
            isMoreOptionsOpen && (
            <Fragment>
              <QuadrantsMoreOptions
                graphData={graphData}
                stemNumerationList={stemNumerationList}
                fontSizeList={fontSizeList}
                setOptions={setOptions}
                setBgImg={setBgImg}
                setBgShapes={setBgShapes}
              />
              <ScoreSettings 
                setValidation={setValidation} 
                graphData={graphData} 
              />
              <ControlsSettings
                onChange={setControls} 
                controlbar={graphData.controlbar} 
              />
              <AnnotationSettings
                annotation={graphData.annotation}
                setAnnotation={setAnnotation}
              />
            </Fragment>            
          )}
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
  setBgShapes: PropTypes.func.isRequired,
  setAnnotation: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(GraphQuadrantsOptions);

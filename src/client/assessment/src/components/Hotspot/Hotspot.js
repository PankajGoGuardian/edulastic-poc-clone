import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HotspotPreview from './HotspotPreview';
import HotspotEdit from './HotspotEdit';
import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions';
import { setQuestionDataAction } from '../../../../author/src/actions/question';

const Hotspot = (props) => {
  const { view } = props;
  return (
    <Fragment>
      {view === PREVIEW && <HotspotPreview {...props} />}
      {view === EDIT && <HotspotEdit {...props} />}
    </Fragment>
  );
};

Hotspot.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any
};

Hotspot.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: ''
};

export default connect(
  null,
  { setQuestionData: setQuestionDataAction }
)(Hotspot);

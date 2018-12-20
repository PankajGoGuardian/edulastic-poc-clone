import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ShadingPreview from './ShadingPreview';
import ShadingEdit from './ShadingEdit';
import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions';
import { setQuestionDataAction } from '../../../../author/src/actions/question';

const Shading = (props) => {
  const { view } = props;
  return (
    <Fragment>
      {view === PREVIEW && <ShadingPreview {...props} />}
      {view === EDIT && <ShadingEdit {...props} />}
    </Fragment>
  );
};

Shading.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any
};

Shading.defaultProps = {
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
)(Shading);

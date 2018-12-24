import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HighlightImagePreview from './HighlightImagePreview';
import HighlightImageEdit from './HighlightImageEdit';
import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions';
import { setQuestionDataAction } from '../../../../author/src/actions/question';

const HighlightImage = (props) => {
  const { view } = props;
  return (
    <Fragment>
      {view === PREVIEW && <HighlightImagePreview {...props} />}
      {view === EDIT && <HighlightImageEdit {...props} />}
    </Fragment>
  );
};

HighlightImage.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any
};

HighlightImage.defaultProps = {
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
)(HighlightImage);

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TokenHighlightPreview from './TokenHighlightPreview';
import TokenHighlightEdit from './TokenHighlightEdit';
import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions';
import { setQuestionDataAction } from '../../../../author/src/actions/question';

const TokenHighlight = (props) => {
  const { view } = props;
  return (
    <Fragment>
      {view === PREVIEW && <TokenHighlightPreview {...props} />}
      {view === EDIT && <TokenHighlightEdit {...props} />}
    </Fragment>
  );
};

TokenHighlight.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any
};

TokenHighlight.defaultProps = {
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
)(TokenHighlight);

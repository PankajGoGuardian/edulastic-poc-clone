import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import MatchListPreview from './MatchListPreview';
import MatchListEdit from './MatchListEdit';
import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions';

const MatchList = (props) => {
  const { view } = props;
  return (
    <Fragment>
      {view === PREVIEW && <MatchListPreview {...props} />}
      {view === EDIT && <MatchListEdit {...props} />}
    </Fragment>
  );
};

MatchList.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any
};

MatchList.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: ''
};

export default MatchList;

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import MatchListPreview from './MatchListPreview';
import MatchListEdit from './MatchListEdit';

const MatchList = (props) => {
  const { view } = props;
  return (
    <Fragment>
      {view === 'preview' && <MatchListPreview {...props} />}
      {view === 'edit' && <MatchListEdit {...props} />}
    </Fragment>
  );
};

MatchList.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any
};

MatchList.defaultProps = {
  previewTab: 'clear',
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: ''
};

export default MatchList;

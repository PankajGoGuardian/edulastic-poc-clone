import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import EditClassification from './EditClassification';
import ClassificationPreview from './ClassificationPreview';

const Classification = (props) => {
  const { view } = props;

  return (
    <Fragment>
      {view === 'edit' && <EditClassification {...props} />}
      {view === 'preview' && <ClassificationPreview {...props} />}
    </Fragment>
  );
};

Classification.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any
};

Classification.defaultProps = {
  previewTab: 'clear',
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: ''
};

export default Classification;

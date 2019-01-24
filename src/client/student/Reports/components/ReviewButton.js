import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

//components
import Review from '../../styled/AssignmentCardButton';

// show review button
const ReviewButton = ({ testActivityId, title, t, attempted }) => (
  <Link
    to={{
      pathname: `/home/testActivityReport/$testActivityId`,
      testActivityId: testActivityId,
      title: title
    }}
  >
    {attempted ? (
      <Review>
        <span>{t('common.review')}</span>
      </Review>
    ) : (
      ''
    )}
  </Link>
);

ReviewButton.propTypes = {
  attempted: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  testActivityId: PropTypes.string.isRequired
};

export default ReviewButton;

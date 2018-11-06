import React from 'react';
import PropTypes from 'prop-types';
import { MoveLink } from '@edulastic/common';
import { withRouter } from 'react-router-dom';

const MainInfoCell = ({ data, history }) => {
  const goToItem = () => {
    history.push(`/author/items/${data.id}/item-detail`);
  };
  return (
    <div>
      <MoveLink onClick={goToItem}>{data.title}</MoveLink>
      <div dangerouslySetInnerHTML={{ __html: data.stimulus }} />
    </div>
  );
};

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(MainInfoCell);

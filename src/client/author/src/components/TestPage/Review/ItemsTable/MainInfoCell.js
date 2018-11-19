import React from 'react';
import PropTypes from 'prop-types';
import { MoveLink } from '@edulastic/common';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const MainInfoCell = ({ data, history }) => {
  const goToItem = () => {
    history.push(`/author/items/${data.id}/item-detail`);
  };
  return (
    <div>
      <MoveLink onClick={goToItem}>{data.title}</MoveLink>
      <STIMULUS dangerouslySetInnerHTML={{ __html: data.stimulus }} />
    </div>
  );
};

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(MainInfoCell);

const STIMULUS = styled.div`
  font-size: 13px;
  color: #444444;
  margin-top: 3px;
`;

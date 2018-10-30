import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { blue } from '@edulastic/colors';
import { Link } from 'react-router-dom';

const MainInfoCell = ({ data }) => (
  <div>
    <Title to={`/author/items/${data.id}/item-detail`}>{data.title}</Title>
    <div>{data.stimulus}</div>
  </div>
);

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MainInfoCell;

const Title = styled(Link)`
  color: ${blue};
`;

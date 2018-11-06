import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Main from './ItemList';

const ItemList = ({ flag }) => (
  <Container flag={flag}>
    <Main />
  </Container>
);

export default React.memo(
  connect(({ ui }) => ({
    flag: ui.flag,
  }))(ItemList),
);

ItemList.propTypes = {
  flag: PropTypes.bool.isRequired,
};

const Container = styled.div`
  @media (min-width: 1200px) {
    margin-left: ${props => (props.flag ? '7rem' : '16.5rem')};
  }
`;

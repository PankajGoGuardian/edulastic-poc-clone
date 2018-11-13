import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TabContainer = ({ children }) => <Container>{children}</Container>;

TabContainer.propTypes = {
  children: PropTypes.any.isRequired,
};

export default TabContainer;

const Container = styled.div`
  padding: 25px 0;
`;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { blue, textColor } from '../../../utilities/css';

const Tab = ({ label, onClick, active }) => (
  <Container onClick={onClick} active={active}>
    {label}
  </Container>
);

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool,
};

Tab.defaultProps = {
  onClick: () => {},
  active: false,
};

export default Tab;

const Container = styled.div`
  color: ${({ active }) => (active ? blue : textColor)};
  padding: 10px 25px;
  cursor: pointer;
  border-bottom: 2px solid ${({ active }) => (active ? blue : 'transparent')};
`;

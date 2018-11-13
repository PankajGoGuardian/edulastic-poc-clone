import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { white, textColor } from '@edulastic/colors';

const getMarginLeft = (type) => {
  switch (type) {
    case '30-70':
      return '30%';
    case '70-30':
      return '70%';
    case '50-50':
      return '50%';
    case '40-60':
      return '40%';
    case '60-40':
      return '60%';
    default:
      return 0;
  }
};

const SettingsBarIcon = ({ active, type }) => (
  <Container active={active}>
    <Divider active={active} type={type} />
  </Container>
);

SettingsBarIcon.propTypes = {
  active: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default SettingsBarIcon;

const Container = styled.div`
  border: 1px solid ${({ active }) => (active ? white : textColor)};
  width: 50px;
  height: 50px;
`;

const Divider = styled.div`
  width: 1px;
  background: ${({ active }) => (active ? white : textColor)};
  height: 100%;
  display: ${({ type }) => (type === '100-100' ? 'none' : 'block')};
  margin-left: ${({ type }) => getMarginLeft(type)};
`;

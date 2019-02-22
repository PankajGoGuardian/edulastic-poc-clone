import React from 'react';
import styled from 'styled-components';
import { blue, black } from '@edulastic/colors';
import PropTypes from 'prop-types';

const ThreeDotButton = ({ onClick }) => (
  <Wrapper title="Show more" onClick={onClick}>
    ⋮
  </Wrapper>
);

ThreeDotButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default ThreeDotButton;

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${black};
  font-size: 16px;
  cursor: pointer;
  box-shadow: -10px 0px 10px 1px #eee;

  :hover {
    color: ${blue};
  }
`;

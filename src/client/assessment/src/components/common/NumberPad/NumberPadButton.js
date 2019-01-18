import React from 'react';
import PropTypes from 'prop-types';
import { grey, textColor, lightGrey, white } from '@edulastic/colors';
import styled from 'styled-components';

const NumberPadButton = ({ children, onClick }) => <Item onClick={onClick}>{children}</Item>;

NumberPadButton.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func
};

NumberPadButton.defaultProps = {
  onClick: () => {}
};

export default NumberPadButton;

const Item = styled.div`
  width: 25%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${grey};
  color: ${textColor};
  font-weight: 700;
  background: ${lightGrey};
  cursor: pointer;
  user-select: none;

  :hover {
    background: ${grey};
  }

  :active {
    background: ${white};
  }
`;

import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { blue, white } from '@edulastic/colors';

const buttons = [
  { value: 'summary', text: 'Summary' },
  { value: 'addItems', text: 'Add Items' },
  { value: 'review', text: 'Review' },
  { value: 'settings', text: 'Settings' },
];

function TestPageNav({ onChange, current }) {
  return (
    <List>
      {buttons.map(({ value, text }) => (
        <ListItem key={value} active={current === value} onClick={() => onChange(value)}>
          {text}
        </ListItem>
      ))}
    </List>
  );
}

TestPageNav.propTypes = {
  onChange: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
};

export default memo(TestPageNav);

const List = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 70px;
`;

const ListItem = styled.button`
  border: none;
  border-radius: 10px;
  padding: 10px;
  background: ${props => (props.active ? blue : 'transparent')};
  cursor: pointer;
  margin-right: 30px;
  font-size: 16px;
  color: ${white};

  :hover {
    background: ${blue};
    color: ${white};
  }
`;

import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { blue } from '@edulastic/colors';
import { EduButton } from '@edulastic/common';

function TestPageNav({ onChange, current, buttons }) {
  return (
    <nav>
      {buttons.map(({ value, text, icon }) => (
        <StyledButton
          type="primary"
          size="large"
          key={value}
          active={(current === value).toString()}
          onClick={() => onChange(value)}
        >
          <IconWrapper>{icon}</IconWrapper>
          <div>{text}</div>
        </StyledButton>
      ))}
    </nav>
  );
}

TestPageNav.propTypes = {
  onChange: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  buttons: PropTypes.array.isRequired,
};

export default memo(TestPageNav);

const StyledButton = styled(EduButton)`
  display: inline-flex;
  border: none;
  box-shadow: none;
  align-items: center;
  margin-right: 10px;
  background: ${props => (props.active === 'true' ? blue : 'transparent')};
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 10px;
`;

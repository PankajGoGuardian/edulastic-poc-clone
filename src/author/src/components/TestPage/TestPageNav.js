import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { blue } from '@edulastic/colors';
import { EduButton, FlexContainer } from '@edulastic/common';

function TestPageNav({ onChange, current, buttons }) {
  return (
    <FlexContainer>
      {buttons.map(({ value, text, icon }) => (
        <StyledButton
          type="primary"
          size="large"
          key={value}
          active={(current === value).toString()}
          onClick={() => onChange(value)}
        >
          <FlexContainer>
            {icon}
            <div>{text}</div>
          </FlexContainer>
        </StyledButton>
      ))}
    </FlexContainer>
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

import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { StyledNavLink } from './common';

function TestPageNav({ onChange, current, buttons }) {
  return (
    <Container style={{ height: 60 }}>
      {buttons.map(({ value, text, icon }) => (
        <StyledNavLink
          key={value}
          active={(current === value).toString()}
          onClick={() => onChange(value)}
        >
          <FlexContainer>
            {icon}
            <div>{text}</div>
          </FlexContainer>
        </StyledNavLink>
      ))}
    </Container>
  );
}

TestPageNav.propTypes = {
  onChange: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  buttons: PropTypes.array.isRequired,
};

export default memo(TestPageNav);

const Container = styled.div`
  display: flex;
  align-items: center;
`;

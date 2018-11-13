import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darkBlue, white, green, greenDark } from '@edulastic/colors';
import { Button } from 'antd';

const TestListHeader = ({ onCreate, creating, title }) => (
  <Container>
    <Title>{title}</Title>
    <StyledButton type="primary" size="large" loading={creating} onClick={onCreate} icon="plus">
      Create asssessment
    </StyledButton>
  </Container>
);

TestListHeader.propTypes = {
  onCreate: PropTypes.func.isRequired,
  creating: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default memo(TestListHeader);

const Container = styled.div`
  padding: 30px;
  background: ${darkBlue};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${white};
  font-size: 22px;
  margin: 0;
  padding: 0;
`;

const StyledButton = styled(Button)`
  background: ${green};
  text-transform: uppercase;
  :hover {
    background: ${greenDark};
  }
`;

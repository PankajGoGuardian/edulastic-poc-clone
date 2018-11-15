import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darkBlueSecondary, white, green, greenDark } from '@edulastic/colors';
import { Button } from 'antd';

const TestListHeader = ({ onCreate, creating, title }) => (
  <Container>
    <Title>{title}</Title>
    <StyledButton type="primary" size="large" loading={creating} onClick={onCreate} icon="plus">
      Create Test
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
  height: 62px;
  padding: 0px 40px;
  background: ${darkBlueSecondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${white};
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  background: ${green};
  font-size: 11px;
  font-weight: 600;
  width: 173px;
  height: 40px;
  border-radius: 4px;
  text-transform: uppercase;
  :hover {
    background: ${greenDark};
  }

  i {
    font-size: 16px;
    position: relative;
    left: -20px;
  }
`;

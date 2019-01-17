import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styled from 'styled-components';
import { lightGrey } from '@edulastic/colors';

export default (WrappedComponent) => {
  const hocComponent = ({ points, onChangePoints, ...props }) => (
    <div>
      <Container>
        <Input
          type="number"
          data-cy="points"
          value={points}
          onChange={e => onChangePoints(+e.target.value)}
          style={{ width: 105 }}
          size="large"
        />
        <span style={{ textTransform: 'uppercase', marginLeft: 25 }}>Points</span>
      </Container>
      <WrappedComponent {...props} />
    </div>
  );

  hocComponent.propTypes = {
    points: PropTypes.number.isRequired,
    onChangePoints: PropTypes.func.isRequired
  };

  return hocComponent;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  background: ${lightGrey};
  padding: 10px 15px;
  margin-bottom: 20px;
`;

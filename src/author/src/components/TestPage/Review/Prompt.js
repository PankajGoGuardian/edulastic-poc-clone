import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { white } from '@edulastic/colors';
import { EduButton, FlexContainer } from '@edulastic/common';
import { Input } from 'antd';

const Prompt = ({ style, show, onSuccess }) => {
  const [position, setPosition] = useState(0);

  const handleChange = (e) => {
    setPosition(e.target.value);
  };

  const handleSuccess = () => {
    onSuccess(position);
  };

  return (
    <React.Fragment>
      {show && (
        <Container style={style}>
          <FlexContainer style={{ marginBottom: 10 }}>
            <Input placeholder="Position" type="number" value={position} onChange={handleChange} />
          </FlexContainer>
          <FlexContainer justifyContent="center">
            <EduButton type="primary" size="small" onClick={handleSuccess}>
              Reorder
            </EduButton>
          </FlexContainer>
        </Container>
      )}
    </React.Fragment>
  );
};

Prompt.propTypes = {
  style: PropTypes.object,
  show: PropTypes.bool,
  onSuccess: PropTypes.func.isRequired,
};

Prompt.defaultProps = {
  style: {},
  show: false,
};

export default Prompt;

const Container = styled.div`
  padding: 20px;
  background: ${white};
  min-width: 150px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

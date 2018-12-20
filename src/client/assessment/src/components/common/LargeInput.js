import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FlexContainer } from '@edulastic/common';

const LargeInput = ({ value, onChange, type, label, ...restProps }) => (
  <FlexContainer>
    <StyledInput
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      size="large"
      {...restProps}
    />
    <Label>{label}</Label>
  </FlexContainer>
);

LargeInput.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export default LargeInput;

const StyledInput = styled(Input)`
  text-align: ${({ textAlign }) => textAlign || 'center'};
  width: ${({ width }) => width || 110}px;
  padding-right: 0;
  margin-right: ${({ marginRight }) => marginRight || 0}px;
  font-weight: 400;
`;

const Label = styled(FlexContainer)`
  font-weight: 600;
  font-size: 13px;
`;

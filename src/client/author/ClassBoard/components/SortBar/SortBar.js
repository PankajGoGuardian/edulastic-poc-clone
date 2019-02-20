import React from 'react';
import { Select } from 'antd';
import { FlexContainer } from '@edulastic/common';
import {
  Container,
  StyledSelect
} from './styled'

const SortBar = () => (
  <FlexContainer>
    <Container>
      <StyledSelect defaultValue="">
        <Select.Option value="">Class 1</Select.Option>
      </StyledSelect>
    </Container>
  </FlexContainer>
);

export default SortBar;


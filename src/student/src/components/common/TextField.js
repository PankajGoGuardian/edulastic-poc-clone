import React from 'react';
import styled from 'styled-components';
import { grey } from '../../utils/css';

const TextField = ({ ...restProps }) => <Container type="text" {...restProps} />;

export default TextField;

const Container = styled.input`
  border: 1px solid ${grey};
  border-radius: 10px;
  min-height: 45px;
  width: 100%;
  padding: 0 10px;
`;

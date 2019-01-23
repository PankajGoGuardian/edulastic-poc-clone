import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';

// components
import ManageHeader from './Header';
import ManageContainer from './Container';

const Wrapper = styled(Layout)`
  width: 100%;
`;

const ManageClass = () => (
  <Wrapper>
    <ManageHeader />
    <ManageContainer />
  </Wrapper>
);

export default ManageClass;

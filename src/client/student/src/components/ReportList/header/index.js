import React, { memo } from 'react';
import styled from 'styled-components';

import { darkBlueSecondary, white } from '@edulastic/colors';
import { Affix } from 'antd';

const ReportListHeader = () => (
  <Affix>
    <Container>
      <Title>Reports</Title>
    </Container>
  </Affix>
);

export default memo(ReportListHeader);

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

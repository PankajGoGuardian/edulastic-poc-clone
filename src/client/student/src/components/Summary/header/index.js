import React, { memo } from 'react';
import styled from 'styled-components';
import { Affix, Layout, Row, Col } from 'antd';
import { IconLogout } from '@edulastic/icons';

import { LogoCompact } from '../../../../../assessment/src/themes/common';

const SummaryHeader = () => (
  <Affix>
    <AssignmentsHeader>
      <Row style={{ width: '100%' }}>
        <Col span={24} style={{ display: 'flex' }}>
          <Wrapper>
            <LogoCompact />
          </Wrapper>
          <LogoutIcon />
        </Col>
      </Row>
    </AssignmentsHeader>
  </Affix>
);

export default memo(SummaryHeader);

const AssignmentsHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  background-color: #0288d1;
  height: 62px;
  color: #ffffff;
  padding: 0 40px;

  .ant-col-24 {
    align-items: center;
    line-height: 1.2;
    display: flex;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
`;

const LogoutIcon = styled(IconLogout)`
  fill: #fff;
  width: 24px !important;
  height: 24px !important;
  &:hover {
    fill: #23e7ab;
  }
`;

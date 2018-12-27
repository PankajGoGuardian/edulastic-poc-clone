import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { darkBlueSecondary } from '@edulastic/colors';
import { Affix, Layout, Row, Col } from 'antd';

const HeaderWrapper = ({ children }) => (
  <Affix>
    <AssignmentsHeader>
      <HeaderRow>
        <Col span={24}>
          <Wrapper>{children}</Wrapper>
        </Col>
      </HeaderRow>
    </AssignmentsHeader>
  </Affix>
);

HeaderWrapper.propTypes = {
  children: PropTypes.object.isRequired
};

export default memo(HeaderWrapper);

const AssignmentsHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  background-color: ${darkBlueSecondary};
  height: 62px;
  color: #ffffff;

  .ant-col-24 {
    align-items: center;
    line-height: 1.2;
    display: flex;
  }
`;

const HeaderRow = styled(Row)`
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
`;

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import { darkBlue, white, green } from '@edulastic/colors';
import { FlexContainer, EduButton } from '@edulastic/common';
import { FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import TestPageNav from './TestPageNav';

const buttons = [
  { icon: <FaCode style={{ width: 16, height: 16 }} />, value: 'summary', text: 'Summary' },
  { icon: <FaCode style={{ width: 16, height: 16 }} />, value: 'addItems', text: 'Add Items' },
  { icon: <FaCode style={{ width: 16, height: 16 }} />, value: 'review', text: 'Review' },
  { icon: <FaCode style={{ width: 16, height: 16 }} />, value: 'settings', text: 'Settings' },
  { icon: <FaCode style={{ width: 16, height: 16 }} />, value: 'assign', text: 'Assign' },
  { icon: <FaCode style={{ width: 16, height: 16 }} />, value: 'source', text: 'Source' },
];

const getCurrentText = (current) => {
  const currentItem = buttons.find(btn => btn.value === current);
  if (currentItem) {
    return currentItem.text;
  }

  return '';
};

const TestPageHeader = ({ onChangeNav, current, onSave, title }) => (
  <Container>
    <Row gutter={16}>
      <Col span={6}>
        <Title>{title}</Title>
        <SubTitle>
          <BackLink to="/author/tests">Test List</BackLink> / {getCurrentText(current)}
        </SubTitle>
      </Col>
      <Col span={18}>
        <FlexContainer justifyContent="space-between">
          <TestPageNav onChange={onChangeNav} current={current} buttons={buttons} />
          <EduButton size="large" type="secondary" onClick={onSave}>
            Save changes
          </EduButton>
        </FlexContainer>
      </Col>
    </Row>
  </Container>
);

TestPageHeader.propTypes = {
  onChangeNav: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default memo(TestPageHeader);

const Container = styled.div`
  padding: 25px 45px;
  background-color: ${darkBlue};
`;

const BackLink = styled(Link)`
  color: ${white};
  :hover {
    color: ${green};
  }
`;

const Title = styled.h1`
  font-size: 22px;
  margin: 0;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  color: ${white};
`;

const SubTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${white};
  text-transform: uppercase;
`;

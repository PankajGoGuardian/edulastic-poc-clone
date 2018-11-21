import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Affix } from 'antd';
import styled from 'styled-components';
import { white } from '@edulastic/colors';
import { FlexContainer, EduButton } from '@edulastic/common';
import {
  IconAddItems,
  IconAssign,
  IconReview,
  IconSettings,
  IconSummary,
} from '@edulastic/icons';

import TestPageNav from './TestPageNav';

export const navButtons = [
  { icon: <IconSummary color={white} />, value: 'summary', text: 'Summary' },
  { icon: <IconAddItems color={white} />, value: 'addItems', text: 'Add Items' },
  { icon: <IconReview color={white} width={24} height={24} />, value: 'review', text: 'Review' },
  { icon: <IconSettings color={white} />, value: 'settings', text: 'Settings' },
  { icon: <IconAssign color={white} />, value: 'assign', text: 'Assign' },
];

const TestPageHeader = ({ onChangeNav, current, onSave, title, creating, onShare }) => (
  <Affix>
    <Container>
      <Title>{title}</Title>

      <TestPageNav onChange={onChangeNav} current={current} buttons={navButtons} />

      <FlexContainer justifyContent="space-between">
        <EduButton style={{ width: 120 }} size="large" onClick={onShare}>
          Share
        </EduButton>
        <EduButton style={{ width: 120 }} disabled={creating} size="large" type="secondary" onClick={onSave}>
          {creating ? 'Saving...' : 'Save changes'}
        </EduButton>
      </FlexContainer>
    </Container>
  </Affix>
);

TestPageHeader.propTypes = {
  onChangeNav: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  creating: PropTypes.bool.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default memo(TestPageHeader);

const Container = styled.div`
  padding: 0 45px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0288d1;
`;

const Title = styled.div`
  font-size: 22px;
  margin: 0;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  color: ${white};
`;

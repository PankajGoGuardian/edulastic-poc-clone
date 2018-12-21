import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { white, mainBlueColor } from '@edulastic/colors';
import { FlexContainer, EduButton } from '@edulastic/common';
import {
  IconAddItems,
  IconAssign,
  IconReview,
  IconSettings,
  IconSummary,
  IconShare
} from '@edulastic/icons';

import TestPageNav from './TestPageNav';
import HeaderWrapper from '../../mainContent/headerWrapper';

export const navButtons = [
  { icon: <IconSummary color={white} />, value: 'summary', text: 'Summary' },
  {
    icon: <IconAddItems color={white} />,
    value: 'addItems',
    text: 'Add Items'
  },
  {
    icon: <IconReview color={white} width={24} height={24} />,
    value: 'review',
    text: 'Review'
  },
  { icon: <IconSettings color={white} />, value: 'settings', text: 'Settings' },
  { icon: <IconAssign color={white} />, value: 'assign', text: 'ASSIGN' }
];

const TestPageHeader = ({
  onChangeNav,
  current,
  onSave,
  title,
  creating,
  onShare,
  windowWidth
}) =>
  (windowWidth > 993 ? (
    <HeaderWrapper>
      <Title>{title}</Title>

      <TestPageNav
        onChange={onChangeNav}
        current={current}
        buttons={navButtons}
      />

      <FlexContainer justifyContent="space-between">
        <EduButton style={{ width: 120 }} size="large" onClick={onShare}>
          Share
        </EduButton>
        <EduButton
          style={{ width: 120 }}
          disabled={creating}
          size="large"
          type="secondary"
          onClick={onSave}
        >
          {creating ? 'Saving...' : 'Save changes'}
        </EduButton>
      </FlexContainer>
    </HeaderWrapper>
  ) : (
    <HeaderWrapper>
      <Container style={{ flexDirection: 'column', paddingTop: 10 }}>
        <FlexContainer
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <Title>{title}</Title>
          <FlexContainer justifyContent="space-between">
            <EduButton size="large" onClick={onShare}>
              <ShareIcon />
            </EduButton>
            <EduButton
              style={{ width: 80 }}
              disabled={creating}
              size="large"
              type="secondary"
              onClick={onSave}
            >
              {creating ? 'Saving...' : 'Save'}
            </EduButton>
          </FlexContainer>
        </FlexContainer>
        <TestPageNav
          onChange={onChangeNav}
          current={current}
          buttons={navButtons}
        />
      </Container>
    </HeaderWrapper>
  ));

TestPageHeader.propTypes = {
  onChangeNav: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  creating: PropTypes.bool.isRequired,
  onShare: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired
};

export default memo(TestPageHeader);

const Container = styled(HeaderWrapper)`
  padding: 0 45px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 468px) {
    padding: 0px 20px 0px 45px;
  }
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

const ShareIcon = styled(IconShare)`
  fill: ${mainBlueColor};
`;

import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { darkBlueSecondary, white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';
import { Affix } from 'antd';

const ProfileHeader = ({ t }) => (
  <Affix>
    <Container>
      <Title>{t('common.title.profile')}</Title>
    </Container>
  </Affix>
);

ProfileHeader.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withNamespaces('dashboard')
);

export default enhance(ProfileHeader);

const Container = styled.div`
  height: 89px;
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

import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';
import HeaderWrapper from '../../styled/header/headerWrapper';

const ManageHeader = ({ t }) => (
  <HeaderWrapper>
    <Title>{t('common.manageClassTitle')}</Title>
  </HeaderWrapper>
);

ManageHeader.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withNamespaces('header')
);

export default enhance(ManageHeader);

const Title = styled.h1`
  color: ${props => props.theme.headerTitleTextColor};
  font-size: ${props => props.theme.headerTitleFontSize};
  font-weight: bold;
  margin: 0;
  padding: 0;
  @media (max-width: 768px) {
    padding: 0 40px 44px;
  }
`;

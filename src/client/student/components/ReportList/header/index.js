import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';

import { darkBlueSecondary } from '@edulastic/colors';
import { Affix } from 'antd';

const ReportListHeader = ({ t }) => (
  <Affix>
    <Container>
      <Title>{t('common.reportsTitle')}</Title>
    </Container>
  </Affix>
);

ReportListHeader.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withNamespaces('header')
);

export default enhance(ReportListHeader);

const Container = styled.div`
  height: 62px;
  padding: 0px 40px;
  background: ${darkBlueSecondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.headerTitleTextColor};
  font-size: ${props => props.theme.headerTitleFontSize};
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

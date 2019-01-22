import React from 'react';
import styled from 'styled-components';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import HeaderWrapper from '../../styled/header/headerWrapper';
import QuestionSelect from '../../src/components/ReportList/QuestionSelect';

const ReportListHeader = ({ t }) => (
  <HeaderWrapper>
    <Title>{t('common.skillReportTitle')}</Title>
    <QuestionSelectMobile>
      <QuestionSelect />
    </QuestionSelectMobile>
  </HeaderWrapper>
);

ReportListHeader.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces('header'));

export default enhance(ReportListHeader);

const QuestionSelectMobile = styled(Col)`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    margin-top: 12px;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.headerTitleTextColor};
  font-size: ${props => props.theme.headerTitleFontSize};
  font-weight: bold;
  margin: 0;
  padding: 0;
  @media (max-width: 768px) {
    padding-left: 40px;
  }
`;

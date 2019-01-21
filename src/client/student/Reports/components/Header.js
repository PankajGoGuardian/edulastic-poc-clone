import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ClassSelector from '../../component/ClassSelector';

import HeaderWrapper from '../../styled/header/headerWrapper';

const Header = ({ t }) => (
  <HeaderWrapper>
    <Wrapper>
      <AssignmentTitle>{t('common.reportsTitle')}</AssignmentTitle>
      <ClassSelector t={t} />
    </Wrapper>
  </HeaderWrapper>
);

Header.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('header'),
  connect(({ ui }) => ({ flag: ui.flag }))
);

export default enhance(Header);

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AssignmentTitle = styled.div`
  font-family: Open Sans;
  font-size: ${props => props.theme.headerTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.headerTitleTextColor};
  @media screen and (max-width: 768px) {
    padding-left: 0px;
  }
`;

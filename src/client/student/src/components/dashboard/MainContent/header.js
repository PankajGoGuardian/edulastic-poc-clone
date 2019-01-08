import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Select } from 'antd';
import AssignmentTitle from '../common/assignmentTitle';
import AssignmentSelectClass from '../common/assignmentSelectClass';
import HeaderWrapper from '../../../headerWrapper';

const options = ['FFC1', 'FFC2', 'FFC3', 'FFC4', 'FFC5', 'FFC6'];
const { Option } = Select;

const AssignmentSelect = ({ t }) => (
  <AssignmentSelectClass>
    <ClassLabel>{t('common.classLabel')}</ClassLabel>
    <Select defaultValue="FFC1">
      {options.map((option, i) => (
        <Option key={i} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  </AssignmentSelectClass>
);

const Header = ({ flag, t }) => (
  <HeaderWrapper flag={flag}>
    <Wrapper>
      <AssignmentTitle>{t('common.dashboardTitle')}</AssignmentTitle>
      <AssignmentSelect t={t} />
    </Wrapper>
  </HeaderWrapper>
);

Header.propTypes = {
  flag: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

AssignmentSelect.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('header'),
  connect(
    ({ ui }) => ({ flag: ui.flag })
  )
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

const ClassLabel = styled.span`
  display: flex;
  font-size: ${props => props.theme.headerClassTitleFontSize};
  color: ${props => props.theme.headerClassTitleColor};
  font-weight: 600;
  margin-right: 30px;
  align-items: center;
  letter-spacing: 0.2px;

  @media (max-width: 768px) {
    width: 65px;
    width: auto;
    margin-right: 10px;
  }
`;

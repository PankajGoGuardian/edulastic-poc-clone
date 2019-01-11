import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import PropTypes from 'prop-types';
import {
  IconClockDashboard,
  IconAssignment,
  IconBarChart,
  IconReport,
  IconManage
} from '@edulastic/icons';

const NavLink = styled.ul`
  list-style: none;
  padding: 0rem;
  margin: 3rem 2.5rem 1rem 2.5rem;
  @media (max-width: 425px) {
    margin: 3rem 4rem;
  }
`;
const NavList = styled.li`
  padding-bottom: 3rem;
`;

const TextWrapper = styled.span`
  color: #434b5d;
  font-weight: 600;
  font-size: 0.9rem;
  display: ${props => (props.flag ? 'none' : 'inline-block')};
  @media (max-width: 1024px) {
    display: inline-block;
  }
  @media (max-width: 425px) {
    font-size: 1.1rem;
    margin-left: 2rem;
  }
`;
const LinkNavigation = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const renderIcon = icon => styled(icon)`
  width: 22px !important;
  height: 22px !important;
  fill: rgb(67, 75, 93);
  margin-right: ${props => (props.flag ? '0rem' : '1rem')};
`;

const NavButton = ({ icon, label, flag }) => {
  const Icon = renderIcon(icon);
  return (
    <NavList>
      <LinkNavigation to={`/home/${label}`}>
        <Icon flag={flag} />
        <TextWrapper flag={flag}>{label}</TextWrapper>
      </LinkNavigation>
    </NavList>
  );
};

NavButton.propTypes = {
  icon: PropTypes.any.isRequired,
  label: PropTypes.any.isRequired,
  flag: PropTypes.any.isRequired
};

const Navigation = ({ flag, t }) => (
  <NavLink>
    <NavButton label={t('common.dashboard')} icon={IconClockDashboard} flag={flag} />
    <NavButton label={t('common.assignments')} icon={IconAssignment} flag={flag} />
    <NavButton label={t('common.skillReport')} icon={IconBarChart} flag={flag} />
    <NavButton label={t('common.manageClass')} icon={IconManage} flag={flag} />
    <NavButton label={t('common.report')} icon={IconReport} flag={flag} />
  </NavLink>
);

const enhance = compose(
  React.memo,
  withNamespaces('sidemenu')
);

export default enhance(Navigation);

Navigation.propTypes = {
  flag: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

NavButton.propTypes = {
  label: PropTypes.string.isRequired,
  flag: PropTypes.bool.isRequired
};

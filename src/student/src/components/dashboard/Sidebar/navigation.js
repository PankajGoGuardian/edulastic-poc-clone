import React from 'react';
import { IconManage, IconClockDashboard, IconBarChart, IconAssignment } from '@edulastic/icons';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const NavLink = styled.ul`
  list-style: none;
  padding: 0rem;
  margin: 3rem 2rem;
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
const LinkNavigation = styled.a`
  display: flex;
  align-items: center;
`;

const renderIcon = icon => styled(icon)`
  width: 22px !important;
  height: 22px !important;
  fill: rgb(67, 75, 93);
  margin-right: 1rem;
`;

const NavButton = ({ icon, label, flag }) => {
  const Icon = renderIcon(icon);
  return (
    <NavList>
      <LinkNavigation>
        <Icon />
        <TextWrapper flag={flag}>{label}</TextWrapper>
      </LinkNavigation>
    </NavList>
  );
};

NavButton.propTypes = {
  icon: PropTypes.any.isRequired,
  label: PropTypes.any.isRequired,
  flag: PropTypes.any.isRequired,
};

const Navigation = ({ flag }) => (
  <NavLink>
    <NavButton label="Dashboard" icon={IconClockDashboard} flag={flag} />
    <NavButton label="Assignements" icon={IconAssignment} flag={flag} />
    <NavButton label="SkillReport" icon={IconBarChart} flag={flag} />
    <NavButton label="Manage Class" icon={IconManage} flag={flag} />
  </NavLink>
);

Navigation.propTypes = {
  flag: PropTypes.any.isRequired,
};

export default Navigation;

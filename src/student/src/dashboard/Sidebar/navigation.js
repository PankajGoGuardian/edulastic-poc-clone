import React from 'react';
import { IconClockDashboard } from '@edulastic/icons';
import { IconAssignment } from '@edulastic/icons';
import { IconBarChart } from '@edulastic/icons';
import { IconManage } from '@edulastic/icons';
// import Sidebar from '../common/sidebar';
import styled from 'styled-components';

class Navigation extends React.Component {
  render() {
    return (
      <NavigationWrapper>
        <NavLink>
          <IconWrapper>
            <Icon />
          </IconWrapper>
          <TextWrapper>Dashboard</TextWrapper>
        </NavLink>
        <NavLink>
          <IconWrapper>
            <Icon />
          </IconWrapper>
          <TextWrapper>Assignments</TextWrapper>
        </NavLink>
        <NavLink>
          <IconWrapper>
            <Icon />
          </IconWrapper>
          <TextWrapper>Skill report</TextWrapper>
        </NavLink>
        <NavLink>
          <IconWrapper>
            <Icon />
          </IconWrapper>
          <TextWrapper>Manage class</TextWrapper>
        </NavLink>
      </NavigationWrapper>
    );
  }
}

export default Navigation;

const NavigationWrapper = styled.div`
  position: relative;
`;

const Icon = styled(IconClockDashboard)`
  width: 22px !important;
  height: 22px !important;
  fill: rgb(67, 75, 93);
`;

const NavLink = styled.div`
  display: inline-block;
  margin-top: 3rem;
`;
const IconWrapper = styled.div`
  float: left;
  margin-right: 1rem;
`;

const TextWrapper = styled.div`
  float: right;
  color: rgb(67, 75, 93);
  font-weight: 600;
  font-size: 1rem;
`;

import React from 'react';
import { IconHeader } from '@edulastic/icons';
import styled from 'styled-components';
import Sidebar from '../common/sidebar';
import Navigation from './navigation';
import Help from './help';

class Header extends React.Component {
  render() {
    return (
      <Sidebar>
        <SidebarWrapper>
          <HeaderWrapper>
            <Icon />
          </HeaderWrapper>
          <Navigation />
          <Help />
        </SidebarWrapper>
      </Sidebar>
    );
  }
}

export default Header;

const SidebarWrapper = styled.div`
  margin: 0rem 1.5rem;
`;
const HeaderWrapper = styled.div`
  padding: 2rem 0rem;
  border-bottom: 1px solid #d9d6d6;
`;

const Icon = styled(IconHeader)`
  width: 119px !important;
  height: 19px !important;
`;

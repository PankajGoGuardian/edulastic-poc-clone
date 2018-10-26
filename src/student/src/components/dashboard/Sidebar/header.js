import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IconLogoCompact, IconHeader, IconClose, IconChevronLeft } from '@edulastic/icons';
import PropTypes from 'prop-types';

// components
import Help from './help';
import Navigation from './navigation';
import { desktopSideBar as desktopSideBarAction } from '../../../actions/togglemenu';
import { responsiveSideBar as responsiveSideBarAction } from '../../../actions/responsivetogglemenu';

const Header = ({ flag, desktopSideBar, sidebar, responsiveSideBar }) => (
  <Sidebar flag={flag} sidebar={sidebar}>
    <SidebarWrapper>
      <HeaderWrapper flag={flag} sidebar={sidebar}>
        {flag ? <IconCompact /> : <Icon />}
        <ArrowBtn onClick={desktopSideBar} />
        <ResponsiveToggleMenu onClick={responsiveSideBar} />
      </HeaderWrapper>
      <Navigation flag={flag} />
      <Help flag={flag} />
    </SidebarWrapper>
  </Sidebar>
);

Header.propTypes = {
  flag: PropTypes.any.isRequired,
  desktopSideBar: PropTypes.any.isRequired,
  sidebar: PropTypes.any.isRequired,
  responsiveSideBar: PropTypes.any.isRequired,
};

export default connect(
  ({ ui }) => ({ flag: ui.flag, sidebar: ui.sidebar }),
  { desktopSideBar: desktopSideBarAction, responsiveSideBar: responsiveSideBarAction },
)(Header);

const Sidebar = styled.div`
  @media (min-width: 1200px) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: ${props => (props.flag ? '7rem' : '16.3rem')};
    background-color: #fbfafc;
    box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.16);
  }
  @media (max-width: 1200px) {
    display: block;
    position: absolute;
    top: 0;
    bottom:0;
    z-index: 100;
    height:100
    background-color: #fbfafc;
  }
  @media (max-width: 1024px) {
    width: 16rem;
    display: ${props => (props.sidebar ? 'block' : 'none')};
  }
  @media (max-width: 425px) {
    width: 100%;
  }
`;

// empty component???
const SidebarWrapper = styled.div``;
const HeaderWrapper = styled.div`
  padding: ${props => (props.flag ? '2.2rem 1rem 2.2rem 2rem' : '1.8rem 1rem')};
  margin: ${props => (props.flag ? '0rem' : '0rem 2rem')};
  border-bottom: 1px solid #d9d6d6;
  text-align: center;
  align-items: center;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  @media (max-width: 1024px) {
    margin: 0rem 1rem;
  }
`;

const Icon = styled(IconHeader)`
  width: 119px !important;
  height: 20px !important;
`;

const IconCompact = styled(IconLogoCompact)`
  width: 25px !important;
  height: 25px !important;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`;

const ArrowBtn = styled(IconChevronLeft)`
  fill: #1fe3a1;
  float: left;
  cursor: pointer;
  display: none;
  &:hover {
    fill: #1fe3a1;
  }
  @media (min-width: 1200px) {
    float: right;
    display: block;
  }
  @media (max-width: 1024px) {
    margin-right: 1rem;
  }
`;
const ResponsiveToggleMenu = styled(IconClose)`
  @media (min-width: 1200px) {
    display: none;
  }
  display: none;
  @media (max-width: 1024px) {
    fill: #4aac8b;
    width: 15px !important;
    height: 15px !important;
    float: left;
    cursor: pointer;
    display: block;
    margin-right: 1rem;
  }
  &:hover {
    fill: #1fe3a1;
  }
`;

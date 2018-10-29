import React from 'react';
import PropTypes from 'prop-types';
import { IconMenuOpenClose } from '@edulastic/icons';
import { connect } from 'react-redux';
import styled from 'styled-components';
import MainContent from './MainContent';
import { responsiveSideBar } from '../../actions/responsivetogglemenu';

const AppContainer = ({ responsiveSideBar: sidebar }) => (
  <React.Fragment>
    <AssignmentHamburger>
      <IconMenu onClick={sidebar} />
      Assignments
    </AssignmentHamburger>
    <MainContent />
  </React.Fragment>
);

export default React.memo(
  connect(
    ({ ui }) => ({ sidebar: ui.sidebar }),
    { responsiveSideBar },
  )(AppContainer),
);

AppContainer.propTypes = {
  responsiveSideBar: PropTypes.func.isRequired,
};

const AssignmentHamburger = styled.div`
  padding: 1.7rem 2rem;
  background: #0eb08d;
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  @media (min-width: 1200px) {
    display: none;
  }
`;

const IconMenu = styled(IconMenuOpenClose)`
  fill: #fff;
  margin-right: 2rem;
  width: 20px !important;
  height: 20px !important;
  cursor: pointer;
  &:hover {
    fill: #fff;
  }
`;

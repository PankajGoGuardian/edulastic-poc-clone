import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { themes } from './themes';

import Sidebar from './Sidebar/SideMenu';
import DashboardContainer from './components/dashboard';
import AssignmentsContainer from './components/assignments';
import ReportContainer from './components/Report';
import ManageClassContainer from './components/manageClass';
import ReportListContainer from './components/ReportList';
import SkillReportContainer from './components/SkillReport';
import ProfileContainer from './components/profile';

const Dashboard = ({ match, isSidebarCollapsed }) => (
  <ThemeProvider theme={themes.default}>
    <Layout>
      <MainContainer isCollapsed={isSidebarCollapsed}>
        <Sidebar />
        <Wrapper>
          <Switch>
            <Route path={`${match.url}/dashboard`} component={DashboardContainer} />
            <Route path={`${match.url}/assignments`} component={AssignmentsContainer} />
            <Route path={`${match.url}/reports`} component={ReportContainer} />
            <Route path={`${match.url}/skill-reports`} component={SkillReportContainer} />
            <Route path={`${match.url}/manage`} component={ManageClassContainer} />
            <Route path={`${match.url}/profile`} component={ProfileContainer} />
            <Route
              path={`${match.url}/report/list`}
              component={ReportListContainer}
            />
          </Switch>
        </Wrapper>
      </MainContainer>
    </Layout>
  </ThemeProvider>
);

export default connect(({ ui }) => ({
  isSidebarCollapsed: ui.isSidebarCollapsed
}))(Dashboard);


Dashboard.propTypes = {
  match: PropTypes.object.isRequired,
  isSidebarCollapsed: PropTypes.object.isRequired
};

const MainContainer = styled.div`
  padding-left: ${props => (props.isCollapsed ? '100px' : '240px')};
  width: 100%;
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: ${props => (props.isCollapsed ? '100px' : '240px')};
    z-index: 10;
  }
  @media (max-width: 768px) {
    padding-left: 0px;
    .fixed-header {
      left: 0;
      padding-left: 30px;
      background: #0188d2;
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

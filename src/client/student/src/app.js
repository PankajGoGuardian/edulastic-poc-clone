import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import Sidebar from './Sidebar/SideMenu';
import DashboardContainer from './components/dashboard';
import AssignmentsContainer from './components/assignments';
import ReportContainer from './components/Report';
import ManageClassContainer from './components/manageClass';
import ReportListContainer from './components/ReportList';
import SkillReportContainer from './components/SkillReport';
import ProfileContainer from './components/profile';

const Dashboard = ({ match }) => (
  <Layout>
    <Sidebar />
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
  </Layout>
);

export default Dashboard;

Dashboard.propTypes = {
  match: PropTypes.object.isRequired
};

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import Sidebar from './Sidebar/SideMenu';
import AppContainer from './components/dashboard';
import ReportContainer from './components/Report';
import ManageClassContainer from './components/manageClass';
import ReportListContainer from './components/ReportList';

const Dashboard = ({ match }) => (
  <Layout>
    <Sidebar />
    <Switch>
      <Route path={`${match.url}/dashboard`} component={AppContainer} />
      <Route path={`${match.url}/reports`} component={ReportContainer} />
      <Route path={`${match.url}/manage`} component={ManageClassContainer} />
      <Route
        path={`${match.url}/report/list`}
        component={ReportListContainer}
      />
    </Switch>
  </Layout>
);

export default Dashboard;

Dashboard.propTypes = {
  match: PropTypes.string.isRequired
};

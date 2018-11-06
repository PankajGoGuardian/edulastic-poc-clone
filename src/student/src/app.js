import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Sidebar from './Sidebar/SideMenu';
import AppContainer from './components/dashboard';
import ReportContainer from './components/Report';

const Dashboard = ({ match }) => (
  <Layout>
    <Sidebar />
    <Switch>
      <Route path={`${match.url}/dashboard`} component={AppContainer} />
      <Route path={`${match.url}/Report`} component={ReportContainer} />
    </Switch>
  </Layout>
);

export default Dashboard;

Dashboard.propTypes = {
  match: PropTypes.string.isRequired,
};

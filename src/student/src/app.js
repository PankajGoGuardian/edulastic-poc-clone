import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import AppContainer from './components/dashboard';
import ReportContainer from './components/Report';

const Dashboard = ({ match }) => (
  <div>
    <Sidebar />
    <div>
      <Switch>
        <Route path={`${match.url}/dashboard`} component={AppContainer} />
        <Route path={`${match.url}/Report`} component={ReportContainer} />
      </Switch>
    </div>
  </div>
);

export default Dashboard;

Dashboard.propTypes = {
  match: PropTypes.string.isRequired,
};

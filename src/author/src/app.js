import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import ItemList from './components/ItemList';

const Dashboard = ({ match }) => (
  <div>
    <Sidebar />
    <div>
      <Switch>
        <Route path={`${match.url}/items`} component={ItemList} />
      </Switch>
    </div>
  </div>
);

export default Dashboard;

Dashboard.propTypes = {
  match: PropTypes.string.isRequired,
};

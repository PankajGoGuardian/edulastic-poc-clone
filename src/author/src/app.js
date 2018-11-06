import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Sidebar from './Sidebar/SideMenu';
import ItemList from './components/ItemList';

const Dashboard = ({ match }) => (
  <Layout>
    <Sidebar />
    <Switch>
      <Route path={`${match.url}/items`} component={ItemList} />
    </Switch>
  </Layout>
);

export default Dashboard;

Dashboard.propTypes = {
  match: PropTypes.string.isRequired,
};

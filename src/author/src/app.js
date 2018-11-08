import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { Progress } from '@edulastic/common';
import Sidebar from './Sidebar/SideMenu';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';

const TestList = lazy(() => import('./components/TestList'));

const Author = ({ match }) => (
  <Layout>
    <Sidebar />
    <Switch>
      <Route path={`${match.url}/items`} component={ItemList} />
      <Route path={`${match.url}/item/:id/item-detail`} component={ItemDetail} />
      <Route
        path={`${match.url}/tests`}
        render={props => (
          <Suspense fallback={<Progress />}>
            <TestList {...props} />
          </Suspense>
        )}
      />
    </Switch>
  </Layout>
);

export default Author;

Author.propTypes = {
  match: PropTypes.string.isRequired,
};

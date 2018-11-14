import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { Progress } from '@edulastic/common';
import Sidebar from './Sidebar/SideMenu';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import ItemAdd from './components/ItemAdd';
import QuestionEditor from './components/QuestionEditor';
import PickUpQuestionType from './components/PickUpQuestionType';

const TestList = lazy(() => import('./components/TestList'));
const TestPage = lazy(() => import('./components/TestPage'));

const Author = ({ match }) => (
  <Layout>
    <Sidebar />
    <div style={{ width: '100%', position: 'relative', overflow: 'auto', height: '100vh' }}>
      <Switch>
        <Route exact path={`${match.url}/items`} component={ItemList} />
        <Route exact path={`${match.url}/items/:id/item-detail`} component={ItemDetail} />
        <Route exact path="/author/add-item" component={ItemAdd} />
        <Route
          exact
          path={`${match.url}/tests`}
          render={props => (
            <Suspense fallback={<Progress />}>
              <TestList {...props} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/author/tests/create"
          render={props => (
            <Suspense fallback={<Progress />}>
              <TestPage {...props} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/author/tests/:id"
          render={props => (
            <Suspense fallback={<Progress />}>
              <TestPage {...props} />
            </Suspense>
          )}
        />
        <Route exact path="/author/items/:id/pickup-questiontype" component={PickUpQuestionType} />
        <Route exact path="/author/questions/create" component={QuestionEditor} />
        <Route exact path="/author/questions/:id" component={QuestionEditor} />
      </Switch>
    </div>
  </Layout>
);

export default Author;

Author.propTypes = {
  match: PropTypes.string.isRequired,
};

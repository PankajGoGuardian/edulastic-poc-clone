import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { Progress } from '@edulastic/common';
import Sidebar from './Sidebar/SideMenu';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import ItemAdd from './components/ItemAdd';
import QuestionEditor from './components/QuestionEditor';
import PickUpQuestionType from './components/PickUpQuestionType';

const TestList = lazy(() => import('./components/TestList'));
const TestPage = lazy(() => import('./components/TestPage'));

const Author = ({ match, sidebar }) => (

  <Layout>
    <MainContainer sidebar={sidebar}>
      <Sidebar />
      <Wrapper>
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
      </Wrapper>
    </MainContainer>
  </Layout>
);

export default connect(
  ({ authorUi }) => ({ sidebar: authorUi.isSidebarCollapse }),
)(Author);

Author.propTypes = {
  match: PropTypes.object.isRequired
};

const MainContainer = styled.div`
  padding-left: ${props => (props.sidebar ? '100px' : '240px')};
  width: 100%;
  .fixed-header {
    position: fixed;
    top: 0; 
    right: 0;
    left: ${props => (props.sidebar ? '100px' : '240px')};
    z-index: 1;
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

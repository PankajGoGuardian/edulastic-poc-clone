import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { Progress } from '@edulastic/common';
import Sidebar from './Sidebar/SideMenu';

/* lazy load routes */
const TestList = lazy(() => import('./components/TestList'));
const TestPage = lazy(() => import('./components/TestPage'));
const QuestionEditor = lazy(() => import('./components/QuestionEditor'));
const ItemList = lazy(() => import('./components/ItemList'));
const ItemDetail = lazy(() => import('./components/ItemDetail'));
const ItemAdd = lazy(() => import('./components/ItemAdd'));
const PickUpQuestionType = lazy(() =>
  import('./components/PickUpQuestionType'));

const Author = ({ match, history, isSidebarCollapsed }) => {
  const isPickQuestion = !!history.location.pathname.includes(
    'pickup-questiontype'
  );
  const isCollapsed = isPickQuestion || isSidebarCollapsed;
  return (
    <Layout>
      <MainContainer isCollapsed={isCollapsed}>
        <Sidebar />
        <Wrapper>
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route exact path={`${match.url}/items`} component={ItemList} />
              <Route
                exact
                path={`${match.url}/items/:id/item-detail`}
                component={ItemDetail}
              />
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
              <Route
                exact
                path="/author/items/:id/pickup-questiontype"
                component={PickUpQuestionType}
              />
              <Route
                exact
                path="/author/questions/create"
                component={QuestionEditor}
              />
              <Route
                exact
                path="/author/questions/edit"
                component={QuestionEditor}
              />
            </Switch>
          </Suspense>
        </Wrapper>
      </MainContainer>
    </Layout>
  );
};

export default connect(({ authorUi }) => ({
  isSidebarCollapsed: authorUi.isSidebarCollapsed
}))(Author);

Author.propTypes = {
  match: PropTypes.object.isRequired
};

const MainContainer = styled.div`
  padding-left: ${props => (props.isCollapsed ? '100px' : '240px')};
  width: 100%;
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: ${props => (props.isCollapsed ? '100px' : '240px')};
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

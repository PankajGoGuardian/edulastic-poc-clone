import React, { Component, lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Progress } from '@edulastic/common';
import Student from './student/src';
import Dashboard from './student/src/app';

import Author from './author/src/app';

import {
  QuestionEditor,
  ItemAdd,
  ItemList,
  PickUpQuestionType,
} from './author/src';

import ItemDetail from './author/src/components/ItemDetail';

const TestList = lazy(() => import('./author/src/components/TestList'));
const TestPage = lazy(() => import('./author/src/components/TestPage'));

class App extends Component {
  componentWillMount() {
    const { assessmentId } = this.props;
    localStorage.setItem('AssessmentId', assessmentId);
  }

  render() {
    return (
      <div>
        <Switch>
          <Redirect exact path="/" to="/student/test" />
          <Route path="/author" component={Author} />
          <Route path="/home" component={Dashboard} />
          <Route exact path="/author/add-item" component={ItemAdd} />
          <Route
            exact
            path="/author/items/:id/pickup-questiontype"
            component={PickUpQuestionType}
          />
          <Route
            exact
            path="/author/items/:id/item-detail"
            component={ItemDetail}
          />
          <Route
            exact
            path="/author/tests"
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
          <Route exact path="/author/add-item" component={ItemAdd} />
          <Route
            exact
            path="/author/questions/create"
            component={QuestionEditor}
          />
          <Route
            exact
            path="/author/questions/:id"
            component={QuestionEditor}
          />
          <Route
            path="/student/test/:id"
            component={() => <Student defaultAP test />}
          />
          <Route path="/student/test" component={() => <Student defaultAP />} />
          <Route
            exact
            path="/student/practice/:id"
            component={() => <Student defaultAP={false} test />}
          />
          <Route
            exact
            path="/student/practice"
            component={() => <Student defaultAP={false} />}
          />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  assessmentId: PropTypes.string.isRequired,
};

export default DragDropContext(HTML5Backend)(App);

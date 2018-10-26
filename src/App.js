import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { NotificationContainer } from 'react-notifications';

import Student from './student/src';
import AppContainer from './student/src/components/dashboard';
import {
  QuestionEditor,
  ItemAdd,
  ItemList,
  PickUpQuestionType
} from './author/src';
import ItemDetail from './author/src/components/ItemDetail';

class App extends Component {
  componentWillMount() {
    const { assessmentId } = this.props;
    localStorage.setItem('AssessmentId', assessmentId);
  }

  render() {
    return (
      <div>
        <NotificationContainer />
        <Switch>
          <Redirect exact path="/" to="/student/test" />
          <Route exact path="/author/items" component={ItemList} />
          <Route exact path="/home" component={AppContainer} />
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
            exact
            path="/author/items/:id/pickup-questiontype"
            component={PickUpQuestionType}
          />
          <Route
            exact
            path="/author/items/:id/item-detail"
            component={ItemDetail}
          />
          <Route path="/student/test" component={() => <Student defaultAP />} />
          <Route
            path="/student/practice"
            component={() => <Student defaultAP={false} />}
          />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  assessmentId: PropTypes.string.isRequired
};

export default DragDropContext(HTML5Backend)(App);

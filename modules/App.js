import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Student from './student/src';
import { QuestionEditor, MultipleChoiceQuestionEditor, ItemAdd, ItemList, ItemDetail, PickUpQuestionType } from './author/src';

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
          <Route path="/author/mcq" component={MultipleChoiceQuestionEditor} />
          <Route path="/author/orderlist" component={QuestionEditor} />
          <Route exact path="/author/items" component={ItemList} />
          <Route exact path="/author/add-item" component={ItemAdd} />
          <Route exact path="/author/items/:id" component={ItemDetail} />
          <Route exact path="/author/items/:id/pickup-questiontype" component={PickUpQuestionType} />
          <Route path="/student/test" component={() => <Student defaultAP />} />
          <Route path="/student/practice" component={Student} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  assessmentId: PropTypes.string.isRequired,
};

export default App;

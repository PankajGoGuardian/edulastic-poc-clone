import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ItemDetail from './assessment/src/components/ItemDetail';

import Student from './student/src';
import { QuestionEditor, MultipleChoice } from './author/src';

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
          <Route path="/author/mcq" component={MultipleChoice} />
          <Route path="/author/orderlist" component={QuestionEditor} />
          <Route path="/student/test" component={() => <Student defaultAP />} />
          <Route path="/student/practice" component={Student} />
          <Route path="/items/:id" component={ItemDetail} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  assessmentId: PropTypes.string.isRequired,
};

export default App;

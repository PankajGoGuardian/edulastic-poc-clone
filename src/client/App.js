import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'redux';

import Student from './student/src';
import Signup from './student/src/components/authentication/signup';
import Login from './student/src/components/authentication/login';
import AdminSignup from './student/src/components/authentication/signup/adminSignup';
import Dashboard from './student/src/app';

import Author from './author/src/app';

class App extends Component {
  componentWillMount() {
    const { assessmentId } = this.props;
    localStorage.setItem('AssessmentId', assessmentId);
  }

  render() {
    return (
      <div>
        <Switch>
          <Redirect exact path="/" to="/home/dashboard" />
          <Route path="/author" component={Author} />
          <Route path="/home" component={Dashboard} />
          <Route path="/Signup" component={Signup} />
          <Route path="/Login" component={Login} />
          <Route path="/AdminSignup" component={AdminSignup} />
          <Route
            path="/student/test/:id"
            component={() => <Student defaultAP test />}
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
  assessmentId: PropTypes.string.isRequired
};

const enhance = compose(DragDropContext(HTML5Backend));

export default enhance(App);

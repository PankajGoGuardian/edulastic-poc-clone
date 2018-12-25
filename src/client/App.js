import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'redux';

import { fetchUserAction } from './student/src/actions/user';

// route wise splitting
const Student = lazy(() =>
  import(/* webpackChunkName: "assessmentPlayer" */ './student/src'));
const Signup = lazy(() =>
  import(/* webpackChunkName: "teacherSignup" */ './student/src/components/authentication/signup'));
const Login = lazy(() =>
  import(/* webpackChunkName: "login" */ './student/src/components/authentication/login'));
const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ './student/src/components/authentication/signup/getStarted'));
const StudentSignup = lazy(() =>
  import(/* webpackChunkName: "studentSignup" */ './student/src/components/authentication/signup/studentSignup'));
const AdminSignup = lazy(() =>
  import(/* webpackChunkName: "adminSignup" */ './student/src/components/authentication/signup/adminSignup'));
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "student" */ './student/src/app'));

const Author = lazy(() =>
  import(/* webpackChunkName: "author" */ './author/src/app'));

class App extends Component {
  componentWillMount() {
    const { fetchUser } = this.props;
    fetchUser();
  }

  render() {
    return (
      <div>
        <Suspense fallback={() => <div> Loading ...</div>}>
          <Switch>
            <Redirect exact path="/" to="/home/dashboard" />
            <Route path="/author" component={Author} />
            <Route path="/home" component={Dashboard} />
            <Route path="/Signup" component={Signup} />
            <Route path="/Login" component={Login} />
            <Route path="/GetStarted" component={GetStarted} />
            <Route path="/AdminSignup" component={AdminSignup} />
            <Route path="/StudentSignup" component={StudentSignup} />
            <Route
              path="/student/test/:id"
              component={() => <Student defaultAP test />}
            />
            <Route
              path="/student/test/:id"
              component={() => <Student defaultAP test />}
            />
            <Route
              path="/student/test"
              component={() => <Student defaultAP />}
            />
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
        </Suspense>
      </div>
    );
  }
}

App.propTypes = {
  fetchUser: PropTypes.func.isRequired
};

const enhance = compose(
  DragDropContext(HTML5Backend),
  connect(
    ({ user }) => ({ user }),
    { fetchUser: fetchUserAction }
  )
);

export default enhance(App);

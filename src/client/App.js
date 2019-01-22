import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'redux';

// route wise splitting
const Student = lazy(() =>
  import(/* webpackChunkName: "assessmentPlayer" */ './student')
);
const Signup = lazy(() =>
  import(/* webpackChunkName: "teacherSignup" */ './student/components/authentication/signup')
);
const Login = lazy(() =>
  import(/* webpackChunkName: "login" */ './student/components/authentication/login')
);
const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ './student/components/authentication/signup/getStarted')
);
const StudentSignup = lazy(() =>
  import(/* webpackChunkName: "studentSignup" */ './student/components/authentication/signup/studentSignup')
);
const AdminSignup = lazy(() =>
  import(/* webpackChunkName: "adminSignup" */ './student/components/authentication/signup/adminSignup')
);
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "student" */ './student/app')
);
const SummaryTest = lazy(() =>
  import(/* webpackChunkName: "student test summary" */ './student/components/Summary')
);

const Author = lazy(() =>
  import(/* webpackChunkName: "author" */ './author/src/app')
);

const Loading = () => <div> Loading ...</div>;

class App extends Component {
  render() {
    return (
      <div>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Redirect exact path="/" to="/home/assignments" />
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
            <Route path="/student/test-summary" component={SummaryTest} />
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

const enhance = compose(
  DragDropContext(HTML5Backend),
  withRouter,
  connect(
    ({ user }) => ({ user }),
    null
  )
);

export default enhance(App);

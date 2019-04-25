import React, { Component, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { compose } from "redux";
import { Spin } from "antd";
import Joyride from "react-joyride";
import { test } from "@edulastic/constants";
import { TestAttemptReview } from "./student/TestAttemptReview";

const { ASSESSMENT, PRACTICE } = test.type;
// route wise splitting
const AssessmentPlayer = lazy(() => import(/* webpackChunkName: "assessmentPlayer" */ "./assessment/index"));
const TeacherSignup = lazy(() =>
  import(/* webpackChunkName: "teacherSignup" */ "./student/Signup/components/TeacherContainer")
);
const Login = lazy(() => import(/* webpackChunkName: "login" */ "./student/Login/components"));
const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ "./student/Signup/components/GetStartedContainer")
);
const StudentSignup = lazy(() =>
  import(/* webpackChunkName: "studentSignup" */ "./student/Signup/components/StudentContainer")
);
const AdminSignup = lazy(() =>
  import(/* webpackChunkName: "adminSignup" */ "./student/Signup/components/AdminContainer")
);
const Dashboard = lazy(() => import(/* webpackChunkName: "student" */ "./student/app"));

const Author = lazy(() => import(/* webpackChunkName: "author" */ "./author/src/app"));

const Loading = () => (
  <div>
    <Spin />
  </div>
);

class App extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    tutorial: PropTypes.object
  };

  static defaultProps = {
    tutorial: null
  };

  render() {
    const { user, tutorial } = this.props;
    let defaultRoute = "/home/assignments";
    if (user && user.isAuthenticated) {
      if (user.user.role === "teacher") {
        defaultRoute = "/author/assignments";
      }
    } else {
      defaultRoute = "/Login";
    }

    // signup routes hidden till org reference is not done
    return (
      <div>
        {tutorial && <Joyride continuous showProgress showSkipButton steps={tutorial} />}
        <Suspense fallback={<Loading />}>
          <Switch>
            <Redirect exact path="/" to={defaultRoute} />
            <Route path="/author" component={Author} />
            <Route path="/home" component={Dashboard} />

            {/* <Route path="/Signup" component={TeacherSignup} /> */}
            <Route path="/Login" component={Login} />
            <Route path="/GetStarted" component={GetStarted} />
            {/* <Route path="/AdminSignup" component={AdminSignup} /> */}
            {/* <Route path="/StudentSignup" component={StudentSignup} /> */}

            <Route path={`/student/${ASSESSMENT}/:id/uta/:utaId`} render={() => <AssessmentPlayer defaultAP />} />
            <Route path={`/student/${ASSESSMENT}/:id`} render={() => <AssessmentPlayer defaultAP />} />
            <Route path="/student/test-summary" component={TestAttemptReview} />
            <Route path={`/student/${PRACTICE}/:id/uta/:utaId`} render={() => <AssessmentPlayer defaultAP={false} />} />
            <Route path={`/student/${PRACTICE}/:id`} render={() => <AssessmentPlayer defaultAP={false} />} />
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
    ({ user, tutorial }) => ({ user, tutorial: tutorial.currentTutorial }),
    null
  )
);

export default enhance(App);

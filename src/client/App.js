import React, { Component, Suspense, lazy } from "react";
import { get, isUndefined } from "lodash";
import queryString from "query-string";
import PropTypes from "prop-types";
import { Switch, Route, Redirect, withRouter, BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { compose } from "redux";
import { Spin } from "antd";
import Joyride from "react-joyride";
import { test, signUpState } from "@edulastic/constants";
import { TokenStorage } from "@edulastic/api";
import { TestAttemptReview } from "./student/TestAttemptReview";
import { fetchUserAction } from "./student/Login/ducks";
import TestDemoPlayer from "./author/TestDemoPlayer";
import TestItemDemoPlayer from "./author/TestItemDemoPlayer";

const { ASSESSMENT, PRACTICE } = test.type;
// route wise splitting
const AssessmentPlayer = lazy(() => import(/* webpackChunkName: "assessmentPlayer" */ "./assessment/index"));
const TeacherSignup = lazy(() =>
  import(/* webpackChunkName: "teacherSignup" */ "./student/Signup/components/TeacherContainer/Container")
);
const Auth = lazy(() => import(/* webpackChunkName: "auth" */ "./Auth"));
const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ "./student/Signup/components/GetStartedContainer")
);
const StudentSignup = lazy(() =>
  import(/* webpackChunkName: "studentSignup" */ "./student/Signup/components/StudentContainer")
);
const AdminSignup = lazy(() =>
  import(/* webpackChunkName: "adminSignup" */ "./student/Signup/components/AdminContainer/Container")
);
const Dashboard = lazy(() => import(/* webpackChunkName: "student" */ "./student/app"));

const Author = lazy(() => import(/* webpackChunkName: "author" */ "./author/src/app"));

const Admin = lazy(() => import(/* webpackChunkName: "admin" */ "./admin/app"));
const RedirectToTest = lazy(() => import(/* webpackChunkName: "RedirecToTest" */ "./author/RedirectToTest"));

const Loading = () => (
  <div>
    <Spin />
  </div>
);

const query = queryString.parse(window.location.search);
if (query.token && query.userId && query.role) {
  TokenStorage.storeAccessToken(query.token, query.userId, query.role);
  TokenStorage.selectAccessToken(query.userId, query.role);
} else if (query.userId && query.role) {
  TokenStorage.selectAccessToken(query.userId, query.role);
}

const testRedirectRoutes = ["/demo/assessmentPreview", "/d/ap"];

class App extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    tutorial: PropTypes.object,
    location: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired
  };

  static defaultProps = {
    tutorial: null
  };

  componentDidMount() {
    const { fetchUser, location } = this.props;
    const publicPath = location.pathname.split("/").includes("public");

    if (!publicPath) {
      fetchUser();
    }
  }

  render() {
    const { user, tutorial, location, history } = this.props;

    if (location.hash.includes("#renderResource/close/")) {
      const v1Id = location.hash.split("/")[2];
      history.push(`/d/ap?eAId=${v1Id}`);
    }

    const publicPath = location.pathname.split("/").includes("public");
    if (!publicPath && user.authenticating && TokenStorage.getAccessToken()) {
      return <Loading />;
    }

    let defaultRoute = "/author/assignments";

    if (!publicPath) {
      if (user && user.isAuthenticated) {
        const role = get(user, ["user", "role"]);
        if (role === "teacher") {
          if (user.signupStatus === signUpState.DONE || isUndefined(user.signupStatus)) {
            defaultRoute = "/author/assignments";
          } else {
            defaultRoute = "/signup";
          }
        } else if (role === "edulastic-admin") {
          defaultRoute = "/admin";
        } else if (role === "student") {
          defaultRoute = "/home/assignments";
        } else if (role === "district-admin" || role === "school-admin") {
          defaultRoute = "/author/assignments";
        }
        // TODO: handle the rest of the role routes (district-admin,school-admin)
      } else {
        defaultRoute = "/login";
      }
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
            <Route path="/admin" component={Admin} />

            <Route path="/Signup" component={TeacherSignup} />
            <Route path="/login" component={Auth} />
            <Route path="/GetStarted" component={GetStarted} />
            <Route path="/AdminSignup" component={AdminSignup} />
            <Route path="/StudentSignup" component={StudentSignup} />

            <Route path={`/student/${ASSESSMENT}/:id/uta/:utaId`} render={() => <AssessmentPlayer defaultAP />} />
            <Route path={`/student/${ASSESSMENT}/:id`} render={() => <AssessmentPlayer defaultAP />} />
            <Route path="/student/test-summary" component={TestAttemptReview} />
            <Route path={`/student/${PRACTICE}/:id/uta/:utaId`} render={() => <AssessmentPlayer defaultAP={false} />} />
            <Route path={`/student/${PRACTICE}/:id`} render={() => <AssessmentPlayer defaultAP={false} />} />
            <Route path="/public/test/:id" render={() => <TestDemoPlayer />} />
            <Route path="/v1/testItem/:id" render={() => <TestItemDemoPlayer />} />
            {testRedirectRoutes.map(route => (
              <Route path={route} component={RedirectToTest} key={route} />
            ))}
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
    { fetchUser: fetchUserAction }
  )
);

export default enhance(App);

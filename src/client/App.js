import React, { Component, Suspense, lazy } from "react";
import { get, isUndefined } from "lodash";
import queryString from "query-string";
import PropTypes from "prop-types";
import { Switch, Route, Redirect, withRouter, BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import { DragDropContext } from "react-dnd";
import TouchBackend from "react-dnd-touch-backend";
// import HTML5Backend from "react-dnd-html5-backend";
import { compose } from "redux";
import { Spin } from "antd";
import Joyride from "react-joyride";
import { test, signUpState } from "@edulastic/constants";
import { TokenStorage } from "@edulastic/api";
import { TestAttemptReview } from "./student/TestAttemptReview";
import SebQuitConfirm from "./student/SebQuitConfirm";

import { fetchUserAction } from "./student/Login/ducks";
import TestDemoPlayer from "./author/TestDemoPlayer";
import TestItemDemoPlayer from "./author/TestItemDemoPlayer";
import { getWordsInURLPathName, isLoggedIn } from "./common/utils/helpers";
import LoggedOutRoute from "./common/components/loggedOutRoute";
import PrivateRoute from "./common/components/privateRoute";
import V1Redirect from "./author/V1Redirect";

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
const DistrictRoutes = lazy(() => import("./districtRoutes/index"));

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
    const ssoPath = location.pathname.split("/").includes("auth");
    const partnerPath = location.pathname.split("/").includes("partnerLogin");
    const isV1Redirect = location.pathname.includes("/fwd");
    if (!publicPath && !ssoPath && !partnerPath && !isV1Redirect) {
      fetchUser();
    }
  }

  render() {
    const { user, tutorial, location, history } = this.props;
    if (location.hash.includes("#renderResource/close/")) {
      const v1Id = location.hash.split("/")[2];
      history.push(`/d/ap?eAId=${v1Id}`);
    }

    const publicPath = location.pathname.split("/").includes("public") || location.pathname.includes("/fwd");
    if (!publicPath && user.authenticating && TokenStorage.getAccessToken()) {
      return <Loading />;
    }
    let defaultRoute = "";
    let redirectRoute = "";
    if (!publicPath) {
      const path = getWordsInURLPathName(this.props.location.pathname);
      if (user && user.isAuthenticated) {
        const role = get(user, ["user", "role"]);
        if (role === "teacher") {
          if (user.signupStatus === signUpState.DONE || isUndefined(user.signupStatus)) {
            defaultRoute = "/author/assignments";
          } else if (path[0] && path[0].toLocaleLowerCase() === "district" && path[1]) {
            redirectRoute = `/district/${path[1]}/signup`;
          } else {
            redirectRoute = "/Signup";
          }
        } else if (role === "edulastic-admin") {
          defaultRoute = "/admin";
        } else if (role === "student") {
          defaultRoute = "/home/assignments";
        } else if (role === "district-admin" || role === "school-admin") {
          defaultRoute = "/author/assignments";
        } else if (user.user && (user.user.googleId || user.user.msoId || user.user.cleverId)) {
          defaultRoute = "/auth";
        }
        // TODO: handle the rest of the role routes (district-admin,school-admin)
      } else if (
        this.props.location.pathname.toLocaleLowerCase() === "/getstarted" ||
        this.props.location.pathname.toLocaleLowerCase() === "/signup" ||
        this.props.location.pathname.toLocaleLowerCase() === "/studentsignup" ||
        this.props.location.pathname.toLocaleLowerCase() === "/adminsignup" ||
        (path[0] && path[0].toLocaleLowerCase() === "district") ||
        this.props.location.pathname.includes("/fwd")
      ) {
      } else if (
        this.props.location.pathname === "/auth/mso" ||
        this.props.location.pathname === "/auth/clever" ||
        this.props.location.pathname === "/auth/google"
      ) {
      } else if (this.props.location.pathname === `/partnerLogin/${path[1]}`) {
      } else {
        redirectRoute = "/login";
      }
    }

    // signup routes hidden till org reference is not done
    return (
      <div>
        {tutorial && <Joyride continuous showProgress showSkipButton steps={tutorial} />}
        <Suspense fallback={<Loading />}>
          <Switch>
            {this.props.location.pathname.toLocaleLowerCase() !== redirectRoute.toLocaleLowerCase() &&
            redirectRoute !== "" ? (
              <Redirect exact to={redirectRoute} />
            ) : null}
            <PrivateRoute path="/author" component={Author} redirectPath={redirectRoute} />
            <PrivateRoute path="/home" component={Dashboard} redirectPath={redirectRoute} />
            <PrivateRoute path="/admin" component={Admin} redirectPath={redirectRoute} />

            <LoggedOutRoute
              path="/district/:districtShortName"
              component={DistrictRoutes}
              redirectPath={defaultRoute}
            />
            <LoggedOutRoute path="/Signup" component={TeacherSignup} redirectPath={defaultRoute} />
            <LoggedOutRoute path="/login" component={Auth} redirectPath={defaultRoute} />
            <LoggedOutRoute path="/partnerLogin/greatminds" component={Auth} redirectPath={defaultRoute} />
            <LoggedOutRoute path="/partnerLogin/readicheck" component={Auth} redirectPath={defaultRoute} />
            <LoggedOutRoute path="/GetStarted" component={GetStarted} redirectPath={defaultRoute} />
            <LoggedOutRoute path="/AdminSignup" component={AdminSignup} redirectPath={defaultRoute} />
            <LoggedOutRoute path="/StudentSignup" component={StudentSignup} redirectPath={defaultRoute} />

            <Route path={`/student/${ASSESSMENT}/:id/uta/:utaId`} render={() => <AssessmentPlayer defaultAP />} />
            <Route path={`/student/${ASSESSMENT}/:id`} render={() => <AssessmentPlayer defaultAP />} />
            <PrivateRoute path="/student/test-summary" component={TestAttemptReview} />
            <Route path="/student/seb-quit-confirm" component={SebQuitConfirm} />
            <Route path={`/student/${PRACTICE}/:id/uta/:utaId`} render={() => <AssessmentPlayer defaultAP={false} />} />
            <Route path={`/student/${PRACTICE}/:id`} render={() => <AssessmentPlayer defaultAP={false} />} />
            <Route path="/public/test/:id" render={() => <TestDemoPlayer />} />
            <Route path="/v1/testItem/:id" render={() => <TestItemDemoPlayer />} />
            <Route exact path="/fwd" render={() => <V1Redirect />} />
            <Route path="/auth" render={() => <Auth />} />
            {testRedirectRoutes.map(route => (
              <Route path={route} component={RedirectToTest} key={route} />
            ))}
            <Redirect exact to={defaultRoute} />
          </Switch>
        </Suspense>
      </div>
    );
  }
}

const enhance = compose(
  DragDropContext(
    TouchBackend({
      enableTouchEvents: true,
      enableMouseEvents: true
    })
  ),
  withRouter,
  connect(
    ({ user, tutorial }) => ({ user, tutorial: tutorial.currentTutorial }),
    { fetchUser: fetchUserAction }
  )
);

export default enhance(App);

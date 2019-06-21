import React, { useEffect, lazy } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { isDistrictPolicyAllowed, isDistrictPolicyAvailable } from "../common/utils/helpers";

import { getOrgDetailsByShortNameAndOrgTypeAction } from "../student/Signup/duck";

const TeacherSignup = lazy(() =>
  import(/* webpackChunkName: "teacherSignup" */ "../student/Signup/components/TeacherContainer/Container")
);
const Auth = lazy(() => import(/* webpackChunkName: "auth" */ "../Auth"));
const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ "../student/Signup/components/GetStartedContainer")
);
const StudentSignup = lazy(() =>
  import(/* webpackChunkName: "studentSignup" */ "../student/Signup/components/StudentContainer")
);

const DistrictRoutes = ({
  match,
  location,
  getOrgDetailsByShortNameAndOrgTypeAction,
  generalSettings,
  districtPolicy,
  t
}) => {
  const { districtShortName } = match.params;
  const isSignupUsingDaURL = districtShortName ? true : false;
  useEffect(() => {
    getOrgDetailsByShortNameAndOrgTypeAction({
      data: { shortName: districtShortName, orgType: "district" },
      error: { message: t("common.policyvoilation") }
    });
  }, []);

  return (
    <Switch>
      <Route
        exact
        path="/district/:districtShortName"
        render={props => (
          <Auth
            {...props}
            isSignupUsingDaURL={isSignupUsingDaURL}
            generalSettings={generalSettings}
            districtPolicy={districtPolicy}
            districtShortName={districtShortName}
          />
        )}
      />

      {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "teacherSignUp") ? (
        <Route
          exact
          path="/district/:districtShortName/signup"
          render={props => (
            <TeacherSignup
              {...props}
              isSignupUsingDaURL={isSignupUsingDaURL}
              generalSettings={generalSettings}
              districtPolicy={districtPolicy}
              districtShortName={districtShortName}
            />
          )}
        />
      ) : isDistrictPolicyAvailable(isSignupUsingDaURL, districtPolicy) ? (
        <Redirect path="/district/:districtShortName/signup" exact to={`/district/${districtShortName}`} />
      ) : null}

      {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "studentSignUp") ? (
        <Route
          exact
          path="/district/:districtShortName/studentsignup"
          render={props => (
            <StudentSignup
              {...props}
              isSignupUsingDaURL={isSignupUsingDaURL}
              generalSettings={generalSettings}
              districtPolicy={districtPolicy}
              districtShortName={districtShortName}
            />
          )}
        />
      ) : isDistrictPolicyAvailable(isSignupUsingDaURL, districtPolicy) ? (
        <Redirect path="/district/:districtShortName/studentsignup" exact to={`/district/${districtShortName}`} />
      ) : null}

      {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "teacherSignUp") ||
      isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "studentSignUp") ? (
        <Route
          exact
          path="/district/:districtShortName/GetStarted"
          render={props => (
            <GetStarted
              {...props}
              isSignupUsingDaURL={isSignupUsingDaURL}
              generalSettings={generalSettings}
              districtPolicy={districtPolicy}
              districtShortName={districtShortName}
            />
          )}
        />
      ) : isDistrictPolicyAvailable(isSignupUsingDaURL, districtPolicy) ? (
        <Redirect path="/district/:districtShortName/GetStarted" exact to={`/district/${districtShortName}`} />
      ) : null}
    </Switch>
  );
};

const enhance = compose(
  withNamespaces("login"),
  connect(
    state => ({
      generalSettings: get(state, "signup.generalSettings", null),
      districtPolicy: get(state, "signup.districtPolicy", null)
    }),
    {
      getOrgDetailsByShortNameAndOrgTypeAction: getOrgDetailsByShortNameAndOrgTypeAction
    }
  )
);

export default enhance(DistrictRoutes);

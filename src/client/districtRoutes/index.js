import React, { useEffect, lazy } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { get } from "lodash";

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
  districtPolicy
}) => {
  const { districtShortName } = match.params;
  const isSignupUsingDaURL = districtShortName ? true : false;
  useEffect(() => {
    getOrgDetailsByShortNameAndOrgTypeAction({ shortName: districtShortName, orgType: "district" });
  }, []);

  return (
    <Switch>
      {districtPolicy && districtPolicy.teacherSignUp ? (
        <Route
          exact
          path="/district/:districtShortName"
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
      ) : null}
      <Route
        exact
        path="/district/:districtShortName/login"
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
      {districtPolicy && districtPolicy.studentSignUp ? (
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
      ) : null}
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
    </Switch>
  );
};

export default connect(
  state => ({
    generalSettings: get(state, "signup.generalSettings", null),
    districtPolicy: get(state, "signup.districtPolicy", null)
  }),
  {
    getOrgDetailsByShortNameAndOrgTypeAction: getOrgDetailsByShortNameAndOrgTypeAction
  }
)(DistrictRoutes);

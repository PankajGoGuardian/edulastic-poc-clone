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
  districtUrlLoading,
  orgType,
  t
}) => {
  const { orgShortName } = match.params;
  const isSignupUsingDaURL = orgShortName ? true : false;
  useEffect(() => {
    getOrgDetailsByShortNameAndOrgTypeAction({
      data: { shortName: orgShortName, orgType: orgType === "school" ? "institution" : "district" },
      error: { message: t("common.policyviolation") }
    });
  }, []);

  return (
    <>
      {districtUrlLoading ? (
        "Loading Please Wait..."
      ) : (
        <Switch>
          <Route
            exact
            path={`/${orgType}/:orgShortName`}
            render={props => (
              <Auth
                {...props}
                isSignupUsingDaURL={isSignupUsingDaURL}
                generalSettings={generalSettings}
                districtPolicy={districtPolicy}
                orgShortName={orgShortName}
                orgType={orgType}
              />
            )}
          />

          {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "teacherSignUp") ? (
            <Route
              exact
              path={`/${orgType}/:orgShortName/signup`}
              render={props => (
                <TeacherSignup
                  {...props}
                  isSignupUsingDaURL={isSignupUsingDaURL}
                  generalSettings={generalSettings}
                  districtPolicy={districtPolicy}
                  orgShortName={orgShortName}
                  orgType={orgType}
                />
              )}
            />
          ) : null}

          {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "studentSignUp") ? (
            <Route
              exact
              path={`/${orgType}/:orgShortName/studentsignup`}
              render={props => (
                <StudentSignup
                  {...props}
                  isSignupUsingDaURL={isSignupUsingDaURL}
                  generalSettings={generalSettings}
                  districtPolicy={districtPolicy}
                  orgShortName={orgShortName}
                  orgType={orgType}
                />
              )}
            />
          ) : null}

          {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "teacherSignUp") ||
          isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "studentSignUp") ? (
            <Route
              exact
              path={`/${orgType}/:orgShortName/GetStarted`}
              render={props => (
                <GetStarted
                  {...props}
                  isSignupUsingDaURL={isSignupUsingDaURL}
                  generalSettings={generalSettings}
                  districtPolicy={districtPolicy}
                  orgShortName={orgShortName}
                  orgType={orgType}
                />
              )}
            />
          ) : null}
          <Redirect exact to={`/${orgType}/${orgShortName}`} />
        </Switch>
      )}
    </>
  );
};

const enhance = compose(
  withNamespaces("login"),
  connect(
    state => ({
      generalSettings: get(state, "signup.generalSettings", undefined),
      districtPolicy: get(state, "signup.districtPolicy", undefined),
      districtUrlLoading: get(state, "signup.districtUrlLoading", true)
    }),
    {
      getOrgDetailsByShortNameAndOrgTypeAction: getOrgDetailsByShortNameAndOrgTypeAction
    }
  )
);

export default enhance(DistrictRoutes);

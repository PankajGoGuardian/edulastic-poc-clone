import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import Header from "./Header";
import JoinSchool from "./JoinSchool";
import SignupForm from "./SignupForm";
import SubjectGradeForm from "./SubjectGrade";

const Container = ({ user }) => {
  const { isAuthenticated, signupStatus } = user;
  if (!isAuthenticated) {
    return (
      <>
        <SignupForm />
      </>
    );
  }
  const userInfo = get(user, "user");
  return (
    <>
      <Header userInfo={userInfo} />
      {signupStatus === 1 && <JoinSchool />}
      {signupStatus === 2 && <SubjectGradeForm />}
    </>
  );
};

Container.propTypes = {
  user: PropTypes.object
};

Container.defaultProps = {
  user: null
};

const enhance = compose(
  withRouter,
  connect(
    state => ({ user: state.user }),
    {}
  )
);

export default enhance(Container);

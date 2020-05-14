import React, { useEffect } from "react";
import { message, Spin } from "antd";
import { withRouter } from "react-router";
import qs from "query-string";
import { testsApi } from "@edulastic/api";
import { TokenStorage } from "@edulastic/api";
import { compose } from "redux";
import { connect } from "react-redux";

const RedirectToTest = ({ location: { search }, history, user }) => {
  useEffect(() => {
    let { eAId: v1Id } = qs.parse(search);
    if (v1Id) {
      try {
        const testId = atob(v1Id);

        testsApi
          .getByV1Id(testId)
          .then(data => {
            const { _id: id } = data;
            if (!id) {
              handleFailed("no test found");
            }
            if (!user?.authenticating || !TokenStorage.getAccessToken()) {
              //not authenticated user flow
              history.push(`/public/view-test/${id}`);
            } else {
              history.push(`/author/tests/${id}`);
            }
          })
          .catch(handleFailed);
      } catch (e) {
        console.log(e);
        handleFailed();
      }
    }
  }, []);

  const handleFailed = e => {
    console.log(e);
    message("test not found");
    history.replace("/author/test");
  };
  return (
    <div>
      <Spin />
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ user }) => ({ user: user?.user }))
)(RedirectToTest);

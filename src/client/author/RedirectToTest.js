import React, { useEffect } from "react";
import { message, Spin } from "antd";
import { withRouter } from "react-router";
import qs from "query-string";
import { testsApi, TokenStorage } from "@edulastic/api";

import { compose } from "redux";
import { connect } from "react-redux";
import AppConfig from "../../../app-config";

const RedirectToTest = ({ location: { search }, history, user }) => {

  const handleFailed = e => {
    console.log(e);
    message("test not found");
    history.replace("/author/test");
  };

  const decrypt = decoded => {
    try {
      const salted = (BigInt(decoded) ^ BigInt(AppConfig.v1RedirectDecryptSalt));
      return (((BigInt(0x0000FFFF) & salted) << BigInt(16)) | ((BigInt(0xFFFF0000) & salted) >> BigInt(16)));
    } catch (e) {
      handleFailed("Missing Salt Key");
    }
  }
  useEffect(() => {
    const { eAId, aId } = qs.parse(search);
    const v1Id = eAId || aId;
    let testId = v1Id;

    if (isNaN(v1Id)) {
      testId = decrypt(atob(v1Id));
    }

    if (testId) {
      try {
        testsApi
          .getByV1Id(testId)
          .then(data => {
            const { _id: id } = data;
            if (!id) {
              handleFailed("no test found");
            }
            if (!user?.authenticating || !TokenStorage.getAccessToken()) {
              // not authenticated user flow
              history.push(`/public/view-test/${id}`);
            } else {
              history.push(`/author/tests/${id}`);
            }
          })
          .catch(handleFailed);
      } catch (e) {
        console.warn("TestId cannot be null ", e);
        handleFailed();
      }
    }
  }, []);


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

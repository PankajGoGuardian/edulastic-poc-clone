import React, { useEffect } from "react";
import { message, Spin } from "antd";
import { withRouter } from "react-router";
import qs from "query-string";
import { testsApi } from "@edulastic/api";

const RedirectToTest = ({ location: { search }, history }) => {
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

            history.push(`/author/tests/${id}`);
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

export default withRouter(RedirectToTest);

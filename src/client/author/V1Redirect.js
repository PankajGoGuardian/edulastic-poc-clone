import React, { useEffect } from "react";
import { Spin } from "antd";
import { parse as qsParse } from "qs";
import { connect } from "react-redux";
import { fetchV1RedirectAction } from "../student/Login/ducks";

const query = qsParse(window.location.search.replace("?", "") || "");

function V1Redirect({ fetchV1Redirect }) {
  useEffect(() => {
    if (query.id) {
      fetchV1Redirect(query.id);
    }
  }, []);
  return (
    <div>
      <Spin />
    </div>
  );
}

export default connect(
  null,
  { fetchV1Redirect: fetchV1RedirectAction }
)(V1Redirect);

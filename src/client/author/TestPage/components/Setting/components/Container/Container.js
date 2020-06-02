import React, { memo } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withWindowSizes, MainContentWrapper } from "@edulastic/common";
import { SecondHeader } from "./styled";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import MainSetting from "../MainSetting/MainSetting";

const Setting = ({ current, history, windowWidth, owner, isEditable = false, sebPasswordRef, showCancelButton }) => {
  const breadcrumbData = [
    {
      title: showCancelButton ? "ASSIGNMENTS / EDIT TEST" : "TESTS LIBRARY",
      to: showCancelButton ? "/author/assignments" : "/author/tests"
    },
    {
      title: current,
      to: ""
    }
  ];

  return (
    <MainContentWrapper>
      <SecondHeader>
        <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
      </SecondHeader>
      <MainSetting
        history={history}
        windowWidth={windowWidth}
        owner={owner}
        isEditable={isEditable}
        sebPasswordRef={sebPasswordRef}
      />
    </MainContentWrapper>
  );
};

Setting.propTypes = {
  current: PropTypes.string.isRequired,
  history: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
  owner: PropTypes.bool.isRequired,
  windowWidth: PropTypes.number.isRequired
};

const enhance = compose(
  memo,
  withRouter,
  withWindowSizes
);

export default enhance(Setting);

import React, { memo } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withWindowSizes, MainContentWrapper } from "@edulastic/common";

import { setUserCustomizeAction, getUserCustomizeSelector } from "../../ducks";
import { SecondHeader } from "../../../TestPage/components/Setting/components/Container/styled";

import Breadcrumb from "../../../src/components/Breadcrumb";
import MainSetting from "./MainSettings";

const Setting = ({ current, history, windowWidth, customize, setUserCustomize }) => {
  const breadcrumbData = [
    {
      title: "PLAYLIST",
      to: "/author/playlists"
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
        customize={customize}
        handleUserCustomize={setUserCustomize}
      />
    </MainContentWrapper>
  );
};

Setting.propTypes = {
  current: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired
};

const enhance = compose(
  memo,
  withRouter,
  withWindowSizes,
  connect(
    state => ({ customize: getUserCustomizeSelector(state) }),
    {
      setUserCustomize: setUserCustomizeAction
    }
  )
);

export default enhance(Setting);

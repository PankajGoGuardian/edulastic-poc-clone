import React, { memo } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "antd";
import { IconSource } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { themeColor } from "@edulastic/colors";
import { withWindowSizes } from "@edulastic/common";
import { SecondHeader } from "./styled";

import { Container, ButtonLink } from "../../../../../src/components/common";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import MainSetting from "../MainSetting/MainSetting";

const Setting = ({ t, current, history, onShowSource, windowWidth, owner, isEditable = false, sebPasswordRef }) => {
  const breadcrumbData = [
    {
      title: "TESTS LIBRARY",
      to: "/author/tests"
    },
    {
      title: current,
      to: ""
    }
  ];

  return (
    <Container>
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
    </Container>
  );
};

Setting.propTypes = {
  t: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  history: PropTypes.func.isRequired,
  onShowSource: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
  owner: PropTypes.bool,
  windowWidth: PropTypes.number.isRequired
};

const enhance = compose(
  memo,
  withRouter,
  withWindowSizes,
  withNamespaces("author")
);

export default enhance(Setting);

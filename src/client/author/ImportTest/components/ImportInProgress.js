import React, { useEffect } from "react";
import { withNamespaces } from "@edulastic/localization";
import { Spin } from "antd";
import PropTypes from "prop-types";
import useInterval from "@use-it/interval";
import { connect } from "react-redux";

import TitleWrapper from "../../AssignmentCreate/common/TitleWrapper";
import TextWrapper from "../../AssignmentCreate/common/TextWrapper";
import { FlexContainer } from "./styled";
import { qtiImportProgressAction, UPLOAD_STATUS } from "../ducks";

const ImportInprogress = ({ t, qtiImportProgress, jobIds, status }) => {
  const checkProgress = () => {
    if (status !== UPLOAD_STATUS.STANDBY && jobIds.length) {
      qtiImportProgress(jobIds);
    }
  };

  useEffect(() => {
    checkProgress();
  }, []);

  useInterval(() => {
    checkProgress();
  }, 1000 * 5);

  return (
    <FlexContainer flexDirection="column" alignItems="column" width="50%">
      <Spin size="large" style={{ top: "40%" }} />
      <TitleWrapper>{t("qtiimport.importinprogress.title")}</TitleWrapper>
      <TextWrapper> {t("qtiimport.importinprogress.description")} </TextWrapper>
    </FlexContainer>
  );
};

ImportInprogress.propTypes = {
  t: PropTypes.func.isRequired
};

export default withNamespaces("qtiimport")(
  connect(
    ({ admin }) => ({
      jobIds: admin.importTest.jobIds,
      status: admin.importTest.status
    }),
    {
      qtiImportProgress: qtiImportProgressAction
    }
  )(ImportInprogress)
);

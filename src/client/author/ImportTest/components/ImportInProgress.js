import React, { useEffect } from "react";
import { withNamespaces } from "@edulastic/localization";
import { Spin } from "antd";
import PropTypes from "prop-types";
import useInterval from "@use-it/interval";
import { connect } from "react-redux";

import TitleWrapper from "../../AssignmentCreate/common/TitleWrapper";
import TextWrapper from "../../AssignmentCreate/common/TextWrapper";
import { FlexContainer, StyledButton } from "./styled";
import {
  qtiImportProgressAction,
  UPLOAD_STATUS,
  getIsSuccessSelector,
  getErrorDetailsSelector,
  getSuccessMessageSelector,
  getJobIdsSelector,
  getUploadStatusSelector,
  setJobIdsAction,
  uploadTestStatusAction
} from "../ducks";

const ImportInprogress = ({
  t,
  qtiImportProgress,
  jobIds,
  status,
  successMessage,
  isSuccess,
  errorDetails,
  uploadTestStatus,
  setJobIds
}) => {
  const checkProgress = () => {
    if (status !== UPLOAD_STATUS.STANDBY && jobIds.length) {
      qtiImportProgress(jobIds);
    }
  };

  const handleRetry = () => {
    setJobIds([]);
    uploadTestStatus(UPLOAD_STATUS.STANDBY);
    sessionStorage.removeItem("qtiTags");
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
      <TextWrapper style={{ color: isSuccess ? "green" : "red", fontWeight: "bold" }}>
        {isSuccess ? successMessage : errorDetails?.message || "Importing Failed retry"}
        {!isSuccess && (
          <p>
            <StyledButton position="relative" onClick={handleRetry}>
              {t("qtiimport.uploadpage.retry")}
            </StyledButton>
          </p>
        )}
      </TextWrapper>
      <TextWrapper> {t("qtiimport.importinprogress.description")} </TextWrapper>
    </FlexContainer>
  );
};

ImportInprogress.propTypes = {
  t: PropTypes.func.isRequired
};

export default withNamespaces("qtiimport")(
  connect(
    state => ({
      jobIds: getJobIdsSelector(state),
      status: getUploadStatusSelector(state),
      successMessage: getSuccessMessageSelector(state),
      isSuccess: getIsSuccessSelector(state),
      errorDetails: getErrorDetailsSelector(state)
    }),
    {
      qtiImportProgress: qtiImportProgressAction,
      setJobIds: setJobIdsAction,
      uploadTestStatus: uploadTestStatusAction
    }
  )(ImportInprogress)
);

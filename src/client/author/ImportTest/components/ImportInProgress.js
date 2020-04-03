import React, { useEffect } from "react";
import { withNamespaces } from "@edulastic/localization";
import { Spin } from "antd";
import PropTypes from "prop-types";
import useInterval from "@use-it/interval";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose } from "redux";
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
  uploadTestStatusAction,
  getIsImportingselector
} from "../ducks";
import {
  contentImportJobIds,
  importingLoaderSelector,
  contentImportSuccessMessage,
  contentImportError,
  uploadContnentStatus,
  contentImportProgressAction,
  isContentImportSuccess,
  uploadContentStatusAction,
  setImportContentJobIdsAction
} from "../../ContentCollections/ducks";

const ImportInprogress = ({
  t,
  qtiImportProgress,
  jobIds,
  status,
  successMessage,
  isSuccess,
  errorDetails,
  uploadTestStatus,
  setJobIds,
  isImporting,
  contentImportProgress,
  location: { pathname: path },
  setUploadContnentStatus,
  setImportContentJobIds,
  history
}) => {
  const checkProgress = () => {
    if (status !== UPLOAD_STATUS.STANDBY && jobIds.length) {
      if (path === "/author/import-content") {
        contentImportProgress(jobIds);
      } else {
        qtiImportProgress(jobIds);
      }
    }
  };

  // TODO: need to handle
  const handleRetry = () => {
    if (path === "/author/import-content") {
      setUploadContnentStatus(UPLOAD_STATUS.INITIATE);
      setImportContentJobIds([]);
      history.push("/author/content/collections");
    } else {
      setJobIds([]);
      uploadTestStatus(UPLOAD_STATUS.STANDBY);
      sessionStorage.removeItem("qtiTags");
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
      <TextWrapper>
        {path === "/author/import-test"
          ? isImporting
            ? t("qtiimport.importinprogress.description")
            : "Please stay on the screen while we are unzipping your files"
          : isImporting
          ? "Files are being processed"
          : "Files are being processed"}
      </TextWrapper>
    </FlexContainer>
  );
};

ImportInprogress.propTypes = {
  t: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const path = state?.router?.location?.pathname || "";
  if (path === "/author/import-content") {
    return {
      status: uploadContnentStatus(state),
      jobIds: contentImportJobIds(state),
      successMessage: contentImportSuccessMessage(state),
      isSuccess: isContentImportSuccess(state),
      errorDetails: contentImportError(state),
      isImporting: importingLoaderSelector(state)
    };
  }

  return {
    jobIds: getJobIdsSelector(state),
    status: getUploadStatusSelector(state),
    successMessage: getSuccessMessageSelector(state),
    isSuccess: getIsSuccessSelector(state),
    errorDetails: getErrorDetailsSelector(state),
    isImporting: getIsImportingselector(state)
  };
};

const enhancedComponent = compose(
  withNamespaces("qtiimport"),
  withRouter,
  connect(
    mapStateToProps,
    {
      qtiImportProgress: qtiImportProgressAction,
      setJobIds: setJobIdsAction,
      uploadTestStatus: uploadTestStatusAction,
      uploadContentStatus: uploadTestStatusAction,
      contentImportProgress: contentImportProgressAction,
      setUploadContnentStatus: uploadContentStatusAction,
      setImportContentJobIds: setImportContentJobIdsAction
    }
  )
);

export default enhancedComponent(ImportInprogress);

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { List } from "antd";
import { withNamespaces } from "@edulastic/localization";

import { FlexContainer, StyledButton } from "./styled";
import TitleWrapper from "../../AssignmentCreate/common/TitleWrapper";
import {
  getJobsDataSelector,
  UPLOAD_STATUS,
  uploadTestStatusAction,
  setJobIdsAction,
  getUploadStatusSelector,
  getJobIdsSelector,
  qtiImportProgressAction
} from "../ducks";
import { compose } from "redux";

const ImportDone = ({ t, jobsData, setJobIds, uploadTestStatus, status, jobIds, qtiImportProgress, history }) => {
  const items = jobsData.flatMap(job => job?.testItems || []) || [];
  const testIds = jobsData.map(({ testId }) => testId);
  useEffect(() => {
    if (status !== UPLOAD_STATUS.STANDBY && jobIds.length) {
      qtiImportProgress(jobIds);
    }
  }, []);
  const continueToTest = () => {
    setJobIds([]);
    uploadTestStatus(UPLOAD_STATUS.STANDBY);
    sessionStorage.removeItem("qtiTags");
    history.push(`/author/tests/tab/review/id/${testIds[0]}`);
  };

  const handleRetry = () => {
    setJobIds([]);
    uploadTestStatus(UPLOAD_STATUS.STANDBY);
    sessionStorage.removeItem("qtiTags");
  };

  const ContinueBtn = (
    <div
      style={{
        textAlign: "center",
        marginTop: 12,
        height: 32,
        lineHeight: "32px"
      }}
    >
      {items.length ? (
        <StyledButton onClick={continueToTest}>Continue</StyledButton>
      ) : (
        <StyledButton onClick={handleRetry}>Retry</StyledButton>
      )}
    </div>
  );

  return (
    <FlexContainer flexDirection="column" width="65%">
      <TitleWrapper>{t("qtiimport.done.title")}</TitleWrapper>
      <List itemLayout="horizontal" loadMore={ContinueBtn}>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>No of questions imported</div>
            <div>{items.length}</div>
          </FlexContainer>
        </List.Item>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>No of questions skipped due to unsupported type</div>
            <div>0</div>
          </FlexContainer>
        </List.Item>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>No of questions skipped due to incomplete question content</div>
            <div>0</div>
          </FlexContainer>
        </List.Item>
      </List>
    </FlexContainer>
  );
};

ImportDone.propTypes = {
  t: PropTypes.func.isRequired,
  jobsData: PropTypes.object.isRequired
};

export default compose(
  withNamespaces("qtiimport"),
  withRouter,
  connect(
    state => ({
      jobsData: getJobsDataSelector(state),
      status: getUploadStatusSelector(state),
      jobIds: getJobIdsSelector(state)
    }),
    {
      uploadTestStatus: uploadTestStatusAction,
      setJobIds: setJobIdsAction,
      qtiImportProgress: qtiImportProgressAction
    }
  )
)(ImportDone);

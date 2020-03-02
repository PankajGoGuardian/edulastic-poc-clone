import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";
import { withRouter } from "react-router";
import BreadCrumb from "../../src/components/Breadcrumb";
import { ContentWrapper, StyledContent } from "./styled";
import UploadTest from "./UploadTest";
import ImportInprogress from "./ImportInProgress";
import ImportDone from "./ImportDone";
import {
  uploadTestStatusAction,
  setJobIdsAction,
  qtiImportProgressAction,
  UPLOAD_STATUS
} from "../ducks";

const ImportTestContent = ({ uploadTestStatus, setJobIds, jobIds, status, qtiImportProgress }) => {
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    const currentStatus = sessionStorage.getItem("testUploadStatus");
    const sessionJobs = sessionStorage.getItem("jobIds");
    if (currentStatus) {
      uploadTestStatus(currentStatus);
      setJobIds(sessionJobs ? JSON.parse(sessionJobs) : []);
    }
  }, []);

  useEffect(() => {
    if (status !== UPLOAD_STATUS.STANDBY && jobIds.length && !isLoading) {
      qtiImportProgress(jobIds);
      setisLoading(true);
    }
  }, [jobIds, status]);

  const breadcrumbData = [
    {
      title: "RECENT ASSIGNMENTS",
      to: "/author/assignments"
    },
    {
      title: "IMPORT TEST",
      to: ""
    }
  ];

  const getComponentBySatus = () => {
    switch (true) {
      case status === UPLOAD_STATUS.STANDBY:
        return <UploadTest />;
      case status === UPLOAD_STATUS.INITIATE:
        return <ImportInprogress />;
      case status === UPLOAD_STATUS.DONE:
        return <ImportDone />;
      default:
        return <UploadTest />;
    }
  };

  return (
    <ContentWrapper>
      <BreadCrumb
        data={breadcrumbData}
        style={{
          position: "static",
          padding: "10px"
        }}
      />

      <StyledContent status={status}>{getComponentBySatus()}</StyledContent>
    </ContentWrapper>
  );
};

ImportTestContent.propTypes = {
  status: PropTypes.string.isRequired,
  jobIds: PropTypes.array.isRequired
};

const mapStateToProps = ({ admin: { importTest } }) => ({
  status: importTest.status,
  jobIds: importTest.jobIds
});

export default withNamespaces("qtiimport")(
  withRouter(
    connect(
      mapStateToProps,
      {
        uploadTestStatus: uploadTestStatusAction,
        setJobIds: setJobIdsAction,
        qtiImportProgress: qtiImportProgressAction
      }
    )(ImportTestContent)
  )
);

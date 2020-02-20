import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";
import { withRouter } from "react-router";
import BreadCrumb from "../../src/components/Breadcrumb";
import { ContentWrapper, StyledContent } from "./styled";
import UploadTest from "./UploadTest";
import ImportInprogress from "./ImportInProgress";
import ImportDone from "./ImportDone";

const ImportTestContent = ({ importTestDetails = {} }) => {
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

  const getComponentBySatus = status => {
    switch (true) {
      case status === "STANDBY":
        return <UploadTest />;
      case status === "INITIATE":
        return <ImportInprogress />;
      case status === "DONE":
        return <ImportDone />;
      default:
        return <UploadTest />;
    }
  };

  const { status } = importTestDetails;

  return (
    <ContentWrapper>
      <BreadCrumb
        data={breadcrumbData}
        style={{
          position: "static",
          padding: "10px"
        }}
      />

      <StyledContent status={status}>{getComponentBySatus(status)}</StyledContent>
    </ContentWrapper>
  );
};

ImportTestContent.propTypes = {
  importTestDetails: PropTypes.object.isRequired
};

const mapStateToProps = ({ admin: { importTest } }) => ({
  importTestDetails: importTest
});

export default withNamespaces("qtiimport")(withRouter(connect(mapStateToProps)(ImportTestContent)));

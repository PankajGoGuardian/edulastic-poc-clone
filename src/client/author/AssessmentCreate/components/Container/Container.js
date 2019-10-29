/* eslint-disable react/prop-types */
import React from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { debounce } from "lodash";
import qs from "query-string";
import { MenuIcon } from "@edulastic/common";

import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import Breadcrumb from "../../../src/components/Breadcrumb";
import Title from "../common/Title";
import CreationOptions from "../CreationOptions/CreationOptions";
import DropArea from "../DropArea/DropArea";
import { receiveTestByIdAction, getTestsLoadingSelector } from "../../../TestPage/ducks";
import {
  createAssessmentRequestAction,
  getAssessmentCreatingSelector,
  percentageUploadedSelector,
  fileInfoSelector,
  setPercentUploadedAction,
  uploadToDriveAction
} from "../../ducks";
import ContainerWrapper from "../../../AssignmentCreate/common/ContainerWrapper";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";

const breadcrumbStyle = {
  position: "static"
};

const testBreadcrumbs = [
  {
    title: "TEST LIBRARY",
    to: "/author/tests"
  },
  {
    title: "Author Test",
    to: "/author/tests/select"
  }
];

const snapquizBreadcrumb = {
  title: "Snapquiz",
  to: ""
};
const creationMethods = {
  SCRATCH: "scratch",
  LIBRARY: "library",
  PDF: "pdf"
};

class Container extends React.Component {
  static propTypes = {
    createAssessment: PropTypes.func.isRequired,
    receiveTestById: PropTypes.func.isRequired,
    creating: PropTypes.bool.isRequired,
    location: PropTypes.func.isRequired,
    assessmentLoading: PropTypes.bool.isRequired
  };

  state = {
    method: undefined
  };

  cancelUpload;

  componentDidMount() {
    const { location, receiveTestById } = this.props;
    const { assessmentId } = qs.parse(location.search);

    if (assessmentId) {
      receiveTestById(assessmentId);
      this.handleSetMethod(creationMethods.PDF)();
    }
  }

  handleSetMethod = method => () => {
    this.setState({ method });
  };

  handleUploadProgress = progressEvent => {
    const { setPercentUploaded } = this.props;
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setPercentUploaded(percentCompleted);
  };

  setCancelFn = _cancelFn => {
    this.cancelUpload = _cancelFn;
  };

  handleUploadPDF = debounce(({ file }) => {
    const { location, createAssessment, isAddPdf = false } = this.props;
    const { assessmentId } = qs.parse(location.search);
    if (file.type !== "application/pdf") {
      return message.error("File format not supported, please select a valid PDF file.");
    }
    if (file.size / 1024000 > 15) {
      return message.error("File size exceeds 15 MB MB limit.");
    }
    createAssessment({
      file,
      assessmentId,
      progressCallback: this.handleUploadProgress,
      isAddPdf,
      cancelUpload: this.setCancelFn
    });
  }, 1000);

  handleCreateBlankAssessment = event => {
    event.stopPropagation();

    const { location, createAssessment, isAddPdf } = this.props;
    const { assessmentId } = qs.parse(location.search);

    createAssessment({ assessmentId, isAddPdf });
  };

  render() {
    let { method } = this.state;
    const newBreadcrumb = [...testBreadcrumbs];
    const {
      creating,
      location,
      assessmentLoading,
      percentageUploaded,
      fileInfo,
      isAddPdf,
      toggleSideBar,
      uploadToDrive
    } = this.props;
    if (location && location.pathname && location.pathname.includes("snapquiz")) {
      method = creationMethods.PDF;
      newBreadcrumb.push(snapquizBreadcrumb);
    }
    if (assessmentLoading) {
      return <Spin />;
    }

    return (
      <>
        {creating && (
          <div
            style={{
              height: "calc(100vh - 96px)",
              position: "absolute",
              width: "calc(100vw - 100px)",
              top: "96px",
              zIndex: "1",
              backgroundColor: "transparent"
            }}
          />
        )}
        <HeaderWrapper justify="flex-start">
          <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
          <Title>New Test</Title>
        </HeaderWrapper>
        <ContainerWrapper>
          <Breadcrumb data={newBreadcrumb} style={breadcrumbStyle} />
          {!method && <CreationOptions />}
          {method === creationMethods.PDF && (
            <DropArea
              loading={creating}
              onUpload={this.handleUploadPDF}
              onCreateBlank={this.handleCreateBlankAssessment}
              percent={percentageUploaded}
              fileInfo={fileInfo}
              isAddPdf={isAddPdf}
              cancelUpload={this.cancelUpload}
              uploadToDrive={uploadToDrive}
            />
          )}
        </ContainerWrapper>
      </>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    state => ({
      creating: getAssessmentCreatingSelector(state),
      assessmentLoading: getTestsLoadingSelector(state),
      percentageUploaded: percentageUploadedSelector(state),
      fileInfo: fileInfoSelector(state)
    }),
    {
      createAssessment: createAssessmentRequestAction,
      receiveTestById: receiveTestByIdAction,
      setPercentUploaded: setPercentUploadedAction,
      toggleSideBar: toggleSideBarAction,
      uploadToDrive: uploadToDriveAction
    }
  )
);

export default enhance(Container);

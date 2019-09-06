import React from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { debounce } from "lodash";
import qs from "query-string";

import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import Breadcrumb from "../../../src/components/Breadcrumb";
import Title from "../common/Title";
import CreationOptions from "../CreationOptions/CreationOptions";
import DropArea from "../DropArea/DropArea";
import { receiveTestByIdAction, getTestsLoadingSelector } from "../../../TestPage/ducks";
import { createAssessmentRequestAction, getAssessmentCreatingSelector, percentageUploadedSelector } from "../../ducks";
import ContainerWrapper from "../../../AssignmentCreate/common/ContainerWrapper";

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

  handleUploadPDF = debounce(({ file }) => {
    const { location, createAssessment } = this.props;
    const { assessmentId } = qs.parse(location.search);
    if (file.size / 1024000 > 15) {
      return message.error("File size exceeds 15 MB MB limit.");
    }
    createAssessment({ file, assessmentId });
  }, 1000);

  handleCreateBlankAssessment = event => {
    event.stopPropagation();

    const { location, createAssessment } = this.props;
    const { assessmentId } = qs.parse(location.search);

    createAssessment({ assessmentId });
  };

  render() {
    let { method } = this.state;
    let newBreadcrumb = [...testBreadcrumbs];
    const { creating, location, assessmentLoading, percentageUploaded } = this.props;
    if (location && location.pathname && location.pathname.includes("snapquiz")) {
      method = creationMethods.PDF;
      newBreadcrumb.push(snapquizBreadcrumb);
    }
    if (assessmentLoading) {
      return <Spin />;
    }

    return (
      <>
        <HeaderWrapper>
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
      percentageUploaded: percentageUploadedSelector(state)
    }),
    {
      createAssessment: createAssessmentRequestAction,
      receiveTestById: receiveTestByIdAction
    }
  )
);

export default enhance(Container);

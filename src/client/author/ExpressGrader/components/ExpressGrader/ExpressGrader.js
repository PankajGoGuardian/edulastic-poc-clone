import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { isEmpty, size } from "lodash";
// actions
import { receiveTestActivitydAction, clearFeedbackResponseAction } from "../../../src/actions/classBoard";

// ducks
import { getTestActivitySelector, getAdditionalDataSelector } from "../../../ClassBoard/ducks";
import { getFeedbackResponseSelector } from "../../../src/selectors/feedback";
// components
import ScoreTable from "../ScoreTable/ScoreTable";
import ScoreCard from "../ScoreCard/ScoreCard";
import QuestionModal from "../QuestionModal/QuestionModal";
import ClassHeader from "../../../Shared/Components/ClassHeader/ClassHeader";
// styled wrappers
import { PaginationInfo, StyledFlexContainer } from "./styled";

class ExpressGrader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: null,
      tableData: null,
      isVisibleModal: false
    };
  }

  componentDidMount() {
    const { loadTestActivity, match, testActivity, additionalData } = this.props;
    if (!size(testActivity) && isEmpty(additionalData)) {
      const { assignmentId, classId } = match.params;
      loadTestActivity(assignmentId, classId);
    }
  }

  static getDerivedStateFromProps(props) {
    const { changedFeedback } = props;
    const newState = { changedFeedback: !isEmpty(changedFeedback) };
    return newState;
  }

  handleCreate = () => {
    const { history, match } = this.props;
    history.push(`${match.url}/create`);
  };

  showQuestionModal = (record, tableData) => {
    this.setState({
      record,
      tableData,
      isVisibleModal: true
    });
  };

  hideQuestionModal = () => {
    const { changedFeedback } = this.state;
    if (changedFeedback) {
      const {
        clearFeedbackResponse,
        loadTestActivity,
        match: {
          params: { assignmentId, classId }
        }
      } = this.props;

      loadTestActivity(assignmentId, classId);
      clearFeedbackResponse();
    }
    this.setState({
      isVisibleModal: false,
      record: null
    });
  };

  isMobile = () => window.innerWidth < 480;

  render() {
    const { testActivity, additionalData, match } = this.props;
    const { isVisibleModal, record, tableData } = this.state;
    const { assignmentId, classId } = match.params;
    const isMobile = this.isMobile();
    return (
      <div>
        <ClassHeader
          classId={classId}
          active="expressgrader"
          assignmentId={assignmentId}
          onCreate={this.handleCreate}
          additionalData={additionalData || {}}
        />
        <StyledFlexContainer justifyContent="space-between">
          <PaginationInfo>
            &lt; <Link to="/author/assignments">RECENTS ASSIGNMENTS</Link> /{" "}
            {additionalData && <a>{additionalData.testName}</a>} / {additionalData && <a>{additionalData.className}</a>}
          </PaginationInfo>
        </StyledFlexContainer>
        {!isMobile && <ScoreTable testActivity={testActivity} showQuestionModal={this.showQuestionModal} />}

        {isMobile && <ScoreCard testActivity={testActivity} />}

        {isVisibleModal && (
          <QuestionModal
            record={record}
            tableData={tableData}
            isVisibleModal={isVisibleModal}
            showQuestionModal={this.showQuestionModal}
            hideQuestionModal={this.hideQuestionModal}
          />
        )}
      </div>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      testActivity: getTestActivitySelector(state),
      additionalData: getAdditionalDataSelector(state),
      changedFeedback: getFeedbackResponseSelector(state)
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      clearFeedbackResponse: clearFeedbackResponseAction
    }
  )
);

export default enhance(ExpressGrader);

ExpressGrader.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  testActivity: PropTypes.array,
  additionalData: PropTypes.object,
  loadTestActivity: PropTypes.func,
  clearFeedbackResponse: PropTypes.func
};

ExpressGrader.defaultProps = {
  history: {},
  match: {},
  testActivity: [],
  additionalData: {},
  loadTestActivity: () => {},
  clearFeedbackResponse: () => {}
};

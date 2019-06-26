import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { isEmpty, size, get } from "lodash";
// actions
import { receiveTestActivitydAction, clearFeedbackResponseAction } from "../../../src/actions/classBoard";

// ducks
import {
  getTestActivitySelector,
  getAdditionalDataSelector,
  getClassResponseSelector
} from "../../../ClassBoard/ducks";
import { getFeedbackResponseSelector } from "../../../src/selectors/feedback";
// components
import ScoreTable from "../ScoreTable/ScoreTable";
import ScoreCard from "../ScoreCard/ScoreCard";
import QuestionModal from "../QuestionModal/QuestionModal";
import ClassHeader from "../../../Shared/Components/ClassHeader/ClassHeader";
import PresentationToggleSwitch from "../../../Shared/Components/PresentationToggleSwitch";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
// styled wrappers
import { PaginationInfo, StyledFlexContainer } from "./styled";
import memoizeOne from "memoize-one";

/**
 *
 * @param {Object[]} activities
 */
const testActivitiesTransform = activities => {
  return activities
    .map((x, index) => ({ ...x, qIndex: index }))
    .filter(x => !x.disabled)
    .map(x => ({ ...x, qids: (x.qids || []).map((id, index) => index + (x.qIndex + 1)) }));
};

const transform = testActivities =>
  testActivities.map(x => ({ ...x, questionActivities: testActivitiesTransform(x.questionActivities) }));

const transformMemoized = memoizeOne(transform);

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
    const {
      testActivity: _testActivity = [],
      additionalData,
      match,
      classResponse = {},
      isPresentationMode
    } = this.props;
    const { isVisibleModal, record, tableData } = this.state;
    const { assignmentId, classId, testActivityId } = match.params;
    const isMobile = this.isMobile();
    const testActivity = transformMemoized(_testActivity);
    const gradeSubject = {
      grade: classResponse.metadata ? classResponse.metadata.grades : [],
      subject: classResponse.metadata ? classResponse.metadata.subjects : []
    };

    return (
      <FeaturesSwitch inputFeatures="expressGrader" actionOnInaccessible="hidden" gradeSubject={gradeSubject}>
        <div>
          <ClassHeader
            classId={classId}
            active="expressgrader"
            assignmentId={assignmentId}
            onCreate={this.handleCreate}
            additionalData={additionalData || {}}
            testActivityId={testActivityId}
          />
          <StyledFlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt; <Link to="/author/assignments">RECENTS ASSIGNMENTS</Link> /{" "}
              {additionalData && <a>{additionalData.testName}</a>} /{" "}
              {additionalData && <a>{additionalData.className}</a>}
            </PaginationInfo>
            <PresentationToggleSwitch />
          </StyledFlexContainer>
          {!isMobile && (
            <ScoreTable
              testActivity={testActivity}
              showQuestionModal={this.showQuestionModal}
              isPresentationMode={isPresentationMode}
            />
          )}

          {isMobile && <ScoreCard testActivity={testActivity} />}

          {isVisibleModal && (
            <QuestionModal
              record={record}
              tableData={tableData}
              isVisibleModal={isVisibleModal}
              showQuestionModal={this.showQuestionModal}
              hideQuestionModal={this.hideQuestionModal}
              isPresentationMode={isPresentationMode}
            />
          )}
        </div>
      </FeaturesSwitch>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      testActivity: getTestActivitySelector(state),
      additionalData: getAdditionalDataSelector(state),
      changedFeedback: getFeedbackResponseSelector(state),
      classResponse: getClassResponseSelector(state),
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false)
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
  clearFeedbackResponse: PropTypes.func,
  isPresentationMode: PropTypes.bool
};

ExpressGrader.defaultProps = {
  history: {},
  match: {},
  testActivity: [],
  additionalData: {},
  loadTestActivity: () => {},
  clearFeedbackResponse: () => {},
  isPresentationMode: false
};

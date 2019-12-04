import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { isEmpty, size, get } from "lodash";
import memoizeOne from "memoize-one";
import { ThemeProvider } from "styled-components";
import { withWindowSizes } from "@edulastic/common";
// actions
import { receiveTestActivitydAction, clearFeedbackResponseAction } from "../../../src/actions/classBoard";
import { clearAnswersAction } from "../../../src/actions/answers";
// ducks
import {
  getSortedTestActivitySelector,
  getAdditionalDataSelector,
  getClassResponseSelector
} from "../../../ClassBoard/ducks";
import HooksContainer from "../../../ClassBoard/components/HooksContainer/HooksContainer";
import { getFeedbackResponseSelector } from "../../../src/selectors/feedback";
// components
import ScoreTable from "../ScoreTable/ScoreTable";
import ScoreCard from "../ScoreCard/ScoreCard";
import QuestionModal from "../QuestionModal/QuestionModal";
import ClassHeader from "../../../Shared/Components/ClassHeader/ClassHeader";
import PresentationToggleSwitch from "../../../Shared/Components/PresentationToggleSwitch";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
// styled wrappers
import { StyledFlexContainer, ExpressGraderDetailContainer } from "./styled";
import ClassBreadBrumb from "../../../Shared/Components/ClassBreadCrumb";

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

  componentWillUnmount() {
    this.props.clearEgAnswers();
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

  isMobile = () => window.innerWidth < 768;

  render() {
    const {
      testActivity: _testActivity = [],
      additionalData,
      match,
      classResponse = {},
      isPresentationMode,
      windowWidth
    } = this.props;
    const { isVisibleModal, record, tableData } = this.state;
    const { assignmentId, classId, testActivityId } = match.params;
    const isMobile = this.isMobile();
    const testActivity = transformMemoized(_testActivity);
    return (
      <FeaturesSwitch inputFeatures="expressGrader" actionOnInaccessible="hidden" groupId={classId}>
        <div>
          <HooksContainer assignmentId={assignmentId} classId={classId} />
          <ClassHeader
            classId={classId}
            active="expressgrader"
            assignmentId={assignmentId}
            onCreate={this.handleCreate}
            additionalData={additionalData || {}}
            testActivityId={testActivityId}
          />
          <ExpressGraderDetailContainer>
            <StyledFlexContainer justifyContent="space-between">
              <ClassBreadBrumb />
              <PresentationToggleSwitch groupId={classId} />
            </StyledFlexContainer>
            {!isMobile && (
              <ScoreTable
                testActivity={testActivity}
                showQuestionModal={this.showQuestionModal}
                isPresentationMode={isPresentationMode}
                windowWidth={windowWidth}
              />
            )}

            {isMobile && <ScoreCard testActivity={testActivity} />}

            {isVisibleModal && (
              <ThemeProvider theme={{ twoColLayout: { first: "75% !important", second: "25% !important" } }}>
                <QuestionModal
                  record={record}
                  tableData={tableData}
                  isVisibleModal={isVisibleModal}
                  showQuestionModal={this.showQuestionModal}
                  hideQuestionModal={this.hideQuestionModal}
                  isPresentationMode={isPresentationMode}
                  groupId={classId}
                  windowWidth={windowWidth}
                />
              </ThemeProvider>
            )}
          </ExpressGraderDetailContainer>
        </div>
      </FeaturesSwitch>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  connect(
    state => ({
      testActivity: getSortedTestActivitySelector(state),
      additionalData: getAdditionalDataSelector(state),
      changedFeedback: getFeedbackResponseSelector(state),
      classResponse: getClassResponseSelector(state),
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false)
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      clearFeedbackResponse: clearFeedbackResponseAction,
      clearEgAnswers: clearAnswersAction
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

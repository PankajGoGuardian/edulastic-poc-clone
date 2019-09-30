/* eslint-disable react/prop-types */
import React from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { isEmpty, get } from "lodash";

import { white } from "@edulastic/colors";
import { IconSelected, IconAddItems, IconReview, IconSettings } from "@edulastic/icons";
import { test } from "@edulastic/constants";
import { withWindowSizes } from "@edulastic/common";
import {
  receiveTestByIdAction,
  getTestEntitySelector,
  getTestsLoadingSelector,
  setTestDataAction,
  publishTestAction,
  getDefaultTestSettingsAction,
  getTestsCreatingSelector,
  updateDocBasedTestAction
} from "../../../TestPage/ducks";
import { getQuestionsArraySelector, getQuestionsSelector } from "../../../sharedDucks/questions";
import { getItemDetailByIdAction } from "../../../src/actions/itemDetail";
import { changeViewAction } from "../../../src/actions/view";
import { getViewSelector } from "../../../src/selectors/view";
import Worksheet from "../Worksheet/Worksheet";
import Description from "../Description/Description";
import Setting from "../../../TestPage/components/Setting";
import TestPageHeader from "../../../TestPage/components/TestPageHeader/TestPageHeader";
import ShareModal from "../../../src/components/common/ShareModal";
import { validateQuestionsForDocBased } from "../../../../common/utils/helpers";
import { proceedPublishingItemAction } from "../../../ItemDetail/ducks";
import WarningModal from "../../../ItemDetail/components/WarningModal";

const { statusConstants } = test;

const tabs = {
  DESCRIPTION: "description",
  WORKSHEET: "edit",
  REVIEW: "review",
  SETTINGS: "settings"
};

const buttons = [
  {
    icon: <IconSelected color={white} width={16} height={16} />,
    value: tabs.DESCRIPTION,
    text: "Description"
  },
  {
    icon: <IconAddItems color={white} width={16} height={16} />,
    value: tabs.WORKSHEET,
    text: "Worksheet"
  },
  {
    icon: <IconReview color={white} width={16} height={16} />,
    value: tabs.REVIEW,
    text: "Review"
  },
  {
    icon: <IconSettings color={white} width={16} height={16} />,
    value: tabs.SETTINGS,
    text: "Settings"
  }
];

class Container extends React.Component {
  static propTypes = {
    receiveTestById: PropTypes.func.isRequired,
    receiveItemDetailById: PropTypes.func.isRequired,
    assessment: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    questionsById: PropTypes.object.isRequired,
    updateDocBasedTest: PropTypes.func.isRequired,
    changeView: PropTypes.func.isRequired,
    currentTab: PropTypes.string.isRequired
  };

  sebPasswordRef = React.createRef();

  state = {
    editEnable: false,
    showShareModal: false
  };

  componentDidMount() {
    const { match, receiveTestById, getDefaultTestSettings } = this.props;
    receiveTestById(match.params.assessmentId);
    getDefaultTestSettings();
    window.onbeforeunload = () => {
      return this.beforeUnload();
    };
  }

  componentWillUnmount() {
    window.onbeforeunload = () => {
      return;
    };
  }

  beforeUnload = () => {
    const {
      assessment: test,
      match: { params },
      userId,
      questionsUpdated,
      updated
    } = this.props;
    const { authors, testItems, status } = test;
    const { editEnable = true } = this.state;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || status === statusConstants.DRAFT);

    if (isEditable && testItems.length > 0 && (updated || questionsUpdated)) {
      return "";
    }
    return;
  };

  componentDidUpdate(prevProps) {
    const { receiveItemDetailById, assessment } = this.props;
    if (assessment._id && !prevProps.assessment._id && assessment._id !== prevProps.assessment._id) {
      const [testItem] = assessment.testItems;
      const testItemId = typeof testItem === "object" ? testItem._id : testItem;
      receiveItemDetailById(testItemId);
    }
  }

  handleChangeCurrentTab = tab => () => {
    const { changeView } = this.props;
    changeView(tab);
  };

  handleSave = async () => {
    const { questions: assessmentQuestions, assessment, updateDocBasedTest } = this.props;
    if (!validateQuestionsForDocBased(assessmentQuestions)) {
      return;
    }
    updateDocBasedTest(assessment._id, assessment, true);
  };

  validateTest = _test => {
    const {
      title,
      subjects,
      grades,
      requirePassword = false,
      assignmentPassword = "",
      safeBrowser,
      sebPassword
    } = _test;
    if (!title) {
      message.error("Name field cannot be empty");
      return false;
    }
    if (isEmpty(grades)) {
      message.error("Grade field cannot be empty");
      return false;
    }
    if (isEmpty(subjects)) {
      message.error("Subject field cannot be empty");
      return false;
    }
    if (requirePassword) {
      if (assignmentPassword.length < 6 || assignmentPassword.length > 25) {
        message.error("Please add a valid password.");
        return false;
      }
    }
    if (safeBrowser && !sebPassword) {
      if (this.sebPasswordRef.current && this.sebPasswordRef.current.input) {
        this.sebPasswordRef.current.input.focus();
      }
      message.error("Please add a valid password.");
      return false;
    }

    return true;
  };

  handlePublishTest = (assignFlow = false) => {
    const { questions: assessmentQuestions, publishTest, assessment, match } = this.props;
    const { _id } = assessment;
    if (!validateQuestionsForDocBased(assessmentQuestions)) {
      return;
    }
    if (this.validateTest(assessment)) {
      publishTest({ _id, oldId: match.params.oldId, test: assessment, assignFlow });
      this.setState({ editEnable: false });
    }
  };

  handleAssign = () => {
    const { questions: assessmentQuestions, assessment, history, match, updated } = this.props;
    const { status } = assessment;
    if (!validateQuestionsForDocBased(assessmentQuestions)) {
      return;
    }
    if (this.validateTest(assessment)) {
      if (status !== statusConstants.PUBLISHED || updated) {
        this.handlePublishTest(true);
      } else {
        const { id } = match.params;
        if (id) {
          history.push(`/author/assignments/${id}`);
        }
      }
    }
  };

  onShareModalChange = () => {
    const { showShareModal } = this.state;
    this.setState({
      showShareModal: !showShareModal
    });
  };

  onEnableEdit = () => {
    this.setState({ editEnable: true });
  };

  renderContent() {
    const { currentTab, assessment, questions, match, questionsById, userId, setTestData } = this.props;

    const { params = {} } = match;
    const { docUrl, annotations, pageStructure, freeFormNotes } = assessment;
    const { editEnable } = this.state;
    const { authors, status } = assessment;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || status === statusConstants.DRAFT);

    const props = {
      docUrl,
      viewMode: currentTab,
      annotations,
      questions,
      questionsById,
      pageStructure,
      freeFormNotes
    };

    switch (currentTab) {
      case tabs.DESCRIPTION:
        return <Description setData={setTestData} assessment={assessment} />;
      case tabs.WORKSHEET:
        return <Worksheet key="worksheet" {...props} />;
      case tabs.REVIEW:
        return <Worksheet key="review" review {...props} />;
      case tabs.SETTINGS:
        return (
          <Setting
            current={currentTab}
            isEditable={isEditable}
            // onShowSource={this.handleNavChange("source")}
            sebPasswordRef={this.sebPasswordRef}
            owner={owner}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const {
      loading,
      assessment: { _id: testId, authors, grades, subjects, testItems, title, status, isUsed },
      userId,
      windowWidth,
      updated,
      creating,
      showWarningModal,
      proceedPublish,
      currentTab
    } = this.props;
    const { editEnable, showShareModal } = this.state;
    const owner = (authors && authors.some(x => x._id === userId)) || !testId;
    const showPublishButton = (status && status !== statusConstants.PUBLISHED && testId && owner) || editEnable;
    const showShareButton = !!testId;
    const showEditButton =
      authors && authors.some(x => x._id === userId) && status && status === statusConstants.PUBLISHED && !editEnable;

    const hasPremiumQuestion = testItems.some(x => !!x.collectionName);
    const gradeSubject = { grades, subjects };

    if (loading) {
      return <Spin />;
    }

    return (
      <>
        <ShareModal
          isVisible={showShareModal}
          testId={testId}
          hasPremiumQuestion={hasPremiumQuestion}
          isPublished={status === statusConstants.PUBLISHED}
          onClose={this.onShareModalChange}
          gradeSubject={gradeSubject}
        />
        <WarningModal visible={showWarningModal} proceedPublish={proceedPublish} />

        <TestPageHeader
          onChangeNav={this.handleChangeCurrentTab}
          current={currentTab}
          onSave={() => this.handleSave("draft")}
          onShare={this.onShareModalChange}
          onPublish={this.handlePublishTest}
          title={title}
          buttons={buttons}
          creating={creating}
          showEditButton={showEditButton}
          owner={owner}
          isUsed={isUsed}
          windowWidth={windowWidth}
          showPublishButton={showPublishButton}
          testStatus={status}
          showShareButton={showShareButton}
          editEnable={editEnable}
          onEnableEdit={this.onEnableEdit}
          // onShowSource={this.handleNavChange("source")}
          onAssign={this.handleAssign}
          updated={updated}
        />
        {this.renderContent()}
      </>
    );
  }
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      assessment: getTestEntitySelector(state),
      userId: get(state, "user.user._id", ""),
      updated: get(state, "tests.updated", false),
      showWarningModal: get(state, ["itemDetail", "showWarningModal"], false),
      questionsUpdated: get(state, "authorQuestions.updated", false),
      loading: getTestsLoadingSelector(state),
      questions: getQuestionsArraySelector(state),
      creating: getTestsCreatingSelector(state),
      questionsById: getQuestionsSelector(state),
      currentTab: getViewSelector(state)
    }),
    {
      receiveTestById: receiveTestByIdAction,
      proceedPublish: proceedPublishingItemAction,
      setTestData: setTestDataAction,
      receiveItemDetailById: getItemDetailByIdAction,
      getDefaultTestSettings: getDefaultTestSettingsAction,
      updateDocBasedTest: updateDocBasedTestAction,
      changeView: changeViewAction,
      publishTest: publishTestAction
    }
  )
);

export default enhance(Container);

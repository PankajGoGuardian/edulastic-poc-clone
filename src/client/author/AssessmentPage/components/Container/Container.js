import React from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { isEmpty, get } from "lodash";

import { white } from "@edulastic/colors";
import { IconSelected, IconAddItems, IconReview, IconSettings } from "@edulastic/icons";
import { questionType, test } from "@edulastic/constants";
import {
  receiveTestByIdAction,
  getTestEntitySelector,
  getTestsLoadingSelector,
  setTestDataAction,
  updateTestAction,
  publishTestAction,
  getDefaultTestSettingsAction,
  getTestsCreatingSelector
} from "../../../TestPage/ducks";
import { getQuestionsArraySelector, getQuestionsSelector } from "../../../sharedDucks/questions";
import { getItemDetailByIdAction, updateItemDetailByIdAction } from "../../../src/actions/itemDetail";
import { changeViewAction } from "../../../src/actions/view";
import { getItemDetailSelector } from "../../../src/selectors/itemDetail";
import { getViewSelector } from "../../../src/selectors/view";
import Worksheet from "../Worksheet/Worksheet";
import Description from "../Description/Description";
import Setting from "../../../TestPage/components/Setting";
import TestPageHeader from "../../../TestPage/components/TestPageHeader/TestPageHeader";
import { withWindowSizes } from "@edulastic/common";
import ShareModal from "../../../src/components/common/ShareModal";

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

const createWidget = ({ id, type, title }) => ({
  widgetType: type === "sectionLabel" ? "resource" : "question",
  type,
  title,
  reference: id,
  tabIndex: 0
});

class Container extends React.Component {
  static propTypes = {
    receiveTestById: PropTypes.func.isRequired,
    receiveItemDetailById: PropTypes.func.isRequired,
    assessment: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    questionsById: PropTypes.object.isRequired,
    updateItemDetailById: PropTypes.func.isRequired,
    currentTestItem: PropTypes.object.isRequired,
    updateTest: PropTypes.func.isRequired,
    changeView: PropTypes.func.isRequired,
    currentTab: PropTypes.string.isRequired
  };
  sebPasswordRef = React.createRef();
  state = {
    saved: false,
    editEnable: false,
    showShareModal: false,
    published: false
  };

  componentDidMount() {
    const { match, receiveTestById, getDefaultTestSettings } = this.props;

    receiveTestById(match.params.assessmentId);
    getDefaultTestSettings();
  }

  componentWillReceiveProps(next) {
    const { receiveItemDetailById, assessment } = this.props;

    if (!assessment._id && next.assessment._id) {
      const [testItem] = next.assessment.testItems;
      const testItemId = typeof testItem === "object" ? testItem._id : testItem;
      receiveItemDetailById(testItemId);
    }
  }

  handleChangeCurrentTab = tab => () => {
    const { changeView } = this.props;
    changeView(tab);
  };

  handleSave = (status = "draft") => {
    const {
      questions: assessmentQuestions,
      assessment,
      currentTestItem,
      updateItemDetailById,
      updateTest
    } = this.props;

    if (!this.validateQuestions(assessmentQuestions)) {
      return;
    }

    const [testItem] = assessment.testItems;
    const testItemId = typeof testItem === "object" ? testItem._id : testItem;
    const resourceTypes = [questionType.VIDEO, questionType.PASSAGE];

    const resources = assessmentQuestions.filter(q => resourceTypes.includes(q.type));
    const questions = assessmentQuestions.filter(q => !resourceTypes.includes(q.type));

    const updatedTestItem = {
      ...currentTestItem,
      authors: undefined,
      public: undefined,
      data: {
        ...currentTestItem.data,
        questions,
        resources
      },
      rows: [
        {
          tabs: [],
          dimension: "100%",
          widgets: assessmentQuestions.map(createWidget)
        }
      ],
      itemLevelScoring: false
    };

    const newAssessment = {
      ...assessment,
      status
    };

    updateTest(assessment._id, newAssessment, true);
    updateItemDetailById(testItemId, updatedTestItem, true, false);
    this.setState({ saved: true, published: false });
  };

  validateTest = test => {
    const {
      title,
      subjects,
      grades,
      requirePassword = false,
      assignmentPassword = "",
      safeBrowser,
      sebPassword
    } = test;
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
    const { publishTest, assessment, match } = this.props;
    const { _id } = assessment;
    if (this.validateTest(assessment)) {
      publishTest({ _id, oldId: match.params.oldId, test: assessment, assignFlow });
      this.setState({ editEnable: false, saved: false, published: true });
    }
  };

  handleAssign = () => {
    const { assessment, history, match } = this.props;
    const { published } = this.state;
    if (published && this.validateTest(assessment)) {
      const { assessmentId } = match.params;
      if (assessmentId) {
        history.push(`/author/assignments/${assessmentId}`);
      }
    }
  };

  onShareModalChange = () => {
    this.setState({
      showShareModal: !this.state.showShareModal
    });
  };

  validateQuestions = questions => {
    if (!questions.length) {
      message.warning("At least one question has to be created before saving assessment");
      return false;
    }

    const correctAnswerPicked = questions
      .filter(question => question.type !== "sectionLabel")
      .every(question => {
        const validationValue = get(question, "validation.validResponse.value");
        if (question.type === "math") {
          return validationValue.every(value => !isEmpty(value.value));
        }
        return !isEmpty(validationValue);
      });

    if (!correctAnswerPicked) {
      message.warning("Correct answers have to be chosen for every question");
      return false;
    }

    return true;
  };

  onEnableEdit = () => {
    this.setState({ editEnable: true });
  };

  renderContent() {
    const { currentTab, assessment, questions, match, questionsById, userId, setTestData } = this.props;

    const { params = {} } = match;
    const { docUrl, annotations, pageStructure } = assessment;
    const { editEnable } = this.state;
    const { authors, status } = assessment;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || status === statusConstants.DRAFT);

    const props = {
      docUrl,
      annotations,
      questions,
      questionsById,
      pageStructure
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
    state => {
      console.log("state in container", state);
      return {
        assessment: getTestEntitySelector(state),
        userId: get(state, "user.user._id", ""),
        loading: getTestsLoadingSelector(state),
        questions: getQuestionsArraySelector(state),
        creating: getTestsCreatingSelector(state),
        questionsById: getQuestionsSelector(state),
        currentTestItem: getItemDetailSelector(state),
        currentTab: getViewSelector(state)
      };
    },
    {
      receiveTestById: receiveTestByIdAction,
      receiveItemDetailById: getItemDetailByIdAction,
      updateItemDetailById: updateItemDetailByIdAction,
      setTestData: setTestDataAction,
      getDefaultTestSettings: getDefaultTestSettingsAction,
      updateTest: updateTestAction,
      changeView: changeViewAction,
      publishTest: publishTestAction
    }
  )
);

export default enhance(Container);

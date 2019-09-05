import React, { PureComponent } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { withRouter } from "react-router-dom";
import { cloneDeep, identity as _identity, isObject as _isObject, uniq as _uniq, isEmpty, get, without } from "lodash";
import uuidv4 from "uuid/v4";
import { withWindowSizes } from "@edulastic/common";
import { test, questionType } from "@edulastic/constants";

import { Content } from "./styled";
import TestPageHeader from "../TestPageHeader/TestPageHeader";
import {
  defaultImage,
  createTestAction,
  receiveTestByIdAction,
  setTestDataAction,
  updateTestAction,
  updateDefaultThumbnailAction,
  setDefaultTestDataAction,
  getTestSelector,
  getTestItemsRowsSelector,
  getTestsCreatingSelector,
  getTestsLoadingSelector,
  publishTestAction,
  getTestStatusSelector,
  setRegradeOldIdAction,
  getTestCreatedItemsSelector,
  getDefaultTestSettingsAction
} from "../../ducks";
import {
  clearSelectedItemsAction,
  getItemsSubjectAndGradeAction,
  getItemsSubjectAndGradeSelector
} from "../AddItems/ducks";
import { loadAssignmentsAction } from "../Assign/ducks";
import { saveCurrentEditingTestIdAction, updateItemsDocBasedByIdAction } from "../../../ItemDetail/ducks";
import { getUserSelector } from "../../../src/selectors/user";
import SourceModal from "../../../QuestionEditor/components/SourceModal/SourceModal";
import ShareModal from "../../../src/components/common/ShareModal";

import AddItems from "../AddItems";
import Review from "../Review";
import Summary from "../Summary";
import Assign from "../Assign";
import Setting from "../Setting";

import { testsApi } from "@edulastic/api";
import { themeColor } from "@edulastic/colors";
import Worksheet from "../../../AssessmentPage/components/Worksheet/Worksheet";
import { getQuestionsSelector, getQuestionsArraySelector } from "../../../sharedDucks/questions";
import { createWidget } from "../../../AssessmentPage/components/Container/Container";

const { getDefaultImage } = testsApi;
const { statusConstants } = test;

class Container extends PureComponent {
  propTypes = {
    createTest: PropTypes.func.isRequired,
    updateTest: PropTypes.func.isRequired,
    receiveTestById: PropTypes.func.isRequired,
    setData: PropTypes.func.isRequired,
    setDefaultData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
    creating: PropTypes.bool.isRequired,
    windowWidth: PropTypes.number.isRequired,
    test: PropTypes.object,
    user: PropTypes.object,
    isTestLoading: PropTypes.bool.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    saveCurrentEditingTestId: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  static defaultProps = {
    test: null,
    user: {}
  };
  sebPasswordRef = React.createRef();
  state = {
    current: "review",
    showModal: false,
    editEnable: false,
    showShareModal: false
  };

  componentDidMount() {
    const {
      match,
      receiveTestById,
      setDefaultData,
      history,
      history: { location },
      clearSelectedItems,
      clearTestAssignments,
      editAssigned,
      createdItems = [],
      setRegradeOldId,
      getDefaultTestSettings
    } = this.props;
    const self = this;
    if (location.hash === "#review") {
      this.handleNavChange("review", true)();
    } else if (createdItems.length > 0) {
      this.setState({ current: "addItems", editEnable: true });
      message.success(
        <span>
          {" "}
          New item has been created and added to the current test. Click{" "}
          <span onClick={() => self.setState({ current: "review" })} style={{ color: themeColor, cursor: "pointer" }}>
            here
          </span>{" "}
          to see it.
        </span>,
        3
      );
    }
    if (match.params.id && match.params.id != "undefined") {
      receiveTestById(match.params.id, true, editAssigned);
    } else {
      this.setState({ current: "description" });
      clearTestAssignments([]);
      clearSelectedItems();
      setDefaultData();
    }

    if (editAssigned) {
      setRegradeOldId(match.params.id);
      this.setState({ editEnable: true });
    } else {
      setRegradeOldId("");
    }
    window.onbeforeunload = () => {
      return this.beforeUnload();
    };
    getDefaultTestSettings();
  }

  beforeUnload = () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      updated
    } = this.props;
    const { authors, testItems } = test;
    const { editEnable } = this.state;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || testStatus === statusConstants.DRAFT);

    if (isEditable && testItems.length > 0 && updated) {
      return "";
    }
    return;
  };
  componentWillUnmount() {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      updated
    } = this.props;
    const { authors, testItems } = test;
    const { editEnable } = this.state;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || testStatus === statusConstants.DRAFT);

    if (isEditable && testItems.length > 0 && updated) {
      this.handleSave(test);
    }
  }

  handleNavChange = (value, firstFlow) => () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      updated
    } = this.props;
    const { authors, testItems = [] } = test;
    const { editEnable } = this.state;
    if (!this.props.test.title.trim().length) {
      return;
    }

    if (value === "source") {
      this.setState({
        showModal: true
      });
      return;
    }

    this.setState({
      current: value
    });
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || testStatus === statusConstants.DRAFT);
    if (isEditable && testItems.length > 0 && updated && !firstFlow) {
      this.handleSave(test);
    }
  };

  handleAssign = () => {
    const { test, history, match, updated } = this.props;
    const { status } = test;
    if (this.validateTest(test)) {
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

  handleAddItems = testItems => {
    const { test, setData } = this.props;
    const newTest = cloneDeep(test);

    newTest.testItems = testItems;

    newTest.scoring.testItems = testItems.map(item => {
      const foundItem = newTest.scoring.testItems.find(({ id }) => item && item._id === id);
      if (!foundItem) {
        return {
          id: item ? item._id : uuidv4(),
          points: 0
        };
      }
      return foundItem;
    });
    setData(newTest);
  };

  handleChangeGrade = grades => {
    const { setData, getItemsSubjectAndGrade, test, itemsSubjectAndGrade } = this.props;
    setData({ ...test, grades });
    getItemsSubjectAndGrade({ subjects: itemsSubjectAndGrade.subjects, grades: [] });
  };

  handleChangeSubject = subjects => {
    const { setData, getItemsSubjectAndGrade, test, itemsSubjectAndGrade, updateDefaultThumbnail } = this.props;
    setData({ ...test, subjects });
    if (test.thumbnail === defaultImage) {
      getDefaultImage({
        subject: subjects[0] || "Other Subjects",
        standard: get(test, "summary.standards[0].identifier", "")
      }).then(thumbnail => updateDefaultThumbnail(thumbnail));
    }
    getItemsSubjectAndGrade({ grades: itemsSubjectAndGrade.grades, subjects: [] });
  };

  handleSaveTestId = () => {
    const { test, saveCurrentEditingTestId } = this.props;
    saveCurrentEditingTestId(test._id);
  };

  renderContent = () => {
    const { test, setData, rows, isTestLoading, userId, match = {}, testStatus, questions, questionsById } = this.props;
    if (isTestLoading) {
      return <Spin />;
    }
    const { params = {} } = match;
    const { current, editEnable } = this.state;
    const { authors, isDocBased, docUrl, annotations, pageStructure } = test;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || testStatus === statusConstants.DRAFT);

    const props = {
      docUrl,
      annotations,
      questions,
      questionsById,
      pageStructure
    };

    switch (current) {
      case "addItems":
        return (
          <AddItems
            onAddItems={this.handleAddItems}
            current={current}
            isEditable={isEditable}
            onSaveTestId={this.handleSaveTestId}
            test={test}
            gotoSummary={this.handleNavChange("description")}
          />
        );
      case "description":
        return (
          <Summary
            onShowSource={this.handleNavChange("source")}
            setData={setData}
            test={test}
            owner={owner}
            current={current}
            isEditable={isEditable}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
          />
        );
      case "review":
        return isDocBased ? (
          <Worksheet key="review" review {...props} />
        ) : (
          <Review
            test={test}
            rows={rows}
            onSaveTestId={this.handleSaveTestId}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            owner={owner}
            isEditable={isEditable}
            current={current}
          />
        );
      case "settings":
        return (
          <Setting
            current={current}
            isEditable={isEditable}
            onShowSource={this.handleNavChange("source")}
            sebPasswordRef={this.sebPasswordRef}
            owner={owner}
          />
        );
      case "worksheet":
        return <Worksheet key="worksheet" {...props} />;
      case "assign":
        return <Assign test={test} setData={setData} current={current} />;
      default:
        return null;
    }
  };

  modifyTest = () => {
    const { user, test, itemsSubjectAndGrade } = this.props;
    const { testItems } = test;
    const newTest = cloneDeep(test);

    newTest.subjects = _uniq([...newTest.subjects, ...itemsSubjectAndGrade.subjects]);
    newTest.grades = _uniq([...newTest.grades, ...itemsSubjectAndGrade.grades]);
    const name = without([user.firstName, user.lastName], undefined, null, "").join(" ");
    newTest.createdBy = {
      id: user._id,
      name
    };

    newTest.testItems = testItems || [];
    newTest.scoring.testItems = (testItems || []).map(item => {
      const foundItem = newTest.scoring.testItems.find(({ id }) => item && item._id === id);
      if (!foundItem) {
        return {
          id: item ? item._id : uuidv4(),
          points: 0
        };
      }
      return foundItem;
    });
    return newTest;
  };

  handleSave = () => {
    const { test, updateTest, createTest, editAssigned } = this.props;
    if (!test.title.trim().length) {
      return message.error("Name field is required");
    }
    const newTest = this.modifyTest();
    if (newTest.safeBrowser && !newTest.sebPassword) {
      if (this.sebPasswordRef.current && this.sebPasswordRef.current.input) {
        this.sebPasswordRef.current.input.focus();
      }

      return message.error("Please add a valid password");
    }
    if (test._id) {
      updateTest(test._id, newTest);
    } else {
      createTest(newTest);
    }
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

  handleDocBasedSave = async () => {
    const { questions: assessmentQuestions, test: assessment, updateItemsDocBasedById, updateTest } = this.props;

    if (!this.validateQuestions(assessmentQuestions)) {
      return;
    }

    const [testItem] = assessment.testItems;
    const testItemId = typeof testItem === "object" ? testItem._id : testItem;
    const resourceTypes = [questionType.VIDEO, questionType.PASSAGE];

    const resources = assessmentQuestions.filter(q => resourceTypes.includes(q.type));
    const questions = assessmentQuestions.filter(q => !resourceTypes.includes(q.type));
    const updatedTestItem = {
      ...testItem,
      public: undefined,
      authors: undefined,
      version: testItem.version,
      isDocBased: true,
      data: {
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
      testItems: [{ _id: testItemId, ...updatedTestItem }]
    };

    await updateItemsDocBasedById(testItemId, updatedTestItem, true, false);
    updateTest(assessment._id, newAssessment, true);
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

  onShareModalChange = () => {
    this.setState({
      showShareModal: !this.state.showShareModal
    });
  };

  handleApplySource = source => {
    const { setData } = this.props;
    try {
      const data = JSON.parse(source);
      setData(data);
      this.setState({
        showModal: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  setShowModal = value => () => {
    this.setState({
      showModal: value
    });
  };

  handlePublishTest = (assignFlow = false) => {
    const { publishTest, test, match } = this.props;
    const { _id } = test;
    if (this.validateTest(test)) {
      const newTest = this.modifyTest();
      publishTest({ _id, oldId: match.params.oldId, test: newTest, assignFlow });
      this.setState({ editEnable: false });
    }
  };

  onEnableEdit = () => {
    this.setState({ editEnable: true });
  };

  renderModal = () => {
    const { test } = this.props;
    const { showModal } = this.state;

    if (showModal) {
      return (
        <SourceModal onClose={this.setShowModal(false)} onApply={this.handleApplySource}>
          {JSON.stringify(test, null, 4)}
        </SourceModal>
      );
    }
  };

  render() {
    const { creating, windowWidth, test, testStatus, userId, updated } = this.props;
    const { showShareModal, current, editEnable } = this.state;
    const { _id: testId, status, authors, grades, subjects, testItems, isDocBased } = test;
    const owner = (authors && authors.some(x => x._id === userId)) || !testId;
    const showPublishButton = (testStatus && testStatus !== statusConstants.PUBLISHED && testId && owner) || editEnable;
    const showShareButton = !!testId;
    const showEditButton =
      authors &&
      authors.some(x => x._id === userId) &&
      testStatus &&
      testStatus === statusConstants.PUBLISHED &&
      !editEnable;

    const hasPremiumQuestion = testItems.some(x => !!x.collectionName);
    const gradeSubject = { grades, subjects };
    return (
      <>
        {this.renderModal()}
        <ShareModal
          isVisible={showShareModal}
          testId={testId}
          hasPremiumQuestion={hasPremiumQuestion}
          isPublished={status === statusConstants.PUBLISHED}
          onClose={this.onShareModalChange}
          gradeSubject={gradeSubject}
        />
        <TestPageHeader
          onChangeNav={this.handleNavChange}
          current={current}
          isDocBased={isDocBased}
          onSave={isDocBased ? this.handleDocBasedSave : this.handleSave}
          onShare={this.onShareModalChange}
          onPublish={this.handlePublishTest}
          title={test.title}
          creating={creating}
          showEditButton={showEditButton}
          owner={owner}
          isUsed={test.isUsed}
          windowWidth={windowWidth}
          showPublishButton={showPublishButton}
          testStatus={testStatus}
          showShareButton={showShareButton}
          editEnable={editEnable}
          onEnableEdit={this.onEnableEdit}
          onShowSource={this.handleNavChange("source")}
          onAssign={this.handleAssign}
          updated={updated}
        />
        <Content>{this.renderContent()}</Content>
      </>
    );
  }
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      test: getTestSelector(state),
      rows: getTestItemsRowsSelector(state),
      creating: getTestsCreatingSelector(state),
      user: getUserSelector(state),
      questions: getQuestionsArraySelector(state),
      questionsById: getQuestionsSelector(state),
      createdItems: getTestCreatedItemsSelector(state),
      isTestLoading: getTestsLoadingSelector(state),
      testStatus: getTestStatusSelector(state),
      userId: get(state, "user.user._id", ""),
      updated: get(state, "tests.updated", false),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state),
      standardsData: get(state, ["standardsProficiencyReducer", "data"], []),
      performanceBandsData: get(state, ["performanceBandDistrict", "profiles"], [])
    }),
    {
      createTest: createTestAction,
      updateTest: updateTestAction,
      receiveTestById: receiveTestByIdAction,
      setData: setTestDataAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction,
      setDefaultData: setDefaultTestDataAction,
      publishTest: publishTestAction,
      updateItemsDocBasedById: updateItemsDocBasedByIdAction,
      clearSelectedItems: clearSelectedItemsAction,
      setRegradeOldId: setRegradeOldIdAction,
      clearTestAssignments: loadAssignmentsAction,
      saveCurrentEditingTestId: saveCurrentEditingTestIdAction,
      getItemsSubjectAndGrade: getItemsSubjectAndGradeAction,
      getDefaultTestSettings: getDefaultTestSettingsAction
    }
  )
);

export default enhance(Container);

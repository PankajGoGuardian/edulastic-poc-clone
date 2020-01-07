import React, { PureComponent } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { withRouter, Prompt } from "react-router-dom";
import { cloneDeep, uniq as _uniq, isEmpty, get, without } from "lodash";
import uuidv4 from "uuid/v4";
import { withWindowSizes } from "@edulastic/common";
import { test as testContants, roleuser } from "@edulastic/constants";
import { testsApi } from "@edulastic/api";
import { themeColor } from "@edulastic/colors";
import { assignmentApi } from "@edulastic/api";

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
  getDefaultTestSettingsAction,
  updateDocBasedTestAction,
  duplicateTestRequestAction,
  getReleaseScorePremiumSelector,
  approveOrRejectSingleTestRequestAction
} from "../../ducks";
import {
  clearSelectedItemsAction,
  getItemsSubjectAndGradeAction,
  getItemsSubjectAndGradeSelector
} from "../AddItems/ducks";
import { loadAssignmentsAction } from "../Assign/ducks";
import {
  saveCurrentEditingTestIdAction,
  updateItemsDocBasedByIdAction,
  getItemDetailByIdAction,
  proceedPublishingItemAction
} from "../../../ItemDetail/ducks";
import { getUserSelector, getUserRole, getCollectionsSelector, getUserFeatures } from "../../../src/selectors/user";
import SourceModal from "../../../QuestionEditor/components/SourceModal/SourceModal";
import ShareModal from "../../../src/components/common/ShareModal";

import AddItems from "../AddItems";
import Review from "../Review";
import Summary from "../Summary";
import Assign from "../Assign";
import Setting from "../Setting";

import Worksheet from "../../../AssessmentPage/components/Worksheet/Worksheet";
import { getQuestionsSelector, getQuestionsArraySelector } from "../../../sharedDucks/questions";
import { validateQuestionsForDocBased } from "../../../../common/utils/helpers";
import WarningModal from "../../../ItemDetail/components/WarningModal";
import { hasUserGotAccessToPremiumItem } from "../../../dataUtils";

const { getDefaultImage } = testsApi;
const { statusConstants, releaseGradeLabels, passwordPolicy: passwordPolicyValues } = testContants;

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
    history: PropTypes.object.isRequired,
    currentTab: PropTypes.string
  };

  static defaultProps = {
    test: null,
    user: {}
    // currentTab: "review"
  };

  sebPasswordRef = React.createRef();

  state = {
    showModal: false,
    editEnable: false,
    showShareModal: false,
    isShowFilter: true
  };

  gotoTab = tab => {
    const { history, match, location } = this.props;
    const { regradeFlow = false, previousTestId = "" } = location?.state || {};
    const id = match.params.id && match.params.id != "undefined" && match.params.id;
    console.log("mathc params are", match.params);
    const oldId = match.params.oldId && match.params.oldId != "undefined" && match.params.oldId;
    let url = `/author/tests/create/${tab}`;
    console.log("this is the one called");
    if ((id && oldId) || regradeFlow) {
      const newTab = previousTestId ? "review" : tab;
      url = `/author/tests/tab/${newTab}/id/${id}/old/${oldId || previousTestId}`;
    } else if (id) {
      url = `/author/tests/tab/${tab}/id/${id}`;
    }
    console.log("url here is", url);
    history.push({
      pathname: url,
      state: history.location.state
    });
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
      getDefaultTestSettings,
      setData,
      userRole,
      isReleaseScorePremium,
      location: _location
    } = this.props;
    const self = this;
    const { showCancelButton = false } = history.location.state || {};
    if (location.hash === "#review") {
      this.handleNavChange("review", true)();
    }
    if (createdItems.length > 0) {
      this.setState({ editEnable: true });
      if (this.props.location?.state?.showItemAddedMessage) {
        message.success(
          <span>
            New item has been created and added to the current test. Click
            <span onClick={() => self.gotoTab("review")} style={{ color: themeColor, cursor: "pointer" }}>
              here
            </span>{" "}
            to see it.
          </span>,
          3
        );
      }
    }

    if (match.params.id && match.params.id != "undefined") {
      receiveTestById(match.params.id, true, editAssigned);
    } else if (!_location?.state?.persistStore) {
      // currently creating test do nothing
      this.gotoTab("description");
      clearTestAssignments([]);
      clearSelectedItems();
      setDefaultData();
      if (userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) {
        setData({ testType: testContants.type.COMMON });
      }
      if (userRole === roleuser.TEACHER && isReleaseScorePremium) {
        setData({ releaseScore: releaseGradeLabels.WITH_RESPONSE });
      }
    }
    if (showCancelButton) {
      this.setState({ editEnable: true });
    }

    if (editAssigned) {
      setRegradeOldId(match.params.id);
    } else {
      setRegradeOldId("");
    }
    window.onbeforeunload = () => {
      return this.beforeUnload();
    };
    getDefaultTestSettings();
  }

  componentDidUpdate(prevProps) {
    const { receiveItemDetailById, test } = this.props;
    if (test._id && !prevProps.test._id && test._id !== prevProps.test._id && test.isDocBased) {
      const testItem = test.itemGroups?.[0].items?.[0] || {};
      const testItemId = typeof testItem === "object" ? testItem._id : testItem;
      receiveItemDetailById(testItemId);
    }
  }

  beforeUnload = () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      questionsUpdated,
      updated
    } = this.props;
    const { authors, itemGroups, isDocBased } = test;
    const { editEnable } = this.state;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || testStatus === statusConstants.DRAFT);

    if (
      isEditable &&
      itemGroups.flatMap(itemGroup => itemGroup.items || []).length > 0 &&
      (updated || (questionsUpdated && isDocBased))
    ) {
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
    const { authors } = test;
    const { editEnable } = this.state;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || testStatus === statusConstants.DRAFT);
  }

  handleNavChange = (value, firstFlow) => () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      updated
    } = this.props;
    const { authors, itemGroups = [] } = test;
    const { editEnable } = this.state;
    if (!this.props.test?.title?.trim()?.length) {
      message.warn("Please enter test name.");
      return;
    }
    if (value === "source") {
      this.setState({
        showModal: true
      });
      return;
    }

    this.gotoTab(value);
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || testStatus === statusConstants.DRAFT);
    if (isEditable && itemGroups.flatMap(itemGroup => itemGroup.items || []).length > 0 && updated && !firstFlow) {
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

  handleChangeGrade = grades => {
    const { setData, getItemsSubjectAndGrade, test, itemsSubjectAndGrade } = this.props;
    setData({ ...test, grades });
    getItemsSubjectAndGrade({ subjects: itemsSubjectAndGrade.subjects, grades: [] });
  };

  handleChangeCollection = (value, options) => {
    const { setData, test } = this.props;
    let _value = options.map(o => ({ name: o.props.title, _id: o.props.value }));
    setData({ ...test, collections: _value });
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
    const {
      test,
      setData,
      rows,
      isTestLoading,
      userId,
      match = {},
      testStatus,
      questions,
      questionsById,
      history
    } = this.props;
    if (isTestLoading) {
      return <Spin />;
    }
    const { params = {} } = match;
    const { showCancelButton = false } = history.location.state || {};
    const { editEnable, isShowFilter } = this.state;
    const current = this.props.currentTab;
    const { authors, isDocBased, docUrl, annotations, pageStructure, freeFormNotes = {} } = test;
    const owner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = owner && (editEnable || testStatus === statusConstants.DRAFT);

    const props = {
      docUrl,
      annotations,
      questions,
      freeFormNotes,
      questionsById,
      pageStructure
    };

    switch (current) {
      case "addItems":
        return (
          <Content>
            <AddItems
              current={current}
              isEditable={isEditable}
              onSaveTestId={this.handleSaveTestId}
              test={test}
              gotoSummary={this.handleNavChange("description")}
              toggleFilter={this.toggleFilter}
              isShowFilter={isShowFilter}
            />
          </Content>
        );
      case "description":
        return (
          <Content>
            <Summary
              onShowSource={this.handleNavChange("source")}
              setData={setData}
              test={test}
              owner={owner}
              current={current}
              isEditable={isEditable}
              onChangeGrade={this.handleChangeGrade}
              onChangeCollection={this.handleChangeCollection}
              onChangeSubjects={this.handleChangeSubject}
              showCancelButton={showCancelButton}
            />
          </Content>
        );
      case "review":
        return isDocBased ? (
          <Content>
            <Worksheet key="review" review {...props} viewMode="review" />
          </Content>
        ) : (
          <Review
            test={test}
            rows={rows}
            onSaveTestId={this.handleSaveTestId}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            onChangeCollection={this.handleChangeCollection}
            owner={owner}
            isEditable={isEditable}
            current={current}
            showCancelButton={showCancelButton}
          />
        );
      case "settings":
        return (
          <Content>
            <Setting
              current={current}
              isEditable={isEditable}
              onShowSource={this.handleNavChange("source")}
              sebPasswordRef={this.sebPasswordRef}
              owner={owner}
              showCancelButton={showCancelButton}
            />
          </Content>
        );
      case "worksheet":
        return (
          <Content>
            <Worksheet key="worksheet" {...props} viewMode="edit" />
          </Content>
        );
      case "assign":
        return (
          <Content>
            <Assign test={test} setData={setData} current={current} />
          </Content>
        );
      default:
        return null;
    }
  };

  modifyTest = () => {
    const { user, test, itemsSubjectAndGrade } = this.props;
    const { itemGroups } = test;
    const newTest = cloneDeep(test);

    newTest.subjects = _uniq([...newTest.subjects, ...itemsSubjectAndGrade.subjects]);
    newTest.grades = _uniq([...newTest.grades, ...itemsSubjectAndGrade.grades]);
    const name = without([user.firstName, user.lastName], undefined, null, "").join(" ");
    newTest.createdBy = {
      id: user._id,
      name
    };

    newTest.scoring.testItems = (itemGroups.flatMap(itemGroup => itemGroup.items || []) || []).map(item => {
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
      updateTest(test._id, { ...newTest, currentTab: this.props.currentTab });
    } else {
      createTest({ ...newTest, currentTab: this.props.currentTab });
    }
  };

  handleDocBasedSave = async () => {
    const { questions: assessmentQuestions, test, updateDocBasedTest } = this.props;

    if (!validateQuestionsForDocBased(assessmentQuestions)) {
      return;
    }
    updateDocBasedTest(test._id, test, true);
  };

  validateTest = test => {
    const {
      title,
      subjects,
      grades,
      passwordPolicy = passwordPolicyValues.REQUIRED_PASSWORD_POLICY_OFF,
      assignmentPassword = "",
      safeBrowser,
      sebPassword
    } = test;
    const { userFeatures } = this.props;
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
    if (passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC) {
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
    if ((userFeatures.isPublisherAuthor || userFeatures.isCurator) && test.collections?.length === 0) {
      message.error("Test is not associated with any collection.");
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
      publishTest({ _id, oldId: match.params.oldId, test: newTest, assignFlow, currentTab: this.props.currentTab });
      this.setState({ editEnable: false });
    }
  };

  onEnableEdit = () => {
    const { test, testStatus, userId, duplicateTest } = this.props;
    const { _id: testId, status, authors, title } = test;
    const canEdit = authors && authors.some(x => x._id === userId);
    if (canEdit) {
      this.handleSave();
    } else {
      duplicateTest({ currentTab: this.props.currentTab, title, _id: testId });
    }

    this.setState({ editEnable: true });
  };

  handleDuplicateTest = async e => {
    e && e.stopPropagation();
    const { history, test } = this.props;
    const duplicateTest = await assignmentApi.duplicateAssignment(test);
    history.push(`/author/tests/${duplicateTest._id}`);
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

  toggleFilter = () => {
    const { isShowFilter } = this.state;

    this.setState({
      isShowFilter: !isShowFilter
    });
  };

  onCuratorApproveOrReject = payload => {
    const { approveOrRejectSingleTestRequestAction } = this.props;
    approveOrRejectSingleTestRequestAction(payload);
  };

  render() {
    const {
      creating,
      windowWidth,
      test,
      testStatus,
      userId,
      updated,
      showWarningModal,
      proceedPublish,
      isTestLoading,
      history,
      collections = [],
      userFeatures
    } = this.props;
    const { showShareModal, editEnable, isShowFilter } = this.state;
    const current = this.props.currentTab;
    const { showCancelButton = false } = history.location.state || {};
    const { _id: testId, status, authors, grades, subjects, itemGroups, isDocBased } = test;
    const owner = (authors && authors.some(x => x._id === userId)) || !testId || userFeatures.isCurator;
    const showPublishButton = (testStatus && testStatus !== statusConstants.PUBLISHED && testId && owner) || editEnable;
    const showShareButton = !!testId;
    const showDuplicateButton = testStatus && testStatus === statusConstants.PUBLISHED && !editEnable && !owner;
    const showEditButton =
      testStatus && testStatus === statusConstants.PUBLISHED && !editEnable && owner && !showCancelButton;

    const testItems = itemGroups.flatMap(itemGroup => itemGroup.items || []) || [];
    const hasPremiumQuestion = !!testItems.find(i => hasUserGotAccessToPremiumItem(i.collections, collections));

    const gradeSubject = { grades, subjects };

    return (
      <>
        <Prompt
          when={!!updated}
          message={loc =>
            loc.pathname.startsWith("/author/tests") || "There are unsaved changes. Are you sure you want to leave?"
          }
        />
        {this.renderModal()}
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
          toggleFilter={this.toggleFilter}
          isShowFilter={isShowFilter}
          isTestLoading={isTestLoading}
          showDuplicateButton={showDuplicateButton}
          handleDuplicateTest={this.handleDuplicateTest}
          showCancelButton={showCancelButton}
          onCuratorApproveOrReject={this.onCuratorApproveOrReject}
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
      showWarningModal: get(state, ["itemDetail", "showWarningModal"], false),
      questionsUpdated: get(state, "authorQuestions.updated", false),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state),
      standardsData: get(state, ["standardsProficiencyReducer", "data"], []),
      performanceBandsData: get(state, ["performanceBandDistrict", "profiles"], []),
      userRole: getUserRole(state),
      isReleaseScorePremium: getReleaseScorePremiumSelector(state),
      collections: getCollectionsSelector(state),
      userFeatures: getUserFeatures(state)
    }),
    {
      createTest: createTestAction,
      proceedPublish: proceedPublishingItemAction,
      updateTest: updateTestAction,
      updateDocBasedTest: updateDocBasedTestAction,
      receiveTestById: receiveTestByIdAction,
      setData: setTestDataAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction,
      setDefaultData: setDefaultTestDataAction,
      publishTest: publishTestAction,
      updateItemsDocBasedById: updateItemsDocBasedByIdAction,
      clearSelectedItems: clearSelectedItemsAction,
      setRegradeOldId: setRegradeOldIdAction,
      clearTestAssignments: loadAssignmentsAction,
      receiveItemDetailById: getItemDetailByIdAction,
      saveCurrentEditingTestId: saveCurrentEditingTestIdAction,
      getItemsSubjectAndGrade: getItemsSubjectAndGradeAction,
      getDefaultTestSettings: getDefaultTestSettingsAction,
      duplicateTest: duplicateTestRequestAction,
      approveOrRejectSingleTestRequestAction
    }
  )
);

Container.displayName = "TestPage";

export default enhance(Container);

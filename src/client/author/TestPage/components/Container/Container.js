import React, { PureComponent } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { withRouter, Prompt } from "react-router-dom";
import { cloneDeep, uniq as _uniq, isEmpty, get, without } from "lodash";
import uuidv4 from "uuid/v4";
import { withWindowSizes, notification } from "@edulastic/common";
import { test as testContants, roleuser } from "@edulastic/constants";
import { testsApi, assignmentApi } from "@edulastic/api";
import { themeColor } from "@edulastic/colors";
import { getAllAssignmentsSelector, fetchAssignmentsByTestAction } from "../../../../publicTest/ducks";

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
  approveOrRejectSingleTestRequestAction,
  updateLastUsedCollectionListAction,
  removeTestEntityAction,
  setEditEnableAction
} from "../../ducks";
import {
  clearSelectedItemsAction,
  getItemsSubjectAndGradeAction,
  getItemsSubjectAndGradeSelector,
  resetPageStateAction
} from "../AddItems/ducks";
import { loadAssignmentsAction, getAssignmentsSelector } from "../Assign/ducks";
import {
  saveCurrentEditingTestIdAction,
  updateItemsDocBasedByIdAction,
  getItemDetailByIdAction,
  proceedPublishingItemAction
} from "../../../ItemDetail/ducks";
import {
  getUserSelector,
  getUserRole,
  getCollectionsSelector,
  getUserFeatures,
  getCollectionsToAddContent,
  isOrganizationDistrictUserSelector
} from "../../../src/selectors/user";
import SourceModal from "../../../QuestionEditor/components/SourceModal/SourceModal";
import ShareModal from "../../../src/components/common/ShareModal";

import AddItems from "../AddItems";
import Review from "../Review";
import Summary from "../Summary";
import Assign from "../Assign";
import Setting from "../Setting";
import GroupItems from "../GroupItems";

import MainWorksheet from "../../../AssessmentPage/components/Worksheet/Worksheet";
import { getQuestionsSelector, getQuestionsArraySelector } from "../../../sharedDucks/questions";
import { validateQuestionsForDocBased } from "../../../../common/utils/helpers";
import { allowDuplicateCheck } from "../../../src/utils/permissionCheck";
import WarningModal from "../../../ItemDetail/components/WarningModal";
import { hasUserGotAccessToPremiumItem, setDefaultInterests } from "../../../dataUtils";
import { getCurrentGroup, getClassIds } from "../../../../student/Reports/ducks";
import { redirectToStudentPage } from "../../../../publicTest/utils";
import { startAssignmentAction, resumeAssignmentAction } from "../../../../student/Assignments/ducks";

const { getDefaultImage } = testsApi;
const {
  statusConstants,
  releaseGradeLabels,
  passwordPolicy: passwordPolicyValues,
  ITEM_GROUP_TYPES,
  ITEM_GROUP_DELIVERY_TYPES
} = testContants;

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
    currentTab: PropTypes.string,
    testStatus: PropTypes.string,
    userId: PropTypes.string,
    updated: PropTypes.bool,
    showWarningModal: PropTypes.bool,
    proceedPublish: PropTypes.func.isRequired,
    clearTestAssignments: PropTypes.func.isRequired,
    editAssigned: PropTypes.bool,
    createdItems: PropTypes.array,
    setRegradeOldId: PropTypes.func.isRequired,
    getDefaultTestSettings: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    userRole: PropTypes.string,
    isReleaseScorePremium: PropTypes.bool,
    receiveItemDetailById: PropTypes.func.isRequired,
    questionsUpdated: PropTypes.bool,
    getItemsSubjectAndGrade: PropTypes.func.isRequired,
    itemsSubjectAndGrade: PropTypes.object,
    collectionsToShow: PropTypes.array,
    updateDefaultThumbnail: PropTypes.func.isRequired,
    questions: PropTypes.array,
    questionsById: PropTypes.object,
    updateDocBasedTest: PropTypes.func.isRequired,
    userFeatures: PropTypes.object.isRequired,
    publishTest: PropTypes.func.isRequired,
    duplicateTest: PropTypes.func.isRequired,
    collections: PropTypes.array,
    approveOrRejectSingleTestRequest: PropTypes.func.isRequired
  };

  static defaultProps = {
    test: null,
    user: {},
    currentTab: "review",
    testStatus: "",
    userId: "",
    updated: false,
    showWarningModal: false,
    editAssigned: false,
    createdItems: [],
    userRole: "teacher",
    isReleaseScorePremium: false,
    questionsUpdated: false,
    itemsSubjectAndGrade: {},
    collectionsToShow: [],
    questions: [],
    questionsById: {},
    collections: []
  };

  sebPasswordRef = React.createRef();

  state = {
    showModal: false,
    showShareModal: false,
    isShowFilter: true,
    showCancelButton: false,
    testLoaded: false,
    disableAlert: false
  };

  gotoTab = tab => {
    const { history, match, location } = this.props;
    const { regradeFlow = false, previousTestId = "" } = location?.state || {};
    const { showCancelButton } = this.state;
    const id = match.params.id && match.params.id != "undefined" && match.params.id;
    const oldId = match.params.oldId && match.params.oldId != "undefined" && match.params.oldId;
    let url = `/author/tests/create/${tab}`;
    if ((id && oldId) || regradeFlow) {
      const newTab = previousTestId ? "review" : tab;
      url = `/author/tests/tab/${newTab}/id/${id}/old/${oldId || previousTestId}`;
    } else if (id) {
      url = `/author/tests/tab/${tab}/id/${id}`;
    }
    // if (tab === "addItems") {
    //   url += `?page=${pageNumber}`;
    // }
    history.push({
      pathname: url,
      state: { ...history.location.state, showCancelButton }
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
      // editAssigned,
      createdItems = [],
      setRegradeOldId,
      getDefaultTestSettings,
      setData,
      userRole,
      isReleaseScorePremium,
      location: _location,
      fetchAssignmentsByTest,
      setEditEnable
    } = this.props;
    if (userRole !== roleuser.STUDENT) {
      const self = this;
      const { showCancelButton = false, editAssigned = false } = history.location.state || this.state;
      if (location.hash === "#review") {
        this.handleNavChange("review", true)();
      }
      if (createdItems.length > 0) {
        setEditEnable(true);
        if (_location?.state?.showItemAddedMessage) {
          const msg = (
            <span>
              New item has been created and added to the current test. Click{" "}
              <span onClick={() => self.gotoTab("review")} style={{ color: themeColor, cursor: "pointer" }}>
                here
              </span>{" "}
              to see it.
            </span>
          );
          notification({ type: "success", msg });
        }
      }

      if (match.params.id && match.params.id != "undefined") {
        this.setState({ testLoaded: false });
        receiveTestById(match.params.id, true, editAssigned);
      } else if (!_location?.state?.persistStore) {
        // currently creating test do nothing
        this.gotoTab("description");
        clearTestAssignments([]);
        clearSelectedItems();
        setDefaultData();
        if (userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) {
          setData({ testType: testContants.type.COMMON, freezeSettings: true });
        }
        if (userRole === roleuser.TEACHER && isReleaseScorePremium) {
          setData({ releaseScore: releaseGradeLabels.WITH_RESPONSE });
        }
      }
      if (showCancelButton) {
        setEditEnable(true);
        this.setState({ showCancelButton });
      }

      if (editAssigned) {
        setRegradeOldId(match.params.id);
      } else {
        setRegradeOldId("");
      }
      if (userRole !== roleuser.EDULASTIC_CURATOR) getDefaultTestSettings();
    } else {
      fetchAssignmentsByTest({ testId: match.params.id });
    }
  }

  componentWillUnmount() {
    const { match, removeTestEntity, resetPageState } = this.props;
    // clear test entity only on edit and regrade flow
    if (match.params.id) removeTestEntity();
    resetPageState();
  }

  componentDidUpdate(prevProps) {
    const {
      receiveItemDetailById,
      test,
      history,
      userId,
      isTestLoading,
      userRole,
      getDefaultTestSettings,
      studentAssignments,
      loadingAssignments,
      startAssignment,
      resumeAssignment,
      setEditEnable,
      editEnable
    } = this.props;

    const { testLoaded, studentRedirected } = this.state;

    if (userRole !== roleuser.STUDENT) {
      if (test._id && !prevProps.test._id && test._id !== prevProps.test._id && test.isDocBased) {
        const testItem = test.itemGroups?.[0].items?.[0] || {};
        const testItemId = typeof testItem === "object" ? testItem._id : testItem;
        receiveItemDetailById(testItemId);
      }
      const { editAssigned = false } = history.location.state || {};

      if (editAssigned && test?._id && !testLoaded && !test.isInEditAndRegrade && !isTestLoading) {
        this.onEnableEdit(true);
      }
      if (editAssigned && test?._id && !editEnable && test.isInEditAndRegrade && !isTestLoading) {
        const canEdit = test.authors?.some(x => x._id === userId);
        if (canEdit) {
          setEditEnable(true);
        }
      }
      if (test._id && !testLoaded && !isTestLoading) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ testLoaded: true });
      }
      if (userRole === roleuser.EDULASTIC_CURATOR && prevProps?.test?._id !== test?._id) {
        getDefaultTestSettings(test);
      }
    } else if (userRole === roleuser.STUDENT) {
      if (!prevProps.loadingAssignments && !loadingAssignments && studentAssignments) {
        // this is to call redirectToStudentPage once, even if multiple props update happend
        if (!studentRedirected) {
          redirectToStudentPage(studentAssignments, history, startAssignment, resumeAssignment, test);
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ studentRedirected: true });
        }
      }
    }
  }

  // Make use of the router Prompt Component. No custom beforeunload method is required.
  beforeUnload = () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      questionsUpdated,
      updated,
      editEnable
    } = this.props;
    const { authors, itemGroups, isDocBased } = test;
    const { disableAlert } = this.state;
    const isOwner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = isOwner && (editEnable || testStatus === statusConstants.DRAFT);
    if (
      isEditable &&
      itemGroups.flatMap(itemGroup => itemGroup.items || []).length > 0 &&
      (updated || (questionsUpdated && isDocBased)) &&
      !disableAlert
    ) {
      return true;
    }
    return false;
  };

  handleNavChange = (value, firstFlow) => () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      updated,
      editEnable
    } = this.props;
    const { authors, itemGroups = [] } = test;
    if (!test?.title?.trim()?.length) {
      notification({ type: "warn", messageKey: "pleaseEnterName" });
      return;
    }
    if (value === "source") {
      this.setState({
        showModal: true
      });
      return;
    }

    this.gotoTab(value);
    const isOwner = (authors && authors.some(x => x._id === userId)) || !params.id;
    const isEditable = isOwner && (editEnable || testStatus === statusConstants.DRAFT);
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
          history.push({
            pathname: `/author/assignments/${id}`,
            state: { fromText: "TEST LIBRARY", toUrl: "/author/tests" }
          });
        }
      }
    }
  };

  handleChangeGrade = grades => {
    const { setData, getItemsSubjectAndGrade, test, itemsSubjectAndGrade } = this.props;
    setData({ ...test, grades });
    setDefaultInterests({ grades });
    getItemsSubjectAndGrade({ subjects: itemsSubjectAndGrade.subjects, grades: [] });
  };

  handleChangeCollection = (_, options) => {
    const { setData, test, collectionsToShow } = this.props;
    const data = {};
    options.forEach(o => {
      if (data[o.props._id]) {
        data[o.props._id].push(o.props.value);
      } else {
        data[o.props._id] = [o.props.value];
      }
    });

    const collectionArray = [];
    for (const [key, value] of Object.entries(data)) {
      collectionArray.push({
        _id: key,
        bucketIds: value
      });
    }

    const orgCollectionIds = collectionsToShow.map(o => o._id);
    const extraCollections = test.collections.filter(c => !orgCollectionIds.includes(c._id));
    setData({ collections: [...collectionArray, ...extraCollections] });
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
    setDefaultInterests({ subject: subjects[0] || "" });
  };

  onChangeSkillIdentifiers = identifiers => {
    const { setData, test } = this.props;
    if (!isEmpty(identifiers)) {
      const metadata = { ...test.metadata, skillIdentifiers: _uniq(identifiers.split(",")) };
      setData({ ...test, metadata });
    }
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
      history,
      updated,
      currentTab,
      userRole,
      editEnable,
      userFeatures
    } = this.props;
    if (isTestLoading) {
      return <Spin />;
    }
    const { params = {} } = match;
    const { showCancelButton = false } = history.location.state || this.state || {};
    const { isShowFilter } = this.state;
    const current = currentTab;
    const { authors, isDocBased, docUrl, annotations, pageStructure, freeFormNotes = {} } = test;
    const isOwner =
      (authors && authors.some(x => x._id === userId)) ||
      !params.id ||
      userRole === roleuser.EDULASTIC_CURATOR ||
      userFeatures.isCurator;
    const isEditable = isOwner && (editEnable || testStatus === statusConstants.DRAFT);

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
              gotoGroupItems={this.handleNavChange("groupItems")}
              toggleFilter={this.toggleFilter}
              isShowFilter={isShowFilter}
              handleSaveTest={this.handleSave}
              updated={updated}
              userRole={userRole}
            />
          </Content>
        );
      case "description":
        return (
          <Content>
            <Summary
              onShowSource={this.handleNavChange("source")} // eslint-disable-next-line react/no-did-update-set-state
              setData={setData}
              test={test}
              owner={isOwner}
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
            <MainWorksheet key="review" review {...props} viewMode="review" />
          </Content>
        ) : (
          <Review
            test={test}
            rows={rows}
            onSaveTestId={this.handleSaveTestId}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            onChangeSkillIdentifiers={this.onChangeSkillIdentifiers}
            onChangeCollection={this.handleChangeCollection}
            owner={isOwner}
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
              owner={isOwner}
              showCancelButton={showCancelButton}
            />
          </Content>
        );
      case "worksheet":
        return (
          <Content>
            <MainWorksheet key="worksheet" {...props} viewMode="edit" />
          </Content>
        );
      case "assign":
        return (
          <Content>
            <Assign test={test} setData={setData} current={current} />
          </Content>
        );
      case "groupItems":
        return (
          <Content>
            <GroupItems />
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
    const {
      test = {},
      updateTest,
      createTest,
      currentTab,
      updateLastUsedCollectionList,
      history,
      testAssignments,
      userRole,
      userFeatures
    } = this.props;
    if (!test?.title?.trim()?.length) {
      notification({ messageKey: "nameFieldRequired" });
      return;
    }
    const newTest = this.modifyTest();
    if (newTest.safeBrowser && !newTest.sebPassword) {
      if (this.sebPasswordRef.current && this.sebPasswordRef.current.input) {
        this.sebPasswordRef.current.input.focus();
      }
      notification({ messageKey: "enterValidPassword" });
      return;
    }

    updateLastUsedCollectionList(test.collections);

    if (test._id) {
      // Push `isInEditAndRegrade` flag in test if a user intentionally editing an assigned in progess test.
      if (
        (history.location.state?.editAssigned || testAssignments.length) &&
        test.isUsed &&
        userRole !== roleuser.EDULASTIC_CURATOR &&
        !userFeatures.isCurator
      ) {
        newTest.isInEditAndRegrade = true;
      }
      updateTest(test._id, { ...newTest, currentTab });
    } else {
      createTest({ ...newTest, currentTab });
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
    const { userFeatures, isOrganizationDistrictUser } = this.props;
    if (!title) {
      notification({ messageKey: "nameShouldNotEmpty" });
      return false;
    }
    if (isEmpty(grades)) {
      notification({ messageKey: "gradeFieldEmpty" });
      return false;
    }
    if (isEmpty(subjects)) {
      notification({ messageKey: "subjectFieldEmpty" });
      return false;
    }
    if (passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC) {
      if (assignmentPassword.length < 6 || assignmentPassword.length > 25) {
        notification({ messageKey: "enterValidPassword" });
        return false;
      }
    }
    if (safeBrowser && !sebPassword) {
      if (this.sebPasswordRef.current && this.sebPasswordRef.current.input) {
        this.sebPasswordRef.current.input.focus();
      }
      notification({ messageKey: "enterValidPassword" });
      return false;
    }
    if (userFeatures.isPublisherAuthor || userFeatures.isCurator || isOrganizationDistrictUser) {
      if (test.collections?.length === 0) {
        notification({ messageKey: "testNotAssociatedWithCollection" });
        return false;
      }
      if (
        test.itemGroups.some(
          itemGroup =>
            itemGroup.type === ITEM_GROUP_TYPES.STATIC &&
            itemGroup.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
            itemGroup.items.length <= itemGroup.deliverItemsCount
        )
      ) {
        notification({ messageKey: "selectedItemsGroupShouldNotBeMoreThanDelivedItems" });
        return false;
      }
    }
    // for itemGroup with limted delivery type should not contain items with question level scoring
    for (const itemGroup in test.itemGroups) {
      if (
        itemGroup.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        itemGroup.items.some(item => item.itemLevelScoring === false)
      ) {
        notification({ msg: `${itemGroup.name} contains items with question level scoring.` });
        return false;
      }
    }

    return true;
  };

  onShareModalChange = () => {
    const { showShareModal } = this.state;
    this.setState({
      showShareModal: !showShareModal
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
    const { publishTest, test, match, currentTab, updateLastUsedCollectionList, setEditEnable } = this.props;
    const { _id } = test;
    if (this.validateTest(test)) {
      const newTest = this.modifyTest();
      publishTest({
        _id,
        oldId: match.params.oldId,
        test: newTest,
        assignFlow,
        currentTab
      });
      setEditEnable(false);
      updateLastUsedCollectionList(test.collections);
    }
  };

  onEnableEdit = onRegrade => {
    const { test, userId, duplicateTest, currentTab, userRole, setEditEnable, userFeatures } = this.props;
    const { _id: testId, authors, title, isUsed } = test;
    const isCurator = userFeatures.isCurator || userRole === roleuser.EDULASTIC_CURATOR;
    const canEdit = (authors && authors.some(x => x._id === userId)) || isCurator;
    setEditEnable(true);
    if (canEdit) {
      return this.handleSave();
    }
    if (!test.isInEditAndRegrade) {
      duplicateTest({ currentTab, title, _id: testId, isInEditAndRegrade: isUsed, onRegrade });
    }
  };

  handleDuplicateTest = async e => {
    e && e.stopPropagation();
    const { history, test, setEditEnable } = this.props;
    const duplicateTest = await assignmentApi.duplicateAssignment({
      _id: test._id,
      title: test.title,
      isInEditAndRegrade: test.isUsed
    });
    history.push(`/author/tests/${duplicateTest._id}`);
    setEditEnable(true);
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
    const { approveOrRejectSingleTestRequest } = this.props;
    approveOrRejectSingleTestRequest(payload);
  };

  setDisableAlert = payload => {
    this.setState({ disableAlert: payload });
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
      collections = [],
      userFeatures,
      currentTab,
      testAssignments,
      userRole,
      editEnable
    } = this.props;
    if (userRole === roleuser.STUDENT) {
      return null;
    }
    const { showShareModal, isShowFilter } = this.state;
    const current = currentTab;
    const { _id: testId, status, authors, grades, subjects, itemGroups, isDocBased } = test;
    const isCurator = userFeatures.isCurator || userRole === roleuser.EDULASTIC_CURATOR;
    const isOwner = authors?.some(x => x._id === userId);
    const showPublishButton =
      (testStatus !== statusConstants.PUBLISHED && testId && (isOwner || isCurator)) || editEnable;
    const showShareButton = !!testId;
    const allowDuplicate = allowDuplicateCheck(test.collections, collections, "test") || isOwner;
    const showDuplicateButton = testStatus === statusConstants.PUBLISHED && !editEnable && allowDuplicate && !isCurator;
    const showEditButton = testStatus === statusConstants.PUBLISHED && !editEnable && (isOwner || isCurator);
    const showCancelButton =
      test.isUsed &&
      !!testAssignments.length &&
      !showEditButton &&
      !showDuplicateButton &&
      (testStatus === "draft" || editEnable);
    const testItems = itemGroups.flatMap(itemGroup => itemGroup.items || []) || [];
    const hasPremiumQuestion = !!testItems.find(i => hasUserGotAccessToPremiumItem(i.collections, collections));

    const gradeSubject = { grades, subjects };

    return (
      <>
        <Prompt
          when={this.beforeUnload()}
          message={loc =>
            loc.pathname.startsWith("/author/tests") || "There are unsaved changes. Are you sure you want to leave?"
          }
        />
        {this.renderModal()}
        <ShareModal
          shareLabel="TEST URL"
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
          title={test?.title || ""}
          creating={creating}
          showEditButton={showEditButton}
          owner={isOwner || isCurator || !testId}
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
          validateTest={this.validateTest}
          setDisableAlert={this.setDisableAlert}
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
      userFeatures: getUserFeatures(state),
      testAssignments: getAssignmentsSelector(state),
      collectionsToShow: getCollectionsToAddContent(state),
      groupId: getCurrentGroup(state),
      classIds: getClassIds(state),
      studentAssignments: getAllAssignmentsSelector(state),
      loadingAssignments: get(state, "publicTest.loadingAssignments"),
      editEnable: get(state, "tests.editEnable"),
      pageNumber: state?.testsAddItems?.page || 1,
      isOrganizationDistrictUser: isOrganizationDistrictUserSelector(state)
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
      approveOrRejectSingleTestRequest: approveOrRejectSingleTestRequestAction,
      updateLastUsedCollectionList: updateLastUsedCollectionListAction,
      removeTestEntity: removeTestEntityAction,
      fetchAssignmentsByTest: fetchAssignmentsByTestAction,
      startAssignment: startAssignmentAction,
      resumeAssignment: resumeAssignmentAction,
      setEditEnable: setEditEnableAction,
      resetPageState: resetPageStateAction
    }
  )
);

Container.displayName = "TestPage";

export default enhance(Container);

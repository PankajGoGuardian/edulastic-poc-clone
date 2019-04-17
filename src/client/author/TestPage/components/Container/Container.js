import React, { PureComponent } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { withRouter } from "react-router-dom";
import { cloneDeep, identity as _identity, isObject as _isObject } from "lodash";
import uuidv4 from "uuid/v4";
import { withWindowSizes } from "@edulastic/common";
import { Content } from "./styled";

import TestPageHeader from "../TestPageHeader/TestPageHeader";
import {
  createTestAction,
  receiveTestByIdAction,
  setTestDataAction,
  updateTestAction,
  setDefaultTestDataAction,
  getTestSelector,
  getTestItemsRowsSelector,
  getTestsCreatingSelector,
  getTestsLoadingSelector,
  publishTestAction,
  getTestStatusSelector,
  setRegradeOldIdAction
} from "../../ducks";
import { getSelectedItemSelector, clearSelectedItemsAction } from "../AddItems/ducks";
import { loadAssignmentsAction } from "../Assign/ducks";
import { saveCurrentEditingTestIdAction } from "../../../ItemDetail/ducks";
import { getUserSelector } from "../../../src/selectors/user";
import SourceModal from "../../../QuestionEditor/components/SourceModal/SourceModal";
import ShareModal from "../../../src/components/common/ShareModal";

import AddItems from "../AddItems";
import Review from "../Review";
import Summary from "../Summary";
import Assign from "../Assign";
import Setting from "../Setting";

const statusConstants = {
  DRAFT: "draft",
  ARCHIVED: "archived",
  PUBLISHED: "published"
};

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
    selectedRows: PropTypes.object,
    test: PropTypes.object,
    user: PropTypes.object,
    isTestLoading: PropTypes.bool.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    saveCurrentEditingTestId: PropTypes.func.isRequired
  };

  static defaultProps = {
    test: null,
    selectedRows: {},
    user: {}
  };

  state = {
    current: "addItems",
    showModal: false,
    editEnable: false,
    showShareModal: false
  };

  componentDidMount() {
    const {
      match,
      receiveTestById,
      setDefaultData,
      history: { location },
      clearSelectedItems,
      clearTestAssignments
    } = this.props;

    if (location.hash === "#review") {
      this.handleNavChange("review")();
    }

    if (match.params.id) {
      receiveTestById(match.params.id);
    } else {
      clearTestAssignments([]);
      clearSelectedItems();
      setDefaultData();
    }

    if (this.props.editAssigned) {
      this.props.setRegradeOldId(match.params.id);
    }
  }

  componentDidUpdate() {
    if (this.props.editAssigned) {
      this.props.setRegradeOldId(this.props.match.params.id);
    }
  }

  handleNavChange = value => () => {
    if (value === "source") {
      this.setState({
        showModal: true
      });
      return;
    }
    this.setState({
      current: value
    });
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
    const { setData, test } = this.props;
    setData({ ...test, grades });
  };

  handleChangeSubject = subjects => {
    const { setData, test } = this.props;
    setData({ ...test, subjects });
  };

  handleSaveTestId = () => {
    const { test, saveCurrentEditingTestId } = this.props;
    saveCurrentEditingTestId(test._id);
  };

  renderContent = () => {
    const { test, setData, rows, isTestLoading } = this.props;
    if (isTestLoading) {
      return <Spin />;
    }
    const { current } = this.state;
    // TODO: fix this shit!!
    const selectedItems = test.testItems.map(item => (_isObject(item) ? item._id : item)).filter(_identity);
    switch (current) {
      case "addItems":
        return (
          <AddItems
            onAddItems={this.handleAddItems}
            selectedItems={selectedItems}
            current={current}
            onSaveTestId={this.handleSaveTestId}
          />
        );
      case "summary":
        return (
          <Summary onShowSource={this.handleNavChange("source")} setData={setData} test={test} current={current} />
        );
      case "review":
        return (
          <Review
            test={test}
            rows={rows}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            current={current}
          />
        );
      case "settings":
        return <Setting current={current} onShowSource={this.handleNavChange("source")} />;
      case "assign":
        return <Assign test={test} setData={setData} current={current} />;
      default:
        return null;
    }
  };

  handleSave = async () => {
    const { selectedRows, user, test, updateTest, createTest } = this.props;
    const testItems = selectedRows.data;
    const newTest = cloneDeep(test);

    newTest.createdBy = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    newTest.testItems = testItems || [];
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
    if (test._id) {
      if (this.props.editAssigned) {
        newTest.versioned = true;
        delete newTest["authors"];
        createTest(newTest);
      } else {
        updateTest(test._id, newTest);
      }
    } else {
      createTest(newTest);
    }
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

  handlePublishTest = () => {
    const { publishTest, test, match } = this.props;
    const { _id } = test;
    publishTest({ _id, oldId: match.params.oldId });
    this.setState({ editEnable: false });
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
    const { creating, windowWidth, test, testStatus } = this.props;
    const { showShareModal, current, editEnable } = this.state;
    const { _id: testId } = test;
    const showPublishButton = (testStatus && testStatus !== statusConstants.PUBLISHED && testId) || editEnable;
    const showShareButton = !!testId;
    return (
      <>
        {this.renderModal()}
        <ShareModal isVisible={showShareModal} onClose={this.onShareModalChange} />
        <TestPageHeader
          onChangeNav={this.handleNavChange}
          current={current}
          onSave={this.handleSave}
          onShare={this.onShareModalChange}
          onPublish={this.handlePublishTest}
          title={test.title}
          creating={creating}
          windowWidth={windowWidth}
          showPublishButton={showPublishButton}
          testStatus={testStatus}
          showShareButton={showShareButton}
          onEnableEdit={this.onEnableEdit}
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
      selectedRows: getSelectedItemSelector(state),
      user: getUserSelector(state),
      isTestLoading: getTestsLoadingSelector(state),
      testStatus: getTestStatusSelector(state)
    }),
    {
      createTest: createTestAction,
      updateTest: updateTestAction,
      receiveTestById: receiveTestByIdAction,
      setData: setTestDataAction,
      setDefaultData: setDefaultTestDataAction,
      publishTest: publishTestAction,
      clearSelectedItems: clearSelectedItemsAction,
      setRegradeOldId: setRegradeOldIdAction,
      clearTestAssignments: loadAssignmentsAction,
      saveCurrentEditingTestId: saveCurrentEditingTestIdAction
    }
  )
);

export default enhance(Container);

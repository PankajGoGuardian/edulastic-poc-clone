import React, { PureComponent } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { withRouter } from "react-router-dom";
import { identity as _identity, isObject as _isObject, uniq as _uniq } from "lodash";
import { withWindowSizes } from "@edulastic/common";
import { Content } from "../../../TestPage/components/Container/styled";

import TestPageHeader from "../../../TestPage/components/TestPageHeader/TestPageHeader";
import {
  createTestAction,
  receivePlaylistByIdAction,
  setTestDataAction,
  updateTestAction,
  setDefaultTestDataAction,
  getPlaylistSelector,
  getTestItemsRowsSelector,
  getTestsCreatingSelector,
  getTestsLoadingSelector,
  getTestStatusSelector,
  createNewModuleAction,
  setRegradeOldIdAction,
  moveContentInPlaylistAction,
  publishPlaylistAction
} from "../../ducks";
import {
  getSelectedItemSelector,
  clearSelectedItemsAction,
  getItemsSubjectAndGradeAction,
  getItemsSubjectAndGradeSelector
} from "../../../TestPage/components/AddItems/ducks";
import { loadAssignmentsAction } from "../../../TestPage/components/Assign/ducks";
import { saveCurrentEditingTestIdAction } from "../../../ItemDetail/ducks";
import { getUserSelector } from "../../../src/selectors/user";
import SourceModal from "../../../QuestionEditor/components/SourceModal/SourceModal";
import ShareModal from "../../../src/components/common/ShareModal";
import CurriculumSequence from "../../../CurriculumSequence/components/CurriculumSequence";
import Summary from "../../../TestPage/components/Summary";
import Setting from "../Settings";
import TestList from "../../../TestList";

const statusConstants = {
  DRAFT: "draft",
  ARCHIVED: "archived",
  PUBLISHED: "published"
};

class Container extends PureComponent {
  propTypes = {
    createPlayList: PropTypes.func.isRequired,
    updateTest: PropTypes.func.isRequired,
    receivePlaylistByIdAction: PropTypes.func.isRequired,
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
    saveCurrentEditingTestId: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  static defaultProps = {
    test: null,
    selectedRows: {},
    user: {}
  };

  state = {
    current: "summary",
    showModal: false,
    textColor: "#ffffff",
    backgroundColor: "#0000ff",
    editEnable: false,
    isTextColorPickerVisible: false,
    isBackgroundColorPickerVisible: false,
    expandedModules: [],
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
    this.handleSave();
    this.setState({
      current: value
    });
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
  handleChangeColor = (type, value) => {
    this.setState({
      [type]: value
    });
  };

  collapseExpandModule = moduleId => {
    const { playlist } = this.props;

    if (!playlist) return null;

    const hasContent =
      playlist.modules.filter((module, index) => {
        if (index === moduleId && module.data && module.data.length > 0) {
          return true;
        }
        return false;
      }).length > 0;

    if (!hasContent) return message.error("Please add some content to this unit.");

    const { expandedModules } = this.state;
    if (expandedModules.indexOf(moduleId) === -1) {
      this.setState({ expandedModules: [...expandedModules, moduleId] });
    } else {
      const newExpandedModules = expandedModules.filter(id => id !== moduleId);
      this.setState({
        expandedModules: newExpandedModules
      });
    }
  };

  onBeginDrag = ({ fromModuleIndex, fromContentId, contentIndex }) => {
    this.setState({
      fromModuleIndex,
      fromContentId,
      fromContentIndex: contentIndex
    });
  };

  onDrop = toModuleIndex => {
    const { fromModuleIndex, fromContentId, fromContentIndex } = this.state;
    const { moveContentInPlaylist } = this.props;
    moveContentInPlaylist({ fromContentId, fromModuleIndex, toModuleIndex, fromContentIndex });
  };

  renderContent = () => {
    const { playlist, setData, rows, isTestLoading, match, history } = this.props;
    if (isTestLoading) {
      return <Spin />;
    }
    const {
      current,
      backgroundColor,
      textColor,
      expandedModules,
      isTextColorPickerVisible,
      isBackgroundColorPickerVisible
    } = this.state;
    const { handleChangeColor } = this;
    // TODO: fix this shit!!
    let selectedTests = [];
    playlist &&
      playlist.modules &&
      playlist.modules.forEach(module => {
        _isObject(module) &&
          module.data.forEach(test => {
            test.contentId && selectedTests.push(test.contentId);
          });
      });
    _uniq(selectedTests);
    switch (current) {
      case "addTests":
        return (
          <TestList
            history={history}
            match={match}
            mode={"embedded"}
            selectedItems={selectedTests}
            current={current}
            onSaveTestId={this.handleSaveTestId}
            playlist={playlist}
          />
        );
      case "summary":
        return (
          <Summary
            onShowSource={this.handleNavChange("source")}
            setData={setData}
            test={playlist}
            current={current}
            isPlaylist={true}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            onChangeColor={handleChangeColor}
            textColor={textColor}
            isTextColorPickerVisible={isTextColorPickerVisible}
            isBackgroundColorPickerVisible={isBackgroundColorPickerVisible}
            backgroundColor={backgroundColor}
          />
        );
      case "review":
        return (
          <CurriculumSequence
            mode={"embedded"}
            destinationCurriculumSequence={playlist}
            expandedModules={expandedModules}
            onCollapseExpand={this.collapseExpandModule}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            onBeginDrag={this.onBeginDrag}
            onDrop={this.onDrop}
            current={current}
          />
        );
      case "settings":
        return <Setting current={current} onShowSource={this.handleNavChange("source")} />;
      default:
        return null;
    }
  };

  handleSave = async () => {
    const { playlist, updatePlaylist, createPlayList } = this.props;

    if (playlist._id) {
      updatePlaylist(playlist._id, playlist);
    } else {
      createPlayList(playlist);
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

  handlePublishPlaylist = () => {
    const { publishPlaylist, playlist, match } = this.props;
    const { grades = [], subjects = [], _id, modules = [] } = playlist;
    if (!_id) {
      return message.error("Save Playlist before publishing");
    }
    if (!grades.length) {
      return message.error("Grade field cannot be empty");
    }
    if (!subjects.length) {
      return message.error("Subject field cannot be empty");
    }
    if (!modules.length) {
      return message.error("Add atleast 1 module");
    }
    this.handleSave();
    publishPlaylist({ _id, oldId: match.params.oldId });
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
    const { creating, windowWidth, playlist, testStatus } = this.props;
    const { showShareModal, current, editEnable } = this.state;
    const { _id: testId } = playlist || {};
    const showPublishButton = (testStatus && testStatus !== statusConstants.PUBLISHED && testId) || editEnable;
    const showShareButton = !!testId;
    return (
      <>
        {this.renderModal()}
        <ShareModal isVisible={showShareModal} testId={testId} isPlaylist={true} onClose={this.onShareModalChange} />
        <TestPageHeader
          onChangeNav={this.handleNavChange}
          current={current}
          onSave={this.handleSave}
          onShare={this.onShareModalChange}
          onPublish={this.handlePublishPlaylist}
          title={playlist.title}
          creating={creating}
          windowWidth={windowWidth}
          showPublishButton={showPublishButton}
          testStatus={testStatus}
          showShareButton={showShareButton}
          onEnableEdit={this.onEnableEdit}
          onShowSource={this.handleNavChange("source")}
          isPlaylist={true}
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
      playlist: getPlaylistSelector(state),
      rows: getTestItemsRowsSelector(state),
      creating: getTestsCreatingSelector(state),
      selectedRows: getSelectedItemSelector(state),
      user: getUserSelector(state),
      isTestLoading: getTestsLoadingSelector(state),
      testStatus: getTestStatusSelector(state),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state)
    }),
    {
      createPlayList: createTestAction,
      updatePlaylist: updateTestAction,
      receiveTestById: receivePlaylistByIdAction,
      setData: setTestDataAction,
      setDefaultData: setDefaultTestDataAction,
      publishPlaylist: publishPlaylistAction,
      clearSelectedItems: clearSelectedItemsAction,
      setRegradeOldId: setRegradeOldIdAction,
      clearTestAssignments: loadAssignmentsAction,
      saveCurrentEditingTestId: saveCurrentEditingTestIdAction,
      addNewModuleToPlaylist: createNewModuleAction,
      moveContentInPlaylist: moveContentInPlaylistAction,
      getItemsSubjectAndGrade: getItemsSubjectAndGradeAction
    }
  )
);

export default enhance(Container);

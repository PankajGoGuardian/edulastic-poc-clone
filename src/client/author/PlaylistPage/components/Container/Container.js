import React, { PureComponent } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { withRouter } from "react-router-dom";
import { identity as _identity, isObject as _isObject, uniq as _uniq } from "lodash";
import { withWindowSizes } from "@edulastic/common";

import { themeColor, white } from "@edulastic/colors";
import { Content } from "../../../TestPage/components/Container/styled";
import { get } from "lodash";
import TestPageHeader from "../../../TestPage/components/TestPageHeader/TestPageHeader";
import {
  createPlaylistAction,
  receivePlaylistByIdAction,
  setTestDataAction,
  updatePlaylistAction,
  setDefaultTestDataAction,
  getPlaylistSelector,
  getTestItemsRowsSelector,
  getTestsCreatingSelector,
  getTestsLoadingSelector,
  getTestStatusSelector,
  createNewModuleAction,
  resequenceModulesAction,
  resequenceTestsAction,
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
import { getUserFeatures } from "../../../../student/Login/ducks";
import SourceModal from "../../../QuestionEditor/components/SourceModal/SourceModal";
import ShareModal from "../../../src/components/common/ShareModal";
import CurriculumSequence from "../../../CurriculumSequence/components/CurriculumSequence";
import Summary from "../../../TestPage/components/Summary";
import Setting from "../Settings";
import TestList from "../../../TestList";
import { CollectionsSelectModal } from "../CollectionsSelectModal/collectionsSelectModal";

const statusConstants = {
  DRAFT: "draft",
  ARCHIVED: "archived",
  PUBLISHED: "published"
};

class Container extends PureComponent {
  propTypes = {
    createPlayList: PropTypes.func.isRequired,
    updatePlaylist: PropTypes.func.isRequired,
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
    editEnable: false,
    isTextColorPickerVisible: false,
    isBackgroundColorPickerVisible: false,
    expandedModules: [],
    showShareModal: false,
    showSelectCollectionsModal: false
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
    if (!this.props.playlist?.title?.trim()?.length) {
      return message.warn("Please enter playlist name.");
    }
    if (value === "source") {
      return this.setState({
        showModal: true
      });
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

  handleChangeCollection = (value, options) => {
    const { setData, test } = this.props;
    let _value = options.map(o => ({
      bucketId: o.props.value,
      _id: o.props._id,
      bucketName: o.props.bucketName,
      collectionName: o.props.collectionName
    }));
    setData({ ...test, collections: _value });
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

  onSortEnd = prop => {
    const { resequenceModules } = this.props;
    resequenceModules(prop);
  };

  handleTestsSort = prop => {
    const { resequenceTests } = this.props;
    resequenceTests(prop);
  };

  renderContent = () => {
    const { playlist, setData, rows, isTestLoading, match, history, userId } = this.props;
    const { authors, _id, bgColor = "", textColor = "" } = playlist;
    const owner = (authors && authors.some(x => x._id === userId)) || !_id;
    if (isTestLoading) {
      return <Spin />;
    }
    const { current, expandedModules, isTextColorPickerVisible, isBackgroundColorPickerVisible } = this.state;
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
            location={history.location}
            match={match}
            mode={"embedded"}
            selectedItems={selectedTests}
            current={current}
            onSaveTestId={this.handleSaveTestId}
            playlist={playlist}
            handleSave={this.handleSave}
            playlistPage
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
            owner={owner}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            onChangeCollection={this.handleChangeCollection}
            onChangeColor={handleChangeColor}
            textColor={textColor || white}
            isTextColorPickerVisible={isTextColorPickerVisible}
            isBackgroundColorPickerVisible={isBackgroundColorPickerVisible}
            backgroundColor={bgColor || themeColor}
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
            history={history}
            onDrop={this.onDrop}
            current={current}
            onSortEnd={this.onSortEnd}
            handleTestsSort={this.handleTestsSort}
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
    if (!playlist?.modules?.length) {
      /**
       * need to save only when at-least a module present
       */
      return;
    }

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
    publishPlaylist({ _id, oldId: match.params.oldId });
    this.setState({ editEnable: false });
  };

  onPublishClick = status => {
    this.setState({ showSelectCollectionsModal: true });
  };

  onOkCollectionsSelectModal = (status, selectedCollections) => {
    this.setState({ showSelectCollectionsModal: false });
    this.handlePublishPlaylist(selectedCollections);
  };

  onCancelCollectionsSelectModal = () => {
    this.setState({ showSelectCollectionsModal: false });
  };

  onCollectionsSelectChange = selectedCollections => {
    const { playlist, setData } = this.props;
    setData({ ...playlist, collections: selectedCollections });
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
    const {
      creating,
      windowWidth,
      playlist,
      testStatus,
      userId,
      location: { state } = {},
      userFeatures = {}
    } = this.props;
    const { showShareModal, current, editEnable, showSelectCollectionsModal } = this.state;
    const { _id: testId, status, authors, grades, subjects, collections } = playlist || {};
    const showPublishButton =
      (testStatus && testStatus !== statusConstants.PUBLISHED && testId) || editEnable || state?.editFlow;
    const showShareButton = !!testId;
    const owner = (authors && authors.some(x => x._id === userId)) || !testId;
    const gradeSubject = { grades, subjects };
    const isPublisher = !!(userFeatures.isCurator || userFeatures.isPublisherAuthor);

    return (
      <>
        {this.renderModal()}
        <CollectionsSelectModal
          isVisible={showSelectCollectionsModal}
          onOk={this.onOkCollectionsSelectModal}
          onCancel={this.onCancelCollectionsSelectModal}
          title={"Collections"}
          onChange={this.onCollectionsSelectChange}
          selectedCollections={collections}
          okText="PUBLISH"
        />
        <ShareModal
          isVisible={showShareModal}
          testId={testId}
          isPlaylist={true}
          isPublished={status === statusConstants.PUBLISHED}
          onClose={this.onShareModalChange}
          gradeSubject={gradeSubject}
        />
        <TestPageHeader
          onChangeNav={this.handleNavChange}
          current={current}
          onSave={this.handleSave}
          onShare={this.onShareModalChange}
          onPublish={isPublisher ? this.onPublishClick : this.handlePublishPlaylist}
          title={playlist.title}
          creating={creating}
          windowWidth={windowWidth}
          showPublishButton={showPublishButton}
          testStatus={testStatus}
          showShareButton={showShareButton}
          editEnable={editEnable}
          onEnableEdit={this.onEnableEdit}
          owner={owner}
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
      userId: get(state, "user.user._id", ""),
      isTestLoading: getTestsLoadingSelector(state),
      userFeatures: getUserFeatures(state),
      testStatus: getTestStatusSelector(state),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state)
    }),
    {
      createPlayList: createPlaylistAction,
      updatePlaylist: updatePlaylistAction,
      receiveTestById: receivePlaylistByIdAction,
      setData: setTestDataAction,
      setDefaultData: setDefaultTestDataAction,
      publishPlaylist: publishPlaylistAction,
      clearSelectedItems: clearSelectedItemsAction,
      setRegradeOldId: setRegradeOldIdAction,
      clearTestAssignments: loadAssignmentsAction,
      saveCurrentEditingTestId: saveCurrentEditingTestIdAction,
      addNewModuleToPlaylist: createNewModuleAction,
      resequenceModules: resequenceModulesAction,
      resequenceTests: resequenceTestsAction,
      moveContentInPlaylist: moveContentInPlaylistAction,
      getItemsSubjectAndGrade: getItemsSubjectAndGradeAction
    }
  )
);

export default enhance(Container);

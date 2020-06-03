import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { groupBy, isEqual, uniqueId, pick } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as moment from "moment";
import { FlexContainer, MainContentWrapper, withWindowSizes } from "@edulastic/common";
import { curriculumSequencesApi } from "@edulastic/api";
import { smallDesktopWidth, desktopWidth, themeColor, extraDesktopWidthMax } from "@edulastic/colors";
import { roleuser } from "@edulastic/constants";
import { Modal, message, Spin } from "antd";

import { getCurrentGroup, getUserFeatures } from "../../../student/Login/ducks";
import { getFilteredClassesSelector } from "../../../student/ManageClass/ducks";
import { getRecentPlaylistSelector } from "../../Playlist/ducks";
import { removeTestFromModuleAction } from "../../PlaylistPage/ducks";
import { getCollectionsSelector, getUserRole, isPublisherUserSelector } from "../../src/selectors/user";
import {
  addNewUnitAction,
  changeGuideAction,
  saveCurriculumSequenceAction,
  saveGuideAlignmentAction,
  setDataForAssignAction,
  setGuideAction,
  setPublisherAction,
  setSelectedItemsForAssignAction,
  useThisPlayListAction,
  playlistTestRemoveFromModuleAction,
  toggleManageContentActiveAction,
  updateDestinationCurriculumSequenceRequestAction,
  resetDestinationAction,
  duplicateManageContentAction,
  cancelPlaylistCustomizeAction,
  publishCustomizedPlaylistAction,
  toggleManageModulesVisibilityCSAction,
  setEmbeddedVideoPreviewModal as setEmbeddedVideoPreviewModalAction,
  setShowRightSideAction,
  setActiveRightPanelViewAction
} from "../ducks";
import { getSummaryData } from "../util";
/* eslint-enable */
import Curriculum from "./Curriculum";
import Insights from "./Insights";
import CurriculumSequenceModals from "./modals";
import Differentiation from "./Differentiation";
import { getDateKeysSelector } from "../../../student/StudentPlaylist/ducks";
import { submitLTIForm } from "./CurriculumModuleRow"; // Fix ME : Needs refactor
import CurriculumHeader from "./CurriculumHeaders";
import CurriculumSubHeader from "./CurriculumHeaders/CurriculumSubHeader";
import CurriculumBreadCrumb from "./CurriculumHeaders/BreadCrumb";
import CurriculumRightPanel from "./CurriculumRightPanel";

/** @typedef {object} ModuleData
 * @property {String} contentId
 * @property {String} createdDate
 * @property {Object} derivedFrom
 * @property {String} id
 * @property {Number} index
 * @property {String} name
 * @property {String} standards
 * @property {String} type
 * @property {boolean} assigned
 * @property {String} testId
 */

/** @typedef {object} CreatedBy
 * @property {String} email
 * @property {String} firstName
 * @property {String} id
 * @property {String} lastName
 */

/**
 * @typedef {object} Module
 * @property {String} customized
 * @property {ModuleData[]} data
 * @property {String} id
 * @property {String} name
 * @property {boolean} assigned
 * @property {boolean=} completed
 */

/**
 * @typedef {("guide"|"content")} CurriculumType
 */

/**
 * @typedef {object} CurriculumSequenceType
 * @property {CreatedBy} createdBy
 * @property {String} createdDate
 * @property {Object} derivedFrom
 * @property {String} description
 * @property {String} id
 * @property {String} _id
 * @property {Module[]} modules
 * @property {String} status
 * @property {String} thumbnail
 * @property {String} title
 * @property {CurriculumType} type
 * @property {String} updatedDate
 */

/**
 * @typedef {object} CurriculumSearchResult
 * @property {string} _id
 * @property {string} title
 */

/**
 * @typedef {object} CurriculumSequenceProps
 * @property {function} onCollapseExpand
 * @property {string[]} expandedModules
 * @property {boolean} selectContent
 * @property {function} onSelectContent
 * @property {CurriculumSequenceType} destinationCurriculumSequence
 * @property {CurriculumSequenceType} sourceCurriculumSequence
 * @property {CurriculumSequenceType[]} curriculumList
 * @property {function} saveCurriculumSequence
 * @property {function} addNewUnitToDestination
 * @property {function} onDrop
 * @property {function} onBeginDrag
 * @property {function} onPublisherChange
 * @property {function} onPublisherSave
 * @property {function} onUseThisClick
 * @property {CurriculumSearchResult[]} curriculumGuides
 * @property {string} publisher
 * @property {string} guide
 * @property {function} setPublisher
 * @property {function} setGuide
 * @property {function} saveGuideAlignment
 * @property {boolean} isContentExpanded
 * @property {function} setSelectedItemsForAssign
 * @property {any[]} selectedItemsForAssign
 * @property {import('./ducks').AssignData} dataForAssign
 */

const EUREKA_PUBLISHER = "Eureka Math";

/** @extends Component<CurriculumSequenceProps> */
class CurriculumSequence extends Component {
  state = {
    addUnit: false,
    addCustomContent: false,
    curriculumGuide: false,
    value: EUREKA_PUBLISHER,
    /** @type {Module | {}} */
    newUnit: {},
    selectedGuide: "",
    assignModal: false,
    assignModalData: {
      startDate: moment(),
      endDate: moment(),
      openPolicy: "Automatically on Start Date",
      closePolicy: "Automatically on Due Date",
      class: []
    },
    showConfirmRemoveModal: false,
    isPlayListEdited: false,
    dropPlaylistModalVisible: false,
    curatedStudentPlaylists: [],
    showSummary: false,
    showRightPanel: true,
    isVisibleAddModule: false,
    moduleForEdit: {}
  };

  static getDerivedStateFromProps(props, state) {
    const { studentPlaylists, classId, destinationCurriculumSequence, useThisPlayList, isStudent } = props;

    /* -- curated playlists (based on classId)-- start */
    const mappedStudentPlaylists = groupBy(
      studentPlaylists.filter(playlist => !classId || playlist.groupId === classId),
      "playlistId"
    );
    Object.entries(mappedStudentPlaylists).forEach(([playlistId, playlists]) => {
      playlists[0].groupIds = [playlists[0].groupId];
      mappedStudentPlaylists[playlistId] = playlists.reduce((res, ele) => {
        res.groupIds.push(ele.groupId);
        return res;
      });
      if (!classId && mappedStudentPlaylists[playlistId]?.groupIds.includes(classId)) {
        mappedStudentPlaylists[playlistId].groupId = classId;
      }
    });
    const curatedStudentPlaylists = Object.values(mappedStudentPlaylists);
    if (
      Object.keys(destinationCurriculumSequence).length &&
      curatedStudentPlaylists.length &&
      !isEqual(curatedStudentPlaylists, state.curatedStudentPlaylists) &&
      !mappedStudentPlaylists[destinationCurriculumSequence._id]
    ) {
      const { playlistId: _id, title, grades, subjects, customize = null } = curatedStudentPlaylists[0];
      useThisPlayList({ _id, title, grades, subjects, groupId: classId, onChange: true, isStudent, customize });
    }
    /* -- curated playlists -- end  */

    // return updated state
    return { curatedStudentPlaylists };
  }

  handlePlaylistChange = ({ _id, title, grades, subjects, groupId }) => {
    const { useThisPlayList, isStudent, classId } = this.props;
    this.handleGuideCancel();
    useThisPlayList({ _id, title, grades, subjects, groupId: classId || groupId, onChange: true, isStudent });
  };

  onExplorePlaylists = () => {
    const { history } = this.props;
    history.push("/author/playlists");
  };

  handleSaveClick = evt => {
    const { saveCurriculumSequence } = this.props;
    evt.preventDefault();
    saveCurriculumSequence();
  };

  handleCustomizeClick = async () => {
    const {
      history,
      destinationCurriculumSequence: { status, _id, title }
    } = this.props;
    if (status === "draft") {
      return history.push(`/author/playlists/${_id}/edit`);
    }
    const duplicatePlayList = await curriculumSequencesApi.duplicatePlayList({ _id, title });
    history.push(`/author/playlists/${duplicatePlayList._id}/edit`);
  };

  handleUseThisClick = () => {
    const {
      destinationCurriculumSequence,
      useThisPlayList,
      match: {
        params: { id: _id }
      }
    } = this.props;
    const { title, grades, subjects, customize = null } = destinationCurriculumSequence;
    useThisPlayList({ _id, title, grades, subjects, customize, fromUseThis: true });
  };

  handleAddUnitOpen = () => {
    const { newUnit } = { ...this.state };
    const { destinationCurriculumSequence } = this.props;

    newUnit.id = uniqueId();
    newUnit.data = [];
    [newUnit.afterUnitId] = destinationCurriculumSequence
      ? destinationCurriculumSequence.modules.map(module => module.id)
      : [];

    this.setState(prevState => ({ addUnit: !prevState.addUnit, newUnit }));
  };

  handleAddCustomContent = () => {
    this.setState(prevState => ({ addCustomContent: !prevState.addCustomContent }));
  };

  handleSelectContent = () => {
    const { onSelectContent } = this.props;
    onSelectContent();
  };

  handleAddUnit = () => {
    this.setState(prevState => ({ addUnit: !prevState.addUnit }));
  };

  handleGuidePopup = () => {
    this.setState(prevState => ({ curriculumGuide: !prevState.curriculumGuide }));
  };

  handleGuideCancel = () => {
    this.setState({ curriculumGuide: false });
  };

  addNewUnitToDestination = newUnit => {
    const { addNewUnitToDestination } = this.props;

    /** @type {String} */
    const { afterUnitId } = newUnit;
    delete newUnit.afterUnitId;

    addNewUnitToDestination({ afterUnitId, newUnit });

    this.setState({ newUnit: {}, addUnit: false });
  };

  onGuideChange = wrappedId => {
    const { setGuide } = this.props;
    const id = wrappedId[0];
    setGuide(id);
  };

  handleEditClick = () => {
    const {
      history,
      destinationCurriculumSequence: { _id }
    } = this.props;
    return history.push({ pathname: `/author/playlists/${_id}/edit`, state: { editFlow: true } });
  };

  onCloseConfirmRemoveModal = () => {
    this.setState({ showConfirmRemoveModal: false });
  };

  handleRemoveTest = (removeModuleIndex, removeTestId) => {
    const {
      history: {
        location: { state = {} }
      }
    } = this.props;
    const { editFlow } = state;
    const { removeTestFromPlaylist } = this;
    if (editFlow) {
      this.setState({ removeModuleIndex, removeTestId, showConfirmRemoveModal: true });
    } else {
      this.setState({ removeModuleIndex, removeTestId }, () => removeTestFromPlaylist(removeModuleIndex, removeTestId));
    }
  };

  removeTestFromPlaylist = () => {
    const { removeModuleIndex, removeTestId } = this.state;
    const { removeTestFromModule } = this.props;
    removeTestFromModule({ moduleIndex: removeModuleIndex, itemId: removeTestId });
    this.setState({ showConfirmRemoveModal: false });
  };

  onApproveClick = () => {
    const { onCuratorApproveOrReject, destinationCurriculumSequence } = this.props;
    const { _id, collections = [] } = destinationCurriculumSequence;
    onCuratorApproveOrReject({ playlistId: _id, status: "published", collections });
  };

  onRejectClick = () => {
    const { onCuratorApproveOrReject, destinationCurriculumSequence } = this.props;
    const { _id } = destinationCurriculumSequence;
    onCuratorApproveOrReject({ playlistId: _id, status: "rejected" });
  };

  openDropPlaylistModal = () => this.setState({ dropPlaylistModalVisible: true });

  closeDropPlaylistModal = () => this.setState({ dropPlaylistModalVisible: false });

  handleNavChange = value => () => {
    const { history, match } = this.props;
    const url = `/author/playlists/${value}/${match?.params?.id}/use-this`;
    // this.handleSave();
    history.push(url);
  };

  toggleManageContentClick = (contentName = "") => () => {
    const {
      destinationCurriculumSequence,
      currentUserId,
      activeRightPanel,
      duplicateManageContent,
      role,
      isStudent,
      setShowRightPanel,
      current
    } = this.props;
    const { authors } = destinationCurriculumSequence;
    const canEdit = authors?.find(x => x._id === currentUserId) || role === roleuser.EDULASTIC_CURATOR;

    const isManageContentActive = activeRightPanel === "manageContent";
    setShowRightPanel(true);

    // if (isManageContentActive && manageContentDirty) {
    //   message.warn("Changes left unsaved. Please save it first");
    //   return;
    // }
    const isAuthoringFlowReview = current === "review";
    if (!isManageContentActive && !canEdit && !isStudent && contentName === "manageContent" && !isAuthoringFlowReview) {
      Modal.confirm({
        title: "Do you want to Customize ?",
        content:
          "Customizing the playlist will unlink from original source. Any updates made by the owner of the playlist will not be visible anymore. Do you want to continue?",
        onOk: () => {
          duplicateManageContent(destinationCurriculumSequence);
          Modal.destroyAll();
        },
        okText: "Continue",
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor, outline: "none" }
        }
      });
    } else {
      this.props?.toggleManageContent(contentName);
    }
  };

  handleCheckout = () => {
    const { history, match } = this.props;
    const { playlistId } = match.params;
    return history.push(`/home/playlist/${playlistId}/recommendations`);
  };

  showLtiResource = async (contentId, resource) => {
    resource = resource && pick(resource, ["toolProvider", "url", "customParams", "consumerKey", "sharedSecret"]);
    const { playlistId, module } = this.props;
    try {
      const signedRequest = await curriculumSequencesApi.getSignedRequest({
        playlistId,
        moduleId: module?._id,
        contentId,
        resource
      });
      submitLTIForm(signedRequest);
    } catch (e) {
      message.error("Failed to load the resource");
    }
  };

  hideRightpanel = () => {
    const { toggleManageContent, setShowRightPanel } = this.props;
    setShowRightPanel(false);
    toggleManageContent("");
  };

  closeAddModuleModal = () => {
    this.setState({ isVisibleAddModule: false, moduleForEdit: {} });
  };

  openAddModuleModal = () => {
    this.setState({ isVisibleAddModule: true });
  };

  editModule = (moduleIndex, module) => {
    this.setState({ moduleForEdit: { moduleIndexForEdit: moduleIndex, module }, isVisibleAddModule: true });
  };

  deleteModule = moduleIndex => {
    this.setState({ moduleForEdit: { moduleIndexForDelete: moduleIndex }, isVisibleAddModule: true });
  };

  componentDidMount() {
    const { current, setActiveRightPanelView, urlHasUseThis, setShowRightPanel } = this.props;
    const isAuthoringFlowReview = current === "review";
    if (isAuthoringFlowReview) {
      setActiveRightPanelView("manageContent");
    } else if (!urlHasUseThis) {
      setShowRightPanel(true);
      setActiveRightPanelView("summary");
    }
  }

  checkWritePermission = () => {
    const { destinationCurriculumSequence, currentUserId } = this.props;
    // Plsylist is being authored - editFlow
    if (!destinationCurriculumSequence.authors) return true;
    return !!destinationCurriculumSequence.authors?.find(x => x?._id === currentUserId);
  };

  render() {
    const { handleRemoveTest, removeTestFromPlaylist, onCloseConfirmRemoveModal } = this;

    const {
      addUnit,
      addCustomContent,
      curriculumGuide,
      newUnit,
      showConfirmRemoveModal,
      dropPlaylistModalVisible,
      curatedStudentPlaylists,
      isVisibleAddModule,
      moduleForEdit
    } = this.state;

    const {
      loading,
      expandedModules,
      onCollapseExpand,
      destinationCurriculumSequence,
      windowWidth,
      selectContent,
      onDrop,
      onBeginDrag,
      onSortEnd,
      current,
      isContentExpanded,
      mode,
      handleSavePlaylist,
      recentPlaylists,
      onShareClick,
      history,
      handleTestsSort,
      features,
      urlHasUseThis,
      isPublisherUser,
      isStudent,
      isTeacher,
      role,
      playlistMetricsList,
      studentPlaylists,
      match,
      manageContentDirty,
      updateDestinationPlaylist,
      collections,
      dateKeys,
      resetDestination,
      cancelPlaylistCustomize,
      publishCustomizedPlaylist,
      activeRightPanel,
      setEmbeddedVideoPreviewModal,
      isVideoResourcePreviewModal,
      fromPlaylist,
      droppedItemId,
      showRightPanel,
      location
    } = this.props;
    const isManageContentActive = activeRightPanel === "manageContent";
    // check Current user's edit permission
    const hasEditAccess = this.checkWritePermission();
    const isNotStudentOrParent = !(role === "student" || role === "parent");

    // figure out which tab contents to render || just render default playlist
    const currentTab = match?.params?.currentTab || "playlist";

    // get active classes for student playlists
    const playlistClassList = [...new Set(studentPlaylists.map(playlist => playlist.groupId))];

    // show all recent playlists in changePlaylistModal
    const slicedRecentPlaylists = recentPlaylists || [];

    const { handleUseThisClick, handleEditClick } = this;
    // Options for add unit
    const options1 = destinationCurriculumSequence.modules
      ? destinationCurriculumSequence.modules.map(module => ({
          value: module.id,
          label: module.name
        }))
      : [];

    // TODO: change options2 to something more meaningful
    const options2 = [{ value: "Lesson", label: "Lesson" }, { value: "Lesson 2", label: "Lesson 2" }];

    const { status, customize = true, modules, collections: _playlistCollections = [] } = destinationCurriculumSequence;
    const sparkCollection = collections.find(c => c.name === "Spark Math" && c.owner === "Edulastic Corp") || {};
    const isSparkMathPlaylist = _playlistCollections.some(item => item._id === sparkCollection?._id);

    const getplaylistMetrics = () => {
      const temp = {};
      modules?.forEach(({ _id: moduleId }) => {
        temp[moduleId] = playlistMetricsList.filter(x => x.playlistModuleId === moduleId);
      });
      return temp;
    };

    const playlistMetrics = getplaylistMetrics();

    const summaryData = getSummaryData(modules, playlistMetrics, isStudent);

    // Module progress
    const modulesStatus = destinationCurriculumSequence.modules
      ? destinationCurriculumSequence.modules
          .filter(m => {
            if (m.data.length === 0) {
              return false;
            }
            for (const test of m.data) {
              if (!test.assignments || test.assignments.length === 0) {
                return false;
              }
              for (const assignment of test.assignments) {
                if (!assignment.class || assignment.class.length === 0) {
                  return false;
                }
                for (const cs of assignment.class) {
                  if (cs.status !== "DONE") {
                    return false;
                  }
                }
              }
            }
            return true;
          })
          .map(x => x._id)
      : [];

    const isAuthoringFlowReview = current === "review";

    const enableCustomize =
      ((((customize || hasEditAccess) && urlHasUseThis && isNotStudentOrParent) ||
        ((customize || hasEditAccess) && isNotStudentOrParent)) &&
        destinationCurriculumSequence &&
        !isAuthoringFlowReview) ||
      role === roleuser.EDULASTIC_CURATOR ||
      mode === "embedded";

    const GridCountInARow = windowWidth >= 1600 ? 5 : 4;
    const countModular = new Array(GridCountInARow - (slicedRecentPlaylists.length % GridCountInARow)).fill(1);

    const isDesktop = windowWidth > parseInt(smallDesktopWidth, 10);

    const isPlaylistDetailsPage = window.location?.hash === "#review";
    const showBreadCrumb = (currentTab === "playlist" || isPlaylistDetailsPage) && !urlHasUseThis;
    const shouldHidCustomizeButton = status === "published" && isPlaylistDetailsPage;

    const playlistsToSwitch = isStudent ? curatedStudentPlaylists : slicedRecentPlaylists;
    // should show useThis Notification only two times
    const showUseThisNotification = location.state?.fromUseThis && !loading && playlistsToSwitch?.length <= 3;

    return (
      <>
        <CurriculumSequenceModals
          isDesktop={isDesktop}
          isStudent={isStudent}
          addUnit={addUnit}
          newUnit={newUnit}
          options1={options1}
          options2={options2}
          countModular={countModular}
          moduleForEdit={moduleForEdit}
          isVisibleAddModule={isVisibleAddModule}
          addCustomContent={addCustomContent}
          curriculumGuide={curriculumGuide}
          playlistsToSwitch={playlistsToSwitch}
          destinationCurriculumSequence={destinationCurriculumSequence}
          showConfirmRemoveModal={showConfirmRemoveModal}
          fromPlaylist={fromPlaylist}
          onCloseConfirmRemoveModal={onCloseConfirmRemoveModal}
          removeTestFromPlaylist={removeTestFromPlaylist}
          closeAddModuleModal={this.closeAddModuleModal}
          handleSavePlaylist={handleSavePlaylist}
          handleAddUnit={this.handleAddUnit}
          addNewUnitToDestination={this.addNewUnitToDestination}
          handleAddCustomContent={this.handleAddCustomContent}
          handlePlaylistChange={this.handlePlaylistChange}
          onExplorePlaylists={this.onExplorePlaylists}
          handleGuideSave={this.handleGuideSave}
          handleGuideCancel={this.handleGuideCancel}
          dropPlaylistModalVisible={dropPlaylistModalVisible}
          closeDropPlaylistModal={this.closeDropPlaylistModal}
          isVideoResourcePreviewModal={isVideoResourcePreviewModal}
          setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
        />

        <CurriculumSequenceWrapper>
          <CurriculumHeader
            role={role}
            mode={mode}
            features={features}
            summaryData={summaryData}
            isStudent={isStudent}
            isTeacher={isTeacher}
            isManageContentActive={isManageContentActive}
            isPublisherUser={isPublisherUser}
            isDesktop={isDesktop}
            urlHasUseThis={urlHasUseThis}
            playlistsToSwitch={playlistsToSwitch}
            destinationCurriculumSequence={destinationCurriculumSequence}
            collections={collections}
            updateDestinationPlaylist={updateDestinationPlaylist}
            handleEditClick={handleEditClick}
            handleUseThisClick={handleUseThisClick}
            openDropPlaylistModal={this.openDropPlaylistModal}
            onShareClick={onShareClick}
            onApproveClick={this.onApproveClick}
            handleNavChange={this.handleNavChange}
            handleGuidePopup={this.handleGuidePopup}
            onRejectClick={this.onRejectClick}
            loading={loading}
            showUseThisNotification={showUseThisNotification}
            windowWidth={windowWidth}
          />

          <MainContentWrapper mode={mode}>
            {showBreadCrumb && <CurriculumBreadCrumb mode={mode} />}
            {loading && <Spin />}
            {currentTab === "playlist" && !loading && (
              <StyledFlexContainer width="100%" alignItems="flex-start" justifyContent="flex-start">
                <ContentContainer
                  urlHasUseThis={urlHasUseThis}
                  showRightPanel={showRightPanel && !shouldHidCustomizeButton && !!activeRightPanel}
                  showBreadCrumb={showBreadCrumb}
                >
                  <CurriculumSubHeader
                    isStudent={isStudent}
                    dateKeys={dateKeys}
                    urlHasUseThis={urlHasUseThis}
                    enableCustomize={enableCustomize}
                    showRightPanel={showRightPanel}
                    summaryData={summaryData}
                    destinationCurriculumSequence={destinationCurriculumSequence}
                    handleCheckout={this.handleCheckout}
                    isManageContentActive={isManageContentActive}
                    isContentExpanded={isContentExpanded}
                    cancelPlaylistCustomize={cancelPlaylistCustomize}
                    toggleManageContentClick={this.toggleManageContentClick}
                    publishCustomizedPlaylist={publishCustomizedPlaylist}
                    shouldHidCustomizeButton={shouldHidCustomizeButton}
                  />
                  <Wrapper active={isContentExpanded}>
                    {destinationCurriculumSequence && (
                      <Curriculum
                        mode={isManageContentActive ? "embedded" : mode}
                        isManageContentActive={isManageContentActive}
                        history={history}
                        status={status}
                        key={destinationCurriculumSequence._id}
                        padding={selectContent}
                        curriculum={destinationCurriculumSequence}
                        expandedModules={expandedModules}
                        onCollapseExpand={onCollapseExpand}
                        onDrop={onDrop}
                        resetDestination={resetDestination}
                        modulesStatus={modulesStatus}
                        customize={customize}
                        handleRemove={handleRemoveTest}
                        hideEditOptions={!urlHasUseThis}
                        onBeginDrag={onBeginDrag}
                        isReview={isAuthoringFlowReview}
                        onSortEnd={onSortEnd}
                        handleTestsSort={handleTestsSort}
                        urlHasUseThis={urlHasUseThis}
                        summaryData={summaryData}
                        playlistMetrics={playlistMetrics}
                        playlistClassList={playlistClassList}
                        manageContentDirty={manageContentDirty}
                        hasEditAccess={hasEditAccess}
                        openAddModuleModal={this.openAddModuleModal}
                        editModule={this.editModule}
                        deleteModule={this.deleteModule}
                        isDesktop={isDesktop}
                        isStudent={isStudent}
                        showRightPanel={showRightPanel}
                        fromPlaylist={fromPlaylist}
                        setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                        droppedItemId={droppedItemId}
                      />
                    )}
                  </Wrapper>
                </ContentContainer>

                <CurriculumRightPanel
                  showRightPanel={showRightPanel}
                  activeRightPanel={activeRightPanel}
                  isStudent={isStudent}
                  urlHasUseThis={urlHasUseThis}
                  hideRightpanel={this.hideRightpanel}
                  summaryData={summaryData}
                  shouldHidCustomizeButton={shouldHidCustomizeButton}
                  isManageContentActive={isManageContentActive}
                  isNotStudentOrParent={isNotStudentOrParent}
                  destinationCurriculumSequence={destinationCurriculumSequence}
                />
              </StyledFlexContainer>
            )}
            {currentTab === "insights" && !loading && <Insights currentPlaylist={destinationCurriculumSequence} />}
            {currentTab === "differentiation" && !loading && isSparkMathPlaylist && (
              <Differentiation
                setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                showResource={this.showLtiResource}
                {...this.props}
              />
            )}
          </MainContentWrapper>
        </CurriculumSequenceWrapper>
      </>
    );
  }
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      curriculumGuides: state.curriculumSequence.guides,
      isManageModulesVisible: state.curriculumSequence?.isManageModulesVisible,
      guide: state.curriculumSequence.selectedGuide,
      isContentExpanded: state.curriculumSequence.isContentExpanded,
      activeRightPanel: state.curriculumSequence.activeRightPanel,
      manageContentDirty: state.curriculumSequence.destinationDirty,
      selectedItemsForAssign: state.curriculumSequence.selectedItemsForAssign,
      dataForAssign: state.curriculumSequence.dataForAssign,
      recentPlaylists: getRecentPlaylistSelector(state),
      collections: getCollectionsSelector(state),
      features: getUserFeatures(state),
      isPublisherUser: isPublisherUserSelector(state),
      isStudent: getUserRole(state) === "student",
      isTeacher: getUserRole(state) === "teacher",
      role: getUserRole(state),
      playlistMetricsList: state?.curriculumSequence?.playlistMetrics,
      studentPlaylists: state?.studentPlaylist?.playlists,
      classId: getCurrentGroup(state),
      activeClasses: getFilteredClassesSelector(state),
      dateKeys: getDateKeysSelector(state),
      currentUserId: state?.user?.user?._id,
      isVideoResourcePreviewModal: state.curriculumSequence?.isVideoResourcePreviewModal,
      showRightPanel: state.curriculumSequence?.showRightPanel
    }),
    {
      onGuideChange: changeGuideAction,
      setPublisher: setPublisherAction,
      setGuide: setGuideAction,
      saveGuideAlignment: saveGuideAlignmentAction,
      setSelectedItemsForAssign: setSelectedItemsForAssignAction,
      setDataForAssign: setDataForAssignAction,
      saveCurriculumSequence: saveCurriculumSequenceAction,
      useThisPlayList: useThisPlayListAction,
      removeTestFromModule: removeTestFromModuleAction,
      removeTestFromDestinationCurriculum: playlistTestRemoveFromModuleAction,
      addNewUnitToDestination: addNewUnitAction,
      toggleManageContent: toggleManageContentActiveAction,
      updateDestinationPlaylist: updateDestinationCurriculumSequenceRequestAction,
      resetDestination: resetDestinationAction,
      duplicateManageContent: duplicateManageContentAction,
      cancelPlaylistCustomize: cancelPlaylistCustomizeAction,
      publishCustomizedPlaylist: publishCustomizedPlaylistAction,
      toggleManageModulesVisibility: toggleManageModulesVisibilityCSAction,
      setEmbeddedVideoPreviewModal: setEmbeddedVideoPreviewModalAction,
      setShowRightPanel: setShowRightSideAction,
      setActiveRightPanelView: setActiveRightPanelViewAction
    }
  )
);

export default enhance(CurriculumSequence);

CurriculumSequence.propTypes = {
  expandedModules: PropTypes.array,
  windowWidth: PropTypes.number.isRequired,
  saveCurriculumSequence: PropTypes.func.isRequired,
  setGuide: PropTypes.func.isRequired,
  onSelectContent: PropTypes.func.isRequired,
  addNewUnitToDestination: PropTypes.func.isRequired,
  destinationCurriculumSequence: PropTypes.object.isRequired,
  onCollapseExpand: PropTypes.func.isRequired,
  selectContent: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  handleSavePlaylist: PropTypes.func.isRequired,
  onBeginDrag: PropTypes.func.isRequired,
  isContentExpanded: PropTypes.bool.isRequired,
  recentPlaylists: PropTypes.array
};

CurriculumSequence.defaultProps = {
  expandedModules: [],
  recentPlaylists: []
};

const Wrapper = styled.div`
  display: flex;
  padding: 0px;
  box-sizing: border-box;
  width: 100%;
  align-self: ${props => (props.active ? "flex-start" : "center")};
  margin-left: ${props => (props.active ? "0px" : "auto")};
  margin-right: ${props => (props.active ? "0px" : "auto")};
  position: relative;
`;

const CurriculumSequenceWrapper = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${desktopWidth}) {
    flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  }
`;

export const ContentContainer = styled.div`
  width: ${({ showRightPanel }) => (showRightPanel ? "calc(100% - 400px)" : "100%")};
  padding-right: 5px;
  margin: 0px;
  margin-right: 10px;
  position: relative;
  overflow: auto;
  overflow-x: hidden;
  height: ${({ showBreadCrumb, isDifferentiationTab }) => {
    if (isDifferentiationTab) {
      return "calc(100vh - 175px)";
    }
    if (showBreadCrumb) {
      return "calc(100vh - 160px)";
    }
    return "calc(100vh - 124px)";
  }};

  @media (max-width: ${extraDesktopWidthMax}) {
    width: ${({ showRightPanel }) => (showRightPanel ? "calc(100% - 340px)" : "100%")};
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: ${({ showRightPanel }) => (showRightPanel ? "calc(100% - 240px)" : "100%")};
    height: ${({ showBreadCrumb, isDifferentiationTab }) => {
      if (isDifferentiationTab) {
        return "calc(100vh - 175px)";
      }
      if (showBreadCrumb) {
        return "calc(100vh - 138px)";
      }
      return "calc(100vh - 102px)";
    }};
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    margin-right: 0px;
    padding-right: 0px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &:hover {
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
    }
  }
`;

import React, { Component } from "react";
import { withRouter, Prompt } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { groupBy, isEqual, uniqueId } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as moment from "moment";
import { EduButton, FlexContainer, MainHeader, ProgressBar } from "@edulastic/common";
import { curriculumSequencesApi } from "@edulastic/api";
import {
  desktopWidth,
  greyThemeDark1,
  largeDesktopWidth,
  lightGreen5,
  lightGrey2,
  lightGrey5,
  lightGrey6,
  smallDesktopWidth,
  tabletWidth,
  themeColor,
  titleColor,
  white
} from "@edulastic/colors";
import { IconBook, IconGraduationCap, IconPencilEdit, IconPlaylist, IconShare, IconTile } from "@edulastic/icons";
import { Button, Cascader, Input, Modal, Tooltip, message } from "antd";
import Header from "../../../student/sharedComponents/Header";
import { getCurrentGroup, getUserFeatures } from "../../../student/Login/ducks";
import { getFilteredClassesSelector } from "../../../student/ManageClass/ducks";
import { getRecentPlaylistSelector } from "../../Playlist/ducks";
import RemoveTestModal from "../../PlaylistPage/components/RemoveTestModal/RemoveTestModal";
import { removeTestFromModuleAction } from "../../PlaylistPage/ducks";
import BreadCrumb from "../../src/components/Breadcrumb";
import { getCollectionsSelector, getUserRole, isPublisherUserSelector } from "../../src/selectors/user";
import { SecondHeader } from "../../TestPage/components/Summary/components/Container/styled";
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
  duplicateManageContentAction
} from "../ducks";
import { getProgressColor, getSummaryData } from "../util";
/* eslint-enable */
import Curriculum from "./Curriculum";
import Insights from "./Insights";
import AddUnitModalBody from "./modals/AddUnitModalBody";
import ChangePlaylistModal from "./modals/ChangePlaylistModal";
import DropPlaylistModal from "./modals/DropPlaylistModal";
import SummaryPieChart from "./SummaryPieChart";
import PlaylistPageNav from "./PlaylistPageNav";
import ManageContentBlock from "./ManageContentBlock";
import StudentPlayListHeader from "../../../student/sharedComponents/Header/PlayListHeader";
import Differentiation from "./Differentiation";
import { getDateKeysSelector } from "../../../student/StudentPlaylist/ducks";

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
// const TENMARKS_PUBLISHER = "TenMarks";
// const GOMATH_PUBLISHER = "Go Math!";

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
    curatedStudentPlaylists: []
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
    useThisPlayList({ _id, title, grades, subjects, customize });
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

  toggleManageContentClick = () => {
    const {
      toggleManageContent,
      manageContentDirty,
      isManageContentActive,
      destinationCurriculumSequence,
      currentUserId,
      duplicateManageContent
    } = this.props;
    const { authors } = destinationCurriculumSequence;
    const canEdit = authors.find(x => x._id === currentUserId);

    if (isManageContentActive && manageContentDirty) {
      message.warn("Changes left unsaved. Please save it first");
      return;
    }
    if (!isManageContentActive && !canEdit) {
      //duplicateManageContent(destinationCurriculumSequence);
      Modal.confirm({
        title: "Do you want to Customize ?",
        content:
          "Customizing the playlist will unlink from original source. Any updates made by the owner of the playlist will not be visible anymore. Do you want to continue?",
        onOk: () => {
          duplicateManageContent(destinationCurriculumSequence);
          Modal.destroyAll();
        }
      });
      return;
    } else {
      this.props.toggleManageContent();
    }
  };

  handleCheckout = () => {
    const { history, match } = this.props;
    const { playlistId } = match.params;
    return history.push(`/home/playlist/${playlistId}/recommendations`);
  };

  render() {
    const desktopWidthValue = Number(desktopWidth.split("px")[0]);

    const {
      onGuideChange,
      handleRemoveTest,
      removeTestFromPlaylist,
      onCloseConfirmRemoveModal,
      toggleManageContentClick
    } = this;

    const {
      addUnit,
      addCustomContent,
      curriculumGuide,
      newUnit,
      isPlayListEdited,
      showConfirmRemoveModal,
      dropPlaylistModalVisible,
      curatedStudentPlaylists
    } = this.state;
    const {
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
      activeClasses,
      match,
      isManageContentActive,
      manageContentDirty,
      updateDestinationPlaylist,
      collections,
      dateKeys,
      resetDestination,
      currentUserId
    } = this.props;

    // check Current user's edit permission
    const hasEditAccess = destinationCurriculumSequence?.authors.find(x => x._id === currentUserId);

    const isNotStudentOrParent = !(role === "student" || role === "parent");

    const testsInPlaylist = destinationCurriculumSequence?.modules?.flatMap(m => m?.data?.map(d => d?.contentId)) || [];

    // figure out which tab contents to render || just render default playlist
    const currentTab = match?.params?.currentTab || "playlist";

    // get active classes for student playlists
    const playlistClassList = [...new Set(studentPlaylists.map(playlist => playlist.groupId))];

    // sliced recent playlists for changePlaylistModal
    const slicedRecentPlaylists = recentPlaylists ? recentPlaylists.slice(0, 3) : [];

    const isPlaylistDetailsPage = window?.location?.hash === "#review";

    const { handleSaveClick, handleUseThisClick, handleCustomizeClick, handleEditClick } = this;
    // Options for add unit
    const options1 = destinationCurriculumSequence.modules
      ? destinationCurriculumSequence.modules.map(module => ({
          value: module.id,
          label: module.name
        }))
      : [];

    // TODO: change options2 to something more meaningful
    const options2 = [{ value: "Lesson", label: "Lesson" }, { value: "Lesson 2", label: "Lesson 2" }];

    const {
      status,
      title,
      description,
      subjects = [],
      grades = [],
      customize = true,
      isAuthor = false,
      modules,
      collections: _playlistCollections = []
    } = destinationCurriculumSequence;
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

    // check if either of the module data has empty value
    // used for giving requisite padding in the SummaryBlock
    const hasSummaryDataNoData = summaryData?.filter(item => (item.hidden ? !item.value && !isStudent : !item.value))
      .length;

    // CURRENT LIMIT on MODULE COLORS is - 11
    const COLORS = [
      "#11AB96",
      "#F74565",
      "#0078AD",
      "#00C2FF",
      "#B701EC",
      "#496DDB",
      "#8884d8",
      "#82ca9d",
      "#EC0149",
      "#FFD500",
      "#00AD50"
    ];

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

    const playlistBreadcrumbData = [
      {
        title: "PLAYLIST",
        to: "/author/playlists"
      },
      {
        title: "REVIEW",
        to: ""
      }
    ];

    const showUseThisButton = status !== "draft" && !urlHasUseThis && !isPublisherUser;

    const changePlaylistIcon = (
      <IconTile
        data-cy="open-dropped-playlist"
        style={{ cursor: "pointer", marginLeft: "18px" }}
        onClick={this.handleGuidePopup}
        width={18}
        height={18}
        color={themeColor}
      />
    );

    const subHeaderIcon1 = !!grades.length && (
      <SubHeaderInfoCard data-cy="playlist-grade">
        <IconGraduationCap color="grey" />
        <SubHeaderInfoCardText>Grade {grades.join(", ")}</SubHeaderInfoCardText>
      </SubHeaderInfoCard>
    );

    const subHeaderIcon2 = !!subjects.length && (
      <SubHeaderInfoCard data-cy="playlist-sub">
        <IconBook color="grey" />
        <SubHeaderInfoCardText>{subjects.filter(item => !!item).join(", ")}</SubHeaderInfoCardText>
      </SubHeaderInfoCard>
    );

    const isAuthoringFlowReview = current === "review";

    const enableCustomize =
      ((customize && urlHasUseThis && isNotStudentOrParent) || (customize && isNotStudentOrParent)) &&
      destinationCurriculumSequence &&
      !isAuthoringFlowReview;

    return (
      <>
        <RemoveTestModal
          isVisible={showConfirmRemoveModal}
          onClose={onCloseConfirmRemoveModal}
          handleRemove={removeTestFromPlaylist}
        />
        {mode === "embedded" && (
          <BreadCrumbWrapper>
            <SecondHeader>
              <BreadCrumb data={playlistBreadcrumbData} style={{ position: "unset" }} />
            </SecondHeader>
          </BreadCrumbWrapper>
        )}
        <CurriculumSequenceWrapper>
          <Modal
            visible={addUnit}
            title="Add Unit"
            onOk={this.handleAddUnit}
            onCancel={this.handleAddUnit}
            footer={null}
            style={windowWidth > desktopWidthValue ? { minWidth: "640px", padding: "20px" } : { padding: "20px" }}
          >
            <AddUnitModalBody
              destinationCurriculumSequence={destinationCurriculumSequence}
              addNewUnitToDestination={this.addNewUnitToDestination}
              handleAddUnit={this.handleAddUnit}
              newUnit={newUnit}
            />
          </Modal>

          <Modal
            visible={addCustomContent}
            title="Add Custom Content"
            onOk={this.handleAddCustomContent}
            onCancel={this.handleAddCustomContent}
            footer={null}
            style={windowWidth > desktopWidthValue ? { minWidth: "640px", padding: "20px" } : { padding: "20px" }}
          >
            <ModalBody>
              <ModalLabelWrapper>
                <label>Content Type</label>
                <label>Add to</label>
              </ModalLabelWrapper>
              <ModalInputWrapper>
                <Input.Group compact>
                  <Cascader defaultValue={["Lesson"]} options={options2} />
                </Input.Group>
                <Input.Group compact>
                  <Cascader defaultValue={["Unit Name"]} options={options1} />
                </Input.Group>
              </ModalInputWrapper>
              <label>Reference #</label>
              <Input />
            </ModalBody>
            <ModalFooter>
              <Button type="primary" ghost key="back" onClick={this.handleAddCustomContent}>
                CANCEL
              </Button>
              <Button key="submit" type="primary" onClick={this.handleAddCustomContent}>
                SAVE
              </Button>
            </ModalFooter>
          </Modal>

          <ChangePlaylistModal
            isStudent={isStudent}
            playlists={isStudent ? curatedStudentPlaylists : slicedRecentPlaylists}
            onChange={this.handlePlaylistChange}
            onExplorePlaylists={this.onExplorePlaylists}
            activePlaylistId={destinationCurriculumSequence._id}
            visible={curriculumGuide}
            footer={null}
            onOk={this.handleGuideSave}
            onCancel={this.handleGuideCancel}
          />

          {isStudent ? (
            <StudentPlayListHeader headingSubContent={curatedStudentPlaylists?.length > 1 && changePlaylistIcon} />
          ) : (
            mode !== "embedded" && (
              <MainHeader
                Icon={IconPlaylist}
                headingText={title}
                headingSubContent={
                  urlHasUseThis && !isPublisherUser && slicedRecentPlaylists?.length > 1 && changePlaylistIcon
                }
                titleMinWidth="unset"
                justify={urlHasUseThis ? "space-between" : "flex-start"}
              >
                {urlHasUseThis && (
                  <PlaylistPageNav
                    onChange={this.handleNavChange}
                    current={currentTab}
                    showDifferentiationTab={isSparkMathPlaylist}
                  />
                )}

                <CurriculumHeaderButtons marginLeft={urlHasUseThis ? "unset" : "auto"}>
                  {(showUseThisButton || urlHasUseThis || features.isCurator) && (
                    <EduButton isGhost data-cy="share" onClick={onShareClick}>
                      <IconShare />
                    </EduButton>
                  )}
                  {urlHasUseThis && isTeacher && !isPublisherUser && (
                    <EduButton data-cy="drop-playlist" onClick={this.openDropPlaylistModal}>
                      DROP PLAYLIST
                    </EduButton>
                  )}

                  {isManageContentActive && <EduButton onClick={updateDestinationPlaylist}>SAVE</EduButton>}
                  {isAuthor && !urlHasUseThis && (
                    <Tooltip placement="bottom" title="EDIT">
                      <EduButton isGhost data-cy="edit-playlist" onClick={handleEditClick}>
                        <IconPencilEdit />
                      </EduButton>
                    </Tooltip>
                  )}
                  {showUseThisButton && (
                    <EduButton data-cy="use-this" onClick={handleUseThisClick}>
                      USE THIS
                    </EduButton>
                  )}
                  {features.isCurator && (status === "inreview" || status === "rejected") && (
                    <EduButton onClick={this.onApproveClick}>APPROVE</EduButton>
                  )}
                  {features.isCurator && status === "inreview" && (
                    <EduButton onClick={this.onRejectClick}>REJECT</EduButton>
                  )}
                </CurriculumHeaderButtons>
              </MainHeader>
            )
          )}

          {currentTab === "playlist" && (
            <>
              {isPlaylistDetailsPage && (
                <ReviewBreadCrumbWrapper>
                  <SecondHeader>
                    <BreadCrumb data={playlistBreadcrumbData} style={{ position: "unset" }} />
                  </SecondHeader>
                </ReviewBreadCrumbWrapper>
              )}

              <StyledFlexContainer width="100%" alignItems="flex-start" justifyContent="flex-start">
                <ContentContainer urlHasUseThis={urlHasUseThis}>
                  {isStudent && !!dateKeys.length && (
                    <SubTopBar>
                      <SubTopBarContainer
                        style={{
                          background: "#2f4151",
                          padding: "10px 20px",
                          color: "#fff",
                          justifyContent: "space-between",
                          flexDirection: "row",
                          fontSize: "12px"
                        }}
                      >
                        <div>NEW RECOMMENDATIONS SINCE LAST LOGIN.</div>
                        <div style={{ cursor: "pointer" }} onClick={this.handleCheckout}>
                          CHECK IT OUT >>
                        </div>
                      </SubTopBarContainer>
                    </SubTopBar>
                  )}
                  <SubTopBar>
                    <SubTopBarContainer active={isContentExpanded} mode={isManageContentActive ? "embedded" : mode}>
                      <CurriculumSubHeaderRow>
                        <SubHeaderTitleContainer maxWidth={enableCustomize ? "40%" : "60%"}>
                          <SubHeaderDescription>{description}</SubHeaderDescription>
                        </SubHeaderTitleContainer>
                        {!enableCustomize && (
                          <SubHeaderInfoCardWrapper>
                            {subHeaderIcon1}
                            {subHeaderIcon2}
                          </SubHeaderInfoCardWrapper>
                        )}
                        {enableCustomize && subHeaderIcon1}
                        {enableCustomize && subHeaderIcon2}
                        {enableCustomize && (
                          <StyledButton
                            width="135px"
                            data-cy="manage-content"
                            onClick={toggleManageContentClick}
                            isManageContentActive={isManageContentActive}
                          >
                            Manage Content
                          </StyledButton>
                        )}
                      </CurriculumSubHeaderRow>
                    </SubTopBarContainer>
                  </SubTopBar>
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
                      />
                    )}
                  </Wrapper>
                </ContentContainer>
                {isNotStudentOrParent && isManageContentActive && !urlHasUseThis ? (
                  <ManageContentBlock
                    testsInPlaylist={testsInPlaylist}
                    subjectsFromCurriculumSequence={destinationCurriculumSequence?.subjects?.[0]}
                    gradesFromCurriculumSequence={destinationCurriculumSequence?.grades || []}
                    collectionFromCurriculumSequence={destinationCurriculumSequence?.collections?.[0]?._id}
                  />
                ) : null}
                {urlHasUseThis &&
                  (isManageContentActive ? (
                    <ManageContentBlock
                      testsInPlaylist={testsInPlaylist}
                      subjectsFromCurriculumSequence={destinationCurriculumSequence?.subjects?.[0]}
                      gradesFromCurriculumSequence={destinationCurriculumSequence?.grades || []}
                      collectionFromCurriculumSequence={destinationCurriculumSequence?.collections?.[0]?._id}
                    />
                  ) : (
                    <SummaryBlock>
                      <SummaryBlockTitle>Summary</SummaryBlockTitle>
                      <SummaryBlockSubTitle>Most Time Spent</SummaryBlockSubTitle>
                      <SummaryPieChart
                        isStudent={isStudent}
                        data={summaryData}
                        totalTimeSpent={summaryData?.map(x => x?.tSpent)?.reduce((a, c) => a + c, 0)}
                        colors={COLORS}
                      />
                      <Hr />
                      <SummaryBlockSubTitle>Module Proficiency</SummaryBlockSubTitle>
                      <div style={{ width: "80%", margin: "20px auto" }}>
                        {summaryData?.map(
                          item =>
                            ((isStudent && !item.hidden) || (!isStudent && urlHasUseThis)) && (
                              <div style={{ opacity: item.hidden ? `.5` : `1` }}>
                                <Tooltip placement="topLeft" title={item.title || item.name}>
                                  <ModuleTitle>{item.title || item.name}</ModuleTitle>
                                </Tooltip>
                                <ProgressBar
                                  strokeColor={getProgressColor(item?.value)}
                                  strokeWidth={13}
                                  percent={item.value}
                                  size="small"
                                  color={item.value ? greyThemeDark1 : lightGrey2}
                                  format={percent => (percent ? `${percent}%` : "NO DATA")}
                                  padding={hasSummaryDataNoData ? "0px 30px 0px 0px" : "0px"}
                                />
                              </div>
                            )
                        )}
                      </div>
                    </SummaryBlock>
                  ))}
              </StyledFlexContainer>
            </>
          )}

          {currentTab === "insights" && <Insights currentPlaylist={destinationCurriculumSequence} />}

          {currentTab === "differentiation" && isSparkMathPlaylist && <Differentiation />}
        </CurriculumSequenceWrapper>
        {dropPlaylistModalVisible && (
          <DropPlaylistModal visible={dropPlaylistModalVisible} closeModal={this.closeDropPlaylistModal} />
        )}
      </>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    state => ({
      curriculumGuides: state.curriculumSequence.guides,
      guide: state.curriculumSequence.selectedGuide,
      isContentExpanded: state.curriculumSequence.isContentExpanded,
      isManageContentActive: state.curriculumSequence.isManageContentActive,
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
      currentUserId: state?.user?.user?._id
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
      duplicateManageContent: duplicateManageContentAction
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
  onBeginDrag: PropTypes.func.isRequired,
  isContentExpanded: PropTypes.bool.isRequired,
  recentPlaylists: PropTypes.array
};

CurriculumSequence.defaultProps = {
  expandedModules: [],
  recentPlaylists: []
};

const ModuleTitle = styled.p`
  font-size: 11px;
  color: #434b5d;
  font-weight: 600;
  text-transform: uppercase;
  padding-right: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.2px;
  margin-top: 8px;
`;

const Hr = styled.div`
  width: 70%;
  border: 2px dashed transparent;
  border-bottom: 2px dashed #d2d2d2;
  margin: 15px auto 30px auto;
`;

const SummaryBlock = styled.div`
  width: 400px;
  min-width: 400px;
  min-height: 760px;
  margin: 20px 30px 40px 0;
  background: ${white};
  padding-top: 30px;
  border-radius: 4px;
  border: 1px solid #dadae4;

  .recharts-layer {
    tspan {
      text-transform: uppercase;
      fill: #434b5d;
      font-size: 11px;
      font-weight: 600;
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    margin: 20px 40px 40px 40px;
  }
`;

const SummaryBlockTitle = styled.div`
  width: 100%;
  color: ${titleColor};
  font-weight: 700;
  font-size: 22px;
  text-align: center;
`;

const SummaryBlockSubTitle = styled.div`
  width: 100%;
  color: ${lightGrey5};
  font-weight: 600;
  font-size: 13px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0;
`;

const StyledButton = styled.div`
  margin: ${props => props.margin || "0px"};
  height: ${props => props.height || "45px"};
  min-width: ${props => props.width || "auto"};
  color: ${({ isManageContentActive }) => (isManageContentActive ? white : themeColor)};
  display: flex;
  font: 11px/15px Open Sans;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  background: ${({ isManageContentActive }) => (isManageContentActive ? themeColor : white)};
  border-radius: 4px;
  border: 1px solid ${themeColor};
  cursor: pointer;
  text-transform: uppercase;
  user-select: none;
  -webkit-transition: background 300ms ease;
  -ms-transition: background 300ms ease;
  transition: background 300ms ease;
  svg {
    margin: auto;
  }
  &:hover {
    background: ${themeColor};
    color: white;
    box-shadow: 0px 0px 1px ${themeColor};
    svg {
      fill: white;
    }
  }
`;

const ModalInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .ant-cascader-picker {
    width: 100%;
  }
`;

const ModalLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  label {
    width: 48%;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  .ant-input:not(.ant-cascader-input) {
    margin-bottom: 20px;
  }
  .ant-input-group {
    width: 48%;
  }
  label {
    font-weight: 600;
    margin-bottom: 10px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  .ant-btn {
    font-size: 10px;
    font-weight: 600;
    min-width: 100px;
    padding-left: 70px;
    padding-right: 70px;
    margin-left: 5px;
    margin-right: 5px;
    @media only screen and (max-width: ${desktopWidth}) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  padding-left: 40px;
  padding-right: 40px;
  box-sizing: border-box;
  width: 100%;
  align-self: ${props => (props.active ? "flex-start" : "center")};
  margin-left: ${props => (props.active ? "0px" : "auto")};
  margin-right: ${props => (props.active ? "0px" : "auto")};
  @media only screen and (max-width: ${largeDesktopWidth}) {
    padding: 0px 40px;
    width: 100%;
  }
  @media only screen and (max-width: ${desktopWidth}) {
    padding: 0px 25px;
  }
`;

const CurriculumHeaderButtons = styled(FlexContainer)`
  margin-left: ${({ marginLeft }) => marginLeft};
`;

const SubTopBar = styled.div`
  width: ${props => (props.active ? "60%" : "100%")};
  padding: 0px 30px;
  margin: auto;
  position: relative;
  @media only screen and (min-width: 1800px) {
    width: ${props => (props.active ? "60%" : "100%")};
    margin-left: ${props => (props.active ? "" : "auto")};
    margin-right: ${props => (props.active ? "" : "auto")};
  }
  @media only screen and (max-width: ${largeDesktopWidth}) {
    width: 100%;
    padding: 0px 40px;
  }
  @media only screen and (max-width: ${desktopWidth}) {
    padding: 0px 25px;
  }
`;

const SubTopBarContainer = styled.div`
  background: white;
  padding: 30px 45px;
  margin-bottom: 10px;
  margin-top: ${props => (props.mode ? "0px" : "20px")};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-left: ${props => (props.active ? "" : "auto")};
  margin-right: ${props => (props.active ? "" : "auto")};
  border-radius: 5px;
  border: 1px solid #DADAE4;

  @media only screen and (max-width: 1366px) {
    flex-direction: column;
    justify-self: flex-start;
    margin-right: auto;
  }
  @media only screen and (max-width: 1750px) and (min-width: 1367px) {
    /* flex-direction: ${props => (props.active ? "column" : "row")};
    justify-self: ${props => (props.active ? "flex-start" : "")};
    margin-right: ${props => (props.active ? "auto" : "")}; */
  }
  @media only screen and (max-width: 480px) {
    padding-left: 20px;
  }
`;

SubTopBarContainer.displayName = "SubTopBarContainer";

const CurriculumSequenceWrapper = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CurriculumSubHeaderRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.marginBottom || "0px"};
`;

const SubHeaderTitleContainer = styled.div`
  min-width: 200px;
  max-width: ${props => props.maxWidth};
  word-break: break-word;
  @media only screen and (max-width: ${tabletWidth}) {
    max-width: 100%;
  }
`;

const SubHeaderDescription = styled.p`
  color: ${lightGrey6};
  font-size: 14px;
  text-align: justify;
`;

const SubHeaderInfoCardWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SubHeaderInfoCard = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  @media only screen and (max-width: ${tabletWidth}) {
    margin-top: 10px;
    margin-left: 0px;
  }
`;

const SubHeaderInfoCardText = styled.div`
  font-family: Open Sans;
  font-weight: 600;
  padding-left: 10px;
  color: ${titleColor};
`;

const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${smallDesktopWidth}) {
    flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  }
`;

const ContentContainer = styled.div`
  width: calc(100% - 335px);
  margin: 0px auto;
  @media (max-width: ${smallDesktopWidth}) {
    width: 100%;
  }
`;

const BreadCrumbWrapper = styled.div`
  padding: 20px 40px;
`;

const ReviewBreadCrumbWrapper = styled.div`
  padding: 20px 40px 0px 30px;
  width: 100%;
`;

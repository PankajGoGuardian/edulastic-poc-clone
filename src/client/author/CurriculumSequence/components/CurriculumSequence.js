import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { uniqueId } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as moment from "moment";

import { curriculumSequencesApi } from "@edulastic/api";
import {
  greenSecondary,
  mobileWidth,
  tabletWidth,
  themeColor,
  white,
  smallDesktopWidth,
  desktopWidth,
  largeDesktopWidth,
  titleColor,
  textColor as descriptionColor,
  lightGreen5
} from "@edulastic/colors";
import {
  IconShare,
  IconGraduationCap,
  IconBook,
  IconTile
} from "@edulastic/icons";
import { FlexContainer, MainHeader } from "@edulastic/common";
import { Button, Cascader, Input, Modal, Progress, Radio } from "antd";

import { getUserFeatures } from "../../../student/Login/ducks";
// import { getTestAuthorName } from "../../dataUtils";
import { getRecentPlaylistSelector } from "../../Playlist/ducks";
import RemoveTestModal from "../../PlaylistPage/components/RemoveTestModal/RemoveTestModal";
import { removeTestFromModuleAction } from "../../PlaylistPage/ducks";
import BreadCrumb from "../../src/components/Breadcrumb";
import { RadioInputWrapper } from "../../src/components/common/RadioInput";
import {
  getCollectionsSelector,
  isPublisherUserSelector,
  getUserRole
} from "../../src/selectors/user";
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
  useThisPlayListAction
} from "../ducks";
/* eslint-enable */
import AddUnitModalBody from "./AddUnitModalBody";
import Curriculum from "./Curriculum";
import SummaryPieChart from "./SummaryPieChart";
import DropPlaylistModal from "./DropPlaylistModal";

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
    dropPlaylistModalVisible: false
  };

  onChange = evt => {
    const playlistIndex = evt.target.value;
    const { recentPlaylists, useThisPlayList } = this.props;
    this.handleGuideCancel();
    const playlistChange = recentPlaylists[playlistIndex];
    useThisPlayList({ _id: playlistChange._id, title: playlistChange.title, onChange: true });
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
    const { title } = destinationCurriculumSequence;
    useThisPlayList({ _id, title });
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
      this.setState({ removeModuleIndex, removeTestId }, () =>
        removeTestFromPlaylist(removeModuleIndex, removeTestId)
      );
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

  render() {
    const desktopWidthValue = Number(desktopWidth.split("px")[0]);
    const {
      onGuideChange,
      handleRemoveTest,
      removeTestFromPlaylist,
      onCloseConfirmRemoveModal
    } = this;
    const {
      addUnit,
      addCustomContent,
      curriculumGuide,
      newUnit,
      isPlayListEdited,
      showConfirmRemoveModal
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
      curriculumGuides,
      guide,
      isContentExpanded,
      mode,
      recentPlaylists,
      onShareClick,
      history,
      handleTestsSort,
      collections,
      features,
      urlHasUseThis,
      isPublisherUser,
      isStudent
    } = this.props;

    const lastThreeRecentPlaylist = recentPlaylists ? recentPlaylists.slice(0, 3) : [];
    const { handleSaveClick, handleUseThisClick, handleCustomizeClick, handleEditClick } = this;
    // Options for add unit
    const options1 = destinationCurriculumSequence.modules
      ? destinationCurriculumSequence.modules.map(module => ({
        value: module.id,
        label: module.name
      }))
      : [];

    // TODO: change options2 to something more meaningful
    const options2 = [
      { value: "Lesson", label: "Lesson" },
      { value: "Lesson 2", label: "Lesson 2" }
    ];

    // Dropdown options for guides
    const guidesDropdownOptions = curriculumGuides.map(item => ({
      value: item._id,
      label: item.title
    }));

    const {
      status,
      title,
      description,
      subjects = [],
      grades = [],
      customize = true,
      isAuthor = false,
      bgColor = themeColor || "",
      textColor = white || ""
    } = destinationCurriculumSequence;

    // {
    //   testId,
    //   playlistModuleId,
    //   plylistId,
    //   maxScore,
    //   timeSpent,
    //   studentTotalScore,
    //   correctCount,
    //   wrongCount,

    // }

    const chartData = [
      { name: "Module 1", value: 10, timeSpent: 4080000 },
      { name: "Module 2", value: 10, timeSpent: 4000000 },
      { name: "Module 3", value: 15, timeSpent: 4380000 },
      { name: "Module 4", value: 30, timeSpent: 4180000 },
      { name: "Module 5", value: 25, timeSpent: 5680000 },
      { name: "Module 6", value: 15, timeSpent: 9080000 },
      { name: "Module 7", value: 35, timeSpent: 4011000 }
    ];

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
    const totalModules = destinationCurriculumSequence.modules
      ? destinationCurriculumSequence.modules.length
      : 0;
    const modulesStatus = destinationCurriculumSequence.modules
      ? destinationCurriculumSequence.modules.filter(m => {
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
      }).map(x => x._id)
      : [];
    const modulesCompleted = modulesStatus.length;
    const playlistBreadcrumbData = [
      {
        title: "PLAY LIST",
        to: "/author/playlists"
      },
      {
        title: "REVIEW",
        to: ""
      }
    ];
    const showUseThisButton = status !== "draft" && !urlHasUseThis && !isPublisherUser;

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
            style={
              windowWidth > desktopWidthValue
                ? { minWidth: "640px", padding: "20px" }
                : { padding: "20px" }
            }
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
            style={
              windowWidth > desktopWidthValue
                ? { minWidth: "640px", padding: "20px" }
                : { padding: "20px" }
            }
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

          <Modal
            visible={curriculumGuide}
            onOk={this.handleGuideSave}
            onCancel={this.handleGuideCancel}
            footer={null}
            style={
              windowWidth > desktopWidthValue
                ? { minWidth: "640px", padding: "20px" }
                : { padding: "20px" }
            }
          >
            <ModalHeader />
            <GuideModalBody>
              <ModalSubtitleWrapper>
                <div>Select a playlist from below to change:</div>
              </ModalSubtitleWrapper>
              <RadioGroupWrapper>
                <Radio.Group onChange={this.onChange}>
                  {lastThreeRecentPlaylist.map((recentPlaylist, ind) => (
                    <Radio checked={ind === 0} value={ind}>
                      {recentPlaylist.title}
                    </Radio>
                  ))}
                </Radio.Group>
              </RadioGroupWrapper>
              <GuidesDropdownWrapper>
                {guidesDropdownOptions.length > 0 && (
                  <Input.Group compact>
                    <Cascader
                      key={guide}
                      onChange={onGuideChange}
                      defaultValue={[guide]}
                      style={{ width: "100%" }}
                      options={guidesDropdownOptions}
                    />
                  </Input.Group>
                )}
              </GuidesDropdownWrapper>
            </GuideModalBody>
            <ModalFooter>
              <Link to="/author/playlists">Go To Library</Link>
            </ModalFooter>
          </Modal>
          
          { mode !== "embedded" && (
            <MainHeader
              headingText={title}
              headingSubContent={!isPublisherUser && (
                <IconTile
                  style={{ cursor: "pointer", marginLeft: "18px" }}
                  onClick={this.handleGuidePopup}
                  width={18}
                  height={18}
                  color={themeColor}
                />
              )}
              titleMinWidth="100px"
              justify="flex-start"
            >
              <CurriculumHeaderButtons>
                {(urlHasUseThis || features.isCurator) && !isStudent && (
                  <>
                    <ShareButtonStyle data-cy="share" onClick={onShareClick}>
                      <IconShare color={lightGreen5} width={15} height={15} />
                    </ShareButtonStyle>
                    <HeaderButton onClick={this.openDropPlaylistModal}>
                      Drop Playlist
                    </HeaderButton>
                  </>
                )}
                {customize && urlHasUseThis && (
                  <HeaderButton
                    data-cy="save"
                    onClick={isPlayListEdited ? handleSaveClick : handleCustomizeClick}
                  >
                    Customize
                  </HeaderButton>
                )}
                {isAuthor && !urlHasUseThis && (
                  <HeaderButton data-cy="edit-playlist" onClick={handleEditClick}>
                    Edit
                  </HeaderButton>
                )}
                {showUseThisButton && (
                  <HeaderButton data-cy="use-this" onClick={handleUseThisClick}>
                    Use This
                  </HeaderButton>
                )}
                {features.isCurator && (status === "inreview" || status === "rejected") && (
                  <HeaderButton onClick={this.onApproveClick}>
                    Approve
                  </HeaderButton>
                )}
                {features.isCurator && status === "inreview" && (
                  <HeaderButton onClick={this.onRejectClick}>
                    Reject
                  </HeaderButton>
                )}
              </CurriculumHeaderButtons>
            </MainHeader>
          )}
          <StyledFlexContainer width="100%" alignItems="flex-start" justifyContent="flex-start">
            <ContentContainer isStudent={isStudent}>
              <SubTopBar>
                <SubTopBarContainer active={isContentExpanded} mode={mode}>
                  <CurriculumSubHeaderRow>
                    <SubHeaderTitleContainer>
                      <SubHeaderDescription>{description}</SubHeaderDescription>
                    </SubHeaderTitleContainer>
                    {grades.length && (
                      <SubHeaderInfoCard data-cy="playlist-grade">
                        <IconGraduationCap color="grey" />
                        <SubHeaderInfoCardText>
                          Grade {grades.join(", ")}
                        </SubHeaderInfoCardText>
                      </SubHeaderInfoCard>
                    )}
                    {subjects.length && (
                      <SubHeaderInfoCard data-cy="playlist-sub">
                        <IconBook color="grey" />
                        <SubHeaderInfoCardText>
                          {subjects.filter(item => !!item).join(", ")}
                        </SubHeaderInfoCardText>
                      </SubHeaderInfoCard>
                    )}
                  </CurriculumSubHeaderRow>
                </SubTopBarContainer>
              </SubTopBar>
              <Wrapper active={isContentExpanded}>
                {destinationCurriculumSequence && (
                  <Curriculum
                    mode={mode}
                    history={history}
                    status={status}
                    key={destinationCurriculumSequence._id}
                    padding={selectContent}
                    curriculum={destinationCurriculumSequence}
                    expandedModules={expandedModules}
                    onCollapseExpand={onCollapseExpand}
                    onDrop={onDrop}
                    modulesStatus={modulesStatus}
                    customize={customize}
                    handleRemove={handleRemoveTest}
                    hideEditOptions={!urlHasUseThis}
                    onBeginDrag={onBeginDrag}
                    isReview={current === "review"}
                    onSortEnd={onSortEnd}
                    handleTestsSort={handleTestsSort}
                    urlHasUseThis={urlHasUseThis}
                  />
                )}
              </Wrapper>
            </ContentContainer>
            {urlHasUseThis && isAuthor && (
              <SummaryBlock>
                <SummaryBlockTitle>Summary</SummaryBlockTitle>
                <SummaryBlockSubTitle>Most Time Spent</SummaryBlockSubTitle>
                <SummaryPieChart
                  data={chartData}
                  totalTimeSpent={chartData.map(x => x.timeSpent).reduce((a, c) => a + c, 0)}
                  colors={COLORS}
                />
                <Hr />
                <SummaryBlockSubTitle>module proficiency</SummaryBlockSubTitle>
                <div style={{ width: "80%", margin: "20px auto" }}>
                  {chartData.map((item, i) => (
                    <div>
                      <ModuleTitle>{item.name}</ModuleTitle>
                      <Progress
                        strokeColor={{
                          "0%": COLORS[i],
                          "100%": COLORS[i]
                        }}
                        strokeWidth={10}
                        percent={40}
                      />
                    </div>
                  ))}
                </div>
              </SummaryBlock>)}
          </StyledFlexContainer>
        </CurriculumSequenceWrapper>
        <DropPlaylistModal
          visible={this.state.dropPlaylistModalVisible}
          closeModal={this.closeDropPlaylistModal}
        />
      </>
    );
  }
}

CurriculumSequence.propTypes = {
  guide: PropTypes.string,
  expandedModules: PropTypes.array,
  windowWidth: PropTypes.number.isRequired,
  saveCurriculumSequence: PropTypes.func.isRequired,
  curriculumGuides: PropTypes.array,
  setGuide: PropTypes.func.isRequired,
  onSelectContent: PropTypes.func.isRequired,
  addNewUnitToDestination: PropTypes.func.isRequired,
  destinationCurriculumSequence: PropTypes.object.isRequired,
  onCollapseExpand: PropTypes.func.isRequired,
  selectContent: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  onBeginDrag: PropTypes.func.isRequired,
  isContentExpanded: PropTypes.bool.isRequired,
  recentPlaylists: PropTypes.array,
  publisher: PropTypes.string,
  curriculumList: PropTypes.array,
  setPublisher: PropTypes.func.isRequired,
  dataForAssign: PropTypes.object.isRequired,
  setDataForAssign: PropTypes.func.isRequired,
  saveGuideAlignment: PropTypes.func.isRequired,
  selectedItemsForAssign: PropTypes.array.isRequired,
  setSelectedItemsForAssign: PropTypes.func.isRequired,
  sourceCurriculumSequence: PropTypes.object.isRequired,
  onSourceCurriculumSequenceChange: PropTypes.func.isRequired
};

CurriculumSequence.defaultProps = {
  publisher: EUREKA_PUBLISHER,
  guide: "",
  curriculumList: [],
  expandedModules: [],
  recentPlaylists: [],
  curriculumGuides: []
};

const ModuleTitle = styled.p`
  font-size: 11px;
  color: #434b5d;
  font-weight: 600;
  text-transform: uppercase;
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
  width: 315px;
  min-width: 315px;
  min-height: 760px;
  margin: 20px 40px 40px 0;
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
  color: #8e9aa4;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0;
`;

const GuidesDropdownWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
`;

const RadioGroupWrapper = styled(RadioInputWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalSubtitleWrapper = styled.div`
  text-align: center;
  width: 100%;
  padding-bottom: 40px;
`;

const GuideModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  padding-top: 40px;
  .ant-input:not(.ant-cascader-input) {
    margin-bottom: 20px;
  }
  .ant-input-group {
    width: 48%;
  }
  label {
    font-weight: 500;
    margin-bottom: 10px;
  }
`;

const HeaderButton = styled.div`
  margin-right: 10px !important;
  height: 45px;
  width: 135px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 11px/15px Open Sans;
  font-weight: 600;
  letter-spacing: 0.2px;
  background: ${lightGreen5};
  border-radius: 4px;
  border: 1px solid ${lightGreen5};
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    box-shadow: 0px 0px 1px ${lightGreen5}
  }

  svg {
    margin: auto;
  }
`;

const ShareButtonStyle = styled.div`
  margin-right: 10px !important;
  height: 45px;
  width: 45px;
  color: ${lightGreen5};
  display: flex;
  align-items: center;
  background: white;
  border-radius: 4px;
  border: 1px solid ${lightGreen5};
  cursor: pointer;
  svg {
    margin: auto;
  }
  &:hover {
    background: ${lightGreen5};
    color: white;
    box-shadow: 0px 0px 1px ${lightGreen5};
    svg {
      fill: white;
    }
  }
`;

const SaveButtonStyle = styled.div`
  .ant-btn {
    padding: 10px 18px;
    min-height: 45px;
    min-width: 120px;
    color: ${greenSecondary};
    display: flex;
    align-items: center;
    @media only screen and (max-width: ${largeDesktopWidth}) {
      min-width: 60px;
    }
    @media only screen and (max-width: ${mobileWidth}) {
      padding: unset;
      min-width: 43px;
      min-height: 40px;
      svg {
        margin: auto;
      }
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
  margin-left: auto;
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
  z-index: 1;
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
  .ant-btn {
    height: 24px;
  }
`;

const CurriculumSubHeaderRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.marginBottom || "0px"};
  @media only screen and (max-width: ${tabletWidth}) {
    flex-direction: column;
    margin-bottom: ${props => props.marginBottom && "7px"};
  }
`;

const SubHeaderTitleContainer = styled.div`
  max-width: 40%;
  word-break: break-word;
  @media only screen and (max-width: ${tabletWidth}) {
    max-width: 100%;
  }
`;

const SubHeaderDescription = styled.p`
  color: ${descriptionColor};
  font-size: 14px;
  text-align: justify;
`;

const SubHeaderInfoCard = styled.div`
  display: flex;
  align-items: baseline;
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
  width: ${({ isStudent }) => (isStudent ? "100%" : "calc(100% - 335px)")};
  @media (max-width: ${smallDesktopWidth}) {
    width: 100%;
  }
`;

const BreadCrumbWrapper = styled.div`
  padding: 20px 40px;
`;

const enhance = compose(
  withRouter,
  connect(
    state => ({
      curriculumGuides: state.curriculumSequence.guides,
      guide: state.curriculumSequence.selectedGuide,
      isContentExpanded: state.curriculumSequence.isContentExpanded,
      selectedItemsForAssign: state.curriculumSequence.selectedItemsForAssign,
      dataForAssign: state.curriculumSequence.dataForAssign,
      recentPlaylists: getRecentPlaylistSelector(state),
      collections: getCollectionsSelector(state),
      features: getUserFeatures(state),
      isPublisherUser: isPublisherUserSelector(state),
      isStudent: getUserRole(state) === "student",
      summaryData: state.curriculumSequence
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
      addNewUnitToDestination: addNewUnitAction
    }
  )
);

export default enhance(CurriculumSequence);

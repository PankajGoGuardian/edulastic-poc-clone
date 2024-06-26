import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { roleuser as userRoles, test } from "@edulastic/constants";
import { withWindowSizes, notification } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { set, omit } from "lodash";
import { getUserId } from "../../src/selectors/user";
import CurriculumSequence from "./CurriculumSequence";
import {
  getAllCurriculumSequencesAction,
  putCurriculumSequenceAction,
  searchCurriculumSequencesAction,
  searchGuidesAction,
  toggleAddContentAction,
  useThisPlayListAction,
  addContentToCurriculumSequenceAction,
  approveOrRejectSinglePlaylistRequestAction,
  setPlaylistDataAction,
  receiveCurrentPlaylistMetrics,
  playlistDestinationReorderTestsAction,
  addItemIntoPlaylistModuleAction
} from "../ducks";
import ShareModal from "../../src/components/common/ShareModal";
import { CollectionsSelectModal } from "../../PlaylistPage/components/CollectionsSelectModal/collectionsSelectModal";

/**
 * @typedef {object} ModuleData
 * @property {String} contentId
 * @property {String} createdDate
 * @property {Object} derivedFrom
 * @property {String} id
 * @property {Number} index
 * @property {String} name
 * @property {String} standards
 * @property {String} type
 */

/**
 *  @typedef {object} CreatedBy
 * @property {String} email
 * @property {String} firstName
 * @property {String} id
 * @property {String} lastName
 */

/**
 * @typedef {object} Module
 * @property {String} assigned
 * @property {String} customized
 * @property {ModuleData[]} data
 * @property {String} id
 * @property {String} name
 */

/**
 * @typedef {Object} CurriculumSequenceType
 * @property {string} id
 * @property {CreatedBy} createdBy
 * @property {String} createdDate
 * @property {Object} derivedFrom
 * @property {String} description
 * @property {String} _id
 * @property {Module[]} modules
 * @property {String} status
 * @property {String} thumbnail
 * @property {String} title
 * @property {String} updatedDate
 * @property {function} toggleAddContent
 * @property {function} addNewUnitToDestination
 * @property {boolean} isContentExpanded
 */

/**
 * @typedef CurriculumProps
 * @property {CurriculumSequenceType} curriculum
 * @property {function} moveContentInPlaylist
 * @property {CurriculumSequenceType} destinationCurriculumSequence
 */

/** @extends Component<CurriculumProps> */
const { statusConstants } = test;

class CurriculumContainer extends Component {
  state = {
    expandedModules: [],
    showShareModal: false,
    showSelectCollectionsModal: false
    /**
     * state for handling drag and drop
     */
  };

  expandAll = () => {
    if (
      this.props?.destinationCurriculumSequence?.modules &&
      this.props?.destinationCurriculumSequence?.status === "published"
    ) {
      this.setState({ expandedModules: this.props?.destinationCurriculumSequence?.modules.map((x, index) => index) });
    }
  };

  componentDidMount() {
    // Hardcoded because we currently don't have a way to store/read what are the
    // default curriculumSequences for the user(and grade)
    // What we would need is an API to set it on the user and get it with the user object
    // Also - only 6ath grade has both content and guides mapped to testIds

    const {
      match,
      getAllCurriculumSequences,
      getCurrentPlaylistMetrics,
      isStudent = false,
      history: { location } = {},
      urlHasUseThis
    } = this.props;

    const playlistId = match.params.id || match.params.playlistId;
    if (playlistId) {
      getAllCurriculumSequences([playlistId], !isStudent && !urlHasUseThis);
      if (isStudent) {
        getCurrentPlaylistMetrics({ groupId: location?.state?.currentGroupId, playlistId });
      } else {
        getCurrentPlaylistMetrics({ playlistId });
      }
    }

    this.expandAll();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps?.destinationCurriculumSequence?.modules && this.props?.destinationCurriculumSequence?.modules) {
      this.expandAll();
    }
  }

  /** @param {String} publisher */
  changePublisher = publisher => {
    const { searchGuides } = this.props;
    searchGuides(publisher);
  };

  /** @param {String} publisher */
  savePublisher = publisher => {
    const { searchCurriculumSequences } = this.props;
    searchCurriculumSequences(publisher);
  };

  onDrop = (toModuleIndex, item, afterIndex) => {
    if (!item) {
      // to avoid executing this on nested drop
      return;
    }
    const { destinationCurriculumSequence, moveContentInPlaylist, addIntoModule } = this.props;
    this.expandModule(toModuleIndex);
    if (item.fromPlaylistTestsBox) {
      const itemExistsInModule = destinationCurriculumSequence.modules?.[toModuleIndex]?.data?.find(
        x => x?.contentId === item.id
      );

      if (!itemExistsInModule) {
        set(item, "contentId", item.id);
        const attrsToOmit = ["id", "type", "fromPlaylistTestsBox"];
        if (item.contentType === "test") {
          attrsToOmit.push(...["contentDescription", "contentUrl"]);
        } else {
          attrsToOmit.push("standardIdentifiers");
        }
        const newItem = omit(item, attrsToOmit);
        addIntoModule({ item: newItem, moduleIndex: toModuleIndex, afterIndex });
      } else {
        notification({
          msg: `Dropped ${item.contentType === "test" ? "Test" : "Resource"} already exists in this module`
        });
      }
    } else {
      const { fromModuleIndex, fromContentId, fromContentIndex } = this.state;
      moveContentInPlaylist({ fromContentId, fromModuleIndex, toModuleIndex, fromContentIndex });
    }
  };

  onBeginDrag = ({ fromModuleIndex, fromContentId, contentIndex }) => {
    this.setState({
      fromModuleIndex,
      fromContentId,
      fromContentIndex: contentIndex
    });
  };

  expandModule = moduleId => {
    const { expandedModules } = this.state;
    if (!expandedModules.includes(moduleId)) {
      this.setState({ expandedModules: [...expandedModules, moduleId] });
    }
  };

  collapseExpandModule = moduleId => {
    const { destinationCurriculumSequence } = this.props;

    if (!destinationCurriculumSequence) return null;

    const hasContent =
      destinationCurriculumSequence.modules.filter((module, index) => {
        if (index === moduleId && module.data && module.data.length > 0) {
          return true;
        }
        return false;
      }).length > 0;

    if (!hasContent) return notification({ type: "warn", messageKey: "moduleHasNOTest" });

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

  handleSelectContent = () => {
    const { toggleAddContent } = this.props;
    toggleAddContent();
  };

  getSourceDestinationCurriculum = () => {
    let sourceCurriculumSequence;
    let destinationCurriculumSequence;
    const { curriculumSequences } = this.props;

    curriculumSequences.allCurriculumSequences.forEach(id => {
      if (curriculumSequences.byId[id].type === "content") {
        sourceCurriculumSequence = curriculumSequences.byId[id];
      } else if (curriculumSequences.byId[id].type === "guide") {
        destinationCurriculumSequence = curriculumSequences.byId[id];
      }
    });

    return { sourceCurriculumSequence, destinationCurriculumSequence };
  };

  handleShare = () => {
    this.setState({ showShareModal: true });
  };

  onShareModalChange = () => {
    const { showShareModal } = this.state;
    this.setState({
      showShareModal: !showShareModal
    });
  };

  onCuratorApproveOrReject = payload => {
    const { approveOrRejectSinglePlaylistRequest } = this.props;
    if (payload.status === "published") {
      this.setState({ showSelectCollectionsModal: true });
    } else if (payload.status === "rejected") {
      approveOrRejectSinglePlaylistRequest(payload);
    }
  };

  onOkCollectionsSelectModal = () => {
    const { destinationCurriculumSequence, approveOrRejectSinglePlaylistRequest } = this.props;
    const { _id, collections } = destinationCurriculumSequence;
    approveOrRejectSinglePlaylistRequest({ playlistId: _id, status: "published", collections });
    this.setState({ showSelectCollectionsModal: false });
  };

  onCancelCollectionsSelectModal = () => {
    this.setState({ showSelectCollectionsModal: false });
  };

  onCollectionsSelectChange = selectedCollections => {
    const { setPlaylistData } = this.props;
    setPlaylistData({ collections: selectedCollections });
  };

  checkWritePermission = () => {
    const { destinationCurriculumSequence, currentUserId } = this.props;
    // Playlist is being authored - editFlow
    if (!destinationCurriculumSequence.authors) return true;
    return !!destinationCurriculumSequence.authors?.find(x => x?._id === currentUserId);
  };

  render() {
    const { windowWidth, curriculumSequences, isContentExpanded, match, mode, resequenceTests, loading } = this.props;
    const { expandedModules, showShareModal, showSelectCollectionsModal } = this.state;
    const {
      handleSelectContent,
      onDrop,
      onBeginDrag,
      savePublisher,
      changePublisher,
      handleShare,
      onShareModalChange,
      collapseExpandModule
    } = this;

    const { sourceCurriculumSequence } = this.getSourceDestinationCurriculum();

    const { destinationCurriculumSequence = {}, urlHasUseThis } = this.props;
    const { collections: selectedCollections } = destinationCurriculumSequence;

    const curriculumList = Object.keys(curriculumSequences.byId).map(key => curriculumSequences.byId[key]);
    const gradeSubject = {
      grades: destinationCurriculumSequence.grades,
      subjects: destinationCurriculumSequence.subjects
    };

    // check Current user's edit permission
    const hasEditAccess = this.checkWritePermission();

    return (
      <>
        <ShareModal
          shareLabel="PLAYLIST URL"
          isVisible={showShareModal}
          isPublished={destinationCurriculumSequence.status === statusConstants.PUBLISHED}
          testId={destinationCurriculumSequence._id}
          isPlaylist
          onClose={onShareModalChange}
          gradeSubject={gradeSubject}
          hasPlaylistEditAccess={hasEditAccess}
        />
        <CollectionsSelectModal
          isVisible={showSelectCollectionsModal}
          onOk={this.onOkCollectionsSelectModal}
          onCancel={this.onCancelCollectionsSelectModal}
          title="Collections"
          onChange={this.onCollectionsSelectChange}
          selectedCollections={selectedCollections}
          okText="APPROVE"
        />
        <CurriculumSequence
          onPublisherSave={savePublisher}
          onPublisherChange={changePublisher}
          selectContent={isContentExpanded}
          onSelectContent={handleSelectContent}
          destinationCurriculumSequence={destinationCurriculumSequence}
          sourceCurriculumSequence={sourceCurriculumSequence}
          expandedModules={expandedModules}
          onCollapseExpand={collapseExpandModule}
          curriculumList={curriculumList}
          onShareClick={handleShare}
          windowWidth={windowWidth}
          onDrop={onDrop}
          match={match}
          mode={mode}
          loading={loading}
          handleTestsSort={resequenceTests}
          onBeginDrag={onBeginDrag}
          onCuratorApproveOrReject={this.onCuratorApproveOrReject}
          urlHasUseThis={urlHasUseThis}
        />
      </>
    );
  }
}

CurriculumContainer.propTypes = {
  curriculum: PropTypes.shape({
    createdBy: PropTypes.object.isRequired,
    createdDate: PropTypes.string.isRequired,
    derivedFrom: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    modules: PropTypes.array.isRequired,
    status: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    updatedDate: PropTypes.string.isRequired
  }),
  windowWidth: PropTypes.number.isRequired,
  curriculumSequences: PropTypes.object.isRequired,
  isContentExpanded: PropTypes.bool.isRequired,
  destinationCurriculumSequence: PropTypes.object.isRequired,
  getAllCurriculumSequences: PropTypes.func.isRequired,
  searchGuides: PropTypes.func.isRequired,
  searchCurriculumSequences: PropTypes.func.isRequired,
  moveContentInPlaylist: PropTypes.func.isRequired,
  toggleAddContent: PropTypes.func.isRequired
};

CurriculumContainer.defaultProps = {
  curriculum: null
};

const mapDispatchToProps = dispatch => ({
  getAllCurriculumSequences(ids, showNotification) {
    dispatch(getAllCurriculumSequencesAction(ids, showNotification));
  },
  putCurriculumSequence(id, curriculumSequence) {
    dispatch(putCurriculumSequenceAction(id, curriculumSequence));
  },
  searchCurriculumSequences(publisher) {
    dispatch(searchCurriculumSequencesAction({ publisher }));
  },
  searchGuides(publisher) {
    dispatch(searchGuidesAction({ publisher }));
  },
  toggleAddContent() {
    dispatch(toggleAddContentAction());
  },
  moveContentInPlaylist(payload) {
    dispatch(addContentToCurriculumSequenceAction(payload));
  },
  useThisPlayList(_id, title, grades, subjects, customize) {
    dispatch(useThisPlayListAction({ _id, title, grades, subjects, customize }));
  },
  approveOrRejectSinglePlaylistRequest(payload) {
    dispatch(approveOrRejectSinglePlaylistRequestAction(payload));
  },
  setPlaylistData(payload) {
    dispatch(setPlaylistDataAction(payload));
  },
  getCurrentPlaylistMetrics(payload) {
    dispatch(receiveCurrentPlaylistMetrics(payload));
  },
  resequenceTests: payload => dispatch(playlistDestinationReorderTestsAction(payload)),
  addIntoModule: payload => dispatch(addItemIntoPlaylistModuleAction(payload))
});

const enhance = compose(
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      loading: state.curriculumSequence.loading,
      curriculumSequences: state.curriculumSequence,
      isContentExpanded: state.curriculumSequence?.isContentExpanded,
      destinationCurriculumSequence: state.curriculumSequence?.destinationCurriculumSequence,
      isStudent: state.user?.user?.role === userRoles.STUDENT,
      currentUserId: getUserId(state)
    }),
    mapDispatchToProps
  )
);

export default enhance(CurriculumContainer);

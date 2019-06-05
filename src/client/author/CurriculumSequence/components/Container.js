import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { message } from "antd";
import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import CurriculumSequence from "./CurriculumSequence";
import {
  getAllCurriculumSequencesAction,
  putCurriculumSequenceAction,
  searchCurriculumSequencesAction,
  searchGuidesAction,
  toggleAddContentAction,
  useThisPlayListAction,
  addContentToCurriculumSequenceAction
} from "../ducks";
import ShareModal from "../../src/components/common/ShareModal";

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
const statusConstants = {
  DRAFT: "draft",
  ARCHIVED: "archived",
  PUBLISHED: "published"
};

class CurriculumContainer extends Component {
  state = {
    expandedModules: [],
    showShareModal: false
    /**
     * state for handling drag and drop
     */
  };

  componentDidMount() {
    // Hardcoded because we currently don't have a way to store/read what are the
    // default curriculumSequences for the user(and grade)
    // What we would need is an API to set it on the user and get it with the user object
    // Also - only 6ath grade has both content and guides mapped to testIds

    const { match, getAllCurriculumSequences } = this.props;
    if (match.params.id) {
      getAllCurriculumSequences([match.params.id]);
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

  onDrop = toModuleIndex => {
    const { fromModuleIndex, fromContentId, fromContentIndex } = this.state;
    const { moveContentInPlaylist } = this.props;
    moveContentInPlaylist({ fromContentId, fromModuleIndex, toModuleIndex, fromContentIndex });
  };

  onBeginDrag = ({ fromModuleIndex, fromContentId, contentIndex }) => {
    this.setState({
      fromModuleIndex,
      fromContentId,
      fromContentIndex: contentIndex
    });
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

  /** @param {CurriculumSequence} curriculumSequence */
  setSourceCurriculumSequence = curriculumSequence => {
    this.setState({ sourceCurriculumSequence: curriculumSequence });
  };

  handleShare = () => {
    this.setState({ showShareModal: true });
  };
  onShareModalChange = () => {
    this.setState({
      showShareModal: !this.state.showShareModal
    });
  };

  render() {
    const { windowWidth, curriculumSequences, isContentExpanded, match } = this.props;
    const { expandedModules, showShareModal } = this.state;
    const {
      handleSelectContent,
      setSourceCurriculumSequence,
      onDrop,
      onBeginDrag,
      savePublisher,
      changePublisher,
      handleShare,
      onShareModalChange,
      collapseExpandModule
    } = this;

    const { sourceCurriculumSequence } = this.getSourceDestinationCurriculum();

    const { destinationCurriculumSequence } = this.props;

    const curriculumList = Object.keys(curriculumSequences.byId).map(key => curriculumSequences.byId[key]);

    return (
      <>
        <ShareModal
          isVisible={showShareModal}
          isPublished={destinationCurriculumSequence.status === statusConstants.PUBLISHED}
          testId={destinationCurriculumSequence._id}
          isPlaylist={true}
          onClose={onShareModalChange}
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
          onSourceCurriculumSequenceChange={setSourceCurriculumSequence}
          windowWidth={windowWidth}
          onDrop={onDrop}
          match={match}
          onBeginDrag={onBeginDrag}
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
  getAllCurriculumSequences(ids) {
    dispatch(getAllCurriculumSequencesAction(ids));
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
  useThisPlayList(_id, title) {
    dispatch(useThisPlayListAction({ _id, title }));
  }
});

const enhance = compose(
  withWindowSizes,
  withNamespaces("author"),
  connect(
    ({ curriculumSequence }) => ({
      curriculumSequences: curriculumSequence,
      isContentExpanded: curriculumSequence.isContentExpanded,
      destinationCurriculumSequence: curriculumSequence.destinationCurriculumSequence
    }),
    mapDispatchToProps
  )
);

export default enhance(CurriculumContainer);

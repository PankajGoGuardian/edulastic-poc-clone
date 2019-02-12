import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { message } from 'antd';
import { withWindowSizes } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { cloneDeep } from 'lodash';
import CurriculumSequence from './CurriculumSequence';
import {
  getAllCurriculumSequences,
  putCurriculumSequenceAction,
  searchCurriculumSequences,
  searchGuidesAction,
  toggleAddContentAction
} from '../ducks';

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
* @property {boolean} isContentExpanded
*/

/**
 * @typedef CurriculumProps
 * @property {CurriculumSequenceType} curriculum
 */

/** @extends Component<CurriculumProps> */
class CurriculumContainer extends Component {
  state = {
    expandedModules: [],
    /** @type {CurriculumSequenceType[]} */
    curriculumsList: [],

    /** @type {CurriculumSequenceType} */
    sourceCurriculumSequence: null,

    /** @type {CurriculumSequenceType} */
    destinationCurriculumSequence: null,
    selectContent: false,

    /**
     * Selected publisher
     */
    publisher: '',

    /**
     * state for handling drag and drop
     */
    contentToBeAdded: null
  };

  componentDidMount() {
    // NOTE: temporary here,
    // until what will call the component with specified curriculums
    this.props.getAllCurriculumSequences([
      '5c5ab082b10670586081c94f',
      '5c5ad5894a1e7d960c092543'
    ]);
  }

  /** @param {String} publisher */
  changePublisher = publisher => {
    this.props.searchGuides(publisher);
  };

  /** @param {String} publisher */
  savePublisher = publisher => {
    this.props.searchCurriculumSequences(publisher);
  };

  onDrop = (toUnit) => {
    const { contentToBeAdded } = this.state;

    if (contentToBeAdded) {
      this.addContentToCurriculumSequence(contentToBeAdded, toUnit);
    }
  }

  onBeginDrag = (contentToBeAdded) => {
    this.setState({ contentToBeAdded });
  }

  saveCurriculumSequence = () => {
    // call api and update curriculum
    const { putCurriculumSequence } = this.props;
    const { destinationCurriculumSequence: destinationCurriculumSequenceOld } = this.getSourceDestinationCurriculum();
    const destinationCurriculumSequenceNew = cloneDeep(destinationCurriculumSequenceOld);
    
    const id = destinationCurriculumSequenceNew._id;
    delete destinationCurriculumSequenceNew._id;

    putCurriculumSequence(id, destinationCurriculumSequenceNew);
    this.setState({ destinationCurriculumSequence: null });
  }

  /**
   * @param {ModuleData} contentToAdd
   * @param {Module} toUnit
   */
  addContentToCurriculumSequence = (contentToAdd, toUnit) => {
    if (!contentToAdd || !toUnit) return;

    toUnit.data.push(contentToAdd);
    const { destinationCurriculumSequence } = { ...this.getSourceDestinationCurriculum() };

    const updatedModules = destinationCurriculumSequence.modules.map((module) => {
      if (module.id === toUnit.id) {
        return toUnit;
      }
      return module;
    });
    destinationCurriculumSequence.modules = updatedModules;
    this.setState({ destinationCurriculumSequence });
  }

  addNewUnitToDestination = (afterUnitId, newUnit) => {
    const { destinationCurriculumSequence } = { ...this.state };

    const { modules } = destinationCurriculumSequence;
    const moduleIds = destinationCurriculumSequence.modules.map(module => module.id);
    const insertIndex = moduleIds.indexOf(afterUnitId);
    modules.splice(insertIndex + 1, 0, newUnit);
    destinationCurriculumSequence.modules = modules;
    this.setState({ destinationCurriculumSequence });
  }

  collapseExpandModule = (moduleId) => {
    const { destinationCurriculumSequence } = { ...this.getSourceDestinationCurriculum() };
  
    if (!destinationCurriculumSequence) return null;

    const hasContent = destinationCurriculumSequence.modules.filter((module) => {
      if (module.id === moduleId && module.data && module.data.length > 0) {
        return true;
      }
    }).length > 0;

    if (!hasContent) return message.error('Please add some content to this unit.');

    const { expandedModules } = this.state;
    if (expandedModules.indexOf(moduleId) === -1) {
      this.setState({ expandedModules: [...expandedModules, moduleId] });
    } else {
      const newExpandedModules = expandedModules.filter(id => id !== moduleId)
      this.setState({
        expandedModules: newExpandedModules
      });
    }
  }

  handleSelectContent = () => {
    const { toggleAddContent } = this.props;
    toggleAddContent();
  }

  /** @param {CurriculumSequence} curriculumSequence */
  setDestinationCurriculumSequence = (curriculumSequence) => {
    this.setState({ destinationCurriculumSequence: curriculumSequence });
  }

  /** @param {CurriculumSequence} curriculumSequence */
  setSourceCurriculumSequence = (curriculumSequence) => {
    this.setState({ sourceCurriculumSequence: curriculumSequence });
  }

  getSourceDestinationCurriculum = () => {
    let sourceCurriculumSequence;
    let destinationCurriculumSequence;
    const { curriculumSequences } = this.props;

    curriculumSequences.allCurriculumSequences.forEach((id, index) => {
      if (curriculumSequences.byId[id].type === 'content') {
        sourceCurriculumSequence = curriculumSequences.byId[id];
      } else if (curriculumSequences.byId[id].type === 'guide') {
        destinationCurriculumSequence = curriculumSequences.byId[id];
      }
    });

    // When destination exists on state, it means user changed something, return that
    if(this.state.destinationCurriculumSequence) {
      destinationCurriculumSequence = this.state.destinationCurriculumSequence;
    }

    return { sourceCurriculumSequence, destinationCurriculumSequence };
  }

  render() {
    const { windowWidth, curriculumSequences, isContentExpanded } = this.props;
    const { expandedModules } = this.state;
    const { handleSelectContent, setSourceCurriculumSequence, addContentToCurriculumSequence, saveCurriculumSequence, addNewUnitToDestination, onDrop, onBeginDrag, savePublisher, changePublisher } = this;

    const { sourceCurriculumSequence, destinationCurriculumSequence } = this.getSourceDestinationCurriculum();

    if (!sourceCurriculumSequence || !destinationCurriculumSequence) return null;

    const curriculumList = Object.keys(curriculumSequences.byId).map(key => curriculumSequences.byId[key]);
    
    return (
      <CurriculumSequence
        onPublisherSave={savePublisher}
        onPublisherChange={changePublisher}
        selectContent={isContentExpanded}
        onSelectContent={handleSelectContent}
        destinationCurriculumSequence={destinationCurriculumSequence}
        sourceCurriculumSequence={sourceCurriculumSequence}
        expandedModules={expandedModules}
        onCollapseExpand={this.collapseExpandModule}
        curriculumList={curriculumList}
        onSourceCurriculumSequenceChange={setSourceCurriculumSequence}
        addContentToCurriculumSequence={addContentToCurriculumSequence}
        onSave={saveCurriculumSequence}
        addNewUnitToDestination={addNewUnitToDestination}
        windowWidth={windowWidth}
        onDrop={onDrop}
        onBeginDrag={onBeginDrag}
      />
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
  putCurriculumSequence: PropTypes.func.isRequired,
  isContentExpanded: PropTypes.bool.isRequired

};

CurriculumContainer.defaultProps = {
  curriculum: null
};

const mapDispatchToProps = dispatch => ({
  getAllCurriculumSequences(ids) {
    dispatch(getAllCurriculumSequences(ids));
  },
  putCurriculumSequence(id, curriculumSequence) {
    dispatch(putCurriculumSequenceAction(id, curriculumSequence));
  },
  searchCurriculumSequences(publisher) {
    dispatch(searchCurriculumSequences({ publisher }));
  },
  searchGuides(publisher) {
    dispatch(searchGuidesAction({ publisher }));
  },
  toggleAddContent() {
    dispatch(toggleAddContentAction());
  }
});


const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
  connect(
    ({ curriculumSequence }) => ({
      curriculumSequences: curriculumSequence,
      isContentExpanded: curriculumSequence.isContentExpanded
    }),
    mapDispatchToProps
  )
);

export default enhance(CurriculumContainer);

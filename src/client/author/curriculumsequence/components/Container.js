import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { message } from 'antd';
import { withWindowSizes } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { curriculumSequencesApi } from '@edulastic/api';
import CurriculumSequence from './CurriculumSequence';
import { getAllCurriculumSequences, updateCurriculumSequence } from '../ducks';

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
     * state for handling drag and drop
     */
    contentToBeAdded: null
  };

  componentDidMount() {
    // NOTE: temporary here,
    // until what will call the component with specified curriculums
    this.props.getAllCurriculumSequences([
      '5c5ab073fca6cba41f057d4d',
      '5c5ad5894a1e7d960c092543'
    ]);
  }

  componentDidUpdate(prevProps, prevState) {
    // NOTE: temporary until we know how the curriculum sequences will be assigned
    // We are settting first to destination and second to source just for demo purposes
    if (
      !this.state.sourceCurriculumSequence &&
      !this.state.destinationCurriculumSequence && 
      this.props.curriculumSequences.allCurriculumSequences &&
      this.props.curriculumSequences.allCurriculumSequences.length > 0
    ) {
      this.props.curriculumSequences.allCurriculumSequences.map((id, index) => {
        if (this.props.curriculumSequences.byId[id].type === 'content') {
          this.setState({ sourceCurriculumSequence: this.props.curriculumSequences.byId[id] })
        } else if (this.props.curriculumSequences.byId[id].type === 'guide') {
          this.setState({ destinationCurriculumSequence: this.props.curriculumSequences.byId[id] })
        }
      });
    }
  }

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
    const { destinationCurriculumSequence: destinationCurriculumSequenceOld } = this.state;
    const destinationCurriculumSequenceNew = { ...destinationCurriculumSequenceOld };
    
    const id = destinationCurriculumSequenceNew._id;
    delete destinationCurriculumSequenceNew._id;

    this.props.updateCurriculumSequence(id, destinationCurriculumSequenceNew);
  }

  /**
   * @param {ModuleData} contentToAdd
   * @param {Module} toUnit
   */
  addContentToCurriculumSequence = (contentToAdd, toUnit) => {
    if (!contentToAdd || !toUnit) return;

    toUnit.data.push(contentToAdd);
    const { destinationCurriculumSequence } = { ...this.state };

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
    const { destinationCurriculumSequence } = { ...this.state };

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
    this.setState((prevState) => {
      return { selectContent: !prevState.selectContent };
    });
  }

  /** @param {CurriculumSequence} curriculumSequence */
  setDestinationCurriculumSequence = (curriculumSequence) => {
    this.setState({ destinationCurriculumSequence: curriculumSequence });
  }

  /** @param {CurriculumSequence} curriculumSequence */
  setSourceCurriculumSequence = (curriculumSequence) => {
    this.setState({ sourceCurriculumSequence: curriculumSequence });
  }

  // #region yellow
  render() {
    const { windowWidth, curriculumSequences } = this.props;
    const { expandedModules, selectContent, destinationCurriculumSequence, sourceCurriculumSequence } = this.state;
    const { handleSelectContent, setSourceCurriculumSequence, addContentToCurriculumSequence, saveCurriculumSequence, addNewUnitToDestination, onDrop, onBeginDrag } = this;

    if (!destinationCurriculumSequence) return null;

    const curriculumList = Object.keys(curriculumSequences.byId).map(key => curriculumSequences.byId[key])

    return (
      <CurriculumSequence
        selectContent={selectContent}
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
  // #endregion
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
  curriculumSequences: PropTypes.object.isRequired
};

CurriculumContainer.defaultProps = {
  curriculum: null
};

const mapDispatchToProps = dispatch => ({
  getAllCurriculumSequences(ids) {
    dispatch(getAllCurriculumSequences(ids));
  },
  updateCurriculumSequence(id, curriculumSequence) {
    dispatch(updateCurriculumSequence(id, curriculumSequence));
  }
});


const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
  connect(
    ({ curriculumSequence }) => ({
      curriculumSequences: curriculumSequence
    }),
    mapDispatchToProps
  )
);

export default enhance(CurriculumContainer);

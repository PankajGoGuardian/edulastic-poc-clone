import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Input, Cascader, message } from "antd";
import { desktopWidth } from "@edulastic/colors";

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
 * @property {String} type
 * @property {String} updatedDate
 */

/**
 * @typedef {object} AddUnitModalBodyProps
 * @property {CurriculumSequenceType} destinationCurriculumSequence
 * @property {function} addModuleToPlaylist
 * @property {function} handleAddModule
 * @property {Module | {}} newModule
 */

class AddUnitModalBody extends React.Component {
  state = {
    /** @type {Module | {}} */
    newModule: {}
  };

  componentWillMount() {
    const { newModule } = this.props;
    this.setState({ newModule });
  }

  onNewModuleNameChange = evt => {
    evt.preventDefault();
    const { newModule } = { ...this.state };
    newModule.name = evt.target.value;
    this.setState({ newModule });
  };

  onModuleAfterIdChange = id => {
    const { newModule } = { ...this.state };
    const [afterModuleId] = id;
    newModule.afterModuleId = afterModuleId;
    this.setState({ newModule });
  };

  addModuleToPlaylist = () => {
    const { newModule } = { ...this.state };
    if (newModule.name.trim()) {
      const { addModuleToPlaylist } = this.props;
      if (addModuleToPlaylist) {
        addModuleToPlaylist({ afterModuleIndex: newModule.afterModuleId, moduleName: newModule.name });
        this.setState({ newModule: { name: "" } });
      }
    } else {
      message.warning("Module name cannot be empty");
    }
  };

  render() {
    const { destinationCurriculumSequence, handleAddModule } = this.props;
    const { newModule } = this.state;
    const { onNewModuleNameChange, onModuleAfterIdChange } = this;
    // Options for add unit
    let options1 =
      destinationCurriculumSequence &&
      destinationCurriculumSequence.modules.map(({ title }, index) => ({ value: index + 1, label: title }));
    options1 = options1.length ? options1 : [];
    return (
      <div>
        <AddModuleModalBodyContaner>
          <label>Module Name</label>
          <Input data-cy="addNewModuleInputName" value={newModule.name || ""} onChange={onNewModuleNameChange} />
          <label>Add After</label>
          <Input.Group compact>
            <Cascader onChange={onModuleAfterIdChange} style={{ width: "100%" }} options={options1} />
          </Input.Group>
        </AddModuleModalBodyContaner>
        <ModalFooter>
          <Button data-cy="addModuleCancel" type="primary" ghost key="back" onClick={handleAddModule}>
            CANCEL
          </Button>
          <Button data-cy="addModuleSave" key="submit" type="primary" onClick={this.addModuleToPlaylist}>
            SAVE
          </Button>
        </ModalFooter>
      </div>
    );
  }
}
AddUnitModalBody.propTypes = {
  destinationCurriculumSequence: PropTypes.object.isRequired,
  addModuleToPlaylist: PropTypes.func.isRequired,
  handleAddModule: PropTypes.func.isRequired,
  newModule: PropTypes.object.isRequired
};

export default AddUnitModalBody;

const AddModuleModalBodyContaner = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  .ant-input:not(.ant-cascader-input) {
    margin-bottom: 20px;
  }
  .ant-input-group {
    width: 100%;
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

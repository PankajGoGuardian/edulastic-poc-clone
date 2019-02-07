import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Modal, Input, Cascader, Radio, Icon } from 'antd';
import { FlexContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { darkBlueSecondary, white, green, mainBlueColor } from '@edulastic/colors';
import customContentIcon from '../assets/custom-content.svg';
import addUnitIcon from '../assets/add-unit.svg';
import selectContentIcon from '../assets/select-content.svg';
import sourceIcon from '../assets/source.svg';
import Curriculum from './Curriculum';
import ShareIcon from '../assets/share-button.svg';
import SelectContent from './SelectContent';


/** @typedef {object} ModuleData
* @property {String} contentId
* @property {String} createdDate
* @property {Object} derivedFrom
* @property {String} id
* @property {Number} index
* @property {String} name
* @property {String} standards
* @property {String} type
*/

/** @typedef {object} CreatedBy
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
* @typedef {object} CurriculumSequenceType
* @property {CreatedBy} createdBy
* @property {String} createdDate
* @property {Object} derivedFrom
* @property {String} description
* @property {String} id
* @property {Module[]} modules
* @property {String} status
* @property {String} thumbnail
* @property {String} title
* @property {String} updatedDate
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
* @property {function} onSave
* @property {function} addNewUnitToDestination
* @property {function} onDrop
* @property {function} onBeginDrag
*/

// NOTE: primary theme color is different than in the screen design

/** @extends Component<CurriculumSequenceProps> */
class CurriculumSequence extends Component {

  state = {
    addUnit: false,
    addCustomContent: false,
    curriculumGuide: false,
    value: 1,
    /** @type {Module | {}} */
    newUnit: {}
  }

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  handleSaveClick = (evt) => {
    evt.preventDefault();
    this.props.onSave();
  }

  handleAddUnitOpen = () => {
    const { newUnit } = { ...this.state };
    const { destinationCurriculumSequence } = this.props;

    newUnit.id = uniqueId();
    newUnit.data = [];
    newUnit.afterUnitId = destinationCurriculumSequence.modules.map((module => module.id))[0];


    this.setState((prevState) => ({ addUnit: !prevState.addUnit, newUnit }));
  }

  handleAddCustomContent = () => {
    this.setState((prevState) => ({ addCustomContent: !prevState.addCustomContent }));
  }

  handleSelectContent = () => {
    const { onSelectContent } = this.props;
    this.props.onSelectContent();
  }

  handleAddUnit = () => {
    this.setState((prevState) => ({ addUnit: !prevState.addUnit }));
  }

  handleGuide = () => {
    this.setState((prevState) => ({ curriculumGuide: !prevState.curriculumGuide }));
  }

  addNewUnitToDestination = () => {
    // console.log('NAME', newUnitName);
    const { addNewUnitToDestination } = this.props;
    let { newUnit } = { ...this.state };

    /** @type {String} */
    const afterUnitId = newUnit.afterUnitId;
    delete newUnit.afterUnitId;

    newUnit.id = uniqueId(afterUnitId.substr(0, afterUnitId.length - 2));

    addNewUnitToDestination(afterUnitId, newUnit);

    this.setState({ newUnit: {}, addUnit: false });
  }

  onNewUnitNameChange = (evt) => {
    evt.preventDefault();

    const { newUnit } = { ...this.state };
    newUnit.name = evt.target.value;
    this.setState({ newUnit });
  }

  onUnitAfterIdChange = (id) => {
    const { newUnit } = { ...this.state };
    const [ afterUnitId ] = id;
    newUnit.afterUnitId = afterUnitId;
    this.setState({ newUnit });
  }

  render() {
    const { onNewUnitNameChange, onUnitAfterIdChange } = this;
    const { addUnit, addCustomContent, newUnit, curriculumGuide } = this.state;
    const { expandedModules, onCollapseExpand, curriculumList, destinationCurriculumSequence, sourceCurriculumSequence, addContentToCurriculumSequence, onSelectContent, windowWidth, onSourceCurriculumSequenceChange, selectContent, onDrop, onBeginDrag } = this.props;

    // Options for add unit
    const options1 = destinationCurriculumSequence.modules.map((module) => ({ value: module.id, label: module.name }))

    // TODO: chante options2 to something more meaningful
    const options2 = [{ value: 'Lesson', label: 'Lesson' }, { value: 'Lesson 2', label: 'Lesson 2' }];
    const { title } = destinationCurriculumSequence;

    const isSelectContent = selectContent && destinationCurriculumSequence;

    return (
      <CurriculumSequenceWrapper>
        <Modal
          visible={addUnit}
          title="Add Unit"
          onOk={this.handleAddUnit}
          onCancel={this.handleAddUnit}
          footer={null}
          style={windowWidth > 845 ? { minWidth: '640px', padding: '20px' } : { padding: '20px' }}
        >
          <AddUnitModalBody>
            <label>Unit Name</label>
            <Input value={newUnit.name || ''} onChange={onNewUnitNameChange} />
            <label>Add After</label>
            <Input.Group compact>
              <Cascader onChange={onUnitAfterIdChange} defaultValue={[options1[0].value]} style={{ width: '100%' }} options={options1} />
            </Input.Group>
          </AddUnitModalBody>
          <ModalFooter>
            <Button type="primary" ghost key="back" onClick={this.handleAddUnit}>CANCEL</Button>,
            <Button key="submit" type="primary" onClick={this.addNewUnitToDestination}>
              SAVE
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          visible={addCustomContent}
          title="Add Custom Content"
          onOk={this.handleAddCustomContent}
          onCancel={this.handleAddCustomContent}
          footer={null}
          style={windowWidth > 845 ? { minWidth: '640px', padding: '20px' } : { padding: '20px' }}
        >
          <ModalBody>
            <ModalLabelWrapper>
              <label>Content Type</label>
              <label>Add to</label>
            </ModalLabelWrapper>
            <ModalInputWrapper>
              <Input.Group compact>
                <Cascader defaultValue={['Lesson']} options={options2} />
              </Input.Group>
              <Input.Group compact>
                <Cascader defaultValue={['Unit Name']} options={options1} />
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
          onOk={this.handleGuide}
          onCancel={this.handleGuide}
          footer={null}
          style={windowWidth > 845 ? { minWidth: '640px', padding: '20px' } : { padding: '20px' }}
        >
        <ModalHeader>
          <span>Curriculum Alignments in Two Clicks</span>
        </ModalHeader>
          <GuideModalBody>
            <ModalSubtitleWrapper>
              <div>Which of these do you use?</div>
              <div>Select 'Other' if you don't see your curriculum listed.</div>
            </ModalSubtitleWrapper>
            <RadioGroupWrapper>
            <Radio.Group onChange={this.onChange} value={this.state.value}>
        <Radio value={1}>Engage/NY</Radio>
        <Radio value={2}>TenMarks</Radio>
        <Radio value={3}>GoMath!</Radio>
        <Radio value={4}>Other</Radio>
      </Radio.Group>
      </RadioGroupWrapper>
          </GuideModalBody>
          <ModalFooter>
            <Button type="primary" ghost key="back" onClick={this.handleGuide}>
              CANCEL
            </Button>
            <Button key="submit" type="primary" onClick={this.handleGuide}>
              SAVE
            </Button>
          </ModalFooter>
        </Modal>

        <CurriculumHeader>
          <HeaderTitle>{title}
            <Icon style={{ fontSize: '16px', cursor: 'pointer', marginLeft: '10px' }} type={curriculumGuide ? "up" : "down"} onClick={this.handleGuide} />
          </HeaderTitle>
          <ShareButtonStyle>
            <Button type="default">
              <ShareButtonText>{windowWidth > 845 ? 'SHARE' : <img src={ShareIcon} alt="Add unit " style={{ width: '100%' }} />}</ShareButtonText>
            </Button>
          </ShareButtonStyle>
          <SaveButtonStyle windowWidth={windowWidth}>
            <Button type="primary">
              <SaveButtonText onClick={this.handleSaveClick}>{windowWidth > 845 ? 'Save Changes' : 'Save'}</SaveButtonText>
            </Button>
          </SaveButtonStyle>
        </CurriculumHeader>
        <CurriculumSubheader>
          <AddUnitSubHeaderButtonStyle>
            <Button onClick={this.handleAddUnitOpen} type="primary" ghost>
              <img src={addUnitIcon} alt="Add unit" />
              <ButtonText>Add Unit</ButtonText>
            </Button>
          </AddUnitSubHeaderButtonStyle>
          <SelectContentSubHeaderButtonStyle>
            <Button onClick={this.handleSelectContent} type="primary" ghost>
              <img src={selectContentIcon} alt="Select content" />
              <ButtonText>Select Content</ButtonText>
            </Button>
          </SelectContentSubHeaderButtonStyle>
          <AddCustomContentSubHeaderButtonStyle>
            <Button onClick={this.handleAddCustomContent} type="primary" ghost>
              <img src={customContentIcon} alt="Custom content" />
              <ButtonText>Add Custom Content</ButtonText>
            </Button>
          </AddCustomContentSubHeaderButtonStyle>
          <SourceSubHeaderButtonStyle>
            <Button type="primary" ghost>
              <img src={sourceIcon} alt="Source" />
              <ButtonText>Source</ButtonText>
            </Button>
          </SourceSubHeaderButtonStyle>
        </CurriculumSubheader>
        <Wrapper>
          {destinationCurriculumSequence &&
            <Curriculum
              padding={selectContent}
              curriculum={destinationCurriculumSequence}
              expandedModules={expandedModules}
              onCollapseExpand={onCollapseExpand}
              onDrop={onDrop}
            />
          }
          {isSelectContent &&
            <SelectContent
              destinationCurriculum={destinationCurriculumSequence}
              curriculumList={curriculumList}
              addContentToCurriculumSequence={addContentToCurriculumSequence}
              curriculum={sourceCurriculumSequence}
              onCurriculumSequnceChange={onSourceCurriculumSequenceChange}
              windowWidth={windowWidth}
              onSelectContent={onSelectContent}
              onBeginDrag={onBeginDrag}
            />
          }
        </Wrapper>
      </CurriculumSequenceWrapper>
    );
  }
}

CurriculumSequence.propTypes = {
  expandedModules: PropTypes.bool,
  curriculumList: PropTypes.array,
  windowWidth: PropTypes.number.isRequired
};

CurriculumSequence.defaultProps = {
  curriculum: null,
  curriculumList: [],
  expandedModules: []

};

const ModalHeader = styled.div`
display: flex;
align-items: center;
justify-content: center;
font-weight: 700;
font-size: 18px;
`;

const RadioGroupWrapper = styled.div`
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

const AddUnitSubHeaderButtonStyle = styled.div`
  color: ${mainBlueColor};
  border-color: ${mainBlueColor};
  display: flex;
  align-items: center;
  .ant-btn {
    display: flex;
    align-items: center;
  }
`;

const AddCustomContentSubHeaderButtonStyle = styled.div`
  color: ${mainBlueColor};
  border-color: ${mainBlueColor};
  display: flex;
  align-items: center;
  .ant-btn {
    display: flex;
    align-items: center;
  }
`;

const SelectContentSubHeaderButtonStyle = styled.div`
  color: ${mainBlueColor};
  border-color: ${mainBlueColor};
  display: flex;
  align-items: center;
  .ant-btn {
    display: flex;
    align-items: center;
  }
`;

const SourceSubHeaderButtonStyle = styled.div`
  color: ${mainBlueColor};
  border-color: ${mainBlueColor};
  display: flex;
  align-items: center;
  justify-self: flex-end;
  margin-left: auto;
  .ant-btn {
    display: flex;
    align-items: center;
  }
`;

const ShareButtonStyle = styled.div`
.ant-btn {
  padding: 10px;
  min-height: 40px;
  min-width: 120px;
  color: ${mainBlueColor};
  @media only screen and (max-width: 845px) {
  min-width: 40px;
  max-width: auto;
  padding: 0px;
}
}
`;

const SaveButtonStyle = styled.div`
.ant-btn {
  padding: 10px;
  min-height: 40px;
  min-width: 120px;
  background-color: ${green};

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

const AddUnitModalBody = styled.div`
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
    @media only screen and (max-width: 845px) {
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
  @media only screen and (max-width: 845px) {
  padding-left: 20px;
  padding-right: 20px;
}
`;

const CurriculumHeader = styled(FlexContainer)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: ${darkBlueSecondary};
  padding: 0px 40px;
  height: 62px;
  z-index: 1;
  @media only screen and (max-width: 845px) {
  padding: 0px 20px;
}
`;

const CurriculumSubheader = styled(FlexContainer)`
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
  @media only screen and (max-width: 480px) {
  padding-left: 30px;
}
@media only screen and (min-width: 846px) {
  padding: 0px 40px;
}
`;

const ButtonText = styled.div`
  text-transform: uppercase;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  @media only screen and (max-width: 845px) {
display: none;
}
`;

const ShareButtonText = styled.div`
  text-transform: uppercase;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 10px;
  font-weight: 600;
  @media only screen and (max-width: 845px) {
  padding-left: 0px;
  padding-right: 0px;
}
`;

const SaveButtonText = styled.div`
  text-transform: uppercase;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 10px;
  font-weight: 600;
`;

const CurriculumSequenceWrapper = styled.div`
  .ant-btn {
    height: 24px;
  }
`;

const HeaderTitle = styled.div`
  justify-self: flex-start;
  margin-right: auto;
  font-size: 20px;
  font-weight: 700;
  color: ${white}
`;

export default CurriculumSequence;

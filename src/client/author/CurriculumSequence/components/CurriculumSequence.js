import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Modal, Input, Cascader, Radio, Icon } from 'antd';
import { FlexContainer } from '@edulastic/common';
import { white, green, mainBlueColor, greenSecondary, largeDesktopWidth, desktopWidth } from '@edulastic/colors';
import customContentIcon from '../assets/custom-content.svg';
import addUnitIcon from '../assets/add-unit.svg';
import selectContentIcon from '../assets/select-content.svg';
import Curriculum from './Curriculum';
import ShareIcon from '../assets/share-button.svg';
import SelectContent from './SelectContent';
import {
  changeGuideAction,
  setGuideAction,
  setPublisherAction,
  saveGuideAlignmentAction
} from '../ducks';


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
* @property {function} onSave
* @property {function} addNewUnitToDestination
* @property {function} onDrop
* @property {function} onBeginDrag
* @property {function} onPublisherChange
* @property {function} onPublisherSave
* @property {CurriculumSearchResult[]} curriculumGuides
* @property {string} publisher
* @property {string} guide
* @property {function} setPublisher
* @property {function} setGuide
* @property {function} saveGuideAlignment
* @property {boolean} isContentExpanded
*/

// NOTE: primary theme color is different than in the screen design

const EUREKA_PUBLISHER = 'Eureka Math';
const TENMARKS_PUBLISHER = 'TenMarks';
const GOMATH_PUBLISHER = 'Go Math!';

/** @extends Component<CurriculumSequenceProps> */
class CurriculumSequence extends Component {

  state = {
    addUnit: false,
    addCustomContent: false,
    curriculumGuide: false,
    value: EUREKA_PUBLISHER,
    /** @type {Module | {}} */
    newUnit: {},
    selectedGuide: ''
  }

  componentDidMount() {
    const { setPublisher, publisher } = this.props;
    setPublisher(publisher);
  }

  onChange = (evt) => {
    const publisher = evt.target.value;
    const { setPublisher } = this.props;
    setPublisher(publisher);
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
    onSelectContent();
  }

  handleAddUnit = () => {
    this.setState((prevState) => ({ addUnit: !prevState.addUnit }));
  }

  handleGuideSave = () => {
    const { saveGuideAlignment } = this.props;
    this.setState({ curriculumGuide: false });
    saveGuideAlignment();
  }

  handleGuidePopup = () => {
    this.setState(prevState => ({ curriculumGuide: !prevState.curriculumGuide }));
  }

  handleGuideCancel = () => {
    this.setState({ curriculumGuide: false });
  }

  addNewUnitToDestination = () => {
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
    const [afterUnitId] = id;
    newUnit.afterUnitId = afterUnitId;
    this.setState({ newUnit });
  }

  onGuideChange = (wrappedId) => {
    const { setGuide } = this.props;
    const id = wrappedId[0];
    setGuide(id);
  }

  render() {
    const largeDesktopWidthValue = Number(largeDesktopWidth.split('px')[0]);
    const desktopWidthValue = Number(desktopWidth.split('px')[0]);
    const { onNewUnitNameChange, onUnitAfterIdChange, onGuideChange } = this;
    const { addUnit, addCustomContent, newUnit, curriculumGuide } = this.state;
    const { expandedModules, onCollapseExpand, curriculumList, destinationCurriculumSequence, sourceCurriculumSequence, addContentToCurriculumSequence, onSelectContent, windowWidth, onSourceCurriculumSequenceChange, selectContent, onDrop, onBeginDrag, curriculumGuides, publisher, guide, isContentExpanded } = this.props;

    // Options for add unit
    const options1 = destinationCurriculumSequence.modules.map((module) => ({ value: module.id, label: module.name }))

    // TODO: change options2 to something more meaningful
    const options2 = [{ value: 'Lesson', label: 'Lesson' }, { value: 'Lesson 2', label: 'Lesson 2' }];

    // Dropdown options for guides
    const guidesDropdownOptions = curriculumGuides.map(item => ({ value: item._id, label: item.title }));

    const { title } = destinationCurriculumSequence;

    const isSelectContent = selectContent && destinationCurriculumSequence;

    // Module progress
    const totalModules = destinationCurriculumSequence.modules.length;
    const modulesCompleted = destinationCurriculumSequence.modules.filter(m => m.completed === true).length;

    return (
      <CurriculumSequenceWrapper>
        <Modal
          visible={addUnit}
          title="Add Unit"
          onOk={this.handleAddUnit}
          onCancel={this.handleAddUnit}
          footer={null}
          style={windowWidth > desktopWidthValue ? { minWidth: '640px', padding: '20px' } : { padding: '20px' }}
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
          style={windowWidth > desktopWidthValue ? { minWidth: '640px', padding: '20px' } : { padding: '20px' }}
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
          onOk={this.handleGuideSave}
          onCancel={this.handleGuideCancel}
          footer={null}
          style={windowWidth > desktopWidthValue ? { minWidth: '640px', padding: '20px' } : { padding: '20px' }}
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
              <Radio.Group onChange={this.onChange} value={publisher}>
                <Radio checked={publisher === EUREKA_PUBLISHER} value={EUREKA_PUBLISHER}>Eureka/EngageNY</Radio>
                <Radio checked={publisher === TENMARKS_PUBLISHER} value={TENMARKS_PUBLISHER}>TenMarks</Radio>
                <Radio checked={publisher === GOMATH_PUBLISHER} value={GOMATH_PUBLISHER}>GoMath!</Radio>
              </Radio.Group>
            </RadioGroupWrapper>
            <GuidesDropdownWrapper>
              {guidesDropdownOptions.length > 0 && (
                <Input.Group compact>
                  <Cascader key={guide} onChange={onGuideChange} defaultValue={[guide]} style={{ width: '100%' }} options={guidesDropdownOptions} />
                </Input.Group>
              )}
            </GuidesDropdownWrapper>
          </GuideModalBody>
          <ModalFooter>
            <Button type="primary" ghost key="back" onClick={this.handleGuideCancel}>
              CANCEL
            </Button>
            <Button key="submit" type="primary" onClick={this.handleGuideSave}>
              SAVE
            </Button>
          </ModalFooter>
        </Modal>
        <TopBar>
        <CurriculumHeader>
          <HeaderTitle>{title}
            <Icon style={{ fontSize: '16px', cursor: 'pointer', marginLeft: '10px' }} type={curriculumGuide ? "up" : "down"} onClick={this.handleGuidePopup} />
          </HeaderTitle>
          <ShareButtonStyle>
            <Button type="default">
              <ShareButtonText>{windowWidth > desktopWidthValue ? 'SHARE' : <img src={ShareIcon} alt="SHARE" style={{ width: '100%' }} />}</ShareButtonText>
            </Button>
          </ShareButtonStyle>
          <SaveButtonStyle windowWidth={windowWidth}>
            <Button type="primary">
              <SaveButtonText onClick={this.handleSaveClick}>{windowWidth > desktopWidthValue ? 'Save Changes' : 'Save'}</SaveButtonText>
            </Button>
          </SaveButtonStyle>
        </CurriculumHeader>
        <CurriculumSubheader active={isContentExpanded}>
          <ModuleProgressWrapper>
            <ModuleProgressLabel>
              <ModuleProgressText>
                Module Progress
              </ModuleProgressText>
              <ModuleProgressValues>
                {modulesCompleted} / {totalModules} Completed
              </ModuleProgressValues>
            </ModuleProgressLabel>
            <ModuleProgress modules={destinationCurriculumSequence.modules} />
          </ModuleProgressWrapper>
          <SubheaderActions>
            <AddUnitSubHeaderButtonStyle>
              <Button onClick={this.handleAddUnitOpen} type="primary">
                <img src={addUnitIcon} alt="Add unit" />
                <ButtonText>Add Unit</ButtonText>
              </Button>
            </AddUnitSubHeaderButtonStyle>
            <SelectContentSubHeaderButtonStyle active={isContentExpanded}>
              <Button onClick={this.handleSelectContent} type="primary">
                <img src={selectContentIcon} alt="Select content" />
                <ButtonText>Select Content</ButtonText>
              </Button>
            </SelectContentSubHeaderButtonStyle>
            <AddCustomContentSubHeaderButtonStyle>
              <Button onClick={this.handleAddCustomContent} type="primary">
                <img src={customContentIcon} alt="Custom content" />
                <ButtonText>Add Custom Content</ButtonText>
              </Button>
            </AddCustomContentSubHeaderButtonStyle>
          </SubheaderActions>
        </CurriculumSubheader>
        </TopBar>
        <Wrapper>
          {destinationCurriculumSequence && (
            <Curriculum
              padding={selectContent}
              curriculum={destinationCurriculumSequence}
              expandedModules={expandedModules}
              onCollapseExpand={onCollapseExpand}
              onDrop={onDrop}
            />
          )}
          {isSelectContent && (
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
          )}
        </Wrapper>
      </CurriculumSequenceWrapper>
    );
  }
}

CurriculumSequence.propTypes = {
  publisher: PropTypes.string,
  guide: PropTypes.string,
  expandedModules: PropTypes.bool,
  curriculumList: PropTypes.array,
  windowWidth: PropTypes.number.isRequired,
  onPublisherChange: PropTypes.func.isRequired,
  onPublisherSave: PropTypes.func.isRequired,
  curriculumGuides: PropTypes.array,
  setPublisher: PropTypes.func.isRequired,
  setGuide: PropTypes.func.isRequired,
  saveGuideAlignment: PropTypes.func.isRequired
};

CurriculumSequence.defaultProps = {
  publisher: EUREKA_PUBLISHER,
  guide: '',
  curriculumList: [],
  expandedModules: [],
  curriculumGuides: []
};

const ModuleProgress = ({ modules }) => (
  <ModuleProgressBars>
    {modules.map(m => (
      <ModuleProgressBar completed={m.completed} />
    ))}
  </ModuleProgressBars>
);

const TopBar = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${greenSecondary};
`;

const SubheaderActions = styled.div`
  display: flex;
  @media only screen and (max-width: 1200px) {
    margin-top: 20px;
    justify-content: flex-start;
    margin-right: auto;
  }
`;

const ModuleProgressBar = styled.div`
  border-radius: 1px;
  width: 40px;
  height: 6px;
  margin-right: 6px;
  background: ${(props) => props.completed ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.6)'};
`;

const ModuleProgressLabel = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: 4px;
`;

const ModuleProgressBars = styled.div`
  width: 100%;
  display: flex;
`;

const ModuleProgressWrapper = styled.div`
  z-index: 100;
  justify-self: flex-start;
  width: 100%;
  align-items: center;
`;
ModuleProgressWrapper.displayName = 'ModuleProgressWrapper';

const ModuleProgressText = styled.div`
  color: rgba(255,255,255, 1);
  padding-right: 8px;
  font-weight: 600;
`;

const ModuleProgressValues = styled.div`
  color: rgba(1, 1, 1, 1);
  font-weight: 600;
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
  display: flex;
  align-items: center;
  .ant-btn {
    color: ${white};
    border-color: ${white};
    background-color: transparent;
    display: flex;
    align-items: center;
  }
  .ant-btn:hover {
    background-color: ${mainBlueColor};
    color: ${white};
    border-color: ${mainBlueColor};
  }
`;

const AddCustomContentSubHeaderButtonStyle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  .ant-btn {
    color: ${white};
    border-color: ${white};
    background-color: transparent;
    display: flex;
    align-items: center;
  }
  .ant-btn:hover {
    background-color: ${mainBlueColor};
    color: ${white};
    border-color: ${mainBlueColor};
  }
`;

const SelectContentSubHeaderButtonStyle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  /* TODO: responsive paddings - negative margin on the parent */
  .ant-btn {
    color: ${white};
    border-color: ${props => props.active ? mainBlueColor : white };
    background-color: ${props => props.active ? mainBlueColor : 'transparent' };
    display: flex;
    align-items: center;
  }
  .ant-btn:hover {
    background-color: ${mainBlueColor};
    color: ${white};
    border-color: ${mainBlueColor};
  }
`;

const ShareButtonStyle = styled.div`
.ant-btn {
  padding: 10px;
  min-height: 40px;
  min-width: 120px;
  color: ${mainBlueColor};
  @media only screen and (max-width: ${largeDesktopWidth}) {
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
  border-color: ${green};
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
  margin-top: -50px;
  @media only screen and (max-width: ${desktopWidth}) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const CurriculumHeader = styled(FlexContainer)`
width: 100%;
z-index: 0;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  padding: 20px 40px 50px 30px;
  align-items: center;

  @media only screen and (max-width: 320px) {
    padding: 10px 20px;
  }

@media only screen and (min-width: 846px) {
    padding: 20px 40px 50px 40px;
  }
`;

const CurriculumSubheader = styled.div`
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 60px;
  z-index: 1;
  display: flex;
  align-items: center;
  @media only screen and (max-width: 1200px) {
    flex-direction: column;
    justify-self: flex-start;
    margin-right: auto;
  }
  @media only screen and (min-width: 1800px) {
    width: ${props => props.active ? '60%' : '100%' };
    padding-right: 30px;
  }
  @media only screen and (max-width: 480px) {
    padding-left: 20px;
  }
`;
CurriculumSubheader.displayName = 'CurriculumSubheader';

const ButtonText = styled.div`
  text-transform: uppercase;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  @media only screen and (max-width: ${desktopWidth}) {
    display: none;
  }
`;

const ShareButtonText = styled.div`
  text-transform: uppercase;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 10px;
  font-weight: 600;
  @media only screen and (max-width: ${desktopWidth}) {
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

const mapDispatchToProps = dispatch => ({
  onGuideChange(id) {
    dispatch(changeGuideAction(id));
  },
  setPublisher(name) {
    dispatch(setPublisherAction(name));
  },
  setGuide(id) {
    dispatch(setGuideAction(id));
  },
  saveGuideAlignment() {
    dispatch(saveGuideAlignmentAction());
  }
});

const enhance = compose(
  connect(
    ({ curriculumSequence }) => ({
      curriculumGuides: curriculumSequence.guides,
      publisher: curriculumSequence.selectedPublisher,
      guide: curriculumSequence.selectedGuide,
      isContentExpanded: curriculumSequence.isContentExpanded
    }),
    mapDispatchToProps
  )
);

export default enhance(CurriculumSequence);

// export default CurriculumSequence;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { PaddingDiv, CustomQuillComponent } from '@edulastic/common';
import { IconUpload, IconDrawResize, IconPin } from '@edulastic/icons';
import { greenDark } from '@edulastic/colors';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import 'react-quill/dist/quill.snow.css';
import { Button, Checkbox, Input, InputNumber, Select, Upload, message } from 'antd';
import { ChromePicker } from 'react-color';
import styled from 'styled-components';

import SortableItemContainer from './SortableItemContainer';
import Subtitle from '../common/Sutitle';
import AddNewChoiceBtn from './AddNewChoiceBtn';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';
import DeleteButton from '../components/DeleteButton';
import FlexView from '../components/FlexView';
import DropArea from '../common/DropArea';

const DragHandle = SortableHandle(() => <i className="fa fa-align-justify" />);

const defaultImageURL = 'https://assets.learnosity.com/demos/docs/colored_world_map.png';

// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;
const { Dragger } = Upload;

const SortableItem = SortableElement(({ value, onRemove, onChange }) => (
  <SortableItemContainer>
    <div className="main">
      <DragHandle />
      <div>
        <input style={{ background: 'transparent' }} type="text" value={value} onChange={onChange} />
      </div>
    </div>
    <DeleteButton onDelete={onRemove} />
  </SortableItemContainer>
));

const SortableList = SortableContainer(({ items, onRemove, onChange }) => (
  <FlexContainer style={{ flexFlow: 'row wrap' }}>
    {items.map((value, index) => (
      <SortableItem
        key={index}
        index={index}
        value={value}
        onRemove={() => onRemove(index)}
        onChange={e => onChange(index, e)}
      />
    ))}
  </FlexContainer>
));

class clozeImageDragDropAuthoring extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
  };

  state = {
    isColorPickerVisible: false,
  }

  getNewItem() {
    const { item } = this.props;
    return cloneDeep(item);
  }

  onChangeQuesiton = (html) => {
    const stimulus = html;
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, stimulus });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options = arrayMove(newItem.options, oldIndex, newIndex);
    setQuestionData(newItem);
  };

  remove = (index) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options.splice(index, 1);
    setQuestionData(newItem);
  };

  editOptions = (index, e) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options[index] = e.target.value;
    setQuestionData(newItem);
  };

  addNewChoiceBtn = () => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options.push('new choice');
    setQuestionData(newItem);
  };

  onResponsePropChange = (prop, value) => {
    console.log('prop', prop, value);
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    if (newItem.responseLayout === undefined) {
      newItem.responseLayout = {};
    }
    newItem.responseLayout[prop] = value;
    setQuestionData({ ...newItem });
  }

  onItemPropChange = (prop, value) => {
    console.log('prop changed');
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem[prop] = value;
    setQuestionData({ ...newItem });
  };

  onResponseLabelChange = (index, value) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.responses[index].label = value;
    setQuestionData({ ...newItem });
  }

  showColorPicker = (status) => {
    this.setState({ isColorPickerVisible: status });
  }

  updateData = (item) => {
    this.onItemPropChange('responses', item);
  }

  handlePointersChange = (value) => {
    const { item, setQuestionData } = this.props;
    const newResponses = item.responses.map((it) => {
      if (it.active) {
        it.pointerPosition = value;
      }
      return it;
    });
    setQuestionData({ ...item, responses: newResponses });
  }

  handleImageUpload = (info) => {
    const { status, response } = info.file;
    console.log('info:', info);
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      const imageUrl = response.result.files.file[0].providerResponse.location;
      this.onItemPropChange('imageUrl', imageUrl);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  render() {
    const { t, item } = this.props;
    const { maxRespCount, responseLayout, imageAlterText, isEditAriaLabels, responses, imageWidth } = item;
    const { isColorPickerVisible } = this.state;
    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;

    return (
      <div>
        <PaddingDiv bottom={20}>
          <Subtitle>{t('component.clozeImageDragDrop.composequestion')}</Subtitle>
          <CustomQuillComponent
            toolbarId="stimulus"
            wrappedRef={(instance) => { this.stimulus = instance; }}
            placeholder={t('component.clozeImageDragDrop.thisisstem')}
            onChange={this.onChangeQuesiton}
            showResponseBtn={false}
            value={item.stimulus}
          />
          <PaddingDiv top={30} />
          <FlexContainer style={{ background: '#efefefc2', height: 70, fontSize: 13 }}>
            <div style={{ alignItems: 'center' }}>
              <InputNumber defaultValue={imageWidth || 600} onChange={val => this.onItemPropChange('imageWidth', val)} />
              <PaddingDiv left={20}>
                {t('component.clozeImageDragDrop.widthpx')}
              </PaddingDiv>
            </div>
            <div style={{ alignItems: 'center' }}>
              <Input
                size="large"
                style={{ width: 220 }}
                defaultValue={imageAlterText}
                onChange={val => this.onItemPropChange('imageAlterText', val.target.value)}
              />
              <PaddingDiv left={20}>
                {t('component.clozeImageDragDrop.imagealtertext')}
              </PaddingDiv>
            </div>
            <div style={{ alignItems: 'center' }}>
              <ColorBox
                style={{ background: responseLayout && responseLayout.background }}
                onClick={() => this.showColorPicker(true)}
              />
              {isColorPickerVisible && (
                <ColorPickerContainer>
                  <ColorPickerWrapper onClick={() => this.showColorPicker(false)} />
                  <ChromePicker
                    color={responseLayout && responseLayout.background}
                    onChangeComplete={color => this.onResponsePropChange('background', color.hex)}
                  />
                </ColorPickerContainer>
              )}
              <PaddingDiv left={20}>
                {t('component.clozeImageDragDrop.fillcolor')}
              </PaddingDiv>
            </div>
            <div style={{ alignItems: 'center' }}>
              <InputNumber
                min={1}
                max={10}
                style={{ width: 100 }}
                defaultValue={maxRespCount}
                onChange={val => this.onResponsePropChange('maxRespCount', val)}
              />
              <PaddingDiv left={20} style={{ width: 160 }}>
                {t('component.clozeImageDragDrop.maximumresponses')}
              </PaddingDiv>
            </div>
          </FlexContainer>
          <PaddingDiv top={30} />
          <FlexContainer>
            <div
              className="controls-bar"
              style={{ width: 120, background: '#fbfafc', alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'column' }}
            >
              <Button style={{ width: 100, height: 100, whiteSpace: 'normal' }}>
                <IconDrawResize width={20} height={20} color={greenDark} />
                {t('component.clozeImageDragDrop.drawresize')}
              </Button>
              <div style={{ position: 'relative', width: 100, marginTop: 10, marginBottom: 10, }}>
                <Button disabled={!hasActive} style={{ width: 100, height: 100, position: 'absolute', top: 0, left: 0, whiteSpace: 'normal' }}>
                  <IconPin width={20} height={20} />
                  {t('component.clozeImageDragDrop.pointers')}
                </Button>
                <Select disabled={!hasActive} defaultValue="none" style={{ width: 100, height: 100, position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'flex-end' }} onChange={this.handlePointersChange}>
                  <Option value="none">None</Option>
                  <Option value="top">Top</Option>
                  <Option value="bottom">Bottom</Option>
                  <Option value="left">Left</Option>
                  <Option value="right">Right</Option>
                </Select>
              </div>
            </div>
            <FlexView
              size={1}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginLeft: 20
              }}
            >
              <div style={{ position: 'relative', top: 0, left: 0, minHeight: 400, display: 'flex', padding: 20 }}>
                {item.imageUrl && (
                  <React.Fragment>
                    <img src={defaultImageURL} width={700} alt="resp-preview" style={{ userSelect: 'none', pointerEvents: 'none' }} />
                    <DropArea updateData={this.updateData} item={item} key={item} />
                  </React.Fragment>
                )}
                {!item.imageUrl && (
                  <Dragger
                    name="file"
                    action="//ec2-34-227-229-142.compute-1.amazonaws.com:3100/api/files/edureact-dev/upload"
                    onChange={this.handleImageUpload}
                  >
                    <p className="ant-upload-drag-icon">
                      <IconUpload width={100} height={100} color="#e6e6e6" />
                    </p>
                    <p className="ant-upload-hint"><strong>Drag & Drop</strong></p>
                    <h2 className="ant-upload-text">YOUR OWN Image</h2>
                    <p className="ant-upload-hint">OR BROWSE: PNG, JPG, GIF (1024KB MAX.)</p>
                  </Dragger>
                )}
              </div>
              <PaddingDiv top={30} style={{ alignSelf: 'flex-start' }}>
                <Checkbox
                  defaultChecked={responseLayout && responseLayout.showdashedborder}
                  onChange={val => this.onResponsePropChange('showdashedborder', val.target.checked)}
                >
                  {t('component.clozeImageDragDrop.showdashedborder')}
                </Checkbox>
                <Checkbox
                  defaultChecked={isEditAriaLabels}
                  onChange={val => this.onItemPropChange('isEditAriaLabels', val.target.checked)}
                >
                  {t('component.clozeImageDragDrop.editAriaLabels')}
                </Checkbox>
              </PaddingDiv>
            </FlexView>
          </FlexContainer>
          <PaddingDiv>
            {isEditAriaLabels && (
              <React.Fragment>
                <Subtitle>{t('component.clozeImageDragDrop.editAriaLabels')}</Subtitle>
                {responses.map((responseContainer, index) => (
                  <div className="imagelabeldragdrop-droppable iseditablearialabel" key={index}>
                    <span className="index-box">{index + 1}</span>
                    <Input
                      defaultValue={responseContainer.label}
                      onChange={value => this.onResponseLabelChange(index, value)}
                    />
                  </div>
                ))}
              </React.Fragment>
            )}
          </PaddingDiv>
          <PaddingDiv>
            <Subtitle>{t('component.clozeImageDragDrop.possibleresponses')}</Subtitle>
            <SortableList
              items={item.options}
              onSortEnd={this.onSortEnd}
              useDragHandle
              onRemove={this.remove}
              onChange={this.editOptions}
            />
            <div>
              <AddNewChoiceBtn onClick={() => this.addNewChoiceBtn()}>
                {t('component.clozeImageDragDrop.addnewchoice')}
              </AddNewChoiceBtn>
            </div>
          </PaddingDiv>
        </PaddingDiv>
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  connect(
    null,
    { setQuestionData: setQuestionDataAction },
  ),
);

export default enhance(clozeImageDragDropAuthoring);

const ColorPickerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const ColorPickerContainer = styled.div`
  position: relative;
  top: 20px;
  left: -30px;
  width: 0;
  height: 0;
  z-index: 1000;
`;

const ColorBox = styled.div`
  width: 30px;
  height: 30px;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 10px;
  background: white;
`;

const FlexContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;

  & > div {
    display: flex;
  }
`;

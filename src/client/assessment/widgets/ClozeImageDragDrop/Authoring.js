import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import 'react-quill/dist/quill.snow.css';
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Upload,
  message
} from 'antd';
import { ChromePicker } from 'react-color';

import { PaddingDiv, CustomQuillComponent } from '@edulastic/common';
import { IconUpload, IconDrawResize, IconPin } from '@edulastic/icons';
import { greenDark } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { API_CONFIG } from '@edulastic/api';

import { setQuestionDataAction } from '../../../author/src/actions/question';

import DropArea from '../../containers/DropArea';
import SortableList from '../../components/SortableList/index';
import { FlexView } from '../../styled/FlexView';
import { AddNewChoiceBtn } from '../../styled/AddNewChoiceBtn';
import { Subtitle } from '../../styled/Subtitle';

import { ColorBox } from './styled/ColorBox';
import { ColorPickerContainer } from './styled/ColorPickerContainer';
import { ColorPickerWrapper } from './styled/ColorPickerWrapper';
import { FlexContainer } from './styled/FlexContainer';

const { Option } = Select;
const { Dragger } = Upload;

class Authoring extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired
  };

  state = {
    isColorPickerVisible: false
  };

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
    const { setQuestionData, t } = this.props;
    const newItem = this.getNewItem();
    newItem.options.push(t('component.clozeImageDragDrop.newChoice'));
    setQuestionData(newItem);
  };

  onResponsePropChange = (prop, value) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    if (newItem.responseLayout === undefined) {
      newItem.responseLayout = {};
    }
    newItem.responseLayout[prop] = value;
    setQuestionData({ ...newItem });
  };

  onItemPropChange = (prop, value) => {
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
  };

  showColorPicker = (status) => {
    this.setState({ isColorPickerVisible: status });
  };

  updateData = (item) => {
    this.onItemPropChange('responses', item);
  };

  handlePointersChange = (value) => {
    const { item, setQuestionData } = this.props;
    const newResponses = item.responses.map((it) => {
      if (it.active) {
        it.pointerPosition = value;
      }
      return it;
    });
    setQuestionData({ ...item, responses: newResponses });
  };

  handleImageUpload = (info) => {
    const { status, response } = info.file;
    const { t } = this.props;
    if (status === 'done') {
      message.success(`${info.file.name} ${t('component.clozeImageDragDrop.fileUploadedSuccessfully')}.`);
      const imageUrl = response.result.fileUri;
      this.onItemPropChange('imageUrl', imageUrl);
    } else if (status === 'error') {
      message.error(`${info.file.name} ${t('component.clozeImageDragDrop.fileUploadFailed')}.`);
    }
  };

  render() {
    const { t, item } = this.props;
    const {
      maxRespCount,
      responseLayout,
      background,
      imageAlterText,
      isEditAriaLabels,
      responses,
      imageWidth
    } = item;

    const { isColorPickerVisible } = this.state;
    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;

    const draggerProps = {
      name: 'file',
      action: `${API_CONFIG.api}/file/upload`,
      headers: {
        authorization: localStorage.getItem('access_token')
      }
    };
    return (
      <div>
        <PaddingDiv bottom={20}>
          <Subtitle>{t('component.clozeImageDragDrop.composequestion')}</Subtitle>
          <CustomQuillComponent
            toolbarId="stimulus"
            wrappedRef={(instance) => {
              this.stimulus = instance;
            }}
            placeholder={t('component.clozeImageDragDrop.thisisstem')}
            onChange={this.onChangeQuesiton}
            showResponseBtn={false}
            value={item.stimulus}
          />
          <PaddingDiv top={30} />
          <FlexContainer style={{ background: '#efefefc2', height: 70, fontSize: 13 }}>
            <div style={{ alignItems: 'center' }}>
              <InputNumber
                defaultValue={imageWidth || 600}
                onChange={val => this.onItemPropChange('imageWidth', val)}
              />

              <PaddingDiv left={20}>{t('component.clozeImageDragDrop.widthpx')}</PaddingDiv>
            </div>
            <div style={{ alignItems: 'center' }}>
              <Input
                size="large"
                style={{ width: 220 }}
                defaultValue={imageAlterText}
                onChange={val => this.onItemPropChange('imageAlterText', val.target.value)}
              />
              <PaddingDiv left={20}>{t('component.clozeImageDragDrop.imagealtertext')}</PaddingDiv>
            </div>
            <div style={{ alignItems: 'center' }}>
              <ColorBox
                style={{ backgroundColor: background }}
                onClick={() => this.showColorPicker(true)}
              />
              {isColorPickerVisible && (
                <ColorPickerContainer>
                  <ColorPickerWrapper onClick={() => this.showColorPicker(false)} />
                  <ChromePicker
                    color={background}
                    onChangeComplete={color => this.onItemPropChange('background', color.hex)}
                  />
                </ColorPickerContainer>
              )}
              <PaddingDiv left={20}>{t('component.clozeImageDragDrop.fillcolor')}</PaddingDiv>
            </div>
            <div style={{ alignItems: 'center' }}>
              <InputNumber
                min={1}
                max={10}
                style={{ width: 100 }}
                defaultValue={maxRespCount}
                onChange={val => this.onItemPropChange('maxRespCount', val)}
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
              style={{
                width: 120,
                background: '#fbfafc',
                alignItems: 'center',
                alignSelf: 'flex-start',
                flexDirection: 'column'
              }}
            >
              <Button style={{ width: 100, height: 100, whiteSpace: 'normal' }}>
                <IconDrawResize width={20} height={20} color={greenDark} />
                {t('component.clozeImageDragDrop.drawresize')}
              </Button>

              <div
                style={{
                  position: 'relative',
                  width: 100,
                  marginTop: 10,
                  marginBottom: 10
                }}
              >
                <Button
                  disabled={!hasActive}
                  style={{
                    width: 100,
                    height: 100,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    whiteSpace: 'normal'
                  }}
                >
                  <IconPin width={20} height={20} />
                  {t('component.clozeImageDragDrop.pointers')}
                </Button>
                <Select
                  disabled={!hasActive}
                  defaultValue="none"
                  style={{
                    width: 100,
                    height: 100,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    alignItems: 'flex-end'
                  }}
                  onChange={this.handlePointersChange}
                >
                  <Option value="none">{t('component.clozeImageDragDrop.none')}</Option>
                  <Option value="top">{t('component.clozeImageDragDrop.top')}</Option>
                  <Option value="bottom">{t('component.clozeImageDragDrop.bottom')}</Option>
                  <Option value="left">{t('component.clozeImageDragDrop.left')}</Option>
                  <Option value="right">{t('component.clozeImageDragDrop.right')}</Option>
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
              <div
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  minHeight: 400,
                  padding: 0,
                  width: imageWidth || 600
                }}
              >
                {item.imageUrl && (
                  <React.Fragment>
                    <img
                      src={item.imageUrl}
                      width="100%"
                      alt="resp-preview"
                      style={{ userSelect: 'none', pointerEvents: 'none' }}
                    />
                    <DropArea updateData={this.updateData} item={item} key={item} />
                  </React.Fragment>
                )}
                {!item.imageUrl && (
                  <Dragger {...draggerProps} onChange={this.handleImageUpload}>
                    <p className="ant-upload-drag-icon">
                      <IconUpload width={100} height={100} color="#e6e6e6" />
                    </p>
                    <p className="ant-upload-hint">
                      <strong>{t('component.clozeImageDragDrop.draganddrop')}</strong>
                    </p>
                    <h2 className="ant-upload-text">{t('component.clozeImageDragDrop.yourOwnImage')}</h2>
                    <p className="ant-upload-hint">{t('component.clozeImageDragDrop.orBrowse')}: PNG, JPG, GIF (1024KB MAX.)</p>
                  </Dragger>
                )}
              </div>
              <PaddingDiv top={30} style={{ alignSelf: 'flex-start' }}>
                <Checkbox
                  defaultChecked={responseLayout && responseLayout.showdashedborder}
                  onChange={val =>
                    this.onResponsePropChange('showdashedborder', val.target.checked)
                  }
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
                      onChange={e => this.onResponseLabelChange(index, e.target.value)}
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
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(Authoring);

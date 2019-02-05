import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import 'react-quill/dist/quill.snow.css';
import {
  Checkbox,
  Input,
  Select,
  Upload,
  message
} from 'antd';
import { ChromePicker } from 'react-color';

import { API_CONFIG } from '@edulastic/api';
import { PaddingDiv } from '@edulastic/common';
import { IconUpload, IconDrawResize, IconPin } from '@edulastic/icons';
import { withNamespaces } from '@edulastic/localization';
import { greenDark } from '@edulastic/colors';

import { setQuestionDataAction } from '../../../author/src/actions/question';

import DropArea from '../../containers/DropArea';
import { AddNewChoiceBtn } from '../../styled/AddNewChoiceBtn';
import { Subtitle } from '../../styled/Subtitle';
import SortableList from '../../components/SortableList';


import { StyledCustomQuill } from './styled/StyledCustomQuill';
import { FormContainer } from './styled/FormContainer';
import { ImageWidthInput } from './styled/ImageWidthInput';
import { ImageAlterTextInput } from './styled/ImageAlterTextInput';
import { ColorBox } from './styled/ColorBox';
import { ColorPickerContainer } from './styled/ColorPickerContainer';
import { ColorPickerWrapper } from './styled/ColorPickerWrapper';
import { MaxRespCountInput } from './styled/MaxRespCountInput';
import { FlexContainer } from './styled/FlexContainer';
import { ControlBar } from './styled/ControlBar';
import { ControlButton } from './styled/ControlButton';
import { PointerContainer } from './styled/PointerContainer';
import { PointerSelect } from './styled/PointerSelect';
import { ImageFlexView } from './styled/ImageFlexView';
import { ImageContainer } from './styled/ImageContainer';
import { PreviewImage } from './styled/PreviewImage';
import { CheckContainer } from './styled/CheckContainer';

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

  onSortEnd = (index, { oldIndex, newIndex }) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options[index] = arrayMove(newItem.options[index], oldIndex, newIndex);
    setQuestionData(newItem);
  };

  remove = (index, itemIndex) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options[index].splice(itemIndex, 1);
    setQuestionData(newItem);
  };

  editOptions = (index, itemIndex, e) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    if (newItem.options[index] === undefined) newItem.options[index] = [];
    newItem.options[index][itemIndex] = e.target.value;
    setQuestionData(newItem);
  };

  addNewChoiceBtn = (index) => {
    const { setQuestionData, t } = this.props;
    const newItem = this.getNewItem();
    if (newItem.options[index] === undefined) newItem.options[index] = [];
    newItem.options[index].push(t('component.clozeImageText.newChoice'));
    setQuestionData(newItem);
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
      message.success(`${info.file.name} ${t('component.clozeImageText.fileUploadedSuccessfully')}.`);
      const imageUrl = response.result.fileUri;
      this.onItemPropChange('imageUrl', imageUrl);
    } else if (status === 'error') {
      message.error(`${info.file.name} ${t('component.clozeImageText.fileUploadFailed')}.`);
    }
  };

  render() {
    const { t, item } = this.props;
    const {
      maxRespCount,
      background,
      imageAlterText,
      isEditAriaLabels,
      responses,
      imageWidth
    } = item;

    const { isColorPickerVisible } = this.state;
    const hasActive =
      item.responses &&
      item.responses.filter(it => it.active === true).length > 0;

    const draggerProps = {
      name: 'file',
      action: `${API_CONFIG.api}/file/upload`,
      headers: {
        authorization:
          localStorage.getItem('access_token')
      },
      className: 'drag-full-parent'
    };
    return (
      <div>
        <PaddingDiv>
          <Subtitle>
            {t('component.clozeImageText.composequestion')}
          </Subtitle>
          <StyledCustomQuill
            toolbarId="stimulus"
            wrappedRef={(instance) => {
              this.stimulus = instance;
            }}
            placeholder={t('component.clozeImageText.thisisstem')}
            onChange={this.onChangeQuesiton}
            showResponseBtn={false}
            value={item.stimulus}
          />
          <PaddingDiv top={30} />
          <FormContainer>
            <div style={{ alignItems: 'center' }}>
              <ImageWidthInput
                defaultValue={imageWidth}
                onChange={val => this.onItemPropChange('imageWidth', val)}
              />

              <PaddingDiv left={20}>
                {t('component.clozeImageText.widthpx')}
              </PaddingDiv>

            </div>
            <div style={{ alignItems: 'center' }}>
              <ImageAlterTextInput
                size="large"
                defaultValue={imageAlterText}
                onChange={val =>
                  this.onItemPropChange('imageAlterText', val.target.value)
                }
              />
              <PaddingDiv left={20}>{t('component.clozeImageText.imagealtertext')}</PaddingDiv>
            </div>
            <div style={{ alignItems: 'center' }}>
              <ColorBox
                background={background}
                onClick={() => this.showColorPicker(true)}
              />
              {isColorPickerVisible && (
                <ColorPickerContainer>
                  <ColorPickerWrapper
                    onClick={() => this.showColorPicker(false)}
                  />
                  <ChromePicker
                    color={background}
                    onChangeComplete={color =>
                      this.onItemPropChange('background', color.hex)
                    }
                  />
                </ColorPickerContainer>
              )}
              <PaddingDiv left={20}>{t('component.clozeImageText.fillcolor')}</PaddingDiv>
            </div>
            <div style={{ alignItems: 'center' }}>
              <MaxRespCountInput
                min={1}
                max={10}
                defaultValue={maxRespCount}
                onChange={val => this.onItemPropChange('maxRespCount', val)}
              />
              <PaddingDiv left={20} style={{ width: 160 }}>
                {t('component.clozeImageText.maximumresponses')}
              </PaddingDiv>
            </div>
          </FormContainer>
          <FlexContainer style={{ padding: 0, background: '#fbfafc', borderRadius: '0px 0px 10px 10px', overflow: 'hidden' }}>
            <ControlBar>
              <ControlButton>
                <IconDrawResize width={20} height={20} color={greenDark} />
                {t('component.clozeImageText.drawresize')}
              </ControlButton>

              <PointerContainer className="controls-bar">
                <ControlButton disabled={!hasActive}>
                  <IconPin width={20} height={20} />
                  {t('component.clozeImageText.pointers')}
                </ControlButton>
                <PointerSelect
                  disabled={!hasActive}
                  defaultValue="none"
                  onChange={this.handlePointersChange}
                >
                  <Option value="none">
                    {t('component.clozeImageText.none')}
                  </Option>
                  <Option value="top">
                    {t('component.clozeImageText.top')}
                  </Option>
                  <Option value="bottom">
                    {t('component.clozeImageText.bottom')}
                  </Option>
                  <Option value="left">
                    {t('component.clozeImageText.left')}
                  </Option>
                  <Option value="right">
                    {t('component.clozeImageText.right')}
                  </Option>
                </PointerSelect>
              </PointerContainer>
            </ControlBar>
            <ImageFlexView size={1}>
              <ImageContainer width={imageWidth}>
                {item.imageUrl && (
                  <React.Fragment>
                    <PreviewImage
                      src={item.imageUrl}
                      width="100%"
                      alt="resp-preview"
                    />
                    <DropArea
                      updateData={this.updateData}
                      item={item}
                      key={item}
                    />

                  </React.Fragment>
                )}
                {!item.imageUrl && (
                  <Dragger {...draggerProps} onChange={this.handleImageUpload}>
                    <p className="ant-upload-drag-icon">
                      <IconUpload width={100} height={100} color="#e6e6e6" />
                    </p>
                    <p className="ant-upload-hint" style={{ color: 'rgb(230, 230, 230)' }}>
                      <strong>Drag & Drop</strong>
                    </p>
                    <h2 className="ant-upload-text" style={{ color: 'rgb(177, 177, 177)' }}>{t('component.clozeImageText.yourOwnImage')}</h2>
                    <p className="ant-upload-hint" style={{ color: 'rgb(230, 230, 230)' }}>
                      {t('component.clozeImageText.orBrowse')}: PNG, JPG, GIF (1024KB MAX.)
                    </p>
                  </Dragger>
                )}
              </ImageContainer>
              <CheckContainer>
                <Checkbox
                  defaultChecked={isEditAriaLabels}
                  onChange={val =>
                    this.onItemPropChange(
                      'isEditAriaLabels',
                      val.target.checked
                    )
                  }
                >
                  {t('component.clozeImageText.editAriaLabels')}
                </Checkbox>
              </CheckContainer>
            </ImageFlexView>
          </FlexContainer>
          <PaddingDiv>
            {isEditAriaLabels && (
              <React.Fragment>
                <Subtitle>
                  {t('component.clozeImageText.editAriaLabels')}
                </Subtitle>
                {responses.map((responseContainer, index) => (
                  <div
                    className="imagelabelDropDown-droppable iseditablearialabel"
                    key={index}
                  >
                    <span className="index-box">{index + 1}</span>
                    <Input
                      defaultValue={responseContainer.label}
                      onChange={e =>
                        this.onResponseLabelChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </React.Fragment>
            )}
          </PaddingDiv>
          {
            item.options.map((option, index) => (
              <PaddingDiv key={`${option}_${index}`} top={30}>
                <Subtitle style={{ padding: '0px 0px 6px 0px' }}>
                  {t('component.clozeImageText.response')} {index + 1}
                </Subtitle>
                <SortableList
                  items={item.options[index] || []}
                  onSortEnd={params => this.onSortEnd(index, params)}
                  useDragHandle
                  onRemove={itemIndex => this.remove(index, itemIndex)}
                  onChange={(itemIndex, e) => this.editOptions(index, itemIndex, e)}
                />
                <PaddingDiv top={6}>
                  <AddNewChoiceBtn onClick={() => this.addNewChoiceBtn(index)}>
                    {t('component.clozeImageText.addnewchoice')}
                  </AddNewChoiceBtn>
                </PaddingDiv>
              </PaddingDiv>
            ))
          }
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

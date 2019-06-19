/* eslint-disable func-names */
import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Rnd } from "react-rnd";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import produce from "immer";
import { newBlue } from "@edulastic/colors";
import "react-quill/dist/quill.snow.css";
import { Checkbox, Input, Select, Upload, message } from "antd";
import { ChromePicker } from "react-color";
import { withTheme } from "styled-components";
import { cloneDeep, isUndefined } from "lodash";

// import { API_CONFIG, TokenStorage } from "@edulastic/api";
import { PaddingDiv, EduButton } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { clozeImage, canvasDimensions, aws } from "@edulastic/constants";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import DropArea from "../../containers/DropArea";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";
import { Subtitle } from "../../styled/Subtitle";

import QuestionTextArea from "../../components/QuestionTextArea";
import { FormContainer } from "./styled/FormContainer";
import { ImageWidthInput } from "./styled/ImageWidthInput";
import { ImageAlterTextInput } from "./styled/ImageAlterTextInput";
import { ColorBox } from "./styled/ColorBox";
import { ColorPickerContainer } from "./styled/ColorPickerContainer";
import { ColorPickerWrapper } from "./styled/ColorPickerWrapper";
import { MaxRespCountInput } from "./styled/MaxRespCountInput";
import { FlexContainer } from "./styled/FlexContainer";
import { ControlButton, MoveControlButton } from "./styled/ControlButton";
import { PointerContainer } from "./styled/PointerContainer";
import { PointerSelect } from "./styled/PointerSelect";
import { ImageFlexView } from "./styled/ImageFlexView";
import { ImageContainer } from "./styled/ImageContainer";
import { PreivewImageWrapper, PreviewImage } from "./styled/PreviewImage";
import { CheckContainer } from "./styled/CheckContainer";
// import { IconDrawResize } from "./styled/IconDrawResize";
import { IconMoveResize } from "./styled/IconMoveResize";
import { IconPin } from "./styled/IconPin";
import { IconUpload } from "./styled/IconUpload";
import { Widget } from "../../styled/Widget";
import { FieldWrapper } from "./styled/FieldWrapper";

import { uploadToS3 } from "../../../author/src/utils/upload";

import SortableList from "../../components/SortableList";

const { Option } = Select;
const { Dragger } = Upload;

const IMAGE_WIDTH_PROP = "imageWidth";
const IMAGE_HEIGHT_PROP = "imageHeight";

class Authoring extends Component {
  imageRndRef = createRef();

  constructor(props) {
    super(props);
    this.imageWidthEditor = React.createRef();
  }

  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  state = {
    isEditableResizeMove: false,
    isColorPickerVisible: false
    // imageWidth:
    //   this.props.item.imageWidth > 0 ? (this.props.item.imageWidth >= 700 ? 700 : this.props.item.imageWidth) : 700
  };

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.cloze.imageText.composequestion"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  componentDidUpdate(nextProps) {
    const { item, setQuestionData } = nextProps;
    // const { item: pastItem } = this.props;

    const newItem = cloneDeep(item);
    if (document.getElementById("mainImage") && item.imageUrl) {
      const imageWidth = document.getElementById("mainImage").clientWidth;

      if (item.imageWidth && imageWidth !== item.imageWidth) {
        newItem.imageWidth = imageWidth;
        setQuestionData(newItem);
      }
    }
  }

  onChangeQuestion = stimulus => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        updateVariables(draft);
      })
    );
  };

  onSortEnd = (index, { oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[index] = arrayMove(draft.options[index], oldIndex, newIndex);
      })
    );
  };

  remove = (index, itemIndex) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[index].splice(itemIndex, 1);
        updateVariables(draft);
      })
    );
  };

  editOptions = (index, itemIndex, val) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[index] === undefined) draft.options[index] = [];
        draft.options[index][itemIndex] = val;
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = index => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[index] === undefined) draft.options[index] = [];
        draft.options[index].push(t("component.cloze.imageText.newChoice"));
      })
    );
  };

  onItemPropChange = (prop, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        // This is when the image gets uploaded so
        // we reset the image to the starting position on canvas
        // we need the updatePosition to nudge the rnd component to re-render
        if (prop === IMAGE_WIDTH_PROP || prop === IMAGE_HEIGHT_PROP) {
          draft.imageOptions = { x: 0, y: 0 };
          this.imageRndRef.current.updatePosition({ x: 0, y: 0 });
        }
        draft[prop] = value;
        updateVariables(draft);
      })
    );
  };

  onResponseLabelChange = (index, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.responses[index].label = value;
        updateVariables(draft);
      })
    );
  };

  showColorPicker = status => {
    this.setState({ isColorPickerVisible: status });
  };

  updateData = item => {
    this.onItemPropChange("responses", item);
  };

  handlePointersChange = value => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.responses = draft.responses.map(it => {
          if (it.active) {
            it.pointerPosition = value;
          }
          return it;
        });

        updateVariables(draft);
      })
    );
  };

  getImageDimensions = url => {
    const { item, setQuestionData } = this.props;
    const { maxWidth, maxHeight } = clozeImage;
    const img = new Image();

    img.addEventListener("load", function() {
      let height;
      let width;
      if (this.naturalHeight > maxHeight || this.naturalWidth > maxWidth) {
        const fitHeight = Math.floor(maxWidth * (this.naturalHeight / this.naturalWidth));
        const fitWidth = Math.floor(maxHeight * (this.naturalWidth / this.naturalHeight));
        if (fitWidth > maxWidth) {
          width = maxWidth;
          height = fitHeight;
        } else {
          height = maxHeight;
          width = fitWidth;
        }
      } else {
        width = this.naturalWidth;
        height = this.naturalHeight;
      }
      ((wid, heig) => {
        setQuestionData(
          produce(item, draft => {
            draft.imageHeight = undefined;
            draft.imageWidth = undefined;
            draft.imageUrl = url;
            draft.imageOriginalHeight = heig;
            draft.imageOriginalWidth = wid;
            updateVariables(draft);
          })
        );
      })(width, height);
    });
    img.src = url;
  };

  getWidth = () => {
    const { item } = this.props;
    const { imageOriginalWidth, imageWidth } = item;
    const { maxWidth } = clozeImage;

    // If image uploaded is smaller than the max width, keep it as-is
    // If image is larger, compress it to max width (keep aspect-ratio by default)
    // If user changes image size manually to something larger, allow it

    if (!isUndefined(imageWidth)) {
      return imageWidth > 0 ? imageWidth : maxWidth;
    }

    if (!isUndefined(imageOriginalWidth) && imageOriginalWidth < maxWidth) {
      return imageOriginalWidth;
    }
    if (!isUndefined(imageOriginalWidth) && imageOriginalWidth >= maxWidth) {
      return maxWidth;
    }
    return maxWidth;
  };

  getHeight = () => {
    const { item } = this.props;
    const { imageHeight } = item;
    const { imageOriginalHeight, maxHeight } = clozeImage;

    // If image uploaded is smaller than the max width, keep it as-is
    // If image is larger, compress it to max width (keep aspect-ratio by default)
    // If user changes image size manually to something larger, allow it
    if (!isUndefined(imageHeight)) {
      return imageHeight > 0 ? imageHeight : maxHeight;
    }

    if (!isUndefined(imageOriginalHeight) && imageOriginalHeight < maxHeight) {
      return imageOriginalHeight;
    }
  };

  getLeft = () => {
    const {
      item: { imageOptions = {} }
    } = this.props;
    const { x } = clozeImage;
    return isUndefined(imageOptions.x) ? x : imageOptions.x || 0;
  };

  getTop = () => {
    const {
      item: { imageOptions = {} }
    } = this.props;
    const { y } = clozeImage;
    return isUndefined(imageOptions.y) ? y : imageOptions.y || 0;
  };

  changeImageHeight = height => {
    const { maxHeight } = clozeImage;
    const newHeight = height > 0 ? height : maxHeight;
    this.onItemPropChange("imageHeight", newHeight);
  };

  changeImageWidth = width => {
    const { maxWidth } = clozeImage;
    const newWidth = width > 0 ? width : maxWidth;
    this.onItemPropChange("imageWidth", newWidth);
  };

  changeImageLeft = left => {
    const { item, setQuestionData } = this.props;
    const oldImageOption = cloneDeep(item.imageOptions);

    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { ...oldImageOption, x: left };
      })
    );
  };

  chnageImageTop = top => {
    const { item, setQuestionData } = this.props;
    const oldImageOption = cloneDeep(item.imageOptions);

    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { ...oldImageOption, y: top };
      })
    );
  };

  toggleIsMoveResizeEditable = () => {
    this.setState(prevState => ({ isEditableResizeMove: !prevState.isEditableResizeMove }));
  };

  handleImagePosition = d => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { x: d.x, y: d.y };
      })
    );
  };

  handleChange = async info => {
    try {
      const { t } = this.props;
      const { file } = info;
      if (!file.type.match(/image/g)) {
        message.error("Please upload files in image format");
        return;
      }
      const imageUrl = await uploadToS3(file, aws.s3Folders.COURSE);
      this.getImageDimensions(imageUrl);
      message.success(`${info.file.name} ${t("component.cloze.imageText.fileUploadedSuccessfully")}.`);
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line no-undef
      message.error(`${info.file.name} ${t("component.cloze.imageText.fileUploadFailed")}.`);
    }
  };

  render() {
    const { t, item, theme, setQuestionData } = this.props;
    const { maxRespCount, background, imageAlterText, isEditAriaLabels, responses, imageOptions = {} } = item;
    const { isColorPickerVisible, isEditableResizeMove } = this.state;

    const { maxHeight, maxWidth } = canvasDimensions;

    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;
    const { toggleIsMoveResizeEditable, handleImagePosition } = this;

    const uploadProps = {
      beforeUpload: () => false,
      onChange: this.handleChange,
      accept: "image/*",
      multiple: false,
      showUploadList: false
    };

    const canvasWidth = this.getWidth() < maxWidth ? maxWidth : this.getWidth();

    return (
      <div>
        <PaddingDiv>
          <Widget>
            <Subtitle>{t("component.cloze.imageText.composequestion")}</Subtitle>
            <QuestionTextArea
              toolbarId="stimulus"
              inputId="stimulusInput"
              placeholder={t("component.cloze.imageText.thisisstem")}
              onChange={this.onChangeQuestion}
              value={item.stimulus}
            />
            <PaddingDiv />
            <FormContainer data-cy="top-toolbar-area">
              <div data-cy="left-buttons">
                <FieldWrapper>
                  <ImageWidthInput
                    ref={this.imageWidthEditor}
                    data-cy="image-width-input"
                    value={this.getWidth()}
                    onChange={this.changeImageWidth}
                  />

                  <PaddingDiv left={20}>{t("component.cloze.imageText.widthpx")}</PaddingDiv>
                </FieldWrapper>

                <FieldWrapper>
                  <ImageWidthInput
                    data-cy="image-height-input"
                    value={this.getHeight()}
                    onChange={this.changeImageHeight}
                  />
                  <PaddingDiv left={20}>{t("component.cloze.imageText.heightpx")}</PaddingDiv>
                </FieldWrapper>

                <FieldWrapper>
                  <ImageWidthInput data-cy="image-left-input" value={this.getLeft()} onChange={this.changeImageLeft} />
                  <PaddingDiv left={20}>{t("component.cloze.imageText.positionX")}</PaddingDiv>
                </FieldWrapper>

                <FieldWrapper>
                  <ImageWidthInput data-cy="image-top-input" value={this.getTop()} onChange={this.chnageImageTop} />
                  <PaddingDiv left={20}>{t("component.cloze.imageText.positionY")}</PaddingDiv>
                </FieldWrapper>

                <CheckContainer position="unset" alignSelf="center">
                  <Checkbox
                    data-cy="drag-drop-image-aria-check"
                    defaultChecked={isEditAriaLabels}
                    onChange={val => this.onItemPropChange("keepAspectRatio", val.target.checked)}
                  >
                    {t("component.cloze.imageText.keepAspectRatio")}
                  </Checkbox>
                </CheckContainer>
              </div>

              <div data-cy="right-buttons">
                <PointerContainer className="controls-bar">
                  <FieldWrapper>
                    <ControlButton disabled={!hasActive}>
                      <IconPin />
                    </ControlButton>
                    <span>{t("component.cloze.imageText.pointers")}</span>
                  </FieldWrapper>
                  <PointerSelect disabled={!hasActive} defaultValue="none" onChange={this.handlePointersChange}>
                    <Option value="none">{t("component.cloze.imageText.none")}</Option>
                    <Option value="top">{t("component.cloze.imageText.top")}</Option>
                    <Option value="bottom">{t("component.cloze.imageText.bottom")}</Option>
                    <Option value="left">{t("component.cloze.imageText.left")}</Option>
                    <Option value="right">{t("component.cloze.imageText.right")}</Option>
                  </PointerSelect>
                </PointerContainer>

                <FieldWrapper>
                  <ColorBox
                    data-cy="image-text-box-color-picker"
                    background={background}
                    onClick={() => this.showColorPicker(true)}
                  />
                  {isColorPickerVisible && (
                    <ColorPickerContainer data-cy="image-text-box-color-panel">
                      <ColorPickerWrapper onClick={() => this.showColorPicker(false)} />
                      <ChromePicker
                        color={background}
                        onChangeComplete={color => this.onItemPropChange("background", color.hex)}
                      />
                    </ColorPickerContainer>
                  )}
                  <PaddingDiv left={20}>{t("component.cloze.imageText.fillcolor")}</PaddingDiv>
                </FieldWrapper>
              </div>
            </FormContainer>

            <FlexContainer
              style={{
                padding: 0,
                background: theme.widgets.clozeImageText.controlBarContainerBgColor,
                borderRadius: "0px 0px 10px 10px",
                overflow: "hidden"
              }}
            >
              <ImageFlexView size={1} leftAlign>
                <ImageContainer
                  data-cy="drag-drop-image-panel"
                  imageUrl={item.imageUrl}
                  height={this.getHeight() || maxHeight}
                  width={canvasWidth}
                  onDragStart={e => e.preventDefault()}
                >
                  {item.imageUrl && (
                    <React.Fragment>
                      <Rnd
                        ref={this.imageRndRef}
                        style={{ overflow: "hidden" }}
                        default={{
                          x: imageOptions.x || 0,
                          y: imageOptions.y || 0
                        }}
                        position={{ x: imageOptions.x || 0, y: imageOptions.y || 0 }}
                        bounds="parent"
                        enableResizing={{
                          bottom: false,
                          bottomLeft: false,
                          bottomRight: false,
                          left: false,
                          right: false,
                          top: false,
                          topLeft: false,
                          topRight: false
                        }}
                        onDragStop={(evt, d) => handleImagePosition(d)}
                      >
                        <PreivewImageWrapper>
                          <PreviewImage
                            id="mainImage"
                            src={item.imageUrl}
                            width={this.getWidth()}
                            height={this.getHeight()}
                            maxWidth={maxWidth}
                            maxHeight={maxHeight}
                            alt="resp-preview"
                            onDragStart={e => e.preventDefault()}
                          />
                          <MoveControlButton
                            onClick={toggleIsMoveResizeEditable}
                            style={{
                              boxShadow: isEditableResizeMove ? `${newBlue} 0px 1px 7px 0px` : null
                            }}
                          >
                            <IconMoveResize />
                          </MoveControlButton>
                        </PreivewImageWrapper>
                      </Rnd>
                      <DropArea
                        disable={isEditableResizeMove}
                        updateData={this.updateData}
                        item={item}
                        key={item}
                        width={canvasWidth}
                        showIndex={false}
                        setQuestionData={setQuestionData}
                      />
                    </React.Fragment>
                  )}
                  {!item.imageUrl && (
                    <Dragger {...uploadProps}>
                      <p className="ant-upload-drag-icon">
                        <IconUpload />
                      </p>
                      <p
                        className="ant-upload-hint"
                        style={{
                          color: theme.widgets.clozeImageText.antUploadHintColor
                        }}
                      >
                        <strong>{t("component.cloze.imageText.dragAndDrop")}</strong>
                      </p>
                      <h2
                        className="ant-upload-text"
                        style={{
                          color: theme.widgets.clozeImageText.antUploadTextColor
                        }}
                      >
                        {t("component.cloze.imageText.yourOwnImage")}
                      </h2>
                      <p
                        className="ant-upload-hint"
                        style={{
                          color: theme.widgets.clozeImageText.antUploadHintColor
                        }}
                      >
                        {t("component.cloze.imageText.orBrowse")}: PNG, JPG, GIF (1024KB MAX.)
                      </p>
                    </Dragger>
                  )}
                </ImageContainer>
              </ImageFlexView>
            </FlexContainer>

            <FlexContainer>
              {item.imageUrl && (
                <Dragger
                  className="super-dragger"
                  {...uploadProps}
                  style={{ padding: 0, marginBottom: 20, marginTop: 20, marginRight: 20 }}
                  showUploadList={false}
                >
                  <EduButton type="primary">{t("component.cloze.imageText.updateImageButtonText")}</EduButton>
                </Dragger>
              )}
              <CheckContainer position="unset" alignSelf="center">
                <Checkbox
                  data-cy="drag-drop-image-aria-check"
                  defaultChecked={isEditAriaLabels}
                  onChange={val => this.onItemPropChange("isEditAriaLabels", val.target.checked)}
                >
                  {t("component.cloze.imageText.editAriaLabels")}
                </Checkbox>
              </CheckContainer>
              <div style={{ alignItems: "center" }}>
                <MaxRespCountInput
                  data-cy="drag-drop-image-max-res"
                  min={1}
                  max={10}
                  defaultValue={maxRespCount}
                  onChange={val => this.onItemPropChange("maxRespCount", val)}
                />
                <PaddingDiv left={20} style={{ width: 160 }}>
                  {t("component.cloze.imageText.maximumresponses")}
                </PaddingDiv>
              </div>

              <div style={{ alignItems: "center" }}>
                <ImageAlterTextInput
                  data-cy="image-alternate-input"
                  size="large"
                  defaultValue={imageAlterText}
                  onChange={val => this.onItemPropChange("imageAlterText", val.target.value)}
                />
                <PaddingDiv left={20}>{t("component.cloze.imageText.imagealtertext")}</PaddingDiv>
              </div>
            </FlexContainer>
            <PaddingDiv>
              {isEditAriaLabels && (
                <React.Fragment>
                  <Subtitle>{t("component.cloze.imageText.editAriaLabels")}</Subtitle>
                  {responses.map((responseContainer, index) => (
                    <div className="imagelabelDropDown-droppable iseditablearialabel" key={index}>
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
            {item.options.map((option, index) => (
              <PaddingDiv key={`${option}_${index}`}>
                <Subtitle style={{ paddingTop: index > 0 ? "30px" : "" }}>
                  {t("component.cloze.imageText.response")} {index + 1}
                </Subtitle>
                <SortableList
                  items={item.options[index] || []}
                  onSortEnd={params => this.onSortEnd(index, params)}
                  useDragHandle
                  onRemove={itemIndex => this.remove(index, itemIndex)}
                  onChange={(itemIndex, e) => this.editOptions(index, itemIndex, e)}
                />
                <PaddingDiv>
                  <AddNewChoiceBtn onClick={() => this.addNewChoiceBtn(index)}>
                    {t("component.cloze.imageText.addnewchoice")}
                  </AddNewChoiceBtn>
                </PaddingDiv>
              </PaddingDiv>
            ))}
          </Widget>
        </PaddingDiv>
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(Authoring);

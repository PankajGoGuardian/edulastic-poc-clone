import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Rnd } from "react-rnd";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { cloneDeep, isUndefined, maxBy } from "lodash";
import produce from "immer";
import { themeColor } from "@edulastic/colors";
import "react-quill/dist/quill.snow.css";
import { Checkbox, Input, Select, Upload, message, Dropdown } from "antd";
import { ChromePicker } from "react-color";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
// import { API_CONFIG, TokenStorage } from "@edulastic/api";
import { PaddingDiv, EduButton, beforeUpload } from "@edulastic/common";

import { clozeImage, aws } from "@edulastic/constants";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import DropArea from "../../containers/DropArea";
import { Subtitle } from "../../styled/Subtitle";

import QuestionTextArea from "../../components/QuestionTextArea";
import { FormContainer } from "./styled/FormContainer";
import { ImageWidthInput } from "./styled/ImageWidthInput";
import { ImageAlterTextInput } from "./styled/ImageAlterTextInput";
import { ColorBox } from "./styled/ColorBox";
import { FlexContainer } from "./styled/FlexContainer";
import { ControlButton, MoveControlButton } from "./styled/ControlButton";
import { PointerContainer } from "./styled/PointerContainer";
import { PointerSelect } from "./styled/PointerSelect";
import { ImageFlexView } from "./styled/ImageFlexView";
import { ImageContainer } from "./styled/ImageContainer";
import { PreviewImage } from "./styled/PreviewImage";
import { CheckContainer } from "./styled/CheckContainer";
import { IconMoveResize } from "./styled/IconMoveResize";
import { IconPin } from "./styled/IconPin";
import { IconUpload } from "./styled/IconUpload";
import { FieldWrapper } from "./styled/FieldWrapper";
import { FieldLabel } from "./styled/FieldLabel";
import { ResponsTextInputWrapper } from "./styled/ResponsTextInputWrapper";
import { UploadButton } from "./styled/UploadButton";
import { Widget } from "../../styled/Widget";

import { uploadToS3 } from "../../../author/src/utils/upload";

const { Option } = Select;
const { Dragger } = Upload;

const IMAGE_WIDTH_PROP = "imageWidth";
const IMAGE_HEIGHT_PROP = "imageHeight";

class ComposeQuestion extends Component {
  constructor(props) {
    super(props);
    this.imageWidthEditor = createRef();
    this.canvasRef = createRef();
    this.imageRndRef = createRef();
    this.imagePreviewRef = createRef();
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
    isEditableResizeMove: false
  };

  componentDidMount = () => {
    const { fillSections, t, item } = this.props;
    if (item.imageUrl) this.getImageDimensions(item.imageUrl);
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.cloze.imageDropDown.composequestion"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
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

  onItemPropChange = (prop, value) => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, newItem => {
        if (prop === "responses") {
          if (newItem.options.length > value.length) {
            newItem.options.pop();
          } else if (value.length > newItem.options.length) {
            newItem.options.push(["", ""]);
          }
        }

        // This is when the image gets uploaded so
        // we reset the image to the starting position on canvas
        // we need the updatePosition to nudge the rnd component to re-render
        if (prop === IMAGE_WIDTH_PROP || prop === IMAGE_HEIGHT_PROP) {
          newItem.imageOptions = { x: 0, y: 0 };
          this.imageRndRef.current.updatePosition({ x: 0, y: 0 });
        }

        newItem[prop] = value;
        updateVariables(newItem);
      })
    );
  };

  onResponsePropChange = (prop, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.responseLayout = draft.responseLayout || {};
        draft.responseLayout[prop] = value;

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

  getImageDimensions = (url, isNew) => {
    const { item, setQuestionData } = this.props;
    const { maxWidth, maxHeight } = clozeImage;
    const img = new Image();

    // eslint-disable-next-line func-names
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
      ((_width, _height) => {
        setQuestionData(
          produce(item, draft => {
            if (isNew) {
              draft.imageHeight = undefined;
              draft.imageWidth = undefined;
            }
            draft.imageUrl = url;
            draft.imageOriginalHeight = _height;
            draft.imageOriginalWidth = _width;
            updateVariables(draft);
          })
        );
      })(width, height);
    });
    img.src = url;
  };

  handleChange = async info => {
    try {
      const { t } = this.props;
      const { file } = info;
      if (!beforeUpload(file)) {
        return;
      }
      const imageUrl = await uploadToS3(file, aws.s3Folders.DEFAULT);
      this.getImageDimensions(imageUrl, true);
      this.onItemPropChange("imageUrl", imageUrl);
      message.success(`${info.file.name} ${t("component.cloze.imageText.fileUploadedSuccessfully")}.`);
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line no-undef
      message.error(`${info.file.name} ${t("component.cloze.imageText.fileUploadFailed")}.`);
    }
  };

  getHeight = () => {
    const { item } = this.props;
    const { imageOriginalWidth, imageOriginalHeight, imageHeight, keepAspectRatio } = item;
    const { maxHeight } = clozeImage;
    const imageWidth = this.getWidth();

    // If image uploaded is smaller than the max width, keep it as-is
    // If image is larger, compress it to max width (keep aspect-ratio by default)
    // If user changes image size manually to something larger, allow it
    if (keepAspectRatio && !isUndefined(imageOriginalHeight)) {
      return Math.round((imageOriginalHeight * imageWidth) / imageOriginalWidth);
    }

    if (!isUndefined(imageHeight)) {
      return imageHeight > 0 ? imageHeight : maxHeight;
    }

    if (!isUndefined(imageOriginalHeight) && imageOriginalHeight < maxHeight) {
      return imageOriginalHeight;
    }

    return maxHeight;
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

  handleDragStop = d => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { x: Math.round(d.x), y: Math.round(d.y) };
      })
    );
  };

  handleDragging = d => {
    if (!this.canvasRef.current) {
      return;
    }
    const { item } = this.props;
    const { imageWidth, imageHeight, imageOriginalHeight, imageOriginalWidth } = item;
    const { maxHeight, maxWidth } = clozeImage;
    const { x, y } = d;
    const _imageW = imageWidth || imageOriginalWidth;
    const _imageH = imageHeight || imageOriginalHeight;

    const { responseBoxMaxTop, responseBoxMaxLeft } = this.getResponseBoxMaxValues();
    let canvasW = maxWidth < _imageW + x ? _imageW + x : maxWidth;
    let canvasH = maxHeight < _imageH + y ? _imageH + y : maxHeight;

    if (canvasH < responseBoxMaxTop) {
      canvasH = responseBoxMaxTop + 20;
    }

    if (canvasW < responseBoxMaxLeft) {
      canvasW = responseBoxMaxLeft;
    }

    this.canvasRef.current.style.width = `${canvasW}px`;
    this.canvasRef.current.style.height = `${canvasH}px`;
  };

  handleResizeStop = resizeRef => {
    const { width } = resizeRef.style;
    const { height } = resizeRef.style;
    const { item, setQuestionData } = this.props;

    const _width = Math.round(parseInt(width, 10));
    const _height = Math.round(parseInt(height, 10));

    setQuestionData(
      produce(item, draft => {
        draft.imageHeight = _height;
        draft.imageWidth = _width;
      })
    );
  };

  handleResizing = resizeRef => {
    if (!this.canvasRef.current || !this.imagePreviewRef.current) {
      return;
    }

    const {
      item: { imageOptions = {} }
    } = this.props;
    const { maxHeight, maxWidth } = clozeImage;
    const { width } = resizeRef.style;
    const { height } = resizeRef.style;
    const { x = 0, y = 0 } = imageOptions;

    const _imageW = Math.round(parseInt(width, 10));
    const _imageH = Math.round(parseInt(height, 10));

    const { responseBoxMaxTop, responseBoxMaxLeft } = this.getResponseBoxMaxValues();
    let canvasW = maxWidth < _imageW + x ? _imageW + x : maxWidth;
    let canvasH = maxHeight < _imageH + y ? _imageH + y : maxHeight;

    if (canvasH < responseBoxMaxTop) {
      canvasH = responseBoxMaxTop + 20;
    }

    if (canvasW < responseBoxMaxLeft) {
      canvasW = responseBoxMaxLeft;
    }

    this.canvasRef.current.style.width = `${canvasW}px`;
    this.canvasRef.current.style.height = `${canvasH}px`;

    this.imagePreviewRef.current.style.width = `${_imageW}px`;
    this.imagePreviewRef.current.style.height = `${_imageH}px`;
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

  getTop = () => {
    const {
      item: { imageOptions = {} }
    } = this.props;
    const { y } = clozeImage;
    return isUndefined(imageOptions.y) ? y : imageOptions.y || 0;
  };

  getLeft = () => {
    const {
      item: { imageOptions = {} }
    } = this.props;
    const { x } = clozeImage;
    return isUndefined(imageOptions.x) ? x : imageOptions.x || 0;
  };

  getResponseBoxMaxValues = () => {
    const {
      item: { responses }
    } = this.props;
    const maxTop = maxBy(responses, res => res.top);
    const maxLeft = maxBy(responses, res => res.left);
    return { responseBoxMaxTop: maxTop.top + maxTop.height, responseBoxMaxLeft: maxLeft.left + maxLeft.width };
  };

  render() {
    const { t, item, theme, setQuestionData } = this.props;
    const {
      background,
      imageAlterText,
      isEditAriaLabels,
      responses,
      keepAspectRatio,
      responseLayout,
      imageOptions = {}
    } = item;
    const { isEditableResizeMove } = this.state;

    const { toggleIsMoveResizeEditable, handleDragStop } = this;
    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;

    const { maxHeight, maxWidth } = clozeImage;

    const uploadProps = {
      beforeUpload: () => false,
      onChange: this.handleChange,
      accept: "image/*",
      multiple: false,
      showUploadList: false
    };

    const imageWidth = this.getWidth();
    const imageHeight = this.getHeight();
    const imageTop = this.getTop();
    const imageLeft = this.getLeft();

    let canvasWidth = imageWidth < maxWidth ? maxWidth : imageWidth;
    let canvasHeight = imageHeight < maxHeight ? maxHeight : imageHeight;

    if (canvasWidth < imageLeft + imageWidth) {
      canvasWidth = imageLeft + imageWidth;
    }

    if (canvasHeight < imageTop + imageHeight) {
      canvasHeight = imageTop + imageHeight;
    }

    const { responseBoxMaxTop, responseBoxMaxLeft } = this.getResponseBoxMaxValues();

    if (canvasHeight < responseBoxMaxTop) {
      canvasHeight = responseBoxMaxTop + 20;
    }

    if (canvasWidth < responseBoxMaxLeft) {
      canvasWidth = responseBoxMaxLeft;
    }

    return (
      <div>
        <PaddingDiv>
          <Widget>
            <Subtitle>{t("component.cloze.imageDropDown.composequestion")}</Subtitle>

            <QuestionTextArea
              toolbarId="stimulus"
              inputId="stimulusInput"
              placeholder={t("component.cloze.imageDropDown.thisisstem")}
              onChange={this.onChangeQuestion}
              value={item.stimulus}
              border="border"
            />
            <PaddingDiv />
            <FormContainer>
              <div className="left-buttons">
                <div className="size-controls">
                  <FieldWrapper>
                    <ImageWidthInput
                      ref={this.imageWidthEditor}
                      data-cy="image-width-input"
                      value={imageWidth}
                      onChange={this.changeImageWidth}
                    />

                    <PaddingDiv left={20}>{t("component.cloze.imageDropDown.widthpx")}</PaddingDiv>
                  </FieldWrapper>

                  <FieldWrapper>
                    <ImageWidthInput
                      data-cy="image-height-input"
                      value={imageHeight}
                      onChange={this.changeImageHeight}
                    />
                    <PaddingDiv left={20}>{t("component.cloze.imageDropDown.heightpx")}</PaddingDiv>
                  </FieldWrapper>
                </div>

                <div className="position-controls">
                  <FieldWrapper>
                    <ImageWidthInput data-cy="image-left-input" value={imageLeft} onChange={this.changeImageLeft} />
                    <PaddingDiv left={20}>{t("component.cloze.imageText.positionX")}</PaddingDiv>
                  </FieldWrapper>

                  <FieldWrapper>
                    <ImageWidthInput data-cy="image-top-input" value={imageTop} onChange={this.chnageImageTop} />
                    <PaddingDiv left={20}>{t("component.cloze.imageText.positionY")}</PaddingDiv>
                  </FieldWrapper>
                </div>
              </div>

              <div className="right-buttons">
                <CheckContainer position="unset" alignSelf="center">
                  <Checkbox
                    data-cy="drag-drop-image-aria-check"
                    defaultChecked={isEditAriaLabels}
                    checked={keepAspectRatio}
                    onChange={val => this.onItemPropChange("keepAspectRatio", val.target.checked)}
                  >
                    {t("component.cloze.imageText.keepAspectRatio")}
                  </Checkbox>
                </CheckContainer>
                <PointerContainer className="controls-bar">
                  <FieldWrapper>
                    <ControlButton disabled={!hasActive}>
                      <IconPin />
                    </ControlButton>
                    <span>{t("component.cloze.imageDropDown.pointers")}</span>
                  </FieldWrapper>
                  <PointerSelect disabled={!hasActive} defaultValue="none" onChange={this.handlePointersChange}>
                    <Option value="none">{t("component.cloze.imageDropDown.none")}</Option>
                    <Option value="top">{t("component.cloze.imageDropDown.top")}</Option>
                    <Option value="bottom">{t("component.cloze.imageDropDown.bottom")}</Option>
                    <Option value="left">{t("component.cloze.imageDropDown.left")}</Option>
                    <Option value="right">{t("component.cloze.imageDropDown.right")}</Option>
                  </PointerSelect>
                </PointerContainer>

                <Dropdown
                  overlay={() => (
                    <ChromePicker
                      color={background}
                      onChangeComplete={color => this.onItemPropChange("background", color.hex)}
                    />
                  )}
                  trigger={["click"]}
                >
                  <FieldWrapper>
                    <ColorBox data-cy="image-text-box-color-picker" style={{ backgroundColor: background }} />
                    <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.fillcolor")}</PaddingDiv>
                  </FieldWrapper>
                </Dropdown>
              </div>
            </FormContainer>
            <FlexContainer
              style={{
                padding: 0,
                background: "#fbfafc",
                borderRadius: "0px 0px 10px 10px",
                overflow: "hidden"
              }}
            >
              <ImageFlexView size={1} alignItems="flex-start">
                <ImageContainer
                  data-cy="drag-drop-image-panel"
                  imageUrl={item.imageUrl}
                  style={{ height: canvasHeight, width: canvasWidth }}
                  onDragStart={e => e.preventDefault()}
                  innerRef={this.canvasRef}
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
                        enableResizing={{
                          bottom: false,
                          bottomLeft: false,
                          bottomRight: true,
                          left: false,
                          right: false,
                          top: false,
                          topLeft: false,
                          topRight: false
                        }}
                        lockAspectRatio={item.keepAspectRatio}
                        onDragStop={(evt, d) => handleDragStop(d)}
                        onDrag={(evt, d) => this.handleDragging(d)}
                        onResizeStop={(e, direction, ref) => this.handleResizeStop(ref)}
                        onResize={(e, direction, ref) => this.handleResizing(ref)}
                      >
                        {isEditableResizeMove && (
                          <MoveControlButton
                            onClick={toggleIsMoveResizeEditable}
                            style={{
                              boxShadow: isEditableResizeMove ? `${themeColor} 0px 1px 7px 0px` : null
                            }}
                          >
                            <IconMoveResize />
                          </MoveControlButton>
                        )}
                        <PreviewImage
                          style={{ width: imageWidth, height: imageHeight }}
                          maxWidth={maxWidth}
                          maxHeight={maxHeight}
                          onDragStart={e => e.preventDefault()}
                          imageSrc={item.imageUrl}
                          innerRef={this.imagePreviewRef}
                        />
                      </Rnd>
                      <DropArea
                        disable={isEditableResizeMove}
                        setQuestionData={setQuestionData}
                        updateData={this.updateData}
                        item={item}
                        width="100%"
                        showIndex={false}
                        isDropDown
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
                          color: theme.widgets.clozeImageDropDown.antUploadHintColor
                        }}
                      >
                        <strong>{t("component.cloze.imageDropDown.dragAndDrop")}</strong>
                      </p>
                      <h2 className="ant-upload-text" style={{ color: "rgb(177, 177, 177)" }}>
                        {t("component.cloze.imageDropDown.yourOwnImage")}
                      </h2>
                      <p className="ant-upload-hint" style={{ color: "rgb(230, 230, 230)" }}>
                        {t("component.cloze.imageDropDown.orBrowse")}: PNG, JPG, GIF (1024KB MAX.)
                      </p>
                    </Dragger>
                  )}
                  {!isEditableResizeMove && (
                    <MoveControlButton
                      onClick={toggleIsMoveResizeEditable}
                      top={imageTop + imageHeight - 14}
                      left={imageLeft + imageWidth - 14}
                      style={{
                        boxShadow: isEditableResizeMove ? `${themeColor} 0px 1px 7px 0px` : null
                      }}
                    >
                      <IconMoveResize />
                    </MoveControlButton>
                  )}
                </ImageContainer>
              </ImageFlexView>
            </FlexContainer>
            <FlexContainer justifyContent="flex-start">
              {item.imageUrl && (
                <UploadButton {...uploadProps} showUploadList={false}>
                  <EduButton type="primary">{t("component.cloze.imageText.updateImageButtonText")}</EduButton>
                </UploadButton>
              )}
              <CheckContainer position="unset" alignSelf="center">
                <Checkbox
                  data-cy="drag-drop-image-aria-check"
                  defaultChecked={isEditAriaLabels}
                  onChange={val => this.onItemPropChange("isEditAriaLabels", val.target.checked)}
                >
                  {t("component.cloze.imageDropDown.editAriaLabels")}
                </Checkbox>
                <Checkbox
                  data-cy="drag-drop-image-border-check"
                  defaultChecked={responseLayout && responseLayout.showborder}
                  onChange={val => this.onResponsePropChange("showborder", val.target.checked)}
                >
                  {t("component.cloze.imageDropDown.showborder")}
                </Checkbox>
              </CheckContainer>
            </FlexContainer>
            <PaddingDiv>
              {isEditAriaLabels && (
                <React.Fragment>
                  <Subtitle>{t("component.cloze.imageDropDown.editAriaLabels")}</Subtitle>

                  <FieldLabel>{t("component.cloze.imageDropDown.imagealtertext")}</FieldLabel>
                  <FieldWrapper>
                    <ImageAlterTextInput
                      data-cy="image-alternate-input"
                      size="large"
                      defaultValue={imageAlterText}
                      onChange={val => this.onItemPropChange("imageAlterText", val.target.value)}
                    />
                  </FieldWrapper>

                  <FieldLabel>{t("component.cloze.imageText.responsesaltertext")}</FieldLabel>
                  {responses.map((responseContainer, index) => (
                    <ResponsTextInputWrapper key={index}>
                      <span className="index-box">{index + 1}</span>
                      <Input
                        defaultValue={responseContainer.label}
                        onChange={e => this.onResponseLabelChange(index, e.target.value)}
                      />
                    </ResponsTextInputWrapper>
                  ))}
                </React.Fragment>
              )}
            </PaddingDiv>
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

export default enhance(ComposeQuestion);

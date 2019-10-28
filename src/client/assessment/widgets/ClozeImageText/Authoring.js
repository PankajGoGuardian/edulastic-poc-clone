/* eslint-disable func-names */
import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import produce from "immer";
import uuidv4 from "uuid/v4";
import { themeColor } from "@edulastic/colors";
import "react-quill/dist/quill.snow.css";
import { Checkbox, Input, Select, Upload, message, Dropdown } from "antd";
import { ChromePicker } from "react-color";
import { withTheme } from "styled-components";
import { isUndefined, maxBy, get } from "lodash";

// import { API_CONFIG, TokenStorage } from "@edulastic/api";
import { PaddingDiv, EduButton, beforeUpload } from "@edulastic/common";
import { Label } from "../../styled/WidgetOptions/Label";
import { withNamespaces } from "@edulastic/localization";
import { clozeImage, aws } from "@edulastic/constants";
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
import { FlexContainer } from "./styled/FlexContainer";
import { ControlButton, MoveControlButton } from "./styled/ControlButton";
import { PointerContainer } from "./styled/PointerContainer";
import { PointerSelect } from "./styled/PointerSelect";
import { ImageFlexView } from "./styled/ImageFlexView";
import { ImageContainer } from "./styled/ImageContainer";
import { PreivewImage } from "./styled/PreviewImage";
import { CheckContainer } from "./styled/CheckContainer";
// import { IconDrawResize } from "./styled/IconDrawResize";
import { IconMoveResize } from "./styled/IconMoveResize";
import { IconPin } from "./styled/IconPin";
import { IconUpload } from "./styled/IconUpload";
import { FieldLabel } from "./styled/FieldLabel";
import { ResponsTextInputWrapper } from "./styled/ResponsTextInputWrapper";
import { FieldWrapper } from "./styled/FieldWrapper";
import { UploadButton } from "./styled/UploadButton";

import { uploadToS3 } from "../../../author/src/utils/upload";

import SortableList from "../../components/SortableList";
import Question from "../../components/Question";

const { Option } = Select;
const { Dragger } = Upload;

const IMAGE_WIDTH_PROP = "imageWidth";
const IMAGE_HEIGHT_PROP = "imageHeight";

class Authoring extends Component {
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
    isEditableResizeMove: false,
    isResizingImage: false
    // imageWidth:
    //   this.props.item.imageWidth > 0 ? (this.props.item.imageWidth >= 700 ? 700 : this.props.item.imageWidth) : 700
  };

  componentDidUpdate(nextProps) {
    const { item, setQuestionData } = nextProps;
    // const { item: pastItem } = this.props;

    if (document.getElementById("mainImage") && item.imageUrl) {
      const imageWidth = document.getElementById("mainImage").clientWidth;

      if (item.imageWidth && imageWidth !== item.imageWidth) {
        setQuestionData(
          produce(item, draft => {
            draft.imageWidth = imageWidth;
            updateVariables(draft);
          })
        );
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
        draft[prop] = value;
        updateVariables(draft);
      })
    );
  };

  onUserDimensionChange = prop => {
    const { imageWidth, imageHeight } = prop;
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        // This is when the image gets uploaded so
        // we reset the image to the starting position on canvas
        // we need the updatePosition to nudge the rnd component to re-render
        if (prop[IMAGE_WIDTH_PROP] || prop[IMAGE_HEIGHT_PROP]) {
          draft.imageOptions = { x: 0, y: 0 };
          this.imageRndRef?.current?.updatePosition({ x: 0, y: 0 });
        }
        draft[IMAGE_WIDTH_PROP] = imageWidth;
        draft[IMAGE_HEIGHT_PROP] = imageHeight;
        updateVariables(draft);
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
    const { imageRndRef } = this;
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
            if (isNew) {
              draft.imageHeight = undefined;
              draft.imageWidth = undefined;
            }
            draft.imageUrl = url;
            draft.imageOriginalHeight = heig;
            draft.imageOriginalWidth = wid;
            updateVariables(draft);
          })
        );
        if (isNew) {
          imageRndRef.current.updateSize({ width: wid, height: heig });
        }
      })(width, height);
    });
    img.src = url;
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

  changeImageDimensions = (prop, value) => {
    const { item } = this.props;
    const { imageOriginalWidth, imageOriginalHeight, imageWidth, imageHeight, keepAspectRatio } = item;
    const { maxWidth, maxHeight } = clozeImage;

    if (isUndefined(imageOriginalWidth) || isUndefined(imageOriginalHeight)) return;

    let newWidth = prop === "width" && value > 0 ? value : imageWidth || Math.min(imageOriginalWidth, maxWidth);
    let newHeight = prop !== "width" && value > 0 ? value : imageHeight || Math.min(imageOriginalHeight, maxHeight);

    if (keepAspectRatio) {
      [newWidth, newHeight] =
        prop === "width"
          ? [newWidth, Math.round((imageOriginalHeight * newWidth) / imageOriginalWidth)]
          : [Math.round((imageOriginalWidth * newHeight) / imageOriginalHeight), newHeight];
    }

    this.onUserDimensionChange({
      imageHeight: newHeight,
      imageWidth: newWidth
    });
  };

  changeImageLeft = left => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { ...draft.imageOptions, x: left };
      })
    );
  };

  chnageImageTop = top => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { ...draft.imageOptions, y: top };
      })
    );
  };

  toggleIsMoveResizeEditable = isAvaiable => () => {
    this.setState({ isEditableResizeMove: isAvaiable });
  };

  handleDragStop = d => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { x: Math.round(d.x), y: Math.round(d.y) };
      })
    );
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
      message.success(`${info.file.name} ${t("component.cloze.imageText.fileUploadedSuccessfully")}.`);
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line no-undef
      message.error(`${info.file.name} ${t("component.cloze.imageText.fileUploadFailed")}.`);
    }
  };

  handleResizeStart = () => {
    this.setState({ isResizingImage: true });
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

    setTimeout(() => {
      this.setState({ isResizingImage: false });
    });
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

  getResponseBoxMaxValues = () => {
    const {
      item: { responses }
    } = this.props;

    if (responses.length > 0) {
      const maxTop = maxBy(responses, res => res.top);
      const maxLeft = maxBy(responses, res => res.left);
      return { responseBoxMaxTop: maxTop.top + maxTop.height, responseBoxMaxLeft: maxLeft.left + maxLeft.width };
    }

    return { responseBoxMaxTop: 0, responseBoxMaxLeft: 0 };
  };

  addNewRespnose = e => {
    if (!this.canvasRef.current) {
      return;
    }

    const isContainer = e.target === this.canvasRef.current;
    const isDragItem = e.target.classList.contains("react-draggable");
    const { isEditableResizeMove, isResizingImage } = this.state;

    if ((!isContainer && !isDragItem) || isEditableResizeMove || isResizingImage) {
      return;
    }
    const { item, setQuestionData } = this.props;
    const newResponseContainer = {};
    const elemRect = this.canvasRef.current.getBoundingClientRect();
    const _width = get(item, "uiStyle.width", 150);
    const _height = get(item, "uiStyle.height", 40);

    newResponseContainer.top = e.clientY - elemRect.top;
    newResponseContainer.left = e.clientX - elemRect.left;
    newResponseContainer.width = _width;
    newResponseContainer.height = _height;
    newResponseContainer.active = true;
    newResponseContainer.id = uuidv4();

    setQuestionData(
      produce(item, draft => {
        draft.responses = draft.responses.map(res => {
          res.active = false;
          return res;
        });

        draft.responses.push(newResponseContainer);

        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item, theme, setQuestionData, fillSections, cleanSections } = this.props;
    const {
      background,
      imageAlterText,
      isEditAriaLabels,
      responses,
      imageOptions = {},
      keepAspectRatio,
      responseLayout
    } = item;
    const { isEditableResizeMove } = this.state;

    const { maxHeight, maxWidth } = clozeImage;

    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;
    const { toggleIsMoveResizeEditable, handleDragStop } = this;

    const uploadProps = {
      beforeUpload: () => false,
      onChange: this.handleChange,
      accept: "image/*",
      multiple: false,
      showUploadList: false
    };

    const { imageWidth: imgWidth, imageHeight: imgHeight, imageOriginalWidth, imageOriginalHeight } = item;
    const imageWidth = imgWidth || imageOriginalWidth || maxWidth;
    const imageHeight = imgHeight || imageOriginalHeight || maxHeight;
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
          <Question
            section="main"
            label={t("component.cloze.imageText.composequestion")}
            fillSections={fillSections}
            cleanSections={cleanSections}
          >
            <Subtitle>{t("component.cloze.imageText.composequestion")}</Subtitle>

            <QuestionTextArea
              toolbarId="stimulus"
              inputId="stimulusInput"
              placeholder={t("component.cloze.imageText.thisisstem")}
              onChange={this.onChangeQuestion}
              value={item.stimulus}
              border="border"
            />
            <PaddingDiv />
            <FormContainer data-cy="top-toolbar-area">
              <div className="left-buttons">
                <div className="size-controls">
                  <FieldWrapper>
                    <ImageWidthInput
                      ref={this.imageWidthEditor}
                      data-cy="image-width-input"
                      value={imageWidth}
                      onChange={value => this.changeImageDimensions("width", value)}
                    />
                    <Label top={6} left={20}>
                      {t("component.cloze.imageText.widthpx")}
                    </Label>
                  </FieldWrapper>

                  <FieldWrapper>
                    <ImageWidthInput
                      data-cy="image-height-input"
                      value={imageHeight}
                      onChange={value => this.changeImageDimensions("height", value)}
                    />
                    <Label top={6} left={20}>
                      {t("component.cloze.imageText.heightpx")}
                    </Label>
                  </FieldWrapper>
                </div>
                <div className="position-controls">
                  <FieldWrapper>
                    <ImageWidthInput data-cy="image-left-input" value={imageLeft} onChange={this.changeImageLeft} />
                    <Label top={6} left={20}>
                      {t("component.cloze.imageText.positionX")}
                    </Label>
                  </FieldWrapper>

                  <FieldWrapper>
                    <ImageWidthInput data-cy="image-top-input" value={imageTop} onChange={this.chnageImageTop} />
                    <Label top={6} left={20}>
                      {t("component.cloze.imageText.positionY")}
                    </Label>
                  </FieldWrapper>
                </div>
              </div>
              <div className="right-buttons">
                <CheckContainer position="unset" alignSelf="center">
                  <Checkbox
                    data-cy="drag-drop-image-aria-check"
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
                    <Label top={6}>{t("component.cloze.imageText.pointers")}</Label>
                  </FieldWrapper>
                  <PointerSelect
                    disabled={!hasActive}
                    defaultValue="none"
                    onChange={this.handlePointersChange}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <Option value="none">{t("component.cloze.imageText.none")}</Option>
                    <Option value="top">{t("component.cloze.imageText.top")}</Option>
                    <Option value="bottom">{t("component.cloze.imageText.bottom")}</Option>
                    <Option value="left">{t("component.cloze.imageText.left")}</Option>
                    <Option value="right">{t("component.cloze.imageText.right")}</Option>
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
                    <Label top={6} left={20}>
                      {t("component.cloze.imageDragDrop.fillcolor")}
                    </Label>
                  </FieldWrapper>
                </Dropdown>
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
                  style={{ height: canvasHeight, width: canvasWidth }}
                  onDragStart={e => e.preventDefault()}
                  onClick={this.addNewRespnose}
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
                        disableDragging={!isEditableResizeMove}
                        lockAspectRatio={item.keepAspectRatio}
                        onDragStop={(evt, d) => handleDragStop(d)}
                        onDrag={(evt, d) => this.handleDragging(d)}
                        onResizeStop={(e, direction, ref) => this.handleResizeStop(ref)}
                        onResize={(e, direction, ref) => this.handleResizing(ref)}
                        onResizeStart={this.handleResizeStart}
                      >
                        <MoveControlButton
                          onMouseEnter={toggleIsMoveResizeEditable(true)}
                          onMouseLeave={toggleIsMoveResizeEditable(false)}
                          style={{
                            boxShadow: isEditableResizeMove ? `${themeColor} 0px 1px 7px 0px` : null
                          }}
                        >
                          <IconMoveResize />
                        </MoveControlButton>
                        <PreivewImage
                          style={{ width: imageWidth, height: imageHeight }}
                          maxWidth={maxWidth}
                          maxHeight={maxHeight}
                          onDragStart={e => e.preventDefault()}
                          imageSrc={item.imageUrl}
                          innerRef={this.imagePreviewRef}
                        />
                      </Rnd>
                      <DropArea
                        item={item}
                        key={item}
                        showIndex={false}
                        disable={isEditableResizeMove}
                        setQuestionData={setQuestionData}
                        updateData={this.updateData}
                        containerRef={this.canvasRef}
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
                  {t("component.cloze.imageText.editAriaLabels")}
                </Checkbox>
              </CheckContainer>
              <Checkbox
                data-cy="drag-drop-image-border-check"
                defaultChecked={responseLayout && responseLayout.showborder}
                onChange={val => this.onResponsePropChange("showborder", val.target.checked)}
              >
                {t("component.cloze.imageText.showborder")}
              </Checkbox>
            </FlexContainer>
            <PaddingDiv>
              {isEditAriaLabels && (
                <React.Fragment>
                  <Subtitle>{t("component.cloze.imageText.editAriaLabels")}</Subtitle>

                  <FieldLabel>{t("component.cloze.imageText.imagealtertext")}</FieldLabel>
                  <ImageAlterTextInput
                    data-cy="image-alternate-input"
                    size="large"
                    defaultValue={imageAlterText}
                    onChange={val => this.onItemPropChange("imageAlterText", val.target.value)}
                  />

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
          </Question>
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

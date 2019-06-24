import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Rnd } from "react-rnd";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { cloneDeep, isUndefined } from "lodash";
import produce from "immer";
import { newBlue } from "@edulastic/colors";
import "react-quill/dist/quill.snow.css";
import { Checkbox, Input, Select, Upload, message } from "antd";
import { ChromePicker } from "react-color";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
// import { API_CONFIG, TokenStorage } from "@edulastic/api";
import { PaddingDiv, EduButton } from "@edulastic/common";

import { clozeImage, canvasDimensions, aws } from "@edulastic/constants";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import DropArea from "../../containers/DropArea";
import { Subtitle } from "../../styled/Subtitle";

import QuestionTextArea from "../../components/QuestionTextArea";
import { FormContainer } from "./styled/FormContainer";
import { ImageWidthInput } from "./styled/ImageWidthInput";
import { ImageAlterTextInput } from "./styled/ImageAlterTextInput";
import { ColorBox } from "./styled/ColorBox";
import { ColorPickerContainer } from "./styled/ColorPickerContainer";
import { ColorPickerWrapper } from "./styled/ColorPickerWrapper";
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
    isColorPickerVisible: false,
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
      if (!file.type.match(/image/g)) {
        message.error("Please upload files in image format");
        return;
      }
      const imageUrl = await uploadToS3(file, aws.s3Folders.COURSE);
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

  handleImagePosition = d => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { x: Math.round(d.x), y: Math.round(d.y) };
      })
    );
  };

  handleResize = resizeRef => {
    const { width } = resizeRef.style;
    const { height } = resizeRef.style;
    const { item, setQuestionData } = this.props;

    let _width = Math.round(parseInt(width, 10));
    let _height = Math.round(parseInt(height, 10));
    const { imageWidth, imageHeight } = item;

    if (_width <= imageWidth) {
      _width += 10;
    }

    if (_height <= imageHeight) {
      _height += 10;
    }

    setQuestionData(
      produce(item, draft => {
        draft.imageHeight = _height;
        draft.imageWidth = _width;
      })
    );
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

  render() {
    const { t, item, theme, setQuestionData } = this.props;
    const { background, imageAlterText, isEditAriaLabels, responses, keepAspectRatio } = item;
    const { isColorPickerVisible, isEditableResizeMove } = this.state;

    const { toggleIsMoveResizeEditable, handleImagePosition } = this;
    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;

    const { imageOptions = {} } = item;

    const { maxHeight, maxWidth } = canvasDimensions;

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
    const canvasWidth = (imageWidth < maxWidth ? maxWidth : imageWidth) + imageLeft;
    const canvasHeight = (imageHeight < maxHeight ? maxHeight : imageHeight) + imageTop;
    if (this.imageRndRef.current) {
      this.imageRndRef.current.updateSize({ width: imageWidth - 10, height: imageHeight - 10 });
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
                  <PaddingDiv left={20}>{t("component.cloze.imageDropDown.fillcolor")}</PaddingDiv>
                </FieldWrapper>
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
                  height={canvasHeight + 4}
                  width={canvasWidth + 4}
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
                          bottomRight: true,
                          left: false,
                          right: false,
                          top: false,
                          topLeft: false,
                          topRight: false
                        }}
                        onDragStop={(evt, d) => handleImagePosition(d)}
                        onResize={(e, direction, ref) => this.handleResize(ref)}
                      >
                        {isEditableResizeMove && (
                          <MoveControlButton
                            onClick={toggleIsMoveResizeEditable}
                            style={{
                              boxShadow: isEditableResizeMove ? `${newBlue} 0px 1px 7px 0px` : null
                            }}
                          >
                            <IconMoveResize />
                          </MoveControlButton>
                        )}
                        <PreviewImage
                          width={imageWidth - 10}
                          height={imageHeight - 10}
                          maxWidth={maxWidth}
                          maxHeight={maxHeight}
                          onDragStart={e => e.preventDefault()}
                          imageSrc={item.imageUrl}
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
                      onMouseEnter={toggleIsMoveResizeEditable}
                      top={imageTop + imageHeight - 14}
                      left={imageLeft + imageWidth - 14}
                      style={{
                        boxShadow: isEditableResizeMove ? `${newBlue} 0px 1px 7px 0px` : null
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

import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { Rnd } from "react-rnd";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";
import { Checkbox, Input, InputNumber, Select, Upload, message } from "antd";
import { ChromePicker } from "react-color";
import { withTheme } from "styled-components";
import { cloneDeep, isUndefined } from "lodash";

import { PaddingDiv, EduButton } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { newBlue } from "@edulastic/colors";
import { aws, clozeImage } from "@edulastic/constants";
import QuestionTextArea from "../../components/QuestionTextArea";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import DropArea from "../../containers/DropArea";
import { FlexView } from "../../styled/FlexView";
import { Subtitle } from "../../styled/Subtitle";

import AnnotationRnd from "../../components/Graph/Annotations/AnnotationRnd";
import { ColorBox } from "./styled/ColorBox";
import { ColorPickerContainer } from "./styled/ColorPickerContainer";
import { ColorPickerWrapper } from "./styled/ColorPickerWrapper";
import { FlexContainer } from "./styled/FlexContainer";
import { IconMoveResize } from "./styled/IconMoveResize";
import { IconPin } from "./styled/IconPin";
import { IconUpload } from "./styled/IconUpload";
import { Widget } from "../../styled/Widget";
import { FieldWrapper, FieldLabel } from "./styled/FieldWrapper";
import { ControlButton, MoveControlButton } from "./styled/ControlButton";
import { PointerContainer } from "./styled/PointerContainer";
import { PointerSelect } from "./styled/PointerSelect";
import { PreviewImage } from "../ClozeImageDropDown/styled/PreviewImage";
import { ImageContainer } from "../ClozeImageDropDown/styled/ImageContainer";
import { CheckContainer } from "../ClozeImageDropDown/styled/CheckContainer";

import { uploadToS3 } from "../../../author/src/utils/upload";

const { Option } = Select;
const { Dragger } = Upload;

const IMAGE_WIDTH_PROP = "imageWidth";
const IMAGE_HEIGHT_PROP = "imageHeight";

class ComposeQuestion extends Component {
  imageRndRef = createRef();

  state = {
    isEditableResizeMove: false
  };

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
    isColorPickerVisible: false
  };

  componentDidMount = () => {
    const { fillSections, t, item } = this.props;
    if (item.imageUrl) this.getImageDimensions(item.imageUrl);
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.cloze.imageDragDrop.composequestion"), node.offsetTop, node.scrollHeight);
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options = arrayMove(draft.options, oldIndex, newIndex);
      })
    );
  };

  remove = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  onResponsePropChange = (prop, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.responseLayout === undefined) {
          draft.responseLayout = {};
        }
        draft.responseLayout[prop] = value;

        updateVariables(draft);
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
      message.success(`${info.file.name} ${t("component.cloze.imageText.fileUploadedSuccessfully")}.`);
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line no-undef
      message.error(`${info.file.name} ${t("component.cloze.imageText.fileUploadFailed")}.`);
    }
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
    const { isEditableResizeMove } = this.state;
    const { toggleIsMoveResizeEditable, handleImagePosition } = this;

    const { maxWidth, maxHeight } = clozeImage;

    const {
      responseLayout,
      background,
      imageAlterText,
      isEditAriaLabels,
      responses,

      imageOptions = {},
      keepAspectRatio
    } = item;

    const { isColorPickerVisible } = this.state;
    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;

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
      <Widget>
        <Subtitle>{t("component.cloze.imageDragDrop.composequestion")}</Subtitle>
        <QuestionTextArea
          toolbarId="stimulus"
          inputId="stimulusInput"
          placeholder={t("component.cloze.imageDragDrop.thisisstem")}
          onChange={this.onChangeQuestion}
          value={item.stimulus}
        />
        <PaddingDiv top={30} />
        <FlexContainer
          style={{
            background: theme.widgets.clozeImageDragDrop.imageSettingsContainerBgColor,
            height: 70,
            fontSize: theme.widgets.clozeImageDragDrop.imageSettingsContainerFontSize
          }}
        >
          <div data-cy="left-buttons">
            <FieldWrapper>
              <InputNumber data-cy="image-width-input" value={imageWidth} onChange={this.changeImageWidth} />

              <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.widthpx")}</PaddingDiv>
            </FieldWrapper>
            <FieldWrapper>
              <InputNumber data-cy="image-height-input" value={imageHeight} onChange={this.changeImageHeight} />

              <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.heightpx")}</PaddingDiv>
            </FieldWrapper>

            <FieldWrapper>
              <InputNumber data-cy="image-left-input" value={imageLeft} onChange={this.changeImageLeft} />
              <PaddingDiv left={20}>{t("component.cloze.imageText.positionX")}</PaddingDiv>
            </FieldWrapper>

            <FieldWrapper>
              <InputNumber data-cy="image-top-input" value={imageTop} onChange={this.chnageImageTop} />
              <PaddingDiv left={20}>{t("component.cloze.imageText.positionY")}</PaddingDiv>
            </FieldWrapper>

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
          </div>

          <div data-cy="right-buttons">
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
                style={{ backgroundColor: background }}
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
              <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.fillcolor")}</PaddingDiv>
            </FieldWrapper>
          </div>
        </FlexContainer>

        <PaddingDiv top={30} />
        <FlexContainer>
          <FlexView
            size={1}
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              overflow: "auto",
              padding: "5px"
            }}
          >
            <ImageContainer
              data-cy="drag-drop-image-panel"
              imageUrl={item.imageUrl}
              height={canvasHeight + 4}
              width={canvasWidth + 4}
            >
              <div
                style={{
                  position: "relative",
                  width: imageWidth - 10 || "100%",
                  height: imageHeight - 10 || "100%"
                }}
              >
                <AnnotationRnd
                  style={{ backgroundColor: "transparent", boxShadow: "none", border: "1px solid lightgray" }}
                  questionId={item.id}
                  disableDragging={false}
                />
              </div>
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
                  />
                </React.Fragment>
              )}
              {!item.imageUrl && (
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <IconUpload />
                  </p>
                  <p className="ant-upload-hint">
                    <strong>{t("component.cloze.imageDragDrop.draganddrop")}</strong>
                  </p>
                  <h2 className="ant-upload-text">{t("component.cloze.imageDragDrop.yourOwnImage")}</h2>
                  <p className="ant-upload-hint">
                    {t("component.cloze.imageDragDrop.orBrowse")}: PNG, JPG, GIF (1024KB MAX.)
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
          </FlexView>
        </FlexContainer>
        <FlexContainer align="flex-start">
          {item.imageUrl && (
            <Dragger
              className="super-dragger"
              {...uploadProps}
              style={{ padding: 0, marginRight: "20px" }}
              showUploadList={false}
            >
              <EduButton type="primary">{t("component.cloze.imageText.updateImageButtonText")}</EduButton>
            </Dragger>
          )}
          <PaddingDiv top={30} style={{ alignSelf: "flex-start" }}>
            <Checkbox
              data-cy="drag-drop-image-dashboard-check"
              defaultChecked={responseLayout && responseLayout.showdashedborder}
              onChange={val => this.onResponsePropChange("showdashedborder", val.target.checked)}
            >
              {t("component.cloze.imageDragDrop.showdashedborder")}
            </Checkbox>
            <Checkbox
              data-cy="drag-drop-image-aria-check"
              defaultChecked={isEditAriaLabels}
              onChange={val => this.onItemPropChange("isEditAriaLabels", val.target.checked)}
            >
              {t("component.cloze.imageDragDrop.editAriaLabels")}
            </Checkbox>
          </PaddingDiv>
        </FlexContainer>
        <PaddingDiv>
          {isEditAriaLabels && (
            <React.Fragment>
              <Subtitle>{t("component.cloze.imageDragDrop.editAriaLabels")}</Subtitle>

              <FieldLabel>{t("component.cloze.imageDropDown.imagealtertext")}</FieldLabel>

              <FieldWrapper>
                <Input
                  data-cy="image-alternate-input"
                  size="large"
                  style={{ width: 220 }}
                  defaultValue={imageAlterText}
                  onChange={val => this.onItemPropChange("imageAlterText", val.target.value)}
                />
                <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.imagealtertext")}</PaddingDiv>
              </FieldWrapper>

              <FieldLabel>{t("component.cloze.imageText.responsesaltertext")}</FieldLabel>
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
      </Widget>
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

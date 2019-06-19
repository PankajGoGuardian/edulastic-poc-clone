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
import { Button, Checkbox, Input, InputNumber, Select, Upload, message } from "antd";
import { ChromePicker } from "react-color";
import { withTheme } from "styled-components";

import { PaddingDiv, EduButton } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { API_CONFIG, TokenStorage } from "@edulastic/api";
import { newBlue } from "@edulastic/colors";
import QuestionTextArea from "../../components/QuestionTextArea";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import DropArea from "../../containers/DropArea";
import { FlexView } from "../../styled/FlexView";
import { Subtitle } from "../../styled/Subtitle";

import { ColorBox } from "./styled/ColorBox";
import { ColorPickerContainer } from "./styled/ColorPickerContainer";
import { ColorPickerWrapper } from "./styled/ColorPickerWrapper";
import { FlexContainer } from "./styled/FlexContainer";
import { IconDrawResize } from "./styled/IconDrawResize";
import { IconMoveResize } from "./styled/IconMoveResize";
import { IconPin } from "./styled/IconPin";
import { IconUpload } from "./styled/IconUpload";
import { PreviewImage } from "../ClozeImageDropDown/styled/PreviewImage";
import { ImageContainer } from "../ClozeImageDropDown/styled/ImageContainer";
import { Widget } from "../../styled/Widget";
import AnnotationRnd from "../../components/Graph/Annotations/AnnotationRnd";

import { uploadToS3 } from "../../../../client/author/src/utils/upload";
import { aws } from "@edulastic/constants";

const { Option } = Select;
const { Dragger } = Upload;

const IMAGE_WIDTH_PROP = "imageWidth";
const IMAGE_HEIGHT_PROP = "imageHeight";

import { clozeImage, canvasDimensions } from "@edulastic/constants";

class ComposeQuestion extends Component {
  imageRndRef = createRef();

  state = {
    isEditableResizeMove: false,
    isAnnotationBelow: false
  };

  constructor(props) {
    super(props);
    this.imageWidthEditor = React.createRef();
    this.imageHeightEditor = React.createRef();
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
    isColorPickerVisible: false
  };

  componentDidMount = () => {
    const { fillSections, t } = this.props;
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

  getImageDimensions = url => {
    const { maxWidth, maxHeight } = clozeImage;
    const img = new Image();
    const that = this;
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
        that.onItemPropChange("imageWidth", wid);
        that.onItemPropChange("imageHeight", heig);
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
      this.getImageDimensions(imageUrl);
      this.onItemPropChange("imageUrl", imageUrl);
      message.success(`${info.file.name} ${t("component.cloze.imageText.fileUploadedSuccessfully")}.`);
    } catch (e) {
      console.log(e);
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
        draft.imageOptions = { x: d.x, y: d.y };
      })
    );
  };

  toggleIsAnnotationBelow = () => {
    this.setState(prevState => ({ isAnnotationBelow: !prevState.isAnnotationBelow }));
  };

  render() {
    const { t, item, theme, setQuestionData } = this.props;
    const { isEditableResizeMove, isAnnotationBelow } = this.state;
    const { toggleIsMoveResizeEditable, handleImagePosition, toggleIsAnnotationBelow } = this;

    const { maxWidth, maxHeight } = clozeImage;

    const {
      maxRespCount,
      responseLayout,
      background,
      imageAlterText,
      isEditAriaLabels,
      responses,
      imageWidth,
      imageHeight,
      imageOptions = {}
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
          <div style={{ alignItems: "center" }}>
            <InputNumber
              ref={this.imageWidthEditor}
              data-cy="image-width-input"
              value={imageWidth > 0 ? (imageWidth >= maxWidth ? maxWidth : imageWidth) : maxWidth}
              onChange={event => {
                this.onItemPropChange("imageWidth", event > 0 ? (event >= maxWidth ? maxWidth : event) : maxWidth);
              }}
            />

            <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.widthpx")}</PaddingDiv>
          </div>
          <div style={{ alignItems: "center" }}>
            <InputNumber
              ref={this.imageHeightEditor}
              data-cy="image-height-input"
              value={imageHeight > 0 ? (imageHeight >= maxHeight ? maxHeight : imageHeight) : maxHeight}
              onChange={event => {
                this.onItemPropChange("imageHeight", event > 0 ? (event >= maxHeight ? maxHeight : event) : maxHeight);
              }}
            />

            <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.heightpx")}</PaddingDiv>
          </div>
          <div style={{ alignItems: "center" }}>
            <Input
              data-cy="image-alternate-input"
              size="large"
              style={{ width: 220 }}
              defaultValue={imageAlterText}
              onChange={val => this.onItemPropChange("imageAlterText", val.target.value)}
            />
            <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.imagealtertext")}</PaddingDiv>
          </div>
          <div style={{ alignItems: "center" }}>
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
          </div>
          <div style={{ alignItems: "center" }}>
            <InputNumber
              data-cy="drag-drop-image-max-res"
              min={1}
              max={10}
              defaultValue={maxRespCount}
              onChange={val => this.onItemPropChange("maxRespCount", val)}
            />
            <PaddingDiv left={20}>{t("component.cloze.imageDragDrop.maximumresponses")}</PaddingDiv>
          </div>
        </FlexContainer>
        <PaddingDiv top={30} />
        <FlexContainer>
          <div
            className="controls-bar"
            style={{
              width: 120,
              background: theme.widgets.clozeImageDragDrop.controlsBarBgColor,
              alignItems: "center",
              alignSelf: "flex-start",
              flexDirection: "column"
            }}
          >
            <Button style={{ width: 100, height: 100, whiteSpace: "normal" }}>
              <IconDrawResize />
              {t("component.cloze.imageDragDrop.drawresize")}
            </Button>
            <Button
              onClick={toggleIsMoveResizeEditable}
              style={{
                width: 100,
                height: 100,
                whiteSpace: "normal",
                marginTop: 10,
                boxShadow: isEditableResizeMove ? `${newBlue} 0px 1px 7px 0px` : null
              }}
            >
              <IconMoveResize />
              {t("component.cloze.moveBackgroundImage")}
            </Button>
            <div
              style={{
                position: "relative",
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
                  position: "absolute",
                  top: 0,
                  left: 0,
                  whiteSpace: "normal"
                }}
              >
                <IconPin />
                {t("component.cloze.imageDragDrop.pointers")}
              </Button>
              <Select
                disabled={!hasActive}
                defaultValue="none"
                style={{
                  width: 100,
                  height: 100,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "flex",
                  alignItems: "flex-end"
                }}
                onChange={this.handlePointersChange}
              >
                <Option value="none">{t("component.cloze.imageDragDrop.none")}</Option>
                <Option value="top">{t("component.cloze.imageDragDrop.top")}</Option>
                <Option value="bottom">{t("component.cloze.imageDragDrop.bottom")}</Option>
                <Option value="left">{t("component.cloze.imageDragDrop.left")}</Option>
                <Option value="right">{t("component.cloze.imageDragDrop.right")}</Option>
              </Select>
            </div>
          </div>
          <FlexView
            size={1}
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              overflowX: "hidden",
              overflowY: "hidden",
              padding: "5px"
            }}
          >
            <ImageContainer
              data-cy="drag-drop-image-panel"
              imageUrl={item.imageUrl}
              width={`${canvasDimensions.maxWidth}px`}
              height={`${canvasDimensions.maxHeight}px`}
            >
              <div
                style={{
                  position: "relative",
                  width: imageWidth || "100%",
                  height: imageHeight || "100%"
                }}
              >
                <AnnotationRnd
                  style={{ backgroundColor: "transparent", boxShadow: "none", border: "1px solid lightgray" }}
                  questionId={item.id}
                  disableDragging={false}
                  above={!isAnnotationBelow}
                  onDoubleClick={toggleIsAnnotationBelow}
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
                    <PreviewImage
                      src={item.imageUrl}
                      width={imageWidth}
                      height={imageHeight}
                      maxWidth={maxWidth}
                      maxHeight={maxHeight}
                      alt="resp-preview"
                      onDragStart={e => e.preventDefault()}
                    />
                  </Rnd>
                  <DropArea
                    above={isAnnotationBelow}
                    disable={isEditableResizeMove}
                    setQuestionData={setQuestionData}
                    updateData={this.updateData}
                    item={item}
                    width="100%"
                    showIndex={false}
                    onDoubleClick={toggleIsAnnotationBelow}
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
            </ImageContainer>
            <FlexContainer>
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
          </FlexView>
        </FlexContainer>
        <PaddingDiv>
          {isEditAriaLabels && (
            <React.Fragment>
              <Subtitle>{t("component.cloze.imageDragDrop.editAriaLabels")}</Subtitle>
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

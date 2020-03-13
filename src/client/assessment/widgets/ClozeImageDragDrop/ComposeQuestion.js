import { themeColor } from "@edulastic/colors";
import { beforeUpload, PaddingDiv } from "@edulastic/common";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { aws, clozeImage } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { Dropdown, Input, InputNumber, message, Select, Upload } from "antd";
import produce from "immer";
import { get, isUndefined, maxBy } from "lodash";
import PropTypes from "prop-types";
import React, { Component, createRef } from "react";
import { ChromePicker } from "react-color";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import { Rnd } from "react-rnd";
import { withRouter } from "react-router-dom";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withTheme } from "styled-components";
import uuidv4 from "uuid/v4";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { uploadToS3 } from "../../../author/src/utils/upload";
import AnnotationRnd from "../../components/Annotations/AnnotationRnd";
import Question from "../../components/Question";
import QuestionTextArea from "../../components/QuestionTextArea";
import DropArea from "../../containers/DropArea";
import { CustomStyleBtn } from "../../styled/ButtonStyles";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";
import { FlexView } from "../../styled/FlexView";
import { Subtitle } from "../../styled/Subtitle";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";
import { Row } from "../../styled/WidgetOptions/Row";
import { updateVariables } from "../../utils/variables";
import { CheckContainer } from "../ClozeImageDropDown/styled/CheckContainer";
import { FormBottomContainer, FormContainer } from "../ClozeImageDropDown/styled/FormContainer";
import { ImageContainer } from "../ClozeImageDropDown/styled/ImageContainer";
import { PreviewImage } from "../ClozeImageDropDown/styled/PreviewImage";
import { UploadButton } from "../ClozeImageDropDown/styled/UploadButton";
import { ColorBox } from "./styled/ColorBox";
import { ControlButton, MoveControlButton } from "./styled/ControlButton";
import { FieldLabel, FieldWrapper } from "./styled/FieldWrapper";
import { FlexContainer } from "./styled/FlexContainer";
import { IconMoveResize } from "./styled/IconMoveResize";
import { IconPin } from "./styled/IconPin";
import { IconUpload } from "./styled/IconUpload";
import { PointerContainer } from "./styled/PointerContainer";
import { PointerSelect } from "./styled/PointerSelect";
import { TextInputStyled } from "../../styled/InputStyles";

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

  state = {
    isEditableResizeMove: false,
    isAnnotationBelow: false,
    isResizingImage: false
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

  toggleIsAnnotationBelow = () => {
    this.setState(prevState => ({ isAnnotationBelow: !prevState.isAnnotationBelow }));
  };

  changeImageDimensions = (prop, value) => {
    const { item } = this.props;
    const { imageOriginalWidth, imageOriginalHeight, imageWidth, imageHeight } = item;
    const keepAspectRatio = get(item, "responseLayout.keepAspectRatio", false);
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

    if (responses.length > 0) {
      const maxTop = maxBy(responses, res => res.top);
      const maxLeft = maxBy(responses, res => res.left);
      return {
        responseBoxMaxTop: maxTop.top + maxTop.height,
        responseBoxMaxLeft: maxLeft.left + maxLeft.width
      };
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
    const { t, item, setQuestionData, fillSections, cleanSections } = this.props;
    const { isEditableResizeMove, isAnnotationBelow } = this.state;
    const { toggleIsMoveResizeEditable, handleDragStop, toggleIsAnnotationBelow } = this;

    const { maxWidth, maxHeight } = clozeImage;

    const { responseLayout, background, imageAlterText, isEditAriaLabels, responses, imageOptions = {} } = item;

    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;

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
      <Question
        section="main"
        label={t("component.cloze.imageDragDrop.composequestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.cloze.imageDragDrop.composequestion")}`)}>
          {t("component.cloze.imageDragDrop.composequestion")}
        </Subtitle>
        <QuestionTextArea
          toolbarId="stimulus"
          inputId="stimulusInput"
          placeholder={t("component.cloze.imageDragDrop.thisisstem")}
          onChange={this.onChangeQuestion}
          value={item.stimulus}
          border="border"
        />
        <PaddingDiv top={30} />
        <FormContainer>
          <FieldWrapper>
            <InputNumber
              data-cy="image-width-input"
              value={imageWidth}
              onChange={value => this.changeImageDimensions("width", value)}
            />

            <Label top={6} left={20}>
              {t("component.cloze.imageDragDrop.widthpx")}
            </Label>
          </FieldWrapper>
          <FieldWrapper>
            <InputNumber
              data-cy="image-height-input"
              value={imageHeight}
              onChange={value => this.changeImageDimensions("height", value)}
            />

            <Label top={6} left={20}>
              {t("component.cloze.imageDragDrop.heightpx")}
            </Label>
          </FieldWrapper>

          <FieldWrapper>
            <InputNumber data-cy="image-left-input" value={imageLeft} onChange={this.changeImageLeft} />
            <Label top={6} left={20}>
              {t("component.cloze.imageText.positionX")}
            </Label>
          </FieldWrapper>

          <FieldWrapper>
            <InputNumber data-cy="image-top-input" value={imageTop} onChange={this.chnageImageTop} />
            <Label top={6} left={20}>
              {t("component.cloze.imageText.positionY")}
            </Label>
          </FieldWrapper>

          <CheckContainer position="unset" alignSelf="center">
            <CheckboxLabel
              data-cy="keep-aspect-ratio"
              defaultChecked={isEditAriaLabels}
              checked={responseLayout && responseLayout.keepAspectRatio}
              onChange={val => this.onResponsePropChange("keepAspectRatio", val.target.checked)}
            >
              {t("component.cloze.imageText.keepAspectRatio")}
            </CheckboxLabel>
          </CheckContainer>
          <PointerContainer className="controls-bar">
            <FieldWrapper>
              <ControlButton disabled={!hasActive}>
                <IconPin />
              </ControlButton>
              <Label top={6}>{t("component.cloze.imageDropDown.pointers")}</Label>
            </FieldWrapper>
            <PointerSelect
              disabled={!hasActive}
              defaultValue="none"
              onChange={this.handlePointersChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
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
              <Label top={6} left={20}>
                {t("component.cloze.imageDragDrop.fillcolor")}
              </Label>
            </FieldWrapper>
          </Dropdown>
        </FormContainer>
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
              style={{ height: canvasHeight, width: canvasWidth }}
              onDragStart={e => e.preventDefault()}
              onDoubleClick={toggleIsAnnotationBelow}
              onClick={this.addNewRespnose}
              ref={this.canvasRef}
            >
              <AnnotationRnd
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  border: "1px solid lightgray"
                }}
                question={item}
                setQuestionData={setQuestionData}
                disableDragging={false}
                isAbove={!isAnnotationBelow}
                onDoubleClick={toggleIsAnnotationBelow}
              />
              {item.imageUrl && (
                <React.Fragment>
                  <Rnd
                    ref={this.imageRndRef}
                    style={{ overflow: "hidden", height: `auto`, width: `auto` }}
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
                    lockAspectRatio={responseLayout && responseLayout.keepAspectRatio}
                    disableDragging={!isEditableResizeMove}
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
                    <PreviewImage
                      style={{ width: imageWidth, height: imageHeight }}
                      maxWidth={maxWidth}
                      maxHeight={maxHeight}
                      onDragStart={e => e.preventDefault()}
                      imageSrc={item.imageUrl}
                      ref={this.imagePreviewRef}
                    />
                  </Rnd>
                  <DropArea
                    item={item}
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
          </FlexView>
        </FlexContainer>
        <FormBottomContainer align="flex-start">
          {item.imageUrl && (
            <UploadButton {...uploadProps} showUploadList={false}>
              <CustomStyleBtn
                margin="0px 15px 0px 0px"
                id={getFormattedAttrId(`${item?.title}-${t("component.cloze.imageText.updateImageButtonText")}`)}
              >
                {t("component.cloze.imageText.updateImageButtonText")}
              </CustomStyleBtn>
            </UploadButton>
          )}
          <Row gutter={24} type={"flex"} wrap={"wrap"} marginTop="15">
            <Col span={8}>
              <CheckboxLabel
                data-cy="drag-drop-image-aria-check"
                defaultChecked={isEditAriaLabels}
                onChange={val => this.onItemPropChange("isEditAriaLabels", val.target.checked)}
              >
                {t("component.cloze.imageDragDrop.editAriaLabels")}
              </CheckboxLabel>
            </Col>
            <Col span={8}>
              <CheckboxLabel
                data-cy="drag-drop-image-dashboard-check"
                defaultChecked={responseLayout && responseLayout.showdashedborder}
                onChange={val => this.onResponsePropChange("showdashedborder", val.target.checked)}
              >
                {t("component.cloze.imageDragDrop.showdashedborder")}
              </CheckboxLabel>
            </Col>
            <Col span={8}>
              <CheckboxLabel
                data-cy="drag-drop-image-transparent-check"
                defaultChecked={responseLayout && responseLayout.transparentbackground}
                onChange={val => this.onResponsePropChange("transparentbackground", val.target.checked)}
              >
                {t("component.cloze.imageDragDrop.transparentbackground")}
              </CheckboxLabel>
            </Col>
            <Col span={8}>
              <CheckboxLabel
                data-cy="drag-drop-image-border-check"
                defaultChecked={responseLayout && responseLayout.showborder}
                onChange={val => this.onResponsePropChange("showborder", val.target.checked)}
              >
                {t("component.cloze.imageDragDrop.showborder")}
              </CheckboxLabel>
            </Col>
            <Col span={8}>
              <CheckboxLabel
                data-cy="drag-drop-image-border-check"
                defaultChecked={responseLayout && responseLayout.isSnapFitValues}
                onChange={val => this.onResponsePropChange("isSnapFitValues", val.target.checked)}
              >
                {t("component.cloze.imageDragDrop.snapfittodroparea")}
              </CheckboxLabel>
            </Col>
            <Col span={8}>
              <CheckboxLabel
                data-cy="drag-drop-image-wrap-text-to-fit"
                defaultChecked={responseLayout && responseLayout.isWrapText}
                onChange={e => this.onResponsePropChange("isWrapText", e.target.checked)}
              >
                {t("component.cloze.imageDragDrop.wrapTextToFitDropArea")}
              </CheckboxLabel>
            </Col>
          </Row>
        </FormBottomContainer>
        <PaddingDiv>
          {isEditAriaLabels && (
            <React.Fragment>
              <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.cloze.imageDragDrop.editAriaLabels")}`)}>
                {t("component.cloze.imageDragDrop.editAriaLabels")}
              </Subtitle>

              <Row gutter={24}>
                <Col span={24}>
                  <Label>{t("component.cloze.imageDropDown.imagealtertext")}</Label>
                  <div className="imagelabeldragdrop-droppable iseditablearialabel">
                    <TextInputStyled
                      data-cy="image-alternate-input"
                      size="large"
                      defaultValue={imageAlterText}
                      onChange={val => this.onItemPropChange("imageAlterText", val.target.value)}
                    />
                  </div>
                </Col>
                <Col span={24}>
                  <Label>{t("component.cloze.imageText.responsesaltertext")}</Label>
                  {responses.map((responseContainer, index) => (
                    <div className="imagelabeldragdrop-droppable iseditablearialabel" key={index}>
                      <span className="index-box">{index + 1}</span>
                      <TextInputStyled
                        defaultValue={responseContainer.label}
                        onChange={e => this.onResponseLabelChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </Col>
              </Row>
            </React.Fragment>
          )}
        </PaddingDiv>
      </Question>
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

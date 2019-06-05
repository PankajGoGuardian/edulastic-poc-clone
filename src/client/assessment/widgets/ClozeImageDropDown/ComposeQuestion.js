import React, { Component } from "react";
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

import { withNamespaces } from "@edulastic/localization";
import { API_CONFIG, TokenStorage } from "@edulastic/api";
import { PaddingDiv, EduButton } from "@edulastic/common";

import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import DropArea from "../../containers/DropArea";
import { Subtitle } from "../../styled/Subtitle";

import { StyledQuestionTextArea } from "./styled/StyledCustomQuill";
import { FormContainer } from "./styled/FormContainer";
import { ImageWidthInput } from "./styled/ImageWidthInput";
import { ImageAlterTextInput } from "./styled/ImageAlterTextInput";
import { ColorBox } from "./styled/ColorBox";
import { ColorPickerContainer } from "./styled/ColorPickerContainer";
import { ColorPickerWrapper } from "./styled/ColorPickerWrapper";
import { MaxRespCountInput } from "./styled/MaxRespCountInput";
import { FlexContainer } from "./styled/FlexContainer";
import { ControlBar } from "./styled/ControlBar";
import { ControlButton } from "./styled/ControlButton";
import { PointerContainer } from "./styled/PointerContainer";
import { PointerSelect } from "./styled/PointerSelect";
import { ImageFlexView } from "./styled/ImageFlexView";
import { ImageContainer } from "./styled/ImageContainer";
import { PreviewImage } from "./styled/PreviewImage";
import { CheckContainer } from "./styled/CheckContainer";
import { IconDrawResize } from "./styled/IconDrawResize";
import { IconMoveResize } from "./styled/IconMoveResize";
import { IconPin } from "./styled/IconPin";
import { IconUpload } from "./styled/IconUpload";
import { Widget } from "../../styled/Widget";

const { Option } = Select;
const { Dragger } = Upload;

class ComposeQuestion extends Component {
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
    const { fillSections, t } = this.props;
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

  getImageDimensions = url => {
    const { maxWidth, maxHeight } = this.props;
    const img = new Image();
    const that = this;
    img.addEventListener("load", function() {
      const maxheight = maxHeight.split("px")[0];
      const maxwidth = maxWidth.split("px")[0];
      let height, width;
      if (this.naturalHeight > maxheight || this.naturalWidth > maxwidth) {
        const fitHeight = Math.floor(maxwidth * (this.naturalHeight / this.naturalWidth));
        const fitWidth = Math.floor(maxheight * (this.naturalWidth / this.naturalHeight));
        if (fitWidth > maxwidth) {
          width = maxwidth;
          height = fitHeight;
        } else {
          height = maxHeight;
          width = fitWidth;
        }
      } else {
        width = this.naturalWidth;
        height = this.naturalHeight;
      }
      ((width, height) => {
        that.onItemPropChange("imageWidth", width);
        that.onItemPropChange("imageHeight", height);
      })(width, height);
    });
    img.src = url;
  };

  getHeight = () => {
    const { item, maxHeight } = this.props;
    return item.imageHeight > 0 ? (item.imageHeight >= maxHeight ? maxHeight : item.imageHeight) : maxHeight;
  };

  changeImageHeight = height => {
    const { maxHeight } = this.props;
    const limit = +maxHeight.split("px")[0];
    const newHeight = height > 0 ? (height >= limit ? limit : height) : limit;
    this.onItemPropChange("imageHeight", newHeight);
  };

  handleImageUpload = info => {
    const { status, response } = info.file;
    const { t } = this.props;
    if (status === "done") {
      message.success(`${info.file.name} ${t("component.cloze.imageDropDown.fileUploadedSuccessfully")}.`);
      const imageUrl = response.result.fileUri;
      this.getImageDimensions(imageUrl);
      this.onItemPropChange("imageUrl", imageUrl);
    } else if (status === "error") {
      message.error(`${info.file.name} ${t("component.cloze.imageDropDown.fileUploadFailed")}.`);
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

  render() {
    const { t, item, theme, maxWidth, maxHeight, setQuestionData } = this.props;
    const { maxRespCount, background, imageAlterText, isEditAriaLabels, responses, imageWidth, imageHeight } = item;
    const { isColorPickerVisible, isEditableResizeMove } = this.state;

    const { toggleIsMoveResizeEditable, handleImagePosition } = this;
    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;

    const { imageOptions = {} } = item;

    const width = maxWidth;
    const height = maxHeight;

    const draggerProps = {
      name: "file",
      action: `${API_CONFIG.api}/file/upload`,
      headers: {
        "X-Requested-With": null,
        authorization: TokenStorage.getAccessToken()
      }
    };

    return (
      <div>
        <PaddingDiv>
          <Widget>
            <Subtitle>{t("component.cloze.imageDropDown.composequestion")}</Subtitle>
            <StyledQuestionTextArea
              placeholder={t("component.cloze.imageDropDown.thisisstem")}
              onChange={this.onChangeQuestion}
              showResponseBtn={false}
              value={item.stimulus}
            />
            <PaddingDiv />
            <FormContainer>
              <div style={{ alignItems: "center" }}>
                <ImageWidthInput
                  ref={this.imageWidthEditor}
                  data-cy="image-width-input"
                  value={imageWidth > 0 ? (imageWidth >= 700 ? 700 : imageWidth) : 700}
                  onChange={event => {
                    this.onItemPropChange("imageWidth", event > 0 ? (event >= 700 ? 700 : event) : 700);
                  }}
                />

                <PaddingDiv left={20}>{t("component.cloze.imageDropDown.widthpx")}</PaddingDiv>
              </div>
              <div style={{ alignItems: "center" }}>
                <ImageWidthInput
                  data-cy="image-height-input"
                  value={this.getHeight()}
                  onChange={this.changeImageHeight}
                />
                <PaddingDiv left={20}>{t("component.cloze.imageDropDown.heightpx")}</PaddingDiv>
              </div>
              <div style={{ alignItems: "center" }}>
                <ImageAlterTextInput
                  data-cy="image-alternate-input"
                  size="large"
                  defaultValue={imageAlterText}
                  onChange={val => this.onItemPropChange("imageAlterText", val.target.value)}
                />
                <PaddingDiv left={20}>{t("component.cloze.imageDropDown.imagealtertext")}</PaddingDiv>
              </div>
              <div style={{ alignItems: "center" }}>
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
              </div>
              <div style={{ alignItems: "center" }}>
                <MaxRespCountInput
                  data-cy="drag-drop-image-max-res"
                  min={1}
                  max={10}
                  defaultValue={maxRespCount}
                  onChange={val => this.onItemPropChange("maxRespCount", val)}
                />
                <PaddingDiv left={20} style={{ width: 160 }}>
                  {t("component.cloze.imageDropDown.maximumresponses")}
                </PaddingDiv>
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
              <ControlBar>
                <ControlButton>
                  <IconDrawResize />
                  {t("component.cloze.imageDropDown.drawresize")}
                </ControlButton>
                <ControlButton
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
                </ControlButton>
                <PointerContainer className="controls-bar">
                  <ControlButton disabled={!hasActive}>
                    <IconPin />
                    {t("component.cloze.imageDropDown.pointers")}
                  </ControlButton>
                  <PointerSelect disabled={!hasActive} defaultValue="none" onChange={this.handlePointersChange}>
                    <Option value="none">{t("component.cloze.imageDropDown.none")}</Option>
                    <Option value="top">{t("component.cloze.imageDropDown.top")}</Option>
                    <Option value="bottom">{t("component.cloze.imageDropDown.bottom")}</Option>
                    <Option value="left">{t("component.cloze.imageDropDown.left")}</Option>
                    <Option value="right">{t("component.cloze.imageDropDown.right")}</Option>
                  </PointerSelect>
                </PointerContainer>
              </ControlBar>
              <ImageFlexView size={1} alignItems={"flex-start"}>
                <ImageContainer
                  data-cy="drag-drop-image-panel"
                  imageUrl={item.imageUrl}
                  width={!maxWidth ? imageWidth || null : maxWidth}
                  height={maxHeight}
                >
                  {item.imageUrl && (
                    <React.Fragment>
                      <Rnd
                        style={{ overflow: "hidden" }}
                        default={{
                          x: imageOptions.x || 0,
                          y: imageOptions.y || 0,
                          width,
                          height
                        }}
                        onDragStop={(evt, d) => handleImagePosition(d)}
                      >
                        <PreviewImage
                          src={item.imageUrl}
                          width={imageWidth < 700 ? imageWidth : maxWidth}
                          height={imageHeight}
                          maxWidth={maxWidth}
                          maxHeight={maxHeight}
                          alt="resp-preview"
                          onDragStart={e => e.preventDefault()}
                        />
                      </Rnd>
                      <DropArea
                        disable={isEditableResizeMove}
                        setQuestionData={setQuestionData}
                        updateData={this.updateData}
                        item={item}
                        width={"100%"}
                        showIndex={false}
                      />
                    </React.Fragment>
                  )}
                  {!item.imageUrl && (
                    <Dragger {...draggerProps} onChange={this.handleImageUpload}>
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
                </ImageContainer>
                <FlexContainer>
                  {item.imageUrl && (
                    <Dragger
                      className="super-dragger"
                      {...draggerProps}
                      style={{ padding: 0, marginRight: "20px" }}
                      onChange={this.handleImageUpload}
                      showUploadList={false}
                    >
                      <EduButton type="primary">{t("component.cloze.imageText.updateImageButtonText")}</EduButton>
                    </Dragger>
                  )}
                  <CheckContainer position={"unset"} alignSelf={"center"}>
                    <Checkbox
                      data-cy="drag-drop-image-aria-check"
                      defaultChecked={isEditAriaLabels}
                      onChange={val => this.onItemPropChange("isEditAriaLabels", val.target.checked)}
                    >
                      {t("component.cloze.imageDropDown.editAriaLabels")}
                    </Checkbox>
                  </CheckContainer>
                </FlexContainer>
              </ImageFlexView>
            </FlexContainer>
            <PaddingDiv>
              {isEditAriaLabels && (
                <React.Fragment>
                  <Subtitle>{t("component.cloze.imageDropDown.editAriaLabels")}</Subtitle>
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

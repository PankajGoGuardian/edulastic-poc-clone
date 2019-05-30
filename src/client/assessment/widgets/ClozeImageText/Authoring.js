import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import produce from "immer";
import "react-quill/dist/quill.snow.css";
import { Checkbox, Input, Select, Upload, message } from "antd";
import { ChromePicker } from "react-color";
import { withTheme } from "styled-components";
import { cloneDeep } from "lodash";

import { API_CONFIG, TokenStorage } from "@edulastic/api";
import { PaddingDiv, EduButton } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import DropArea from "../../containers/DropArea";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";
import { Subtitle } from "../../styled/Subtitle";

import { StyledCustomQuill } from "./styled/StyledCustomQuill";
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
import { IconPin } from "./styled/IconPin";
import { IconUpload } from "./styled/IconUpload";
import { Widget } from "../../styled/Widget";

import SortableList from "../../components/SortableList";

const { Option } = Select;
const { Dragger } = Upload;

class Authoring extends Component {
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
    imageWidth:
      this.props.item.imageWidth > 0 ? (this.props.item.imageWidth >= 700 ? 700 : this.props.item.imageWidth) : 700
  };

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);
    fillSections("main", t("component.cloze.imageText.composequestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  componentDidUpdate(nextProps) {
    const { item, setQuestionData } = nextProps;
    const { item: pastItem } = this.props;

    const newItem = cloneDeep(item);
    if (document.getElementById("mainImage") && item.imageUrl) {
      const imageHeight = document.getElementById("mainImage").clientHeight;
      const imageWidth = document.getElementById("mainImage").clientWidth;

      newItem.responses = item.responses.map(response => {
        const newResponse = cloneDeep(response);
        if (newResponse.width > imageWidth) {
          newResponse.width = imageWidth;
        }
        if (newResponse.height > imageHeight) {
          newResponse.height = imageHeight;
        }
        if (newResponse.top + newResponse.height > imageHeight) {
          newResponse.top = imageHeight - newResponse.height;
        }
        if (newResponse.left + newResponse.width > imageWidth) {
          newResponse.left = imageWidth - newResponse.width;
        }

        return newResponse;
      });

      if (item.imageWidth && imageWidth !== item.imageWidth) {
        newItem.imageWidth = imageWidth;
        setQuestionData(newItem);
      }
    }
    if (newItem.responses.length - pastItem.responses.length === 1) {
      pastItem.validation.valid_response.value.pop();
      pastItem.validation.alt_responses = pastItem.validation.alt_responses.map(resp => {
        resp.value.pop();
        return resp;
      });
      setQuestionData(pastItem);
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

  getImageWidth = url => {
    const img = new Image();
    const that = this;
    img.addEventListener("load", function() {
      const width = this.naturalWidth >= 700 ? 700 : this.naturalWidth;
      (wid => {
        that.onItemPropChange("imageWidth", wid);
      })(width);
    });
    img.src = url;
  };

  handleImageUpload = info => {
    const { status, response } = info.file;
    const { t } = this.props;
    if (status === "done") {
      message.success(`${info.file.name} ${t("component.cloze.imageText.fileUploadedSuccessfully")}.`);
      const imageUrl = response.result.fileUri;
      this.getImageWidth(imageUrl);
      this.onItemPropChange("imageUrl", imageUrl);
    } else if (status === "error") {
      message.error(`${info.file.name} ${t("component.cloze.imageText.fileUploadFailed")}.`);
    }
  };

  changeImageWidth = event => {
    const newWidth = event > 0 ? (event >= 700 ? 700 : event) : 700;
    this.onItemPropChange("imageWidth", newWidth);
  };

  getWidth = () => {
    const { item } = this.props;

    return item.imageWidth > 0 ? (item.imageWidth >= 700 ? 700 : item.imageWidth) : 700;
  };

  render() {
    const { t, item, theme, maxWidth, maxHeight } = this.props;
    const { maxRespCount, background, imageAlterText, isEditAriaLabels, responses, imageWidth } = item;
    console.log(item, "item");
    const { isColorPickerVisible } = this.state;
    const hasActive = item.responses && item.responses.filter(it => it.active === true).length > 0;

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
            <Subtitle>{t("component.cloze.imageText.composequestion")}</Subtitle>
            <StyledCustomQuill
              toolbarId="stimulus"
              wrappedRef={instance => {
                this.stimulus = instance;
              }}
              placeholder={t("component.cloze.imageText.thisisstem")}
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
                  value={this.getWidth()}
                  onChange={this.changeImageWidth}
                />

                <PaddingDiv left={20}>{t("component.cloze.imageText.widthpx")}</PaddingDiv>
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
                <PaddingDiv left={20}>{t("component.cloze.imageText.fillcolor")}</PaddingDiv>
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
                  {t("component.cloze.imageText.maximumresponses")}
                </PaddingDiv>
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
              <ControlBar>
                <ControlButton>
                  <IconDrawResize />
                  {t("component.cloze.imageText.drawresize")}
                </ControlButton>

                <PointerContainer className="controls-bar">
                  <ControlButton disabled={!hasActive}>
                    <IconPin />
                    {t("component.cloze.imageText.pointers")}
                  </ControlButton>
                  <PointerSelect disabled={!hasActive} defaultValue="none" onChange={this.handlePointersChange}>
                    <Option value="none">{t("component.cloze.imageText.none")}</Option>
                    <Option value="top">{t("component.cloze.imageText.top")}</Option>
                    <Option value="bottom">{t("component.cloze.imageText.bottom")}</Option>
                    <Option value="left">{t("component.cloze.imageText.left")}</Option>
                    <Option value="right">{t("component.cloze.imageText.right")}</Option>
                  </PointerSelect>
                </PointerContainer>
              </ControlBar>
              <ImageFlexView size={1} leftAlign={true}>
                <ImageContainer
                  data-cy="drag-drop-image-panel"
                  imageUrl={item.imageUrl}
                  height={maxHeight}
                  width={maxWidth}
                >
                  {item.imageUrl && (
                    <React.Fragment>
                      <PreviewImage
                        id="mainImage"
                        src={item.imageUrl}
                        width={imageWidth < 700 ? imageWidth : maxWidth}
                        height={"auto"}
                        maxWidth={maxWidth}
                        maxHeight={maxHeight}
                        alt="resp-preview"
                      />
                      <DropArea
                        updateData={this.updateData}
                        item={item}
                        key={item}
                        width={maxWidth}
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
                <FlexContainer>
                  {item.imageUrl && (
                    <Dragger
                      className="super-dragger"
                      {...draggerProps}
                      style={{ padding: 0, marginBottom: 20, marginTop: 20, marginRight: 20 }}
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
                      {t("component.cloze.imageText.editAriaLabels")}
                    </Checkbox>
                  </CheckContainer>
                </FlexContainer>
              </ImageFlexView>
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

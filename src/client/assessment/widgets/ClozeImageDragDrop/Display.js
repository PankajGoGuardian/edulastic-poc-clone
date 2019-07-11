import PropTypes from "prop-types";
import React, { Component } from "react";
import { cloneDeep, flattenDeep, isUndefined, get, maxBy } from "lodash";
import { withTheme } from "styled-components";

import { InstructorStimulus, Stimulus } from "@edulastic/common";
import { response, clozeImage } from "@edulastic/constants";
import striptags from "striptags";

import DropContainer from "./components/DropContainer";
import DragItem from "./components/DragItem";

import { Pointer } from "../../styled/Pointer";
import { Point } from "../../styled/Point";
import { Triangle } from "../../styled/Triangle";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

import ResponseBoxLayout from "./components/ResponseBoxLayout";
import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import CorrectAnswerBoxLayout from "./components/CorrectAnswerBoxLayout";
import { getFontSize } from "../../utils/helpers";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import { RelativeContainer } from "../../styled/RelativeContainer";
import { StyledPreviewImage } from "./styled/StyledPreviewImage";
import { StyledPreviewTemplateBox } from "./styled/StyledPreviewTemplateBox";
import { StyledPreviewContainer } from "./styled/StyledPreviewContainer";
import AnswerContainer from "./AnswerContainer";

import AnnotationRnd from "../../components/Graph/Annotations/AnnotationRnd";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

class Display extends Component {
  constructor(props) {
    super(props);
    const userAnswers = new Array(props.responseContainers.length).fill(false);
    props.userSelections.map((userSelection, index) => {
      userAnswers[index] = userSelection;
      return 0;
    });
    const possibleResponses = this.getInitialResponses(props);

    this.state = {
      userAnswers,
      possibleResponses
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state !== undefined) {
      const possibleResponses = this.getInitialResponses(nextProps);
      this.setState({
        userAnswers: nextProps.userSelections ? [...nextProps.userSelections] : [],
        possibleResponses
      });
    }
  }

  onDrop = ({ item: sourceData, fromContainerIndex, fromRespIndex }, index) => {
    const { userAnswers, possibleResponses } = this.state;
    const { maxRespCount } = this.props;
    const { onChange } = this.props;

    if (fromContainerIndex === index) {
      return;
    }

    const newAnswers = cloneDeep(userAnswers);
    const newResponses = cloneDeep(possibleResponses);

    const data = Array.isArray(sourceData) ? sourceData : [sourceData];
    newAnswers[index] = [...(newAnswers[index] || []), ...data];

    if (maxRespCount && newAnswers[index].length > maxRespCount) {
      const last = newAnswers[index].splice(newAnswers[index].length - 2, 1)[0];
      newResponses.push(last);
    }

    if (typeof fromContainerIndex === "number") {
      newAnswers[fromContainerIndex] = newAnswers[fromContainerIndex].filter((_, i) => i !== fromRespIndex);
    }

    this.setState({ userAnswers: newAnswers, possibleResponses: newResponses });
    onChange(newAnswers);

    const { changePreview, changePreviewTab } = this.props;
    if (changePreview) {
      changePreview("clear");
    }
    changePreviewTab("clear");
  };

  shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  shuffleGroup = data =>
    data.map(arr => {
      arr.options = this.shuffle(arr.options);
      return arr;
    });

  getInitialResponses = ({ options, userSelections, configureOptions }) => {
    const { duplicatedResponses: isDuplicated } = configureOptions;

    let possibleResps = [];
    possibleResps = cloneDeep(options);
    userSelections = flattenDeep(userSelections);
    if (!isDuplicated) {
      for (let j = 0; j < userSelections.length; j++) {
        for (let i = 0; i < possibleResps.length; i++) {
          if (possibleResps[i] === userSelections[j]) {
            possibleResps.splice(i, 1);
            break;
          }
        }
      }
    }
    return possibleResps;
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
    const { imageHeight, keepAspectRatio, imageOriginalHeight, imageOriginalWidth } = item;
    const { maxHeight } = clozeImage;
    const imageWidth = this.getWidth();
    // If image uploaded is smaller than the max width, keep it as-is
    // If image is larger, compress it to max width (keep aspect-ratio by default)
    // If user changes image size manually to something larger, allow it
    if (keepAspectRatio && !isUndefined(imageOriginalHeight)) {
      return (imageOriginalHeight * imageWidth) / imageOriginalWidth;
    }

    if (!isUndefined(imageHeight)) {
      return imageHeight > 0 ? imageHeight : maxHeight;
    }

    if (!isUndefined(imageHeight)) {
      return imageHeight > 0 ? imageHeight : maxHeight;
    }

    if (!isUndefined(imageOriginalHeight) && imageOriginalHeight < maxHeight) {
      return imageOriginalHeight;
    }

    return maxHeight;
  };

  getResponseBoxMaxValues = () => {
    const { responseContainers } = this.props;

    if (responseContainers.length > 0) {
      const maxTop = maxBy(responseContainers, res => res.top);
      const maxLeft = maxBy(responseContainers, res => res.left);
      return { responseBoxMaxTop: maxTop.top + maxTop.height, responseBoxMaxLeft: maxLeft.left + maxLeft.width };
    }
    return { responseBoxMaxTop: 0, responseBoxMaxLeft: 0 };
  };

  render() {
    const {
      smallSize,
      question,
      configureOptions,
      preview,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation,
      imageUrl,
      responseContainers,
      imageAlterText,
      showDashedBorder,
      backgroundColor,
      instructorStimulus,
      theme,
      showQuestionNumber,
      disableResponse,
      item,
      imageOptions,
      showBorder,
      isReviewTab
    } = this.props;

    const questionId = item && item.id;

    const { userAnswers: _uAnswers, possibleResponses } = this.state;
    const cAnswers = get(item, "validation.valid_response.value", []);

    const userAnswers = isReviewTab ? cAnswers : _uAnswers;

    const { showDraghandle: dragHandler, shuffleOptions, transparentResponses } = configureOptions;
    let responses = cloneDeep(possibleResponses);
    if (preview && shuffleOptions) {
      responses = this.shuffle(possibleResponses);
    }
    // Layout Options
    const fontSize = getFontSize(uiStyle.fontsize);
    const { heightpx, wordwrap, responsecontainerposition, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : "auto",
      heightpx: heightpx !== 0 ? heightpx : "auto",
      whiteSpace: wordwrap ? "inherit" : "nowrap"
    };

    const dragItemStyle = {
      border: `${showBorder ? `solid 1px ${theme.widgets.clozeImageDragDrop.dragItemBorderColor}` : null}`,
      margin: 5,
      padding: 5,
      display: "flex",
      alignItems: "center",
      width: "max-content",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    };
    const { maxHeight, maxWidth } = clozeImage;
    const imageWidth = this.getWidth();
    const imageHeight = this.getHeight();
    let canvasHeight = imageHeight + (imageOptions.y || 0);
    let canvasWidth = imageWidth + +(imageOptions.x || 0);

    const { responseBoxMaxTop, responseBoxMaxLeft } = this.getResponseBoxMaxValues();

    if (canvasHeight < responseBoxMaxTop) {
      canvasHeight = responseBoxMaxTop + 20;
    }

    if (canvasWidth < responseBoxMaxLeft) {
      canvasWidth = responseBoxMaxLeft;
    }

    const renderImage = () => (
      <StyledPreviewImage
        imageSrc={imageUrl || ""}
        width={imageWidth}
        height={imageHeight}
        alt={imageAlterText}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        style={{
          position: "absolute",
          top: imageOptions.y || 0,
          left: imageOptions.x || 0
        }}
      />
    );

    const drop = data => data;

    const previewTemplateBoxLayout = (
      <StyledPreviewTemplateBox
        smallSize={smallSize}
        fontSize={fontSize}
        height={canvasHeight > maxHeight ? canvasHeight : maxHeight}
      >
        <StyledPreviewContainer
          smallSize={smallSize}
          width={canvasWidth > maxWidth ? canvasWidth : maxWidth}
          height={canvasHeight > maxHeight ? canvasHeight : maxHeight}
        >
          <div style={{ position: "relative" }}>
            <AnnotationRnd
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
                border: preview ? null : "1px solid lightgray"
              }}
              questionId={questionId}
            />
          </div>
          {renderImage()}
          {responseContainers.map((responseContainer, index) => {
            const dropTargetIndex = index;
            const btnStyle = {
              widthpx: smallSize ? responseContainer.width / 2 : responseContainer.width,
              width: smallSize ? responseContainer.width / 2 : responseContainer.width,
              top: smallSize ? responseContainer.top / 2 : responseContainer.top,
              left: smallSize ? responseContainer.left / 2 : responseContainer.left,
              height: smallSize ? responseContainer.height / 2 : responseContainer.height,
              border: showDashedBorder
                ? `dashed 2px ${theme.widgets.clozeImageDragDrop.dropContainerDashedBorderColor}`
                : `solid 1px ${theme.widgets.clozeImageDragDrop.dropContainerSolidBorderColor}`,
              position: "absolute",
              background: backgroundColor,
              borderRadius: 5
              // overflow: "hidden"
            };
            if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
              const { widthpx } = responsecontainerindividuals[dropTargetIndex];
              btnStyle.width = widthpx;
              btnStyle.widthpx = widthpx;
            }
            if (btnStyle && btnStyle.width === 0) {
              btnStyle.width = responseBtnStyle.widthpx;
            } else {
              btnStyle.width = btnStyle.widthpx;
            }
            // eslint-disable-next-line no-unused-vars
            let indexStr = "";
            switch (stemnumeration) {
              case "lowercase": {
                indexStr = ALPHABET[dropTargetIndex];
                break;
              }
              case "uppercase": {
                indexStr = ALPHABET[dropTargetIndex].toUpperCase();
                break;
              }
              default:
                indexStr = dropTargetIndex + 1;
            }
            return (
              <DropContainer
                key={index}
                index={index}
                style={{
                  ...btnStyle,
                  borderStyle: smallSize ? "dashed" : "solid",
                  height: responseContainer.height || "auto", // responseContainer.height || "auto",
                  width: responseContainer.width || "auto",
                  minHeight: responseContainer.height || "auto",
                  minWidth: responseContainer.width || "auto",
                  maxWidth: response.maxWidth
                }}
                className="imagelabeldragdrop-droppable active"
                drop={drop}
              >
                {responseContainer.label && (
                  <span className="sr-only" role="heading">
                    Drop target {responseContainer.label}
                  </span>
                )}
                <div className="container">
                  {userAnswers[dropTargetIndex] &&
                    userAnswers[dropTargetIndex].map((answer, item_index) => {
                      const title = striptags(answer) || null;
                      return (
                        <DragItem
                          title={title}
                          key={item_index}
                          showDashedBorder={showDashedBorder}
                          index={item_index}
                          item={answer}
                          data={`${answer}_${dropTargetIndex}_${item_index}`}
                          style={dragItemStyle}
                          onDrop={this.onDrop}
                        >
                          <AnswerContainer
                            height={responseContainer.height || "auto"}
                            width={responseContainer.width || "auto"}
                            answer={answer.replace("<p>", "<p class='clipText'>") || ""}
                          />
                        </DragItem>
                      );
                    })}
                </div>
                <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                  <Point />
                  <Triangle />
                </Pointer>
              </DropContainer>
            );
          })}
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    );

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        responseContainers={responseContainers}
        responsecontainerindividuals={responsecontainerindividuals}
        responseBtnStyle={responseBtnStyle}
        image={renderImage()}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        stemnumeration={stemnumeration}
        fontSize={fontSize}
        showAnswer={showAnswer}
        checkAnswer={checkAnswer}
        userSelections={userAnswers}
        evaluation={evaluation}
        drop={drop}
        onDropHandler={this.onDrop}
        showBorder={showBorder}
      />
    );
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const previewResponseBoxLayout = (
      <ResponseBoxLayout
        smallSize={smallSize}
        onDrop={!disableResponse ? this.onDrop : () => {}}
        drop={drop}
        responses={responses}
        fontSize={fontSize}
        dragHandler={dragHandler}
        transparentResponses={transparentResponses}
      />
    );
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
      />
    ) : (
      <div />
    );
    const responseBoxLayout = showAnswer || isReviewTab ? <div /> : previewResponseBoxLayout;
    const answerBox = showAnswer ? correctAnswerBoxLayout : <div />;

    const responseposition = smallSize ? "right" : responsecontainerposition;

    return (
      <div style={{ fontSize }}>
        <InstructorStimulus>{instructorStimulus}</InstructorStimulus>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
          <Stimulus smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
        {responseposition === "top" && (
          <React.Fragment>
            <div style={{ margin: "15px 0", borderRadius: 10 }}>
              <RelativeContainer>{responseBoxLayout}</RelativeContainer>
            </div>
            <div style={{ margin: "15px 0", borderRadius: 10 }}>{templateBoxLayout}</div>
          </React.Fragment>
        )}
        {responseposition === "bottom" && (
          <React.Fragment>
            <div style={{ margin: "15px 0", borderRadius: 10 }}>
              <RelativeContainer>{templateBoxLayout}</RelativeContainer>
            </div>
            <div style={{ margin: "15px 0", borderRadius: 10 }}>{responseBoxLayout}</div>
          </React.Fragment>
        )}
        {responseposition === "left" && (
          <div style={{ display: "flex" }}>
            <div
              className="left responseboxContainer"
              style={{
                width: "20%",
                margin: 15,
                height: "auto",
                borderRadius: 10,
                background: theme.widgets.clozeImageDragDrop.responseBoxBgColor,
                display: "flex",
                justifyContent: "center"
              }}
            >
              <RelativeContainer>{responseBoxLayout}</RelativeContainer>
            </div>
            <div
              style={{
                margin: "15px 0 15px 15px",
                borderRadius: 10,
                flex: 1
              }}
            >
              {templateBoxLayout}
            </div>
          </div>
        )}
        {responseposition === "right" && (
          <div
            style={{
              display: "flex",
              height: smallSize ? 190 : "100%",
              margin: smallSize ? "-30px -40px" : 0
            }}
          >
            <div
              style={{
                flex: 1,
                margin: smallSize ? 0 : "15px 15px 15px 0",
                borderRadius: 10
              }}
            >
              {templateBoxLayout}
            </div>
            <div
              className={`right responseboxContainer ${smallSize ? "small" : ""}`}
              style={{
                height: "auto",
                width: smallSize ? "120px" : "100%",
                margin: smallSize ? 0 : 15,
                borderRadius: smallSize ? 0 : 10,
                background: theme.widgets.clozeImageDragDrop.responseBoxBgColor,
                display: "flex",
                justifyContent: "center"
              }}
            >
              <RelativeContainer>{responseBoxLayout}</RelativeContainer>
            </div>
          </div>
        )}
        {answerBox}
      </div>
    );
  }
}

Display.propTypes = {
  options: PropTypes.array,
  changePreviewTab: PropTypes.func,
  changePreview: PropTypes.func,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  responseContainers: PropTypes.array,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  question: PropTypes.string.isRequired,
  configureOptions: PropTypes.object,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  backgroundColor: PropTypes.string,
  uiStyle: PropTypes.object,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  theme: PropTypes.object.isRequired,
  disableResponse: PropTypes.bool,
  maxRespCount: PropTypes.number,
  instructorStimulus: PropTypes.string,
  imageOptions: PropTypes.object,
  showQuestionNumber: PropTypes.bool,
  item: PropTypes.object,
  showBorder: PropTypes.bool,
  isReviewTab: PropTypes.bool
};

Display.defaultProps = {
  options: [],
  changePreviewTab: () => {},
  changePreview: () => {},
  onChange: () => {},
  preview: true,
  disableResponse: false,
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  userSelections: [],
  responseContainers: [],
  showDashedBorder: false,
  smallSize: false,
  backgroundColor: "#fff",
  validation: {},
  imageUrl: undefined,
  imageAlterText: "",
  maxRespCount: 1,
  configureOptions: {
    showDraghandle: false,
    duplicatedResponses: false,
    shuffleOptions: false,
    transparentResponses: false
  },
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "numerical",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  instructorStimulus: "",
  imageOptions: {},
  showBorder: false,
  showQuestionNumber: false,
  item: {},
  isReviewTab: false
};

export default withTheme(withCheckAnswerButton(Display));

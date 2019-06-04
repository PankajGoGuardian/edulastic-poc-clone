import PropTypes from "prop-types";
import React, { Component } from "react";
import { cloneDeep, flattenDeep } from "lodash";
import { withTheme } from "styled-components";

import { InstructorStimulus, MathSpan } from "@edulastic/common";
import { white } from "@edulastic/colors";
import DropContainer from "./components/DropContainer";
import DragItem from "./components/DragItem";

import { Pointer } from "../../styled/Pointer";
import { Point } from "../../styled/Point";
import { Triangle } from "../../styled/Triangle";
import { QuestionHeader } from "../../styled/QuestionHeader";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

import ResponseBoxLayout from "./components/ResponseBoxLayout";
import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import CorrectAnswerBoxLayout from "./components/CorrectAnswerBoxLayout";
import { getFontSize } from "../../utils/helpers";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import { RelativeContainer } from "../../styled/RelativeContainer";
import AnnotationRnd from "../../components/Graph/Annotations/AnnotationRnd";

import { response } from "../../../../../packages/constants/const/dimensions";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

class Display extends Component {
  constructor(props) {
    super(props);
    console.log("display", props);
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
      const last = newAnswers[index].splice(newAnswers[index].length - 2, 1);
      newResponses.push(last);
    }

    if (typeof fromContainerIndex === "number") {
      newAnswers[fromContainerIndex] = newAnswers[fromContainerIndex].filter((_, i) => i !== fromRespIndex);
    }

    this.setState({ userAnswers: newAnswers, possibleResponses: newResponses });
    onChange(newAnswers);
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
      imageWidth,
      imageHeight,
      imageTitle,
      showDashedBorder,
      backgroundColor,
      instructorStimulus,
      theme,
      showQuestionNumber,
      qIndex,
      item,
      maxHeight,
      maxWidth
    } = this.props;

    const questionId = item && item.id;

    const { userAnswers, possibleResponses } = this.state;
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

    const renderImage = () =>
      imageUrl ? (
        <img
          src={imageUrl || ""}
          style={{
            userSelect: "none",
            pointerEvents: "none",
            width: !maxWidth ? imageWidth || "auto" : imageWidth,
            height: !maxHeight ? imageHeight || "auto" : imageHeight,
            maxHeight: !maxHeight ? null : maxHeight,
            maxWidth: !maxWidth ? null : maxWidth
          }}
          alt={imageAlterText}
          title={imageTitle}
        />
      ) : (
        <div
          style={{
            background: white,
            width: uiStyle.widthpx || "100%",
            height: uiStyle.widthpx || 400,
            userSelect: "none",
            pointerEvents: "none"
          }}
        />
      );

    const drop = data => data;

    const previewTemplateBoxLayout = (
      <div
        className={`imagedragdrop_template_box ${smallSize ? "small" : ""}`}
        style={{
          width: !maxWidth ? imageWidth || "100%" : maxWidth,
          height: !maxHeight ? imageHeight || "100%" : maxHeight,
          margin: "auto",
          fontSize: smallSize ? theme.widgets.clozeImageDragDrop.previewTemplateBoxSmallFontSize : fontSize,
          position: "relative",
          maxHeight: !maxHeight ? null : maxHeight,
          maxWidth: !maxWidth ? null : maxWidth
        }}
      >
        <AnnotationRnd
          style={{ backgroundColor: "transparent", boxShadow: "none", border: "1px solid lightgray" }}
          questionId={questionId}
        />
        <div
          data-cy="drag-drop-board"
          style={{
            position: "relative",
            top: 0,
            left: 0,
            width: "auto",
            minWidth: maxWidth,
            minHeight: maxHeight
          }}
        >
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
              borderRadius: 5,
              overflow: "hidden"
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
                  height: "auto",
                  minHeight: btnStyle.height,
                  width: "max-content",
                  minWidth: response.minWidth,
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
                    userAnswers[dropTargetIndex].map((answer, item_index) => (
                      <DragItem
                        key={item_index}
                        showDashedBorder={showDashedBorder}
                        index={item_index}
                        item={answer}
                        data={`${answer}_${dropTargetIndex}_${item_index}`}
                        style={{
                          border: `solid 1px ${theme.widgets.clozeImageDragDrop.dragItemBorderColor}`,
                          margin: 5,
                          padding: 5,
                          display: "inline-block",
                          width: "max-content",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                        onDrop={this.onDrop}
                      >
                        <MathSpan dangerouslySetInnerHTML={{ __html: answer || "" }} />
                      </DragItem>
                    ))}
                </div>
                <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                  <Point />
                  <Triangle />
                </Pointer>
              </DropContainer>
            );
          })}
        </div>
      </div>
    );

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        responseContainers={responseContainers}
        responsecontainerindividuals={responsecontainerindividuals}
        responseBtnStyle={responseBtnStyle}
        image={renderImage()}
        imageWidth={imageWidth}
        stemnumeration={stemnumeration}
        fontSize={fontSize}
        showAnswer={showAnswer}
        userSelections={userAnswers}
        evaluation={evaluation}
        drop={drop}
        onDropHandler={this.onDrop}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
      />
    );
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    console.log("image width passed to display", imageWidth);
    const previewResponseBoxLayout = (
      <ResponseBoxLayout
        smallSize={smallSize}
        onDrop={this.onDrop}
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
    const responseBoxLayout = showAnswer ? <div /> : previewResponseBoxLayout;
    const answerBox = showAnswer ? correctAnswerBoxLayout : <div />;

    const responseposition = smallSize ? "right" : responsecontainerposition;

    return (
      <div style={{ fontSize }}>
        <InstructorStimulus>{instructorStimulus}</InstructorStimulus>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
          <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
        {responseposition === "top" && (
          <React.Fragment>
            <div style={{ margin: "15px 0", borderRadius: 10 }}>{responseBoxLayout}</div>
            <div style={{ margin: "15px 0", borderRadius: 10 }}>{templateBoxLayout}</div>
          </React.Fragment>
        )}
        {responseposition === "bottom" && (
          <React.Fragment>
            <div style={{ margin: "15px 0", borderRadius: 10 }}>{templateBoxLayout}</div>
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
              {responseBoxLayout}
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
              {responseBoxLayout}
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
  imageTitle: PropTypes.string,
  imageWidth: PropTypes.number,
  maxRespCount: PropTypes.number,
  instructorStimulus: PropTypes.string
};

Display.defaultProps = {
  options: [],
  onChange: () => {},
  preview: true,
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
  imageTitle: "",
  maxRespCount: 1,
  imageWidth: 600,
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
  instructorStimulus: ""
};

export default withTheme(withCheckAnswerButton(Display));

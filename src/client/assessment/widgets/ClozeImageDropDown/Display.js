import React, { Component } from "react";
import PropTypes from "prop-types";
import { shuffle } from "lodash";
import { withTheme } from "styled-components";

import { QuestionHeader } from "../../styled/QuestionHeader";
import CorrectAnswerBoxLayout from "../../components/CorrectAnswerBoxLayout";
import AnswerDropdown from "./components/AnswerDropdown";
import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import { StyledPreviewTemplateBox } from "./styled/StyledPreviewTemplateBox";
import { StyledPreviewContainer } from "./styled/StyledPreviewContainer";
import { StyledPreviewImage } from "./styled/StyledPreviewImage";
import { StyledDisplayContainer } from "./styled/StyledDisplayContainer";
import { TemplateBoxContainer } from "./styled/TemplateBoxContainer";
import { TemplateBoxLayoutContainer } from "./styled/TemplateBoxLayoutContainer";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";
import { getFontSize, topAndLeftRatio, calculateRatio, fromStringToNumberPx } from "../../utils/helpers";

import { response } from "@edulastic/constants";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

class Display extends Component {
  constructor(props) {
    super(props);
    const userAnswers = new Array(props.responseContainers.length).fill(false);
    props.userSelections.map((userSelection, index) => {
      userAnswers[index] = userSelection;
      return 0;
    });

    this.state = {
      userAnswers
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state !== undefined) {
      this.setState({
        userAnswers: nextProps.userSelections ? [...nextProps.userSelections] : []
      });
    }
  }

  selectChange = (value, index) => {
    const { userAnswers: newAnswers } = this.state;
    const { onChange: changeAnswers } = this.props;
    newAnswers[index] = value;
    this.setState({ userAnswers: newAnswers });
    changeAnswers(newAnswers);
  };

  shuffle = arr => {
    const newArr = arr.map(item => shuffle(item));

    return newArr;
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
      imagescale,
      uiStyle: { fontsize },
      showDashedBorder,
      backgroundColor,
      item,
      theme,
      showQuestionNumber,
      qIndex,
      maxHeight,
      maxWidth,
      imageOptions
    } = this.props;
    const { userAnswers } = this.state;
    const { shuffleOptions } = configureOptions;
    let newOptions;
    if (preview && shuffleOptions) {
      newOptions = this.shuffle(options);
    } else {
      newOptions = options;
    }
    // Layout Options
    const fontSize = getFontSize(uiStyle.fontsize);
    const { heightpx, wordwrap, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : "auto",
      heightpx: heightpx !== 0 ? heightpx : "auto",
      whiteSpace: wordwrap ? "inherit" : "nowrap"
    };

    const previewTemplateBoxLayout = (
      <StyledPreviewTemplateBox smallSize={smallSize} fontSize={fontSize} maxHeight={maxHeight} height={maxHeight}>
        <StyledPreviewContainer
          smallSize={smallSize}
          width={!maxWidth ? calculateRatio(imagescale, fontsize, imageWidth) : maxWidth}
          height={maxHeight}
          maxWidth={maxWidth}
        >
          <StyledPreviewImage
            src={imageUrl || ""}
            width={!maxWidth ? calculateRatio(imagescale, fontsize, imageWidth) : imageWidth}
            alt={imageAlterText}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            height={imageHeight}
            style={{
              position: "absolute",
              top: imageOptions.y || 0,
              left: imageOptions.x || 0
            }}
          />
          {!smallSize &&
            responseContainers.map((responseContainer, index) => {
              const dropTargetIndex = index;
              const btnStyle = {
                widthpx: topAndLeftRatio(
                  fromStringToNumberPx(responseContainer.width),
                  imagescale,
                  fontsize,
                  smallSize
                ),
                width: topAndLeftRatio(fromStringToNumberPx(responseContainer.width), imagescale, fontsize, smallSize),
                top: topAndLeftRatio(responseContainer.top, imagescale, fontsize, smallSize),
                left: topAndLeftRatio(responseContainer.left, imagescale, fontsize, smallSize),
                height: topAndLeftRatio(
                  fromStringToNumberPx(responseContainer.height),
                  imagescale,
                  fontsize,
                  smallSize
                ),
                border: showDashedBorder
                  ? `dashed 2px ${theme.widgets.clozeImageDropDown.responseContainerDashedBorderColor}`
                  : `solid 1px ${theme.widgets.clozeImageDropDown.responseContainerDashedBorderColor}`,
                position: "absolute",
                borderRadius: 5
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
                <div
                  key={index}
                  style={{
                    ...btnStyle,
                    borderStyle: smallSize ? "dashed" : "solid",
                    width: `${parseInt(responseContainer.width)}px`,
                    overflow: "hidden",
                    height: `${parseInt(responseContainer.height)}px`,
                    minWidth: response.minWidth,
                    minHeight: response.minHeight
                  }}
                  className="imagelabeldragdrop-droppable active"
                >
                  {!smallSize && (
                    <AnswerDropdown
                      responseIndex={dropTargetIndex}
                      style={{
                        width: `100%`,
                        height: `100%`
                      }}
                      backgroundColor={backgroundColor}
                      options={(newOptions[dropTargetIndex] || []).map(op => ({ value: op, label: op }))}
                      onChange={value => this.selectChange(value, dropTargetIndex)}
                      defaultValue={userAnswers[dropTargetIndex]}
                    />
                  )}
                </div>
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
        imageUrl={imageUrl || ""}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        imageAlterText={imageAlterText}
        imagescale={imagescale}
        stemnumeration={stemnumeration}
        fontSize={fontSize}
        uiStyle={uiStyle}
        showAnswer={showAnswer}
        options={newOptions}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        minWidth={response.minWidth}
        minHeight={response.minHeight}
        userSelections={item && item.activity && item.activity.userResponse ? item.activity.userResponse : userAnswers}
        evaluation={item && item.activity && item.activity.evaluation ? item.activity.evaluation : evaluation}
        imageOptions={imageOptions}
      />
    );
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const correctAnswerBoxLayout = showAnswer ? (
      <React.Fragment>
        <CorrectAnswerBoxLayout
          fontSize={fontSize}
          cleanValue
          groupResponses={newOptions}
          userAnswers={validation.valid_response && validation.valid_response.value}
        />
        {validation.alt_responses && (
          <CorrectAnswerBoxLayout
            fontSize={fontSize}
            cleanValue
            groupResponses={newOptions}
            userAnswers={validation.valid_response && validation.valid_response.value}
            altResponses={validation.alt_responses}
          />
        )}
      </React.Fragment>
    ) : (
      <div />
    );
    const answerBox = showAnswer ? correctAnswerBoxLayout : <div />;
    return (
      <StyledDisplayContainer fontSize={fontSize} smallSize={smallSize}>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
          <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
        <TemplateBoxContainer smallSize={smallSize}>
          <TemplateBoxLayoutContainer smallSize={smallSize}>{templateBoxLayout}</TemplateBoxLayoutContainer>
        </TemplateBoxContainer>
        {answerBox}
      </StyledDisplayContainer>
    );
  }
}

Display.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  responseContainers: PropTypes.array,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  configureOptions: PropTypes.any.isRequired,
  preview: PropTypes.bool.isRequired,
  showDashedBorder: PropTypes.bool,
  question: PropTypes.string.isRequired,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  backgroundColor: PropTypes.string,
  imagescale: PropTypes.bool,
  uiStyle: PropTypes.object,
  item: PropTypes.any.isRequired,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
  imageOptions: PropTypes.object
};

Display.defaultProps = {
  options: [],
  onChange: () => {},
  imagescale: false,
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  userSelections: [],
  responseContainers: [],
  showDashedBorder: false,
  smallSize: false,
  backgroundColor: "#0288d1",
  validation: {},
  imageUrl: undefined,
  imageAlterText: "",
  imageWidth: 600,
  uiStyle: {
    fontsize: "normal",
    stemnumeration: "numerical",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  showQuestionNumber: false,
  qIndex: null,
  imageOptions: {}
};

export default withTheme(Display);

import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTheme } from "styled-components";
import { isUndefined } from "lodash";
import { helpers, Stimulus } from "@edulastic/common";

import { clozeImage, canvasDimensions } from "@edulastic/constants";
// import { QuestionHeader } from "../../styled/QuestionHeader";

import CorrectAnswerBoxLayout from "../../components/CorrectAnswerBoxLayout";

import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import { StyledPreviewTemplateBox } from "./styled/StyledPreviewTemplateBox";
import { StyledPreviewContainer } from "./styled/StyledPreviewContainer";
import { StyledPreviewImage } from "./styled/StyledPreviewImage";
import { StyledDisplayContainer } from "./styled/StyledDisplayContainer";
import { TemplateBoxContainer } from "./styled/TemplateBoxContainer";
import { TemplateBoxLayoutContainer } from "./styled/TemplateBoxLayoutContainer";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";
import { getFontSize } from "../../utils/helpers";
import ClozeTextInput from "../../components/ClozeTextInput";
import { Pointer } from "../../styled/Pointer";
import { Triangle } from "../../styled/Triangle";
import { Point } from "../../styled/Point";

class Display extends Component {
  constructor(props) {
    super(props);
    const userAnswers = new Array(props.responseContainers.length).fill("");
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

  getEmWidth = () => {
    const { uiStyle, imageWidth } = this.props;
    const fontSize = parseInt(getFontSize(uiStyle.fontsize), 10);
    return `${imageWidth / 14 + (fontSize - 14)}em`;
  };

  selectChange = (value, index) => {
    const { userAnswers: newAnswers } = this.state;
    const { onChange: changeAnswers } = this.props;
    newAnswers[index] = value;
    this.setState({ userAnswers: newAnswers });
    changeAnswers(newAnswers);
  };

  shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

  render() {
    const {
      question,
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
      theme,
      item,
      showQuestionNumber,
      imageOptions
    } = this.props;
    const { userAnswers } = this.state;
    // Layout Options
    const fontSize = getFontSize(uiStyle.fontsize);
    const { height, wordwrap, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      width: uiStyle.width !== 0 ? uiStyle.width : "auto",
      height: height !== 0 ? height : "auto",
      whiteSpace: wordwrap ? "inherit" : "nowrap"
    };

    const imageHeight = this.getHeight();
    const canvasHeight = imageHeight + (imageOptions.y || 0);

    const previewTemplateBoxLayout = (
      <StyledPreviewTemplateBox
        fontSize={fontSize}
        height={canvasHeight > canvasDimensions.maxHeight ? canvasHeight : canvasDimensions.maxHeight}
      >
        <StyledPreviewContainer
          data-cy="image-text-answer-board"
          height={canvasHeight > canvasDimensions.maxHeight ? canvasHeight : canvasDimensions.maxHeight}
        >
          <StyledPreviewImage
            imageSrc={imageUrl || ""}
            width={this.getWidth()}
            height={this.getHeight()}
            heighcanvasDimensionst={imageHeight}
            alt={imageAlterText}
            style={{
              position: "absolute",
              top: imageOptions.y || 0,
              left: imageOptions.x || 0
            }}
          />
          {responseContainers.map((responseContainer, index) => {
            const dropTargetIndex = index;
            const btnStyle = {
              fontSize,
              width: `${uiStyle.widthpx}px` || responseContainer.width,
              top: uiStyle.top || responseContainer.top,
              left: uiStyle.left || responseContainer.left,
              height: uiStyle.height || responseContainer.height,
              border: showDashedBorder
                ? `dashed 2px ${theme.widgets.clozeImageText.responseContainerDashedBorderColor}`
                : `solid 1px ${theme.widgets.clozeImageText.responseContainerSolidBorderColor}`,
              position: "absolute",
              background: backgroundColor,
              borderRadius: 5
            };
            if (btnStyle && btnStyle.width === 0) {
              btnStyle.width = responseBtnStyle.width;
            }
            const indexNumber = helpers.getNumeration(dropTargetIndex, stemnumeration);
            return (
              <div
                title={
                  userAnswers[dropTargetIndex]
                    ? userAnswers[dropTargetIndex].length > 0
                      ? userAnswers[dropTargetIndex]
                      : null
                    : null
                }
                style={{
                  ...btnStyle,
                  height: `${parseInt(responseContainer.height, 10)}px`,
                  width: `${parseInt(responseContainer.width, 10)}px`
                }}
              >
                <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                  <Point />
                  <Triangle />
                </Pointer>
                <ClozeTextInput
                  index={dropTargetIndex}
                  resprops={{
                    btnStyle: {},
                    item,
                    onChange: ({ value }) => this.selectChange(value, dropTargetIndex),
                    placeholder: uiStyle.placeholder,
                    type: uiStyle.inputtype,
                    showIndex: false,
                    indexNumber,
                    style: { width: "100%", height: "100%", margin: 0, fontSize },
                    userAnswers
                  }}
                />
              </div>
            );
          })}
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    );

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        responseContainers={responseContainers}
        responseBtnStyle={responseBtnStyle}
        backgroundColor={item.background}
        imageUrl={imageUrl || ""}
        imageWidth={this.getWidth()}
        imageHeight={this.getHeight()}
        imageAlterText={imageAlterText}
        stemnumeration={stemnumeration}
        fontSize={fontSize}
        imageOptions={imageOptions}
        showAnswer={showAnswer}
        options={options}
        userSelections={userAnswers}
        evaluation={evaluation}
        uiStyle={uiStyle}
      />
    );
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
      />
    ) : (
      <div />
    );
    const answerBox = showAnswer ? correctAnswerBoxLayout : <div />;
    return (
      <StyledDisplayContainer fontSize={fontSize}>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
          <Stimulus dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
        <TemplateBoxContainer flexDirection="column">
          <TemplateBoxLayoutContainer>{templateBoxLayout}</TemplateBoxLayoutContainer>
          {answerBox}
        </TemplateBoxContainer>
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
  checkAnswer: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  question: PropTypes.string.isRequired,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  backgroundColor: PropTypes.string,
  uiStyle: PropTypes.object,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  theme: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  imageOptions: PropTypes.object
};

Display.defaultProps = {
  options: [],
  onChange: () => {},
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  userSelections: [],
  responseContainers: [],
  showDashedBorder: false,
  backgroundColor: "#0288d1",
  validation: {},
  imageUrl: undefined,
  imageAlterText: "",
  imageWidth: 600,
  uiStyle: {
    fontsize: "normal",
    stemnumeration: "numerical",
    width: 0,
    height: 0,
    wordwrap: false
  },
  showQuestionNumber: false,
  imageOptions: {}
};

export default withTheme(Display);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { shuffle, isUndefined, isEmpty, get, maxBy } from "lodash";
import { withTheme } from "styled-components";
import { Stimulus } from "@edulastic/common";
import { clozeImage, response } from "@edulastic/constants";
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
import { getFontSize, topAndLeftRatio, fromStringToNumberPx } from "../../utils/helpers";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

class Display extends Component {
  selectChange = (value, index) => {
    const { onChange: changeAnswers, userSelections: newAnswers } = this.props;
    newAnswers[index] = value;
    changeAnswers(newAnswers);
  };

  shuffle = arr => {
    const newArr = arr.map(item => shuffle(item));

    return newArr;
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
    const maxTop = maxBy(responseContainers, res => res.top);
    const maxLeft = maxBy(responseContainers, res => res.left);
    return { responseBoxMaxTop: maxTop.top + maxTop.height, responseBoxMaxLeft: maxLeft.left + maxLeft.width };
  };

  onClickCheckboxHandler = () => {
    const { changePreview, changePreviewTab } = this.props;
    if (changePreview) {
      changePreview("clear");
    }
    changePreviewTab("clear");
  };

  render() {
    const {
      smallSize,
      question,
      configureOptions,
      preview,
      options,
      userSelections,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation,
      imageUrl,
      responseContainers,
      imageAlterText,
      imagescale,
      uiStyle: { fontsize },
      showDashedBorder,
      backgroundColor,
      item,
      theme,
      showQuestionNumber,
      disableResponse,
      imageOptions,
      isReviewTab
    } = this.props;

    const { shuffleOptions } = configureOptions;
    const { maxHeight, maxWidth } = clozeImage;
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

    const cAnswers = get(item, "validation.valid_response.value", []);

    const imageHeight = this.getHeight();
    const imageWidth = this.getWidth();
    let canvasHeight = imageHeight + (imageOptions.y || 0);
    let canvasWidth = imageWidth + +(imageOptions.x || 0);

    const { responseBoxMaxTop, responseBoxMaxLeft } = this.getResponseBoxMaxValues();

    if (canvasHeight < responseBoxMaxTop) {
      canvasHeight = responseBoxMaxTop + 20;
    }

    if (canvasWidth < responseBoxMaxLeft) {
      canvasWidth = responseBoxMaxLeft;
    }

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
          <StyledPreviewImage
            imageSrc={imageUrl || ""}
            width={this.getWidth()}
            height={this.getHeight()}
            alt={imageAlterText}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
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
                <div
                  key={index}
                  style={{
                    ...btnStyle,
                    borderStyle: smallSize ? "dashed" : "solid",
                    width: `${parseInt(responseContainer.width, 10)}px`,
                    overflow: "hidden",
                    height: `${parseInt(responseContainer.height, 10)}px`,
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
                      disabled={disableResponse}
                      backgroundColor={backgroundColor}
                      options={(newOptions[dropTargetIndex] || []).map(op => ({ value: op, label: op }))}
                      onChange={value => this.selectChange(value, dropTargetIndex)}
                      defaultValue={isReviewTab ? cAnswers[dropTargetIndex] : userSelections[dropTargetIndex]}
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
        imageWidth={this.getWidth()}
        imageHeight={this.getHeight()}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        imageAlterText={imageAlterText}
        imagescale={imagescale}
        stemnumeration={stemnumeration}
        fontSize={fontSize}
        uiStyle={uiStyle}
        showAnswer={showAnswer}
        checkAnswer={checkAnswer}
        options={newOptions}
        maxHeight={canvasHeight}
        maxWidth={maxWidth}
        minWidth={response.minWidth}
        minHeight={response.minHeight}
        userSelections={
          item && item.activity && item.activity.userResponse ? item.activity.userResponse : userSelections
        }
        evaluation={item && item.activity && item.activity.evaluation ? item.activity.evaluation : evaluation}
        imageOptions={imageOptions}
        onClickHandler={this.onClickCheckboxHandler}
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
        {!isEmpty(validation.alt_responses) && (
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
          {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
          <Stimulus smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
        <TemplateBoxContainer smallSize={smallSize} flexDirection="column">
          <TemplateBoxLayoutContainer smallSize={smallSize}>{templateBoxLayout}</TemplateBoxLayoutContainer>
          {answerBox}
        </TemplateBoxContainer>
      </StyledDisplayContainer>
    );
  }
}

Display.propTypes = {
  options: PropTypes.array,
  changePreviewTab: PropTypes.func,
  changePreview: PropTypes.func,
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
  disableResponse: PropTypes.bool,
  item: PropTypes.any.isRequired,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  imageOptions: PropTypes.object,
  isReviewTab: PropTypes.bool
};

Display.defaultProps = {
  options: [],
  changePreviewTab: () => {},
  changePreview: () => {},
  onChange: () => {},
  imagescale: false,
  showAnswer: false,
  disableResponse: false,
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
  uiStyle: {
    fontsize: "normal",
    stemnumeration: "numerical",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  showQuestionNumber: false,
  imageOptions: {},
  isReviewTab: false
};

export default withTheme(Display);

import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { shuffle, isUndefined, get, maxBy } from "lodash";
import { withTheme } from "styled-components";
import {
  Stimulus,
  QuestionNumberLabel,
  FlexContainer,
  QuestionSubLabel,
  QuestionLabelWrapper,
  QuestionContentWrapper
} from "@edulastic/common";
import { clozeImage, response } from "@edulastic/constants";
import CorrectAnswerBoxLayout from "./components/CorrectAnswerBox";
import AnswerDropdown from "./components/AnswerDropdown";
import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import { StyledPreviewTemplateBox } from "./styled/StyledPreviewTemplateBox";
import { StyledPreviewContainer } from "./styled/StyledPreviewContainer";
import { StyledPreviewImage } from "./styled/StyledPreviewImage";
import { StyledDisplayContainer } from "./styled/StyledDisplayContainer";
import { TemplateBoxContainer } from "./styled/TemplateBoxContainer";
import { TemplateBoxLayoutContainer } from "./styled/TemplateBoxLayoutContainer";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import { getFontSize, topAndLeftRatio, getStemNumeration } from "../../utils/helpers";
import { Pointer } from "../../styled/Pointer";
import { Point } from "../../styled/Point";
import { Triangle } from "../../styled/Triangle";
import QuestionOptions from "./QuestionOptions";
import Instructions from "../../components/Instructions";
import { EDIT } from "../../constants/constantsForQuestions";

class Display extends Component {
  containerRef = React.createRef();

  selectChange = (value, index) => {
    const { onChange: changeAnswers, userSelections } = this.props;
    changeAnswers(
      produce(userSelections, draft => {
        draft[index] = value;
      })
    );
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

    if (responseContainers.length > 0) {
      const maxTop = maxBy(responseContainers, res => res.top);
      const maxLeft = maxBy(responseContainers, res => res.left);
      return {
        responseBoxMaxTop: maxTop.top + maxTop.height,
        responseBoxMaxLeft: maxLeft.left + maxLeft.width
      };
    }

    return { responseBoxMaxTop: 0, responseBoxMaxLeft: 0 };
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
      isExpressGrader,
      isReviewTab,
      isPrint,
      isPrintPreview,
      view
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
    const fontSize = theme.fontsize || getFontSize(fontsize);

    const { heightpx, wordwrap, responsecontainerindividuals = [], stemNumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : "auto",
      heightpx: heightpx !== 0 ? heightpx : "auto",
      whiteSpace: wordwrap ? "inherit" : "nowrap"
    };

    let cAnswers = get(item, "validation.validResponse.value", []);
    const showDropItemBorder = get(item, "responseLayout.showborder", false);
    const placeholder = uiStyle.placeholder || "";
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
    const largestResponseWidth = responseContainers.reduce((acc, resp) => Math.max(acc, resp.width), 0);
    let containerHeight = 0;
    // calculate the dropdown menu height, its top relative to container, for each responseContainer
    const tops = [];
    let maxResponseOffsetX = 0;
    responseContainers.forEach((responseContainer, i) => {
      const delta = parseFloat(responseContainer?.height) + (newOptions?.[i]?.length * 32 || 110);
      tops.push(topAndLeftRatio(responseContainer?.top, imagescale, fontsize, smallSize) + delta);
      const respOffset = responseContainer.left || 0 + responseContainer.width || 0;
      maxResponseOffsetX = Math.max(respOffset, maxResponseOffsetX);
    });

    containerHeight = Math.max(canvasHeight, maxHeight, Math.max(...tops));
    const containerWidth = Math.max(maxResponseOffsetX, canvasWidth);

    let userSelectedAnswers = userSelections;
    if (isPrintPreview || isPrint) {
      userSelectedAnswers = responseContainers.map((_, i) => getStemNumeration("lowercase", i));
      cAnswers = responseContainers.map((_, i) => getStemNumeration("lowercase", i));
    }
    const previewTemplateBoxLayout = (
      <StyledPreviewTemplateBox
        smallSize={smallSize}
        width={isPrintPreview ? "" : containerWidth}
        fontSize={fontSize}
        height={isPrintPreview ? "" : containerHeight}
      >
        <StyledPreviewContainer
          width={isPrintPreview ? "" : containerWidth}
          smallSize={smallSize}
          height={isPrintPreview ? "" : containerHeight}
        >
          {!isPrintPreview ? (
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
          ) : (
            <img
              src={imageUrl}
              alt={imageAlterText}
              style={{
                width: "100%"
              }}
            />
          )}
          {!smallSize &&
            responseContainers.map((responseContainer, index) => {
              const { height: individualHeight = 0, width: individualWidth = 0 } = responseContainer;
              const { heightpx: globalHeight = 0, widthpx: globalWidth = 0 } = uiStyle;
              const { minWidth, minHeight } = response;
              const height = parseInt(individualHeight, 10) || parseInt(globalHeight, 10) || minHeight;
              const width = parseInt(individualWidth, 10) || parseInt(globalWidth, 10) || minWidth;
              const dropTargetIndex = index;
              const top = topAndLeftRatio(responseContainer.top, imagescale, fontsize, smallSize);
              const left = topAndLeftRatio(responseContainer.left, imagescale, fontsize, smallSize);
              const btnStyle = {
                height: isPrintPreview ? `${(height / containerHeight) * 100}%` : height,
                width: isPrintPreview ? `${(width / containerWidth) * 100}%` : width,
                top: isPrintPreview ? `${(top / containerHeight) * 100}%` : top,
                left: isPrintPreview ? `${(left / containerWidth) * 100}%` : left,
                border: showDropItemBorder
                  ? showDashedBorder
                    ? `dashed 2px ${theme.widgets.clozeImageDropDown.responseContainerDashedBorderColor}`
                    : `solid 1px ${theme.widgets.clozeImageDropDown.responseContainerDashedBorderColor}`
                  : 0,
                position: "absolute",
                borderRadius: 5
              };

              return (
                <div
                  key={index}
                  style={{
                    ...btnStyle,
                    borderStyle: smallSize ? "dashed" : "solid"
                  }}
                  className="imagelabeldragdrop-droppable active"
                >
                  {!smallSize && (
                    <AnswerDropdown
                      placeholder={responseContainer.placeholder || placeholder}
                      responseIndex={dropTargetIndex}
                      style={{
                        width: `100%`,
                        height: `100%`
                      }}
                      fontSize={fontSize}
                      dropdownStyle={{ zoom: theme.widgets.clozeImageDropDown.imageZoom }}
                      disabled={disableResponse}
                      backgroundColor={backgroundColor}
                      options={(newOptions[dropTargetIndex] || []).map(op => ({
                        value: op,
                        label: op
                      }))}
                      onChange={value => this.selectChange(value, dropTargetIndex)}
                      defaultValue={isReviewTab ? cAnswers[dropTargetIndex] : userSelectedAnswers[dropTargetIndex]}
                      isPrintPreview={isPrint || isPrintPreview}
                    />
                  )}
                  <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                    <Point />
                    <Triangle theme={theme} />
                  </Pointer>
                </div>
              );
            })}
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    );

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        containerHeight={containerHeight}
        containerWidth={containerWidth}
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
        stemNumeration={stemNumeration}
        fontSize={fontSize}
        uiStyle={uiStyle}
        showAnswer={showAnswer}
        checkAnswer={checkAnswer}
        options={newOptions}
        maxHeight={canvasHeight}
        maxWidth={response.maxWidth}
        minWidth={response.minWidth}
        minWidthShowAnswer={response.minWidthShowAnswer}
        minHeight={response.minHeight}
        userSelections={
          item && item.activity && item.activity.userResponse ? item.activity.userResponse : userSelections
        }
        evaluation={item && item.activity && item.activity.evaluation ? item.activity.evaluation : evaluation}
        imageOptions={imageOptions}
        onClickHandler={this.onClickCheckboxHandler}
        largestResponseWidth={largestResponseWidth}
        isExpressGrader={isExpressGrader}
        item={item}
        isPrintPreview={isPrintPreview || isPrint}
      />
    );
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const altAnswers = get(validation, "altResponses", []);
    const correctAnswerBoxLayout = (
      <React.Fragment>
        <CorrectAnswerBoxLayout
          fontSize={fontSize}
          stemNumeration={stemNumeration}
          userAnswers={validation.validResponse && validation.validResponse.value}
        />
        {altAnswers.map((answer, index) => (
          <CorrectAnswerBoxLayout
            fontSize={fontSize}
            stemNumeration={stemNumeration}
            userAnswers={answer.value}
            altAnsIndex={index + 1}
          />
        ))}
      </React.Fragment>
    );

    const answerBox = showAnswer || isExpressGrader ? correctAnswerBoxLayout : <div />;

    return (
      <StyledDisplayContainer fontSize={fontSize} smallSize={smallSize} ref={this.containerRef} height="auto">
        <FlexContainer justifyContent="flex-start" alignItems="baseline" width="100%">
          <QuestionLabelWrapper>
            {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
            {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
          </QuestionLabelWrapper>

          <QuestionContentWrapper>
            <QuestionTitleWrapper>
              <Stimulus smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
            </QuestionTitleWrapper>

            <TemplateBoxContainer
              smallSize={smallSize}
              flexDirection="column"
              className="cloze-image-dropdown-response"
            >
              <TemplateBoxLayoutContainer smallSize={smallSize}>{templateBoxLayout}</TemplateBoxLayoutContainer>
              {(isPrintPreview || isPrint) && <QuestionOptions options={newOptions} />}
              {view && view !== EDIT && <Instructions item={item} />}
              {answerBox}
            </TemplateBoxContainer>
          </QuestionContentWrapper>
        </FlexContainer>
      </StyledDisplayContainer>
    );
  }
}

Display.propTypes = {
  options: PropTypes.array,
  changePreviewTab: PropTypes.func,
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
  changePreview: PropTypes.func.isRequired,
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
  isExpressGrader: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  imageOptions: PropTypes.object,
  isReviewTab: PropTypes.bool
};

Display.defaultProps = {
  options: [],
  changePreviewTab: () => {},
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
    stemNumeration: "numerical",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  showQuestionNumber: false,
  imageOptions: {},
  isExpressGrader: false,
  isReviewTab: false
};

export default withTheme(Display);

import PropTypes from "prop-types";
import React, { Component } from "react";
import { cloneDeep, flattenDeep, get, maxBy, minBy, uniqBy } from "lodash";
import { withTheme } from "styled-components";
import {
  Stimulus,
  QuestionNumberLabel,
  measureText,
  HorizontalScrollContext,
  DragDrop,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionContentWrapper,
  QuestionSubLabel
} from "@edulastic/common";
import { clozeImage, ChoiceDimensions } from "@edulastic/constants";

import { QuestionTitleWrapper } from "./styled/QustionNumber";
import ResponseContainers from "./components/ResponseContainers";
import ResponseBoxLayout from "./components/ResponseBoxLayout";
import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import CorrectAnswerBoxLayout from "./components/CorrectAnswerBox";
import SnapItemContainers from "./components/SnapItemContainers";

import { getFontSize } from "../../utils/helpers";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import { RelativeContainer } from "../../styled/RelativeContainer";
import { StyledPreviewImage } from "./styled/StyledPreviewImage";
import { StyledPreviewTemplateBox } from "./styled/StyledPreviewTemplateBox";
import { StyledPreviewContainer } from "./styled/StyledPreviewContainer";
import AnnotationRnd from "../../components/Annotations/AnnotationRnd";

import {
  StyledContainer,
  LeftContainer,
  LeftTemplateContainer,
  LeftResponseContainer,
  RightContainer,
  RightTemplateContainer,
  RightResponseContainer
} from "./styled/layout";

const { DragPreview } = DragDrop;
const { maxWidth: choiceDefaultMaxW, minWidth: choiceDefaultMinW } = ChoiceDimensions;

const isColliding = (responseContainer, answer) => {
  const { height, width, left: responseLeft, top: responseTop } = responseContainer;
  const responseRect = {
    left: responseLeft,
    top: responseTop,
    width: parseInt(width, 10),
    height: parseInt(height, 10)
  };
  const answerRect = {
    top: answer.rect.top,
    left: answer.rect.left,
    width: answer.rect.width,
    height: answer.rect.height
  };

  const responseDistanceFromTop = responseRect.top + responseRect.height;
  const responseDistanceFromLeft = responseRect.left + responseRect.width;

  const answerDistanceFromTop = answerRect.top + answerRect.height;
  const answerDistanceFromTeft = answerRect.left + answerRect.width;

  const notColliding =
    responseDistanceFromTop < answerRect.top ||
    responseRect.top > answerDistanceFromTop ||
    responseDistanceFromLeft < answerRect.left ||
    responseRect.left > answerDistanceFromTeft;

  // return whether it is colliding
  return !notColliding;
};

const findClosestResponseBoxIndex = (containers, answer) => {
  const crosspoints = [];
  for (const container of containers) {
    let { left } = answer;
    if (container.left > answer.left) {
      left = answer.left + answer.width;
    }

    let { top } = answer;
    if (container.top > answer.top) {
      top = answer.top + answer.height;
    }

    crosspoints.push({ left, top, index: container.containerIndex });
  }

  const shouldSeleted = minBy(crosspoints, point => point.left);

  return shouldSeleted.index;
};

const getInitialResponses = ({ options, userSelections, configureOptions }) => {
  const { duplicatedResponses: isDuplicated } = configureOptions;
  let possibleResps = [];
  possibleResps = cloneDeep(options);
  userSelections = flattenDeep(userSelections);
  if (!isDuplicated) {
    // remove all the options that are chosen from the available options
    const _userSelections = userSelections.reduce((acc, opts) => acc.concat(opts?.value || []), []);
    possibleResps = possibleResps.filter(resp => {
      const i = _userSelections.indexOf(resp);
      if (i !== -1) {
        /**
         * i is first index of choice at _userselections
         * we need to remove it from _userSelection
         * becasue there are duplicated choices
         */
        _userSelections.splice(i, 1);
      }
      return i === -1;
    });
  }
  return possibleResps;
};

const getPossibleResps = (snapItems, possibleResps) => {
  possibleResps = cloneDeep(possibleResps);
  snapItems = flattenDeep(snapItems);
  for (let j = 0; j < snapItems.length; j += 1) {
    for (let i = 0; i < possibleResps.length; i += 1) {
      if (snapItems[j].answer === possibleResps[i]) {
        possibleResps.splice(i, 1);
        break;
      }
    }
  }
  return possibleResps;
};

class Display extends Component {
  previewContainerRef = React.createRef();

  displayWrapperRef = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState !== undefined) {
      const {
        item: { isSnapFitValues }
      } = nextProps;
      let possibleResponses = getInitialResponses(nextProps);
      if (nextProps.previewTab === "check" || !isSnapFitValues) {
        possibleResponses = getPossibleResps(nextProps.snapItems, possibleResponses);
      }
      return {
        userAnswers: nextProps.userSelections && nextProps.userSelections.length ? [...nextProps.userSelections] : [],
        possibleResponses
      };
    }
  }

  getAnswerRect = itemRect => {
    const containerRect = this.previewContainerRef.current.getBoundingClientRect();
    let top = itemRect.y - containerRect.top;
    let left = itemRect.x - containerRect.left;
    top = top < 0 ? 0 : top;
    left = left < 0 ? 0 : left;

    const diffW = left + itemRect.width - containerRect.width;
    const diffH = top + itemRect.height - containerRect.height;

    left = diffW > 0 ? left - diffW : left;
    top = diffH > 0 ? top - diffH : top;

    return { ...itemRect, top, left };
  };

  onDropForSnapFit = (sourceData, fromContainerIndex, fromRespIndex, itemRect) => {
    if (!this.previewContainerRef.current || !itemRect.x || !itemRect.y) {
      return;
    }
    const { responseContainers, onChange, maxRespCount } = this.props;
    const { userAnswers, possibleResponses } = this.state;

    let newAnswers = cloneDeep(userAnswers);
    const newResponses = cloneDeep(possibleResponses);

    const answerRect = this.getAnswerRect(itemRect);
    const data = Array.isArray(sourceData) ? sourceData : [sourceData];

    if (fromContainerIndex !== fromRespIndex) {
      newAnswers.push({ value: data, rect: answerRect });
      newResponses.splice(fromRespIndex, 1);
    } else if (typeof fromContainerIndex === "number") {
      newAnswers[fromContainerIndex].rect = answerRect;
    } else {
      newAnswers[fromRespIndex].rect = answerRect;
    }

    for (let i = 0; i < newAnswers.length; i++) {
      const overlaps = [];
      if (newAnswers[i]) {
        for (let j = 0; j < responseContainers.length; j++) {
          if (newAnswers[i] && isColliding(responseContainers[j], newAnswers[i])) {
            overlaps.push({ ...responseContainers[j], containerIndex: j });
          }
        }
        if (overlaps[0]) {
          let { containerIndex } = overlaps[0];
          if (overlaps.length > 1) {
            containerIndex = findClosestResponseBoxIndex(overlaps, newAnswers[i].rect);
          }
          newAnswers[i].responseBoxID = responseContainers[containerIndex].id;
          newAnswers[i].containerIndex = containerIndex;
        } else {
          newAnswers[i].responseBoxID = null;
          newAnswers[i].containerIndex = null;
        }
      }
    }

    for (let i = 0; i < newAnswers.length; i++) {
      if (newAnswers[i] && newAnswers[i].responseBoxID) {
        const duplicated = newAnswers.filter(
          // eslint-disable-next-line no-loop-func
          res => res && res.responseBoxID === newAnswers[i].responseBoxID
        );
        if (duplicated.length > 1) {
          newAnswers[i].value = data;
        }
      }
      if (maxRespCount && newAnswers[i] && newAnswers[i].value.length > maxRespCount) {
        const last = newAnswers[i].value.splice(newAnswers[i].value.length - 2, 1)[0];
        newResponses.push(last);
      }
    }
    const _arr1 = newAnswers.filter(res => res && !res.responseBoxID);
    const _arr2 = uniqBy(newAnswers.filter(res => res && res.responseBoxID), "responseBoxID");
    newAnswers = [];
    for (let i = 0; i < responseContainers.length; i++) {
      const userResponse = _arr2.find(res => res.responseBoxID === responseContainers[i].id);
      if (userResponse) {
        newAnswers[i] = userResponse;
      } else {
        newAnswers[i] = _arr1.pop();
      }
    }

    onChange(newAnswers);
    this.setState({ possibleResponses: newResponses });

    const { changePreview, changePreviewTab, previewTab } = this.props;
    if (previewTab !== "clear") {
      if (changePreview) {
        changePreview("clear");
      }
      changePreviewTab("clear");
    }
  };

  onDrop = ({ data: sourceData, itemRect }, index) => {
    const { option, fromContainerIndex, fromRespIndex } = sourceData;
    const { maxRespCount, onChange, item, preview, responseContainers } = this.props;
    const { userAnswers, possibleResponses } = this.state;
    const isSnapFitValues = get(item, "responseLayout.isSnapFitValues", false);
    if (!isSnapFitValues && preview) {
      return this.onDropForSnapFit(option, fromContainerIndex, fromRespIndex, itemRect);
    }

    if (fromContainerIndex === index) {
      return;
    }

    const newAnswers = cloneDeep(userAnswers);
    const newResponses = cloneDeep(possibleResponses);

    const data = Array.isArray(option) ? option : [option];

    newAnswers[index] = {
      responseBoxID: responseContainers[index] && responseContainers[index].id,
      value: [...(newAnswers[index] ? newAnswers[index].value || [] : []), ...data],
      containerIndex: index,
      rect: this.getAnswerRect(itemRect)
    };

    if (maxRespCount && newAnswers[index].value.length > maxRespCount) {
      const last = newAnswers[index].value.splice(newAnswers[index].value.length - 2, 1)[0];
      newResponses.push(last);
    }

    if (typeof fromContainerIndex === "number") {
      newAnswers[fromContainerIndex] = {
        responseBoxID: responseContainers[fromContainerIndex] && responseContainers[fromContainerIndex].id,
        value: newAnswers[fromContainerIndex].value.filter((_, i) => i !== fromRespIndex),
        containerIndex: index
      };
    }

    onChange(newAnswers);

    const { changePreview, changePreviewTab, previewTab } = this.props;
    if (previewTab !== "clear") {
      if (changePreview) {
        changePreview("clear");
      }
      changePreviewTab("clear");
    }
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

  getCalculatedHeight = (maxHeight, canvasHeight) => {
    const calculatedHeight = canvasHeight > maxHeight ? canvasHeight : maxHeight;

    return calculatedHeight;
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

  getMaxWidthOfChoices() {
    const { userAnswers, possibleResponses } = this.state;
    const allResponses = userAnswers.map(ans => ans?.value?.join("")).concat(possibleResponses);
    const widthArr = allResponses.map(option => measureText(option || ""));
    const maxWidth = maxBy(widthArr, obj => obj?.width);
    return maxWidth?.width;
  }

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
      evaluation,
      imageUrl,
      responseContainers,
      imageAlterText,
      showDashedBorder,
      backgroundColor,
      theme,
      showQuestionNumber,
      disableResponse,
      item,
      imageOptions,
      showBorder,
      isReviewTab,
      isExpressGrader,
      isLCBView,
      setQuestionData,
      studentReport,
      getHeading
    } = this.props;
    const isWrapText = get(item, "responseLayout.isWrapText", false);
    const { userAnswers, possibleResponses } = this.state;
    const transparentBackground = get(item, "responseLayout.transparentbackground", false);
    const showDropItemBorder = get(item, "responseLayout.showborder", false);
    const isSnapFitValues = get(item, "responseLayout.isSnapFitValues", false);
    const { showDraghandle: dragHandler, shuffleOptions, transparentResponses } = configureOptions;
    let responses = cloneDeep(possibleResponses);
    if (preview && shuffleOptions) {
      responses = this.shuffle(possibleResponses);
    }
    // Layout Options
    const fontSize = getFontSize(uiStyle.fontsize);
    const { heightpx, wordwrap, responsecontainerposition, responsecontainerindividuals, stemNumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? `${uiStyle.widthpx}px` : null,
      heightpx: heightpx !== 0 ? `${heightpx}px` : null,
      whiteSpace: wordwrap ? "inherit" : "nowrap"
    };

    const dragItemStyle = {
      border: `${showBorder ? `solid 1px ${theme.widgets.clozeImageDragDrop.dragItemBorderColor}` : null}`,
      margin: "0 0 0 3px", // EV-8287
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "100%",
      whiteSpace: isWrapText ? "normal" : "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    };

    const { maxHeight, maxWidth } = clozeImage;
    const { imageWidth: imgWidth, imageHeight: imgHeight, imageOriginalWidth, imageOriginalHeight } = item;
    const imageWidth = imgWidth || imageOriginalWidth || maxWidth;
    const imageHeight = imgHeight || imageOriginalHeight || maxHeight;
    let canvasHeight = imageHeight + (imageOptions.y || 0);
    let canvasWidth = imageWidth + +(imageOptions.x || 0);

    const { responseBoxMaxTop, responseBoxMaxLeft } = this.getResponseBoxMaxValues();

    if (canvasHeight < responseBoxMaxTop) {
      canvasHeight = responseBoxMaxTop + 20;
    }

    if (canvasWidth < responseBoxMaxLeft) {
      canvasWidth = responseBoxMaxLeft;
    }

    const renderAnnotations = () => (
      <div style={{ position: "relative" }}>
        <AnnotationRnd
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
            border: preview ? null : "1px solid lightgray"
          }}
          question={item}
          setQuestionData={setQuestionData}
        />
      </div>
    );

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

    const maxResponseOffsetTop = responseContainers.reduce((max, resp) => {
      max = Math.max(max, resp.top + parseInt(resp.height, 10));
      return max;
    }, -1);
    const annotations = item.annotations || [];
    const maxAnnotationsOffsetTop = annotations.reduce((max, ann) => {
      max = Math.max(ann.position.y + parseInt(ann.size.height, 10), max);
      return max;
    }, 0);
    const imageOffsetY = get(item, "imageOptions.y", 0);
    // eslint-disable-next-line max-len
    const computedHeight = Math.max(maxResponseOffsetTop, maxAnnotationsOffsetTop, imageHeight + imageOffsetY);

    const choiceMinWidth = get(item, "uiStyle.choiceMinWidth", choiceDefaultMinW);
    const choiceMaxWidth = get(item, "uiStyle.choiceMaxWidth", choiceDefaultMaxW);
    const choiceWidth = this.getMaxWidthOfChoices();

    const choiceStyle = {
      minWidth: choiceMinWidth,
      maxWidth: choiceMaxWidth,
      width: (choiceWidth > choiceMaxWidth ? choiceMaxWidth : choiceWidth) + 40,
      widthpx: (choiceWidth > choiceMaxWidth ? choiceMaxWidth : choiceWidth) + 40,
      heightpx,
      overflow: "hidden"
    };

    const responseposition = smallSize ? "right" : responsecontainerposition;

    const responseBoxWidth = choiceMaxWidth;
    const containerStyle = {
      margin: "auto",
      overflow: isLCBView || isExpressGrader ? null : "auto",
      minWidth: choiceMaxWidth,
      maxWidth: responseposition === "left" || responseposition === "right" ? 1050 : 750
    };

    const renderSnapItems = () =>
      !isSnapFitValues &&
      (preview || showAnswer) && (
        <SnapItemContainers
          userAnswers={userAnswers}
          evaluation={evaluation}
          smallSize={smallSize}
          showDashedBorder={showDashedBorder}
          showAnswer={showAnswer}
          checkAnswer={checkAnswer}
          backgroundColor={backgroundColor}
          onDrop={this.onDrop}
          choiceStyle={choiceStyle}
        />
      );

    const previewContainerWidth = canvasWidth > maxWidth ? canvasWidth : maxWidth;
    const previewTemplateBoxLayout = (
      <StyledPreviewTemplateBox smallSize={smallSize} fontSize={fontSize} height={computedHeight} maxWidth="100%">
        <StyledPreviewContainer
          smallSize={smallSize}
          width={previewContainerWidth}
          data-cy="preview-contaniner"
          ref={this.previewContainerRef}
        >
          {renderAnnotations()}
          {renderImage()}

          {isSnapFitValues && showDropItemBorder && (
            <ResponseContainers
              responseContainers={responseContainers}
              showDropItemBorder={showDropItemBorder}
              smallSize={smallSize}
              isWrapText={isWrapText}
              transparentBackground={transparentBackground}
              userAnswers={userAnswers}
              showDashedBorder={showDashedBorder}
              dragItemStyle={dragItemStyle}
              fontSize={fontSize}
              onDrop={this.onDrop}
            />
          )}

          {renderSnapItems()}
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    );

    const checkboxTemplateBoxLayout = (
      <StyledPreviewTemplateBox fontSize={fontSize} height={computedHeight}>
        <StyledPreviewContainer
          width={previewContainerWidth}
          height={this.getCalculatedHeight(maxHeight, canvasHeight)}
          ref={this.previewContainerRef}
        >
          <CheckboxTemplateBoxLayout
            responseContainers={responseContainers}
            responsecontainerindividuals={responsecontainerindividuals}
            responseBtnStyle={responseBtnStyle}
            annotations={renderAnnotations()}
            image={renderImage()}
            snapItems={renderSnapItems()}
            stemNumeration={stemNumeration}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
            userSelections={userAnswers}
            evaluation={evaluation}
            isSnapFitValues={isSnapFitValues}
            onDropHandler={this.onDrop}
            showBorder={showBorder}
            showDropItemBorder={showDropItemBorder}
            isExpressGrader={isExpressGrader}
          />
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    );
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;

    const previewResponseBoxLayout = (
      <ResponseBoxLayout
        smallSize={smallSize}
        responses={responses}
        fontSize={fontSize}
        dragHandler={dragHandler}
        onDrop={!disableResponse ? this.onDrop : () => {}}
        transparentResponses={transparentResponses}
        responseContainerPosition={responsecontainerposition}
        getHeading={getHeading}
        choiceStyle={choiceStyle}
      />
    );

    const validAnswers = get(item, "validation.validResponse.value", []);
    const altAnswers = get(item, "validation.altResponses", []).map(alt => get(alt, "value", []).map(res => res));
    const allAnswers = [validAnswers, ...altAnswers];

    const correctAnswerBoxLayout = allAnswers.map((answers, answersIndex) => (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={answers}
        answersIndex={answersIndex}
        stemNumeration={stemNumeration}
      />
    ));

    const responseBoxLayout = isReviewTab ? <div /> : previewResponseBoxLayout;
    const answerBox = showAnswer || isExpressGrader ? correctAnswerBoxLayout : <div />;

    return (
      <div style={{ fontSize }}>
        <HorizontalScrollContext.Provider value={{ getScrollElement: () => this.displayWrapperRef.current }}>
          <FlexContainer justifyContent="flex-start" alignItems="baseline">
            <QuestionLabelWrapper>
              {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
              {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
            </QuestionLabelWrapper>
            <QuestionContentWrapper>
              <QuestionTitleWrapper>
                <Stimulus smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
              </QuestionTitleWrapper>
              {responseposition === "top" && (
                <div style={containerStyle} ref={this.displayWrapperRef}>
                  <StyledContainer>
                    <RelativeContainer>{responseBoxLayout}</RelativeContainer>
                  </StyledContainer>
                  <StyledContainer>{templateBoxLayout}</StyledContainer>
                </div>
              )}
              {responseposition === "bottom" && (
                <div style={containerStyle} ref={this.displayWrapperRef}>
                  <StyledContainer>
                    <RelativeContainer>{templateBoxLayout}</RelativeContainer>
                  </StyledContainer>
                  <StyledContainer>{responseBoxLayout}</StyledContainer>
                </div>
              )}
              {responseposition === "left" && (
                <LeftContainer style={containerStyle} ref={this.displayWrapperRef}>
                  <LeftResponseContainer width={responseBoxWidth || null} isReviewTab={isReviewTab}>
                    <RelativeContainer>{responseBoxLayout}</RelativeContainer>
                  </LeftResponseContainer>
                  <LeftTemplateContainer studentReport={studentReport} responseBoxContainerWidth={responseBoxWidth}>
                    {templateBoxLayout}
                  </LeftTemplateContainer>
                </LeftContainer>
              )}
              {responseposition === "right" && (
                <RightContainer smallSize={smallSize} style={containerStyle} ref={this.displayWrapperRef}>
                  <RightTemplateContainer
                    smallSize={smallSize}
                    studentReport={studentReport}
                    responseBoxContainerWidth={responseBoxWidth}
                  >
                    {templateBoxLayout}
                  </RightTemplateContainer>

                  <RightResponseContainer
                    isReviewTab={isReviewTab}
                    width={responseBoxWidth || null}
                    smallSize={smallSize}
                  >
                    <RelativeContainer>{responseBoxLayout}</RelativeContainer>
                  </RightResponseContainer>
                </RightContainer>
              )}
              {answerBox}
              <DragPreview />
            </QuestionContentWrapper>
          </FlexContainer>
        </HorizontalScrollContext.Provider>
      </div>
    );
  }
}

Display.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  options: PropTypes.array,
  getHeading: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func,
  changePreview: PropTypes.func,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  responseContainers: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  question: PropTypes.string.isRequired,
  configureOptions: PropTypes.object,
  evaluation: PropTypes.array,
  backgroundColor: PropTypes.string,
  uiStyle: PropTypes.object,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  theme: PropTypes.object.isRequired,
  studentReport: PropTypes.bool,
  disableResponse: PropTypes.bool,
  maxRespCount: PropTypes.number,
  imageOptions: PropTypes.object,
  showQuestionNumber: PropTypes.bool,
  item: PropTypes.object,
  showBorder: PropTypes.bool,
  isExpressGrader: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  previewTab: PropTypes.string.isRequired
};

Display.defaultProps = {
  options: [],
  changePreviewTab: () => {},
  changePreview: () => {},
  onChange: () => {},
  preview: true,
  studentReport: false,
  disableResponse: false,
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  responseContainers: [],
  showDashedBorder: false,
  smallSize: false,
  backgroundColor: "#fff",
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
    stemNumeration: "numerical",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  imageOptions: {},
  showBorder: false,
  showQuestionNumber: false,
  item: {},
  isExpressGrader: false,
  isReviewTab: false
};

export default withTheme(withCheckAnswerButton(Display));

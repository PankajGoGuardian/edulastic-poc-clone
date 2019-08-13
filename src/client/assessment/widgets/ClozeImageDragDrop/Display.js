import PropTypes from "prop-types";
import React, { Component } from "react";
import { cloneDeep, flattenDeep, isUndefined, get, maxBy, minBy, uniqBy } from "lodash";
import { withTheme } from "styled-components";
import { InstructorStimulus, Stimulus, MathSpan, QuestionNumberLabel } from "@edulastic/common";
import { response, clozeImage } from "@edulastic/constants";
import striptags from "striptags";

import DropContainer from "./components/DropContainer";
import DragItem from "./components/DragItem";

import { Pointer } from "../../styled/Pointer";
import { Point } from "../../styled/Point";
import { Triangle } from "../../styled/Triangle";
import { QuestionTitleWrapper } from "./styled/QustionNumber";

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

import AnnotationRnd from "../../components/Annotations/AnnotationRnd";

import { IconWrapper } from "./components/CheckboxTemplateBoxLayout/styled/IconWrapper";
import { RightIcon } from "./components/CheckboxTemplateBoxLayout/styled/RightIcon";
import { WrongIcon } from "./components/CheckboxTemplateBoxLayout/styled/WrongIcon";

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
    for (let j = 0; j < userSelections.length; j++) {
      for (let i = 0; i < possibleResps.length; i++) {
        if (userSelections[j] && userSelections[j].value.includes(possibleResps[i])) {
          possibleResps.splice(i, 1);
          break;
        }
      }
    }
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

  responseBoxContainerRef = React.createRef();

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
        userAnswers: nextProps.userSelections ? [...nextProps.userSelections] : [],
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
        // eslint-disable-next-line no-loop-func
        const duplicated = newAnswers.filter(res => res && res.responseBoxID === newAnswers[i].responseBoxID);
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

  onDrop = ({ item: sourceData, fromContainerIndex, fromRespIndex, itemRect }, index) => {
    const { maxRespCount, onChange, item, preview, responseContainers } = this.props;
    const { userAnswers, possibleResponses } = this.state;
    const isSnapFitValues = get(item, "responseLayout.isSnapFitValues", false);
    if (!isSnapFitValues && preview) {
      return this.onDropForSnapFit(sourceData, fromContainerIndex, fromRespIndex, itemRect);
    }

    if (fromContainerIndex === index) {
      return;
    }

    const newAnswers = cloneDeep(userAnswers);
    const newResponses = cloneDeep(possibleResponses);

    const data = Array.isArray(sourceData) ? sourceData : [sourceData];

    newAnswers[index] = {
      responseBoxID: responseContainers[index] && responseContainers[index].id,
      value: [...(newAnswers[index] ? newAnswers[index].value || [] : []), ...data],
      containerIndex: index
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

    this.setState({ userAnswers: newAnswers, possibleResponses: newResponses });
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
    const { imageHeight, imageOriginalHeight, imageOriginalWidth } = item;
    const keepAspectRatio = get(item, "responseLayout.keepAspectRatio", false);
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
      isReviewTab,
      setQuestionData
    } = this.props;

    const isWrapText = get(item, "responseLayout.isWrapText", false);
    const { userAnswers: _uAnswers, possibleResponses } = this.state;
    const cAnswers = get(item, "validation.validResponse.value", []);
    const transparentBackground = get(item, "responseLayout.transparentbackground", false);
    const showDropItemBorder = get(item, "responseLayout.showborder", false);
    const isSnapFitValues = get(item, "responseLayout.isSnapFitValues", false);

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
      widthpx: uiStyle.widthpx !== 0 ? `${uiStyle.widthpx}px` : null,
      heightpx: heightpx !== 0 ? `${heightpx}px` : null,
      whiteSpace: wordwrap ? "inherit" : "nowrap"
    };

    const dragItemStyle = {
      border: `${showBorder ? `solid 1px ${theme.widgets.clozeImageDragDrop.dragItemBorderColor}` : null}`,
      margin: 5,
      display: "flex",
      alignItems: "center",
      width: "max-content",
      whiteSpace: isWrapText ? "normal" : "nowrap",
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

    const drop = data => data;

    const renderSnapItems = () =>
      !isSnapFitValues &&
      (preview || showAnswer) && (
        <DropContainer
          index={0}
          drop={drop}
          data-cy="drop-container"
          style={{ height: "100%" }}
          className="imagelabeldragdrop-droppable active"
        >
          {userAnswers.map(
            (userAnswer, index) =>
              userAnswer &&
              userAnswer.value &&
              userAnswer.value.map(answer => {
                const title = striptags(answer) || null;
                const { rect } = userAnswer;
                const status = evaluation[index];
                const btnStyle = {
                  top: smallSize ? rect.top / 2 : rect.top,
                  left: smallSize ? rect.left / 2 : rect.left,
                  border: showDashedBorder ? `dashed 2px` : `solid 1px`,
                  position: "absolute",
                  background: !showAnswer && !checkAnswer ? backgroundColor : status ? "#d3fea6" : "#fce0e8",
                  borderRadius: 5,
                  padding: "8px 30px 8px 20px",
                  zIndex: 40,
                  margin: 0,
                  borderColor:
                    showAnswer || checkAnswer
                      ? status
                        ? "#d3fea6"
                        : "#fce0e8"
                      : showDashedBorder
                      ? theme.widgets.clozeImageDragDrop.dropContainerDashedBorderColor
                      : theme.widgets.clozeImageDragDrop.dropContainerSolidBorderColor
                  // overflow: "hidden"
                };
                return (
                  <DragItem
                    key={index}
                    title={title}
                    showDashedBorder={showDashedBorder}
                    index={index}
                    item={answer}
                    data={`${answer}_${index}_${index}`}
                    style={{
                      ...dragItemStyle,
                      ...btnStyle
                    }}
                    onDrop={this.onDrop}
                  >
                    <MathSpan dangerouslySetInnerHTML={{ __html: answer || "" }} />
                    {(checkAnswer || showAnswer) && (
                      <IconWrapper right={10}>{status ? <RightIcon /> : <WrongIcon />}</IconWrapper>
                    )}
                  </DragItem>
                );
              })
          )}
        </DropContainer>
      );

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
          data-cy="preview-contaniner"
          innerRef={this.previewContainerRef}
        >
          {renderAnnotations()}
          {renderImage()}
          {(isSnapFitValues || !preview) &&
            responseContainers.map((responseContainer, index) => {
              const dropTargetIndex = index;
              const btnStyle = {
                widthpx: smallSize ? responseContainer.width / 2 : responseContainer.width,
                width: smallSize ? responseContainer.width / 2 : responseContainer.width,
                top: smallSize ? responseContainer.top / 2 : responseContainer.top,
                left: smallSize ? responseContainer.left / 2 : responseContainer.left,
                height: smallSize ? responseContainer.height / 2 : responseContainer.height,
                heightpx: smallSize ? responseContainer.height / 2 : responseContainer.height,
                border: showDropItemBorder
                  ? showDashedBorder
                    ? `dashed 2px ${theme.widgets.clozeImageDragDrop.dropContainerDashedBorderColor}`
                    : `solid 1px ${theme.widgets.clozeImageDragDrop.dropContainerSolidBorderColor}`
                  : 0,
                position: "absolute",
                background: transparentBackground ? "transparent" : backgroundColor,
                borderRadius: 5
                // overflow: "hidden"
              };

              if (responseBtnStyle && responseBtnStyle.widthpx) {
                btnStyle.width = responseBtnStyle.widthpx;
              } else {
                btnStyle.width = btnStyle.widthpx;
              }
              console.log(btnStyle);
              if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
                const { widthpx: individualW, heightpx: individualH } = responsecontainerindividuals[dropTargetIndex];
                btnStyle.width = individualW || btnStyle.width;
                btnStyle.widthpx = individualW || btnStyle.widthpx;
                btnStyle.height = individualH || btnStyle.height;
                btnStyle.heightpx = individualH || btnStyle.heightpx;
              }

              return (
                <DropContainer
                  key={index}
                  index={index}
                  style={{
                    borderStyle: smallSize ? "dashed" : "solid",
                    height: isWrapText ? "auto" : responseContainer.height || "auto", // responseContainer.height || "auto",
                    width: responseContainer.width || "auto",
                    minHeight: response.minHeight || "auto",
                    minWidth: response.minWidth || "auto",
                    maxWidth: response.maxWidth,
                    ...btnStyle
                  }}
                  disableResponse={disableResponse}
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
                      userAnswers[dropTargetIndex].value &&
                      userAnswers[dropTargetIndex].value.map((answer, item_index) => {
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
                            disableResponse={disableResponse}
                          >
                            <AnswerContainer
                              height={responseContainer.height || "auto"}
                              width={responseContainer.width || "auto"}
                              isWrapText={isWrapText}
                              answer={answer}
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
          {renderSnapItems()}
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    );

    const checkboxTemplateBoxLayout = (
      <StyledPreviewTemplateBox fontSize={fontSize} height={canvasHeight > maxHeight ? canvasHeight : maxHeight}>
        <StyledPreviewContainer
          width={canvasWidth > maxWidth ? canvasWidth : maxWidth}
          height={canvasHeight > maxHeight ? canvasHeight : maxHeight}
          innerRef={this.previewContainerRef}
        >
          <CheckboxTemplateBoxLayout
            responseContainers={responseContainers}
            responsecontainerindividuals={responsecontainerindividuals}
            responseBtnStyle={responseBtnStyle}
            annotations={renderAnnotations()}
            image={renderImage()}
            snapItems={renderSnapItems()}
            stemnumeration={stemnumeration}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
            userSelections={userAnswers}
            evaluation={evaluation}
            drop={drop}
            isSnapFitValues={isSnapFitValues}
            onDropHandler={this.onDrop}
            showBorder={showBorder}
            showDropItemBorder={showDropItemBorder}
          />
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
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

    const validAnswers = get(item, "validation.validResponse.value", []);
    const altAnswers = get(item, "validation.altResponses", []).map(alt => get(alt, "value", []).map(res => res));
    const allAnswers = [validAnswers, ...altAnswers];

    const correctAnswerBoxLayout = showAnswer ? (
      allAnswers.map((answers, answersIndex) => (
        <CorrectAnswerBoxLayout
          fontSize={fontSize}
          groupResponses={options}
          userAnswers={answers}
          title={answersIndex === 0 ? "Correct Answer" : "Alternate Answer"}
        />
      ))
    ) : (
      <div />
    );

    const responseBoxLayout = isReviewTab ? <div /> : previewResponseBoxLayout;
    const answerBox = showAnswer ? correctAnswerBoxLayout : <div />;

    const responseposition = smallSize ? "right" : responsecontainerposition;

    let responseBoxContainerWidth = 150;
    if (this.responseBoxContainerRef.current) {
      responseBoxContainerWidth =
        this.responseBoxContainerRef.current.clientWidth > 150 ? this.responseBoxContainerRef.current.clientWidth : 150;
    }

    return (
      <div style={{ fontSize }}>
        <InstructorStimulus>{instructorStimulus}</InstructorStimulus>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
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
                margin: 15,
                height: "auto",
                borderRadius: 10,
                background: theme.widgets.clozeImageDragDrop.responseBoxBgColor,
                display: "flex",
                justifyContent: "center"
              }}
              ref={this.responseBoxContainerRef}
            >
              <RelativeContainer containerWidth={responseBoxContainerWidth}>{responseBoxLayout}</RelativeContainer>
            </div>
            <div
              style={{
                margin: "15px 0 15px 15px",
                borderRadius: 10,
                flex: 1,
                width: `calc(100% - ${responseBoxContainerWidth + 30}px)`
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
                borderRadius: 10,
                width: `calc(100% - ${responseBoxContainerWidth + 30}px)`
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
              ref={this.responseBoxContainerRef}
            >
              <RelativeContainer containerWidth={responseBoxContainerWidth}>{responseBoxLayout}</RelativeContainer>
            </div>
          </div>
        )}
        {answerBox}
      </div>
    );
  }
}

Display.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  options: PropTypes.array,
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
  disableResponse: PropTypes.bool,
  maxRespCount: PropTypes.number,
  instructorStimulus: PropTypes.string,
  imageOptions: PropTypes.object,
  showQuestionNumber: PropTypes.bool,
  item: PropTypes.object,
  showBorder: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  previewTab: PropTypes.string.isRequired
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

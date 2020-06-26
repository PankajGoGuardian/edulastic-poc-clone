import React, { useState, useEffect, Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual, get, shuffle, uniq } from "lodash";
import "core-js/features/array/flat";
import {
  FlexContainer,
  Stimulus,
  Subtitle,
  QuestionNumberLabel,
  AnswerContext,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContextProvider
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { ChoiceDimensions } from "@edulastic/constants";

import { PREVIEW, SHOW, CLEAR, CHECK, EDIT } from "../../constants/constantsForQuestions";

import TableLayout from "./components/TableLayout";
import TableRow from "./components/TableRow";
import DropContainer from "../../components/DropContainer";

import { getFontSize, getDirection, getStemNumeration, getJustification } from "../../utils/helpers";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import { StyledPaperWrapper } from "../../styled/Widget";

import { Separator } from "./styled/Separator";
import DragItem from "./components/DragItem";
import { ResponseContainer } from "./components/ResponseContainer";
import ChoiceContainer from "./components/ChoiceContainer";
import CorrectAnswers from "./components/CorrectAnswers";
import Instructions from "../../components/Instructions";
import getMaxMinWidth from "./getMaxMinWidth";

const {
  maxWidth: choiceDefaultMaxW,
  minWidth: choiceDefaultMinW,
  minHeight: choiceDefaultMinH,
  maxHeight: choiceDefaultMaxH
} = ChoiceDimensions;

const ClassificationPreview = ({
  view,
  saveAnswer,
  item = { uiStyle: {} },
  t,
  evaluation,
  userAnswer,
  previewTab,
  smallSize,
  editCorrectAnswers,
  showQuestionNumber,
  disableResponse,
  isReviewTab,
  setQuestionData,
  isPrintPreview,
  isPrint
}) => {
  const listPosition = get(item, "uiStyle.possibilityListPosition", "left");
  const rowHeader = get(item, "uiStyle.rowHeader", null);
  const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"));
  const isVertical = listPosition === "left" || listPosition === "right";
  const dragItemMinWidth = get(item, "uiStyle.choiceMinWidth", choiceDefaultMinW);
  const dragItemMaxWidth = get(item, "uiStyle.choiceMaxWidth", choiceDefaultMaxW);
  const stemNumeration = get(item, "uiStyle.validationStemNumeration", choiceDefaultMaxW);

  const { isAnswerModifiable } = useContext(AnswerContext);

  const direction = getDirection(listPosition, disableResponse);
  const justification = getJustification(listPosition);
  const styles = {
    wrapperStyle: {
      display: "flex",
      flexDirection:
        (isPrintPreview || isPrint) && direction.includes("row") ? direction.replace(/row/gi, "column") : direction,
      width: "100%",
      justifyContent: justification
    },
    dragItemsContainerStyle: {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "wrap",
      minHeight: isVertical ? 140 : 50,
      borderRadius: 4
    }
  };

  const {
    possibleResponses: posResponses = [],
    groupPossibleResponses,
    possibleResponseGroups = [],
    stimulus,
    imageUrl,
    imageOptions = {},
    shuffleOptions,
    transparentPossibleResponses,
    transparentBackgroundImage = true,
    duplicateResponses,
    uiStyle: {
      columnCount: colCount,
      columnTitles: colTitles = [],
      rowCount,
      rowTitles: rowTitles = [],
      showDragHandle
    },
    classifications = []
  } = item;

  const validArray = get(item, "validation.validResponse.value", []);
  const altArrays = get(item, "validation.altResponses", []).map(arr => arr.value || []);

  let groupArrays = [];
  possibleResponseGroups.forEach(o => {
    groupArrays = [...groupArrays, ...o.responses];
  });

  const posResp = groupPossibleResponses ? groupArrays : posResponses;

  const possibleResponses =
    editCorrectAnswers.length > 0
      ? posResp.filter(
          ite => ite && editCorrectAnswers.every(i => !i.includes(posResp.find(resp => resp.id === ite.id).id))
        )
      : posResp;

  const initialLength = (colCount || 2) * (rowCount || 1);

  const createEmptyArrayOfArrays = () => Array(...Array(initialLength)).map(() => []);
  /*
    Changes :
    1. removing validArray mapping for initial answers 
       as it is correct ans array and we need user response array.
    2. Refactoring code for better readability of conditions.
 */
  const getInitialUserAnswers = () => {
    if (!disableResponse && Object.keys(editCorrectAnswers).length > 0) {
      return editCorrectAnswers;
    }
    // it is called only in previewMode
    if (userAnswer && Object.keys(userAnswer)?.some(key => userAnswer[key]?.length !== 0)) {
      return userAnswer;
    }
    const initalAnswerMap = {};
    classifications.forEach(classification => {
      initalAnswerMap[classification.id] = initalAnswerMap[classification.id] || [];
    });
    return initalAnswerMap;
  };

  /**
   * in edit mode
   * edit correct answers basically follows up the same schema as validation.value
   * it is passed from editClassification
   *
   * in preview mode
   * getInitialUserAnswers() is called to get answers
   * it also follows similar schema as of validation.value
   */
  const initialAnswers = getInitialUserAnswers();

  function getPossiblResponses() {
    const allAnswers = Object.values(initialAnswers).reduce((acc, curr) => {
      acc = acc.concat(curr);
      return acc;
    }, []);
    function notSelected(obj) {
      if (obj) {
        return !allAnswers.includes(obj.id);
      }
    }
    const res = possibleResponses.filter(notSelected);
    return res;
  }

  const [answers, setAnswers] = useState(initialAnswers);
  const [dragItems, setDragItems] = useState(possibleResponses);
  console.log("intially", { answers, dragItems, classifications });
  /**
   * it is used to filter out responses from the bottom container and place in correct boxes
   * it also used to clear out responses when clear is pressed
   */
  const updateDragItems = () => {
    setAnswers(initialAnswers);
    setDragItems(getPossiblResponses());
  };

  useEffect(() => {
    if (
      !isEqual(answers, initialAnswers) ||
      (!groupPossibleResponses &&
        (possibleResponses.length !== dragItems.length || !isEqual(possibleResponses, dragItems)))
    ) {
      updateDragItems();
    }
  }, [userAnswer, possibleResponses]);

  useEffect(() => {
    if (view === EDIT) {
      updateDragItems();
    }
  }, [classifications, editCorrectAnswers]);

  useEffect(updateDragItems, []);

  const boxes = createEmptyArrayOfArrays();

  const onDrop = (itemCurrent, itemTo, from) => {
    const columnCount = get(item, "maxResponsePerCell", "");
    const dItems = cloneDeep(dragItems);
    const userAnswers = cloneDeep(answers);
    if (columnCount && userAnswers[itemTo.index] && userAnswers[itemTo.index].length >= columnCount) {
      return;
    }

    // this is called when responses are dragged back to the container from the columns
    if (itemTo.flag === "dragItems") {
      const obj = posResp.find(ite => ite.value === itemCurrent.item);
      if (obj) {
        Object.keys(userAnswers).forEach(key => {
          const arr = userAnswers[key] || [];
          const optionIndex = arr.indexOf(obj.id);
          if (optionIndex !== -1) {
            arr.splice(optionIndex, 1);
          }
        });
        if (!dItems.flatMap(ite => ite.value).includes(itemCurrent.item)) {
          dItems.push(posResponses.find(resp => resp.value === itemCurrent.item));
          setDragItems(dItems);
        }
      }
    } else if (itemTo.flag === "column") {
      /**
       * this is called when
       * responses are dragged from container to columns
       * or, from one column to another
       */
      const obj = posResp.find(ite => ite.value === itemCurrent.item);
      if (obj) {
        Object.keys(userAnswers).forEach(key => {
          const arr = userAnswers[key] || [];
          if (!duplicateResponses && arr.includes(obj.id)) {
            arr.splice(arr.indexOf(obj.id), 1);
          } else if (from === "column" && arr.includes(obj.id)) {
            /**
             * when going from one column1 to column2
             * remove it from the column1
             */
            arr.splice(arr.indexOf(obj.id), 1);
          }
          if (key === itemTo.columnId) {
            arr.push(obj.id);
          }
        });
      }
      /**
       * this is to filter out responses when options are dropped
       * get a new list of possible responses
       */
      if (!duplicateResponses) {
        const includes = posResp.flatMap(_obj => _obj.value).includes(itemCurrent.item);
        if (includes) {
          dItems.splice(dItems.findIndex(_obj => _obj.value === itemCurrent.item), 1);
          setDragItems(dItems);
        }
      }
    }
    /**
     * just a check to verify if actually anything has changed
     */
    if (!isEqual(userAnswers, answers)) {
      setAnswers(userAnswers);
    }
    saveAnswer(userAnswers);
  };

  const drop = ({ flag, index, columnId }) => ({ flag, index, columnId });

  const preview = previewTab === CHECK || previewTab === SHOW;

  const arrayOfRows = new Set(
    boxes.map((n, ind) => (ind % colCount === 0 ? ind : undefined)).filter(i => i !== undefined)
  );

  const verifiedDragItems = uniq(
    shuffleOptions
      ? shuffle(duplicateResponses ? posResponses : dragItems)
      : duplicateResponses
      ? posResponses
      : dragItems
  );

  /**
   * It is in case of group_possbile_responses
   * This takes care of filtering out draggable responses from the bottom container
   */
  const flattenAnswers = Object.values(answers).flatMap(arr => arr);
  const verifiedGroupDragItems = duplicateResponses
    ? possibleResponseGroups.map(group => (shuffleOptions ? shuffle(group.responses) : group.responses))
    : possibleResponseGroups.map(group => {
        const responses = group.responses.filter(response => !flattenAnswers.includes(response.id));
        return shuffleOptions ? shuffle(responses) : responses;
      });

  const { maxWidth: choiceMaxWidth, minWidth: choiceMinWidth } = getMaxMinWidth(posResp, fontSize);
  const { maxWidth: colTitleMaxWidth } = getMaxMinWidth(colTitles.map(title => ({ value: title })));
  const choiceWdith = Math.max(choiceMaxWidth, colTitleMaxWidth);

  const dragItemSize = {
    maxWidth: dragItemMaxWidth,
    minWidth: dragItemMinWidth,
    minHeight: choiceDefaultMinH,
    maxHeight: choiceDefaultMaxH,
    width: choiceWdith + 10
  };

  const dragItemProps = {
    onDrop,
    preview,
    disableResponse,
    from: "container",
    dragHandle: showDragHandle,
    isTransparent: transparentPossibleResponses,
    padding: choiceMinWidth < 35 ? "0px 0px 0px 5px" : "0px 0px 0px 10px",
    isPrintPreview,
    ...dragItemSize
  };

  const dragLayout = (
    <TableRow
      colTitles={colTitles}
      isBackgroundImageTransparent={transparentBackgroundImage}
      isTransparent={transparentPossibleResponses}
      width={get(item, "uiStyle.rowTitlesWidth", "max-content")}
      height={get(item, "uiStyle.rowMinHeight", "65px")}
      colCount={colCount}
      arrayOfRows={arrayOfRows}
      rowTitles={rowTitles}
      drop={drop}
      dragHandle={showDragHandle}
      answers={answers}
      evaluation={evaluation}
      preview={preview}
      previewTab={previewTab}
      possibleResponses={possibleResponses}
      onDrop={onDrop}
      isResizable={view === EDIT}
      item={item}
      disableResponse={disableResponse}
      isReviewTab={isReviewTab}
      view={view}
      setQuestionData={setQuestionData}
      rowHeader={rowHeader}
      dragItemSize={dragItemProps}
      showIndex={previewTab === SHOW}
    />
  );

  const tableLayout = (
    <TableLayout
      colCount={colCount}
      rowCount={rowCount}
      rowTitles={rowTitles}
      colTitles={colTitles}
      width={get(item, "uiStyle.rowTitlesWidth", "max-content")}
      minWidth={200}
      height={get(item, "uiStyle.rowMinHeight", "85px")}
      isBackgroundImageTransparent={transparentBackgroundImage}
      isTransparent={transparentPossibleResponses}
      answers={answers}
      drop={drop}
      dragHandle={showDragHandle}
      item={item}
      isReviewTab={isReviewTab}
      evaluation={evaluation}
      preview={preview}
      onDrop={onDrop}
      disableResponse={disableResponse}
      rowHeader={rowHeader}
      dragItemSize={dragItemSize}
      showIndex={previewTab === SHOW}
    />
  );
  const tableContent = rowCount > 1 ? tableLayout : dragLayout;

  const classificationPreviewComponent = !!choiceWdith && (
    <StyledPaperWrapper
      data-cy="classificationPreview"
      style={{ fontSize }}
      padding={smallSize}
      boxShadow={smallSize ? "none" : ""}
      className="classification-preview"
    >
      <FlexContainer justifyContent="flex-start" alignItems="baseline" width="100%">
        <QuestionLabelWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
          {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
        </QuestionLabelWrapper>

        <div
          style={{
            overflow: "auto",
            width: isPrintPreview && !isVertical && "100%"
          }}
        >
          {!smallSize && view === PREVIEW && (
            <QuestionTitleWrapper>
              <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />
            </QuestionTitleWrapper>
          )}
          <div
            data-cy="classificationPreviewWrapper"
            style={styles.wrapperStyle}
            className="classification-preview-wrapper"
          >
            <ResponseContainer
              direction={direction}
              imageOptions={imageOptions}
              imageUrl={imageUrl}
              disableResponse={disableResponse}
              className="classification-preview-wrapper-response"
            >
              {tableContent}
            </ResponseContainer>
            {!disableResponse && (
              <ChoiceContainer
                direction={direction}
                choiceWidth={dragItemMaxWidth}
                title={t("component.classification.dragItemsTitle")}
              >
                <DropContainer flag="dragItems" drop={drop} style={styles.dragItemsContainerStyle} noBorder>
                  <FlexContainer
                    style={{ width: "100%" }}
                    flexDirection="column"
                    alignItems="stretch"
                    justifyContent="center"
                    maxWidth="100%"
                  >
                    {groupPossibleResponses ? (
                      verifiedGroupDragItems.map((i, index) => (
                        <Fragment key={index}>
                          <FlexContainer
                            style={{ flex: 1 }}
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            maxWidth="100%"
                          >
                            <Subtitle>{get(item, `possibleResponseGroups[${index}].title`, "")}</Subtitle>
                            <FlexContainer className="choice-items-wrapper">
                              {i.map((ite, ind) => (
                                <DragItem
                                  {...dragItemProps}
                                  renderIndex={getStemNumeration(stemNumeration, ind)}
                                  item={ite.value}
                                  key={ite.id}
                                />
                              ))}
                            </FlexContainer>
                          </FlexContainer>
                          {index !== possibleResponseGroups.length - 1 && <Separator />}
                        </Fragment>
                      ))
                    ) : (
                      <Fragment>
                        <FlexContainer
                          style={{ flex: 1 }}
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="flex-start"
                          maxWidth="100%"
                        >
                          <FlexContainer className="choice-items-wrapper">
                            {verifiedDragItems.map(ite => (
                              <DragItem
                                {...dragItemProps}
                                key={ite.id}
                                item={ite.value}
                                renderIndex={possibleResponses.indexOf(ite)}
                                disableResponse={disableResponse || !isAnswerModifiable}
                              />
                            ))}
                          </FlexContainer>
                        </FlexContainer>
                      </Fragment>
                    )}
                  </FlexContainer>
                </DropContainer>
              </ChoiceContainer>
            )}
          </div>
          {view !== EDIT && <Instructions item={item} />}
          {previewTab === SHOW || isReviewTab ? (
            <ChoiceContainer>
              <CorrectAnswers
                colCount={colCount}
                possibleResponse={posResp}
                answersArr={validArray}
                columnTitles={colTitles}
                stemNumeration={stemNumeration}
                dragItemProps={dragItemProps}
                title={t("component.classification.correctAnswers")}
                multiRow={rowCount > 1}
              />
              {altArrays.map((altArray, ind) => (
                <CorrectAnswers
                  colCount={colCount}
                  possibleResponse={posResp}
                  answersArr={altArray}
                  columnTitles={colTitles}
                  stemNumeration={stemNumeration}
                  dragItemProps={dragItemProps}
                  multiRow={rowCount > 1}
                  key={`alt-answer-${ind}`}
                  title={`${t("component.classification.alternateAnswer")} ${ind + 1}`}
                />
              ))}
            </ChoiceContainer>
          ) : null}
        </div>
      </FlexContainer>
    </StyledPaperWrapper>
  );

  return (
    <QuestionContextProvider value={{ questionId: item.id }}>{classificationPreviewComponent}</QuestionContextProvider>
  );
};

ClassificationPreview.propTypes = {
  previewTab: PropTypes.string,
  editCorrectAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  evaluation: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  setQuestionData: PropTypes.any.isRequired,
  userAnswer: PropTypes.any.isRequired,
  view: PropTypes.string.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  isReviewTab: PropTypes.bool
};

ClassificationPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  editCorrectAnswers: [],
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false
};

export default withNamespaces("assessment")(ClassificationPreview);

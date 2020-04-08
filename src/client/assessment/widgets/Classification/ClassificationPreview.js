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
  QuestionSubLabel
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { ChoiceDimensions } from "@edulastic/constants";

import { PREVIEW, SHOW, CLEAR, CHECK, EDIT } from "../../constants/constantsForQuestions";

import TableLayout from "./components/TableLayout";
import TableRow from "./components/TableRow";
import DropContainer from "../../components/DropContainer";

import { getFontSize, getDirection, getStemNumeration } from "../../utils/helpers";
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
  const direction = getDirection(listPosition);

  const styles = {
    wrapperStyle: {
      display: "flex",
      flexDirection:
        (isPrintPreview || isPrint) && direction.includes("row") ? direction.replace(/row/gi, "column") : direction,
      width: "100%",
      overflow: "auto"
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
    }
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
    // it is called only in previewMode
    if (userAnswer && userAnswer.some(arr => arr.length !== 0)) {
      return userAnswer;
    }
    return createEmptyArrayOfArrays();
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
  const initialAnswers =
    !disableResponse && editCorrectAnswers.length > 0 ? editCorrectAnswers : getInitialUserAnswers();

  const [answers, setAnswers] = useState(initialAnswers);
  const [dragItems, setDragItems] = useState(possibleResponses);

  /**
   * it is used to filter out responses from the bottom container and place in correct boxes
   * it also used to clear out responses when clear is pressed
   */
  const updateDragItems = () => {
    setAnswers(initialAnswers);
    setDragItems(possibleResponses.filter(resp => initialAnswers.every(arr => !arr.includes(resp.id))));
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

  useEffect(updateDragItems, []);

  const boxes = createEmptyArrayOfArrays();

  const onDrop = (itemCurrent, itemTo, from) => {
    const columnCount = get(item, "maxResponsePerCell", "");
    const dItems = cloneDeep(dragItems);
    const ansArrays = cloneDeep(answers);
    if (columnCount && ansArrays[itemTo.index] && ansArrays[itemTo.index].length >= columnCount) {
      return;
    }

    // this is called when responses are dragged back to the container from the columns
    if (itemTo.flag === "dragItems") {
      ansArrays.forEach(arr => {
        const obj = posResp.find(ite => ite.value === itemCurrent.item);
        if (obj && arr.includes(obj.id)) {
          arr.splice(arr.indexOf(obj.id), 1);
        }
      });

      if (!dItems.flatMap(ite => ite.value).includes(itemCurrent.item)) {
        dItems.push(posResponses.find(resp => resp.value === itemCurrent.item));
        setDragItems(dItems);
      }
    }

    // this is called when responses are dragged from bottom container to columns
    else if (itemTo.flag === "column") {
      const obj = posResp.find(ite => ite.value === itemCurrent.item);
      if (obj) {
        ansArrays.forEach((arr, i) => {
          if (!duplicateResponses && arr.includes(obj.id)) {
            arr.splice(arr.indexOf(obj.id), 1);
          } else if (from === "column" && arr.includes(obj.id)) {
            arr.splice(arr.indexOf(obj.id), 1);
          }

          if (i === itemTo.index) {
            arr.push(obj.id);
          }
        });
      }

      if (!duplicateResponses) {
        const includes = posResp.flatMap(_obj => _obj.value).includes(itemCurrent.item);
        if (includes) {
          dItems.splice(dItems.findIndex(_obj => _obj.value === itemCurrent.item), 1);
          setDragItems(dItems);
        }
      }
      if (!isEqual(ansArrays, answers)) {
        setAnswers(ansArrays);
      }
    }
    saveAnswer(ansArrays);
  };

  const drop = ({ flag, index }) => ({ flag, index });

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
  const flattenAnswers = answers.flat();
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
    ...dragItemSize
  };

  const dragLayout = boxes.map(
    (n, ind) =>
      arrayOfRows.has(ind) && (
        <TableRow
          colTitles={colTitles}
          key={ind}
          isBackgroundImageTransparent={transparentBackgroundImage}
          isTransparent={transparentPossibleResponses}
          startIndex={ind}
          width={get(item, "uiStyle.row_titles_width", "max-content")}
          height={get(item, "uiStyle.row_min_height", "65px")}
          colCount={colCount}
          arrayOfRows={arrayOfRows}
          rowTitles={rowTitles}
          drop={drop}
          dragHandle={showDragHandle}
          answers={answers}
          validArray={evaluation}
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
      )
  );

  const tableLayout = (
    <TableLayout
      colCount={colCount}
      rowCount={rowCount}
      rowTitles={rowTitles}
      colTitles={colTitles}
      width={get(item, "uiStyle.row_titles_width", "max-content")}
      minWidth={200}
      height={get(item, "uiStyle.row_min_height", "85px")}
      isBackgroundImageTransparent={transparentBackgroundImage}
      isTransparent={transparentPossibleResponses}
      answers={answers}
      drop={drop}
      dragHandle={showDragHandle}
      item={item}
      isReviewTab={isReviewTab}
      validArray={evaluation}
      preview={preview}
      onDrop={onDrop}
      disableResponse={disableResponse}
      rowHeader={rowHeader}
      dragItemSize={dragItemSize}
      showIndex={previewTab === SHOW}
    />
  );
  const tableContent = rowCount > 1 ? tableLayout : dragLayout;

  return (
    !!choiceWdith && (
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
    )
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

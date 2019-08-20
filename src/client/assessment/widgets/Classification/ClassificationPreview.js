import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual, get, shuffle, uniq } from "lodash";
import { compose } from "redux";
import { withTheme } from "styled-components";
import "core-js/features/array/flat";
import {
  Paper,
  FlexContainer,
  CorrectAnswersContainer,
  Stimulus,
  Subtitle,
  InstructorStimulus,
  MathFormulaDisplay,
  QuestionNumberLabel
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import TableLayout from "./components/TableLayout";

import DropContainer from "../../components/DropContainer";
import { PREVIEW, SHOW, CLEAR, CHECK, EDIT } from "../../constants/constantsForQuestions";

import DragItem from "./components/DragItem";
import { IndexBox } from "./styled/IndexBox";
import TableRow from "./components/TableRow";
import { getStyles } from "./utils";
import { getFontSize, getDirection } from "../../utils/helpers";
import { TableWrapper } from "./styled/TableWrapper";
import { QuestionTitleWrapper } from "./styled/QustionNumber";

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
  theme,
  showQuestionNumber,
  disableResponse,
  isReviewTab,
  setQuestionData
}) => {
  const styles = {
    itemContainerStyle: {
      display: "flex",
      alignItems: "center",
      margin: "10px 15px 10px 15px"
    },
    previewItemStyle: {
      paddingRight: 15,
      paddingLeft: 15,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      cursor: "normal",
      fontWeight: theme.widgets.classification.previewItemFontWeight
    },
    noPreviewItemStyle: {},
    dragItemsContainerStyle: {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "wrap",
      minHeight: 140,
      borderRadius: 4
    },
    correctAnswersMargins: { marginBottom: 0, marginRight: 30, width: "100%" }
  };

  const {
    possibleResponses: posResponses = [],
    groupPossibleResponses,
    possibleResponseGroups = [],
    stimulus,
    imageUrl,
    imageOptions,
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

  const itemValidation = item.validation || {};
  let validArray = itemValidation && itemValidation.validResponse && itemValidation.validResponse.value;
  let altArrays = itemValidation && itemValidation.altResponses;
  validArray = validArray || [];
  altArrays = altArrays ? altArrays.map(arr => arr.value || []) : [];
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

  const getStemNumeration = i => {
    if (item.uiStyle) {
      switch (item.uiStyle.validationStemNumeration) {
        case "upper-alpha":
          return String.fromCharCode(i + 65);
        case "lower-alpha":
          return String.fromCharCode(i + 65).toLowerCase();
        default:
          break;
      }
    }
    return i + 1;
  };

  const initialLength = (colCount || 2) * (rowCount || 1);

  const createEmptyArrayOfArrays = () => Array(...Array(initialLength)).map(() => []);
  /*
    Changes :
    1. removing validArray mapping for initial answers as it is correct ans array and we need user response array.
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
  useEffect(() => {
    if (
      !isEqual(answers, initialAnswers) ||
      (!groupPossibleResponses &&
        (possibleResponses.length !== dragItems.length || !isEqual(possibleResponses, dragItems)))
    ) {
      setAnswers(initialAnswers);
      const abc = possibleResponses.filter(resp => initialAnswers.every(arr => !arr.includes(resp.id)));
      setDragItems(abc);
    }
  }, [userAnswer, possibleResponses]);

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
        if (arr.includes(obj.id)) {
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

  const transformArray = Arr => {
    const len = colCount || 2;

    const res = Array(...Array(len)).map(() => []);

    Arr.forEach((arr, i) => {
      res[i % len] = res[i % len].concat(arr);
    });

    return res;
  };

  const preview = previewTab === CHECK || previewTab === SHOW;

  const arrayOfRows = new Set(
    boxes.map((n, ind) => (ind % colCount === 0 ? ind : undefined)).filter(i => i !== undefined)
  );

  const arrayOfCols = transformArray(validArray);
  const arrayOfAltCols = altArrays.map(altArray => transformArray(altArray));

  const listPosition = get(item, "uiStyle.possibilityListPosition", "bottom");
  const rowHeader = get(item, "uiStyle.rowHeader", null);
  const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"));

  const wrapperStyle = {
    display: "flex",
    flexDirection: getDirection(listPosition)
  };

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
          height={get(item, "uiStyle.row_min_height", "85px")}
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
      minWidth="200px"
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
    />
  );

  const tableContent = rowCount > 1 ? tableLayout : dragLayout;
  const maxWidth = listPosition === "left" || listPosition === "right" ? "25%" : null;
  return (
    <Paper data-cy="classificationPreview" style={{ fontSize }} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <InstructorStimulus>{item.instructorStimulus}</InstructorStimulus>
      {!smallSize && view === PREVIEW && (
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
          <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />
        </QuestionTitleWrapper>
      )}

      <div data-cy="classificationPreviewWrapper" style={wrapperStyle}>
        <TableWrapper imageOptions={imageOptions} imageUrl={imageUrl}>
          {tableContent}
        </TableWrapper>
        {!disableResponse && (
          <CorrectAnswersContainer maxWidth={maxWidth} title={t("component.classification.dragItemsTitle")}>
            <DropContainer flag="dragItems" drop={drop} style={styles.dragItemsContainerStyle} noBorder>
              <FlexContainer style={{ width: "100%" }} alignItems="stretch" justifyContent="center">
                {groupPossibleResponses ? (
                  verifiedGroupDragItems.map((i, index) => (
                    <Fragment key={index}>
                      <FlexContainer
                        style={{ flex: 1 }}
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Subtitle
                          style={{
                            color: theme.widgets.classification.previewSubtitleColor
                          }}
                        >
                          {get(item, `possibleResponseGroups[${index}].title`, "")}
                        </Subtitle>
                        <FlexContainer justifyContent="center" style={{ width: "100%", flexWrap: "wrap" }}>
                          {i.map((ite, ind) =>
                            duplicateResponses ? (
                              <DragItem
                                dragHandle={showDragHandle}
                                key={ind}
                                isTransparent={transparentPossibleResponses}
                                preview={preview}
                                renderIndex={getStemNumeration(ind)}
                                onDrop={onDrop}
                                item={ite.value}
                                disableResponse={disableResponse}
                                possibilityListPosition={listPosition}
                                from="container"
                              />
                            ) : (
                              <DragItem
                                dragHandle={showDragHandle}
                                key={ind}
                                isTransparent={transparentPossibleResponses}
                                preview={preview}
                                renderIndex={getStemNumeration(ind)}
                                onDrop={onDrop}
                                item={ite.value}
                                disableResponse={disableResponse}
                                possibilityListPosition={listPosition}
                                from="container"
                              />
                            )
                          )}
                        </FlexContainer>
                      </FlexContainer>
                      {index !== possibleResponseGroups.length - 1 && (
                        <div
                          style={{
                            width: 0,
                            marginLeft: 35,
                            marginRight: 35,
                            borderLeft: `1px solid ${theme.widgets.classification.separatorBorderColor}`
                          }}
                        />
                      )}
                    </Fragment>
                  ))
                ) : (
                  <Fragment>
                    <FlexContainer
                      style={{ flex: 1 }}
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <FlexContainer justifyContent="center" style={{ width: "100%", flexWrap: "wrap" }}>
                        {verifiedDragItems.map((ite, ind) =>
                          duplicateResponses ? (
                            <DragItem
                              dragHandle={showDragHandle}
                              key={ind}
                              isTransparent={transparentPossibleResponses}
                              preview={preview}
                              renderIndex={possibleResponses.indexOf(ite)}
                              onDrop={onDrop}
                              item={ite.value}
                              disableResponse={disableResponse}
                              possibilityListPosition={listPosition}
                              from="container"
                            />
                          ) : (
                            dragItems.includes(ite) && (
                              <DragItem
                                dragHandle={showDragHandle}
                                key={ind}
                                isTransparent={transparentPossibleResponses}
                                preview={preview}
                                renderIndex={possibleResponses.indexOf(ite)}
                                onDrop={onDrop}
                                item={ite.value}
                                disableResponse={disableResponse}
                                possibilityListPosition={listPosition}
                                from="container"
                              />
                            )
                          )
                        )}
                      </FlexContainer>
                    </FlexContainer>
                  </Fragment>
                )}
              </FlexContainer>
            </DropContainer>
          </CorrectAnswersContainer>
        )}
      </div>

      {previewTab === SHOW || isReviewTab ? (
        <CorrectAnswersContainer title={t("component.classification.correctAnswers")}>
          {arrayOfCols.map((arr, i) => (
            <FlexContainer style={{ flexWrap: "wrap", marginBottom: 40 }}>
              <Subtitle style={styles.correctAnswersMargins}>
                <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: colTitles[i] }} />
              </Subtitle>
              {arr.map((id, index) => {
                const resp = posResp.find(_resp => _resp.id === id);
                return (
                  <div style={styles.itemContainerStyle} key={index}>
                    <IndexBox preview={preview}>{getStemNumeration(index)}</IndexBox>
                    <MathFormulaDisplay
                      style={getStyles(
                        false,
                        false,
                        theme.widgets.classification.boxBgColor,
                        theme.widgets.classification.boxBorderColor,
                        styles.previewItemStyle
                      )}
                      dangerouslySetInnerHTML={{ __html: (resp && resp.value) || "" }}
                    />
                  </div>
                );
              })}
            </FlexContainer>
          ))}
          {arrayOfAltCols.map((arrays, ind) => (
            <Fragment key={ind}>
              <Subtitle style={{ marginBottom: 20, marginTop: 20 }}>
                {`${t("component.classification.alternateAnswer")} ${ind + 1}`}
              </Subtitle>
              {arrays.map((arr, i) => (
                <FlexContainer style={{ flexWrap: "wrap", marginBottom: 40 }}>
                  <Subtitle style={styles.correctAnswersMargins}>
                    <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: colTitles[i] }} />
                  </Subtitle>
                  {arr.map((id, index) => {
                    const resp = posResp.find(_resp => _resp.id === id);
                    return (
                      <div style={styles.itemContainerStyle} key={index}>
                        <IndexBox preview={preview}>{getStemNumeration(index)}</IndexBox>
                        <MathFormulaDisplay
                          style={getStyles(
                            false,
                            false,
                            theme.widgets.classification.boxBgColor,
                            theme.widgets.classification.boxBorderColor,
                            styles.previewItemStyle
                          )}
                          dangerouslySetInnerHTML={{ __html: (resp && resp.value) || "" }}
                        />
                      </div>
                    );
                  })}
                </FlexContainer>
              ))}
            </Fragment>
          ))}
        </CorrectAnswersContainer>
      ) : null}
    </Paper>
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
  theme: PropTypes.object.isRequired,
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

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ClassificationPreview);

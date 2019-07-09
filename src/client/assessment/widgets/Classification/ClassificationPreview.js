import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual, get, shuffle, uniq } from "lodash";
import { compose } from "redux";
import { withTheme } from "styled-components";

import {
  Paper,
  FlexContainer,
  CorrectAnswersContainer,
  Stimulus,
  Subtitle,
  CenteredText,
  InstructorStimulus,
  MathFormulaDisplay
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import DropContainer from "../../components/DropContainer";
import { PREVIEW, SHOW, CLEAR, CHECK, EDIT } from "../../constants/constantsForQuestions";

import DragItem from "./components/DragItem";
import { IndexBox } from "./styled/IndexBox";
import TableRow from "./components/TableRow";
import { getStyles } from "./utils";
import { getFontSize, getDirection } from "../../utils/helpers";
import { TableWrapper } from "./styled/TableWrapper";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

const ClassificationPreview = ({
  view,
  saveAnswer,
  item = { ui_style: {} },
  t,
  evaluation,
  userAnswer,
  previewTab,
  smallSize,
  editCorrectAnswers,
  theme,
  qIndex,
  showQuestionNumber,
  disableResponse,
  changePreviewTab
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
    possible_responses: posResponses = [],
    group_possible_responses,
    possible_response_groups = [],
    stimulus,
    imageUrl,
    imageOptions,
    shuffle_options,
    transparent_possible_responses,
    transparent_background_image = true,
    duplicate_responses,
    ui_style: {
      column_count: colCount,
      column_titles: colTitles = [],
      row_count: rowCount,
      row_titles: rowTitles = [],
      show_drag_handle
    }
  } = item;

  const itemValidation = item.validation || {};
  let validArray = itemValidation && itemValidation.valid_response && itemValidation.valid_response.value;
  let altArrays = itemValidation && itemValidation.alt_responses;
  validArray = validArray || [];
  altArrays = altArrays ? altArrays.map(arr => arr.value || []) : [];
  let groupArrays = [];

  possible_response_groups.forEach(o => {
    groupArrays = [...groupArrays, ...o.responses];
  });

  const posResp = group_possible_responses ? groupArrays : posResponses;

  const possible_responses =
    editCorrectAnswers.length > 0
      ? posResp.filter(ite => editCorrectAnswers.every(i => !i.includes(posResp.indexOf(ite))))
      : posResp;

  const initialLength = (colCount || 2) * (rowCount || 1);

  const createEmptyArrayOfArrays = () => Array(...Array(initialLength)).map(() => []);

  const initialAnswers = disableResponse
    ? validArray.map(arr => arr.map(ans => possible_responses[ans]))
    : editCorrectAnswers.length > 0
    ? editCorrectAnswers.map(ite => ite.map(an => posResp[an]))
    : userAnswer && userAnswer.some(arr => arr.length !== 0)
    ? userAnswer.map(arr => arr.map(ans => possible_responses[ans]))
    : createEmptyArrayOfArrays();

  const [answers, setAnswers] = useState(initialAnswers);

  const [dragItems, setDragItems] = useState(possible_responses);

  useEffect(() => {
    if (
      !isEqual(answers, initialAnswers) ||
      (possible_responses.length !== dragItems.length || !isEqual(possible_responses, dragItems))
    ) {
      setAnswers(uniq(initialAnswers));
      setDragItems(uniq(possible_responses.filter(resp => initialAnswers.every(arr => !arr.includes(resp)))));
    }
  }, [userAnswer, possible_responses]);

  const boxes = createEmptyArrayOfArrays();

  const onDrop = (itemCurrent, itemTo) => {
    const columnCount = get(item, "max_response_per_cell", 4);

    const dItems = cloneDeep(dragItems);
    const ansArrays = cloneDeep(answers);

    if (ansArrays[itemTo.index] && ansArrays[itemTo.index].length >= columnCount) {
      return;
    }

    if (itemTo.flag === "dragItems") {
      ansArrays.forEach(arr => {
        if (arr.includes(itemCurrent.item)) {
          arr.splice(arr.indexOf(itemCurrent.item), 1);
        }

        arr = uniq(arr);
      });

      if (!dItems.includes(itemCurrent.item)) {
        dItems.push(itemCurrent.item);
        setDragItems(dItems);
      }
    } else if (!duplicate_responses && dItems.includes(itemCurrent.item)) {
      dItems.splice(dItems.indexOf(itemCurrent.item), 1);
      setDragItems(dItems);
    }

    if (itemTo.flag === "column") {
      ansArrays.forEach((arr, i) => {
        if (!duplicate_responses && arr.includes(itemCurrent.item)) {
          arr.splice(arr.indexOf(itemCurrent.item), 1);
        }

        if (i === itemTo.index) {
          arr.push(itemCurrent.item);
        }

        arr = uniq(arr);
      });
    }

    if (!isEqual(uniq(ansArrays), answers)) {
      setAnswers(uniq(ansArrays));
    }
    saveAnswer(uniq(ansArrays.map(ansArr => uniq(ansArr.map(ans => posResp.indexOf(ans))))));
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

  const listPosition = get(item, "ui_style.possibility_list_position", "bottom");
  const rowHeader = get(item, "ui_style.row_header", null);
  const fontSize = getFontSize(get(item, "ui_style.fontsize", "normal"));

  const wrapperStyle = {
    display: "flex",
    flexDirection: getDirection(listPosition)
  };

  const verifiedDragItems = uniq(
    shuffle_options
      ? shuffle(duplicate_responses ? posResponses : dragItems)
      : duplicate_responses
      ? posResponses
      : dragItems
  );

  const verifiedGroupDragItems = possible_response_groups.map(obj =>
    uniq(shuffle_options ? shuffle(obj.responses) : obj.responses)
  );

  return (
    <Paper data-cy="classificationPreview" style={{ fontSize }} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>
      {!smallSize && view === PREVIEW && (
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
          <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />
        </QuestionTitleWrapper>
      )}

      <div data-cy="classificationPreviewWrapper" style={wrapperStyle}>
        <TableWrapper imageOptions={imageOptions} imageUrl={imageUrl}>
          {boxes.map(
            (n, ind) =>
              arrayOfRows.has(ind) && (
                <TableRow
                  colTitles={colTitles}
                  key={ind}
                  isBackgroundImageTransparent={transparent_background_image}
                  isTransparent={transparent_possible_responses}
                  startIndex={ind}
                  width={get(item, "ui_style.row_titles_width", "100%")}
                  height={get(item, "ui_style.row_min_height", "150px")}
                  colCount={colCount}
                  arrayOfRows={arrayOfRows}
                  rowTitles={rowTitles}
                  drop={drop}
                  dragHandle={show_drag_handle}
                  answers={answers}
                  validArray={evaluation}
                  preview={preview}
                  possible_responses={possible_responses}
                  onDrop={onDrop}
                  isResizable={view === EDIT}
                  item={item}
                  disableResponse={disableResponse}
                />
              )
          )}
        </TableWrapper>
        {!disableResponse && (
          <CorrectAnswersContainer title={t("component.classification.dragItemsTitle")}>
            <DropContainer flag="dragItems" drop={drop} style={styles.dragItemsContainerStyle} noBorder>
              <FlexContainer style={{ width: "100%" }} alignItems="stretch" justifyContent="center">
                {group_possible_responses ? (
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
                          {i.title}
                        </Subtitle>
                        <FlexContainer justifyContent="center" style={{ width: "100%", flexWrap: "wrap" }}>
                          {i.map((ite, ind) =>
                            duplicate_responses ? (
                              <DragItem
                                dragHandle={show_drag_handle}
                                key={ind}
                                isTransparent={transparent_possible_responses}
                                preview={preview}
                                renderIndex={possible_responses.indexOf(ite)}
                                onDrop={onDrop}
                                item={ite}
                                disableResponse={disableResponse}
                                changePreviewTab={changePreviewTab}
                              />
                            ) : (
                              dragItems.includes(ite) && (
                                <DragItem
                                  dragHandle={show_drag_handle}
                                  key={ind}
                                  isTransparent={transparent_possible_responses}
                                  preview={preview}
                                  renderIndex={possible_responses.indexOf(ite)}
                                  onDrop={onDrop}
                                  item={ite}
                                  disableResponse={disableResponse}
                                  changePreviewTab={changePreviewTab}
                                />
                              )
                            )
                          )}
                        </FlexContainer>
                      </FlexContainer>
                      {index !== possible_response_groups.length - 1 && (
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
                          duplicate_responses ? (
                            <DragItem
                              dragHandle={show_drag_handle}
                              key={ind}
                              isTransparent={transparent_possible_responses}
                              preview={preview}
                              renderIndex={possible_responses.indexOf(ite)}
                              onDrop={onDrop}
                              item={ite}
                              disableResponse={disableResponse}
                              changePreviewTab={changePreviewTab}
                            />
                          ) : (
                            dragItems.includes(ite) && (
                              <DragItem
                                dragHandle={show_drag_handle}
                                key={ind}
                                isTransparent={transparent_possible_responses}
                                preview={preview}
                                renderIndex={possible_responses.indexOf(ite)}
                                onDrop={onDrop}
                                item={ite}
                                disableResponse={disableResponse}
                                changePreviewTab={changePreviewTab}
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

      {previewTab === SHOW && (
        <CorrectAnswersContainer title={t("component.classification.correctAnswers")}>
          {arrayOfCols.map((arr, i) => (
            <FlexContainer style={{ flexWrap: "wrap", marginBottom: 40 }}>
              <Subtitle style={styles.correctAnswersMargins}>
                <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: colTitles[i] }} />
              </Subtitle>
              {arr.map(index => (
                <div style={styles.itemContainerStyle} key={index}>
                  <IndexBox preview={preview}>{index + 1}</IndexBox>
                  <MathFormulaDisplay
                    style={getStyles(
                      false,
                      false,
                      theme.widgets.classification.boxBgColor,
                      theme.widgets.classification.boxBorderColor,
                      styles.previewItemStyle
                    )}
                    dangerouslySetInnerHTML={{ __html: posResp[index] }}
                  />
                </div>
              ))}
            </FlexContainer>
          ))}
          {arrayOfAltCols.map((arrays, ind) => (
            <Fragment key={ind}>
              <Subtitle style={{ marginBottom: 20, marginTop: 20 }}>{`${t(
                "component.classification.alternateAnswer"
              )} ${ind + 1}`}</Subtitle>
              {arrays.map((arr, i) => (
                <FlexContainer style={{ flexWrap: "wrap", marginBottom: 40 }}>
                  <Subtitle style={styles.correctAnswersMargins}>
                    <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: colTitles[i] }} />
                  </Subtitle>
                  {arr.map(index => (
                    <div style={styles.itemContainerStyle} key={index}>
                      <IndexBox preview={preview}>{index + 1}</IndexBox>
                      <MathFormulaDisplay
                        style={getStyles(
                          false,
                          false,
                          theme.widgets.classification.boxBgColor,
                          theme.widgets.classification.boxBorderColor,
                          styles.previewItemStyle
                        )}
                        dangerouslySetInnerHTML={{ __html: posResp[index] }}
                      />
                    </div>
                  ))}
                </FlexContainer>
              ))}
            </Fragment>
          ))}
        </CorrectAnswersContainer>
      )}
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
  userAnswer: PropTypes.any.isRequired,
  view: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  qIndex: PropTypes.number,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  changePreviewTab: PropTypes.func.isRequired
};

ClassificationPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  editCorrectAnswers: [],
  showQuestionNumber: false,
  qIndex: null,
  disableResponse: false
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ClassificationPreview);

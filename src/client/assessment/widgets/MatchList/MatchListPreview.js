import React, { useState, Fragment, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { connect } from "react-redux";
import { cloneDeep, isEqual, get, shuffle } from "lodash";
import { withTheme } from "styled-components";
import { compose } from "redux";
import {
  Paper,
  FlexContainer,
  CorrectAnswersContainer,
  Stimulus,
  Subtitle,
  CorItem,
  InstructorStimulus,
  MathFormulaDisplay,
  Checkbox
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import DropContainer from "../../components/DropContainer";
import { CHECK, SHOW, PREVIEW, CLEAR } from "../../constants/constantsForQuestions";
import DragItem from "./components/DragItem";
import { ListItem } from "./styled/ListItem";
import { Separator } from "./styled/Separator";
import { CorTitle } from "./styled/CorTitle";
import { AnswerItem } from "./styled/AnswerItem";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";
import { getFontSize, getDirection } from "../../utils/helpers";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

const styles = {
  dropContainerStyle: smallSize => ({
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: smallSize ? 26 : 44,
    maxWidth: "50%",
    padding: 0
  }),
  listItemContainerStyle: { width: "100%", marginBottom: 6, marginTop: 6 },
  dragItemsContainerStyle: {
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",
    minHeight: 140,
    borderRadius: 4
  }
};

const MatchListPreview = ({
  view,
  saveAnswer,
  userAnswer,
  item,
  t,
  previewTab,
  smallSize,
  editCorrectAnswers,
  theme,
  showQuestionNumber,
  qIndex,
  showBorder,
  setQuestionData
}) => {
  const {
    possible_responses: posResponses,
    possible_response_groups,
    group_possible_responses,
    stimulus,
    list,
    validation,
    shuffleOptions
  } = item;

  const alternateAnswers = {};
  if (validation.alt_responses && validation.alt_responses.length > 0) {
    const { alt_responses: altAnswers } = validation;
    altAnswers.forEach(altAnswer => {
      altAnswer.value.forEach((alt, index) => {
        alternateAnswers[index + 1] = alternateAnswers[index + 1] || [];
        if (alt && alt !== "") {
          alternateAnswers[index + 1].push(alt);
        }
      });
    });
  }

  const hasAlternateAnswers = Object.keys(alternateAnswers).length > 0;

  const itemValidation = item.validation || {};
  let validArray = itemValidation.valid_response && itemValidation.valid_response.value;
  validArray = validArray || [];
  const altArray = itemValidation.alt_responses || [];
  let groupArrays = [];

  possible_response_groups.forEach(o => {
    groupArrays = [...groupArrays, ...o.responses];
  });

  const possible_responses = group_possible_responses ? groupArrays : posResponses;

  const [ans, setAns] = useState(
    Array.isArray(userAnswer) && !userAnswer.every(answer => answer === null)
      ? userAnswer
      : Array.from({ length: list.length }).fill(null)
  );

  let [dragItems, setDragItems] = useState(
    possible_responses.filter(answer => Array.isArray(userAnswer) && !userAnswer.includes(answer))
  );

  useEffect(() => {
    setAns(
      Array.isArray(userAnswer) && !userAnswer.every(answer => answer === null)
        ? userAnswer
        : Array.from({ length: list.length }).fill(null)
    );
    setDragItems(possible_responses.filter(answer => Array.isArray(userAnswer) && !userAnswer.includes(answer)));
  }, [userAnswer, possible_responses]);

  if (editCorrectAnswers.length > 0) {
    if (
      !isEqual(ans, editCorrectAnswers) ||
      !isEqual(dragItems, possible_responses.filter(ite => !editCorrectAnswers.includes(ite)))
    ) {
      setAns(editCorrectAnswers);
      setDragItems(possible_responses.filter(ite => !editCorrectAnswers.includes(ite)));
    }
  }

  const drop = ({ flag, index }) => ({ flag, index });

  const onDrop = (itemCurrent, itemTo) => {
    const answers = cloneDeep(ans);
    const dItems = cloneDeep(dragItems);

    if (itemTo.flag === "ans") {
      if (dItems.includes(itemCurrent.item)) {
        dItems.splice(dItems.indexOf(itemCurrent.item), 1);
      }
      if (answers[itemTo.index] && answers[itemTo.index] !== itemCurrent.item) {
        dItems.push(ans[itemTo.index]);
      }
      if (answers.includes(itemCurrent.item)) {
        answers[answers.indexOf(itemCurrent.item)] = null;
      }

      answers[itemTo.index] = itemCurrent.item;
    } else if (answers.includes(itemCurrent.item)) {
      answers[answers.indexOf(itemCurrent.item)] = null;
      dItems.push(itemCurrent.item);
    }

    if (!isEqual(ans, answers)) {
      setAns(answers);
    }

    if (!isEqual(dItems, dragItems)) {
      setDragItems(dItems);
    }

    saveAnswer(answers);
  };

  const handleShuffleChange = useCallback(() => {
    setQuestionData(
      produce(item, draft => {
        draft.shuffleOptions = !item.shuffleOptions;
      })
    );
  }, [shuffleOptions]);

  const getStyles = ({ flag, preview, correct, isDragging }) => ({
    display: "flex",
    width: "auto",
    maxWidth: "220px",
    maxHeight: "140px",
    alignItems: "center",
    justifyContent: preview ? "space-between" : "center",
    margin: flag === "dragItems" ? "10px 15px 10px 15px" : "10px 0px 10px 0",
    background: preview
      ? correct
        ? theme.widgets.matchList.dragItemCorrectBgColor
        : theme.widgets.matchList.dragItemIncorrectBgColor
      : theme.widgets.matchList.dragItemBgColor,
    border: showBorder ? `1px solid ${theme.widgets.matchList.dragItemBorderColor}` : "unset",
    padding: preview ? 0 : "0 40px",
    cursor: "pointer",
    alignSelf: "stretch",
    borderRadius: 4,
    fontWeight: theme.widgets.matchList.dragItemFontWeight,
    color: theme.widgets.matchList.dragItemColor,
    opacity: isDragging ? 0.5 : 1
  });

  const preview = previewTab === CHECK || previewTab === SHOW;

  const validAnswers = ans.filter((ite, i) => ite === validArray[i]);

  let altAnswers = [...validAnswers];

  altArray.forEach(ite => {
    let res = [];

    res = ans.filter((an, i) => ite.value[i] === an);

    if (res.length > altAnswers.length) {
      altAnswers = res;
    }
  });

  const fontSize = getFontSize(get(item, "ui_style.fontsize", "normal"));
  const listPosition = get(item, "ui_style.possibility_list_position", "bottom");

  const wrapperStyle = {
    display: "flex",
    flexDirection: getDirection(listPosition),
    alignItems: listPosition === "right" || listPosition === "left" ? "center" : "initial"
  };

  if (shuffleOptions === true) {
    dragItems = shuffle(dragItems);
  }

  return (
    <Paper data-cy="matchListPreview" style={{ fontSize }} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>

      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
        {!smallSize && view === PREVIEW && <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />}
      </QuestionTitleWrapper>

      <div data-cy="previewWrapper" style={wrapperStyle}>
        <FlexContainer
          style={{
            flex: 3,
            marginRight: listPosition === "right" ? 20 : 0,
            marginLeft: listPosition === "left" ? 20 : 0
          }}
          flexDirection="column"
          alignItems="flex-start"
        >
          {list.map((ite, i) => (
            <AnswerItem
              key={i}
              style={styles.listItemContainerStyle}
              alignItems="center"
              childMarginRight={smallSize ? 13 : 45}
            >
              <ListItem smallSize={smallSize}>
                <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: ite }} />
              </ListItem>
              <Separator smallSize={smallSize} />
              <DropContainer
                noBorder={!!ans[i]}
                index={i}
                drop={drop}
                flag="ans"
                style={styles.dropContainerStyle(smallSize)}
              >
                <DragItem
                  preview={preview}
                  correct={altAnswers.includes(ans[i])}
                  flag="ans"
                  renderIndex={i}
                  onDrop={onDrop}
                  item={ans[i]}
                  getStyles={getStyles}
                />
              </DropContainer>
            </AnswerItem>
          ))}
        </FlexContainer>

        <CorrectAnswersContainer title={t("component.matchList.dragItemsTitle")}>
          <DropContainer drop={drop} flag="dragItems" style={styles.dragItemsContainerStyle} noBorder>
            <FlexContainer style={{ width: "100%" }} alignItems="stretch" justifyContent="center">
              {group_possible_responses ? (
                possible_response_groups.map((i, index) => (
                  <Fragment key={index}>
                    <FlexContainer
                      style={{ flex: 1 }}
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Subtitle
                        style={{
                          color: theme.widgets.matchList.previewSubtitleColor
                        }}
                      >
                        {i.title}
                      </Subtitle>
                      <FlexContainer justifyContent="center" style={{ width: "100%", flexWrap: "wrap" }}>
                        {i.responses.map(
                          (ite, ind) =>
                            dragItems.includes(ite) && (
                              <DragItem flag="dragItems" onDrop={onDrop} key={ind} item={ite} getStyles={getStyles} />
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
                          borderLeft: `1px solid ${theme.widgets.matchList.groupSeparatorBorderColor}`
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
                      {dragItems.map(
                        (ite, ind) =>
                          dragItems.includes(ite) && (
                            <DragItem
                              flag="dragItems"
                              onDrop={onDrop}
                              key={ind}
                              renderIndex={ind}
                              item={ite}
                              getStyles={getStyles}
                            />
                          )
                      )}
                    </FlexContainer>
                  </FlexContainer>
                </Fragment>
              )}
            </FlexContainer>
          </DropContainer>
        </CorrectAnswersContainer>
      </div>
      {view === "edit" && (
        <Checkbox
          className="additional-options"
          key={`shuffleOptions_${item.shuffleOptions}`}
          onChange={handleShuffleChange}
          label={t("component.cloze.dragDrop.shuffleoptions")}
          checked={item.shuffleOptions}
        />
      )}
      {previewTab === SHOW && (
        <Fragment>
          <CorrectAnswersContainer title={t("component.matchList.correctAnswers")}>
            {list.map((ite, i) => (
              <FlexContainer key={i} alignItems="center">
                <CorTitle>
                  <MathFormulaDisplay stem dangerouslySetInnerHTML={{ __html: ite }} />
                </CorTitle>
                <CorItem index={i}>
                  <MathFormulaDisplay choice dangerouslySetInnerHTML={{ __html: validArray[i] }} />
                </CorItem>
              </FlexContainer>
            ))}
          </CorrectAnswersContainer>

          {hasAlternateAnswers && (
            <CorrectAnswersContainer title={t("component.matchList.alternateAnswers")}>
              {Object.keys(alternateAnswers).map((key, i) => (
                <FlexContainer key={i} alignItems="center">
                  <CorItem index={i}>
                    <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: alternateAnswers[key].join(", ") }} />
                  </CorItem>
                </FlexContainer>
              ))}
            </CorrectAnswersContainer>
          )}
        </Fragment>
      )}
    </Paper>
  );
};

MatchListPreview.propTypes = {
  previewTab: PropTypes.string,
  editCorrectAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.array,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};

MatchListPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  editCorrectAnswers: [],
  userAnswer: [],
  showQuestionNumber: false,
  qIndex: null
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(MatchListPreview);

import React, { useState, Fragment, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import styled, { withTheme } from "styled-components";
import { connect } from "react-redux";
import { cloneDeep, isEqual, get, shuffle, identity, keyBy } from "lodash";
import { compose } from "redux";
import {
  FlexContainer,
  CorrectAnswersContainer,
  Stimulus,
  Subtitle,
  CorItem,
  MathFormulaDisplay,
  QuestionNumberLabel,
  AnswerContext,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
  AssessmentPlayerContext
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { ChoiceDimensions } from "@edulastic/constants";
import { HorizontalScrollContainer } from "@edulastic/common/src/components/DragScrollContainer";

import DropContainer from "../../components/DropContainer";
import Instructions from "../../components/Instructions";
import { CHECK, SHOW, PREVIEW, CLEAR, EDIT } from "../../constants/constantsForQuestions";
import DragItem from "./components/DragItem";
import { ListItem } from "./styled/ListItem";
import { Separator } from "./styled/Separator";
import { CorTitle } from "./styled/CorTitle";
import { AnswerItem } from "./styled/AnswerItem";
import { Index } from "./styled/Index";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import { GroupsSeparator } from "./styled/GroupsSeparator";
import { getFontSize, getDirection, getStemNumeration } from "../../utils/helpers";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { StyledPaperWrapper } from "../../styled/Widget";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";
import DragItems from "./components/DragItems";
import { storeOrderInRedux } from "../../actions/assessmentPlayer";

const { maxWidth: choiceDefaultMaxW, minWidth: choiceDefaultMinW } = ChoiceDimensions;

const styles = {
  dropContainerStyle: smallSize => ({
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    minHeight: smallSize ? 26 : 44,
    maxWidth: "50%",
    padding: 0
  }),
  listItemContainerStyle: { width: "100%", marginBottom: 6, marginTop: 6 }
};

/**
 * TODO
 * refactor the matchListPreview component
 * segregate components in separate files instead of accumulating everything in one mammoth file
 */
const MatchListPreview = ({
  view,
  saveAnswer,
  userAnswer,
  item,
  t,
  previewTab,
  smallSize,
  theme,
  showQuestionNumber,
  setQuestionData,
  disableResponse,
  changePreviewTab,
  changePreview,
  evaluation,
  isReviewTab,
  isPrintPreview,
  updateOptionsToStore,
  optionsFromStore
}) => {
  const {
    possibleResponses: posResponses,
    possibleResponseGroups,
    groupPossibleResponses,
    stimulus,
    list,
    validation,
    shuffleOptions,
    duplicatedResponses = false
  } = item;
  const answerContextConfig = useContext(AnswerContext);
  const assessmentPlayerContext = useContext(AssessmentPlayerContext);
  const { isStudentAttempt } = assessmentPlayerContext;
  const { expressGrader, isAnswerModifiable } = answerContextConfig;

  const validArray = get(item, "validation.validResponse.value", []);
  const altArray = get(item, "validation.altResponses", []);
  const stemNumeration = get(item, "uiStyle.validationStemNumeration", "");
  const dragItemMinWidth = get(item, "uiStyle.choiceMinWidth", choiceDefaultMinW);
  const dragItemMaxWidth = get(item, "uiStyle.choiceMaxWidth", choiceDefaultMaxW);

  const getPossibleResponses = () => {
    if (!groupPossibleResponses) {
      return shuffleOptions ? [...shuffle(posResponses)] : [...posResponses];
    }

    let groupArrays = [];
    possibleResponseGroups.forEach((group, groupIndex) => {
      let responses = shuffleOptions ? shuffle(group.responses) : group.responses;
      responses = responses.map(response => ({ ...response, groupIndex }));
      groupArrays = [...groupArrays, ...responses];
    });
    return groupArrays;
  };

  const [ans, setAns] = useState(
    Array.isArray(userAnswer) && !userAnswer.every(answer => answer === null)
      ? userAnswer
      : Array.from({ length: list.length }).fill(null)
  );

  function getInitialDragItems() {
    if (optionsFromStore) {
      return optionsFromStore;
    }
    if (duplicatedResponses) {
      return getPossibleResponses();
    }
    return getPossibleResponses().filter(answer => Array.isArray(userAnswer) && !userAnswer.includes(answer.value));
  }

  const [dragItems, setDragItems] = useState(getInitialDragItems());

  /**
   * drag items has flattned structure of all the responses
   * we need to group back, based on group index
   * required to segregate into different groups in the responses section
   */
  const possibleResponsesGrouped = () => {
    const groupArrays = [];
    dragItems.forEach(response => {
      const { groupIndex } = response;
      groupArrays[groupIndex] = groupArrays[groupIndex] || [];
      groupArrays[groupIndex].push(response);
    });
    return groupArrays;
  };

  const groupedPossibleResponses = possibleResponsesGrouped();

  /**
   * need ref to store the dragItems order
   * we need the order at which the user clicked on next button
   * this ref will be used to store the order in the redux, when component unmounts
   * relying on state values, does not work as state gets updated due to re-renders from other actions
   * values change in state due to useEffect
   * and during component unmount it has a different order, than what user last saw in the screen
   */
  const dragItemsRef = useRef(dragItems);

  /**
   * this ref is required to keep track if the user started to attempt
   * in that case we will not stop using the preserved order from the redux store
   */
  const userAttemptRef = useRef(false);

  useEffect(
    () =>
      /**
       * simulate component will unmount
       * during student attempt, only if shuffle is on
       * save the order of drag items in the redux store
       * so when user comes back to this question, show the responses in the preserved order
       * order is preserved until user attempts again, shuffle is done for every attempt
       * @see https://snapwiz.atlassian.net/browse/EV-14104
       */
      () => {
        if (isStudentAttempt && shuffleOptions) {
          updateOptionsToStore({ itemId: item.id, options: dragItemsRef.current });
        }
      },
    []
  );

  useEffect(() => {
    setAns(
      Array.isArray(userAnswer) && !userAnswer.every(answer => answer === null)
        ? userAnswer
        : Array.from({ length: list.length }).fill(null)
    );
    let newDragItems = duplicatedResponses
      ? getPossibleResponses()
      : getPossibleResponses().filter(answer => Array.isArray(userAnswer) && !userAnswer.some(i => i === answer.value));

    /**
     * at student side, if shuffle is on and if user comes back to this question
     * for subsequent renders, show the preserved order maintained in redux store
     * unless, user attempts the question again
     * store the order in a ref, which will be used to update in redux store, when component unmounts
     * @see https://snapwiz.atlassian.net/browse/EV-14104
     */
    if (isStudentAttempt && shuffleOptions) {
      if (!userAttemptRef.current && optionsFromStore) {
        newDragItems = optionsFromStore;
      }
      dragItemsRef.current = newDragItems;
    }
    setDragItems(newDragItems);
  }, [userAnswer, posResponses, possibleResponseGroups, duplicatedResponses]);

  const preview = previewTab === CHECK || previewTab === SHOW;

  const drop = ({ flag, index }) => ({ flag, index });

  const onDrop = (itemCurrent, itemTo) => {
    const answers = cloneDeep(ans);
    const answerIds = answers.map(i => i).filter(identity);
    const dItems = cloneDeep(dragItems);
    const { item: _item, sourceFlag, sourceIndex } = itemCurrent;

    if (isStudentAttempt && shuffleOptions) {
      userAttemptRef.current = true;
    }

    if (itemTo.flag === "ans") {
      if (dItems.includes(_item)) {
        dItems.splice(dItems.indexOf(_item), 1);
      }
      if (answers[itemTo.index] && answers[itemTo.index] !== _item) {
        dItems.push(ans[itemTo.index]);
      }
      if (sourceFlag === "ans") {
        answers[sourceIndex] = null;
      } else if (!duplicatedResponses && answers.includes(_item)) {
        answers[answers.indexOf(_item)] = null;
      }
      answers[itemTo.index] = _item.value;
    } else if (answerIds.includes(_item.value)) {
      answers[sourceIndex] = null;
      dItems.push(itemCurrent.item);
    }

    if (!isEqual(ans, answers)) {
      setAns(answers);
    }

    if (!isEqual(dItems, dragItems)) {
      setDragItems(dItems);
    }

    if (preview) {
      changePreview(CLEAR);
    }
    saveAnswer(answers);
  };

  const handleShuffleChange = () => {
    setQuestionData(
      produce(item, draft => {
        draft.shuffleOptions = !item.shuffleOptions;
      })
    );
  };

  const handleDuplicatedResponsesChange = () => {
    setQuestionData(
      produce(item, draft => {
        draft.duplicatedResponses = !item.duplicatedResponses;
      })
    );
  };

  const validAnswers = ans.filter((ite, i) => ite === validArray[i]);

  let altAnswers = [...validAnswers];

  altArray.forEach(ite => {
    let res = [];

    res = ans.filter((an, i) => ite.value[i] === an);

    if (res.length > altAnswers.length) {
      altAnswers = res;
    }
  });

  const allItemsById = keyBy(getPossibleResponses(), "value");

  const alternateAnswers = {};
  if (altArray.length > 0) {
    const { altResponses } = validation;
    altResponses.forEach(altAnswer => {
      altAnswer.value.forEach((alt, index) => {
        alternateAnswers[index + 1] = alternateAnswers[index + 1] || [];
        const altResp = allItemsById[alt];
        if (altResp && altResp.label) {
          alternateAnswers[index + 1].push(altResp.label);
        }
      });
    });
  }

  const hasAlternateAnswers = Object.keys(alternateAnswers).length > 0;

  /**
   * calculate styles here based on question JSON
   */
  const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"));
  const listPosition = get(item, "uiStyle.possibilityListPosition", "bottom");
  const horizontallyAligned = listPosition === "left" || listPosition === "right";

  const {
    answerBox: { borderWidth, borderStyle, borderColor }
  } = theme;

  const getStyles = ({ flag, _preview, correct, isDragging, width }) => ({
    display: "flex",
    width: width || "auto",
    alignItems: "center",
    justifyContent: _preview ? "space-between" : "flex-start",
    padding: flag === "dragItems" ? "10px 15px 10px 15px" : "5px",
    margin: flag === "dragItems" ? "4px" : "0px",
    background: _preview
      ? correct
        ? theme.widgets.matchList.dragItemCorrectBgColor
        : theme.widgets.matchList.dragItemIncorrectBgColor
      : theme.widgets.matchList.dragItemBgColor,
    border: _preview
      ? `${borderWidth} ${borderStyle} ${borderColor}`
      : flag === "ans"
      ? "none"
      : `2px dotted ${borderColor}`,
    cursor: "pointer",
    alignSelf: "stretch",
    borderRadius: 4,
    fontWeight: theme.widgets.matchList.dragItemFontWeight,
    color: theme.widgets.matchList.dragItemColor,
    opacity: isDragging ? 0.5 : 1,
    minWidth: dragItemMinWidth,
    overflow: "hidden",
    transform: "translate3d(0px, 0px, 0px)"
  });

  const direction = getDirection(listPosition);
  const wrapperStyle = {
    display: "flex",
    flexDirection: isPrintPreview && direction.includes("row") ? direction.replace(/row/gi, "column") : direction,
    alignItems: horizontallyAligned ? "flex-start" : "center",
    width: isPrintPreview ? "100%" : horizontallyAligned ? 1050 : 750,
    margin: "auto"
  };

  const responseBoxStyle = {
    marginRight: listPosition === "right" ? 20 : 0,
    marginLeft: listPosition === "left" ? 20 : 0,
    marginTop: horizontallyAligned ? 14 : 0,
    width: isPrintPreview ? "100%" : horizontallyAligned ? null : 750,
    flex: horizontallyAligned ? "auto" : null
  };

  const choicesBoxStyle = {
    width: isPrintPreview ? "100%" : horizontallyAligned ? null : 750,
    maxWidth: horizontallyAligned ? dragItemMaxWidth : null
  };

  const choicesBoxDropContainerStyle = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    minHeight: 140,
    borderRadius: 4,
    justifyContent: "center"
  };

  const choiceColStyle = {
    ...styles.dropContainerStyle(smallSize),
    width: `calc(50% - ${smallSize ? 28 : 40}px)`
  };

  const stemColStyle = {
    alignSelf: "stretch",
    width: `calc(50% - ${smallSize ? 28 : 40}px)`
  };

  if (isPrintPreview) {
    stemColStyle.maxWidth = stemColStyle.width;
    stemColStyle.width = "auto";
  }

  const correctAnswerBoxStyle = {
    width: isPrintPreview ? "100%" : horizontallyAligned ? 1050 : 750
  };

  const showEvaluate = (preview && !isAnswerModifiable && expressGrader) || (preview && !expressGrader);

  /**
   * scroll element
   */
  const previewWrapperRef = useRef();

  return (
    <StyledPaperWrapper
      data-cy="matchListPreview"
      style={{
        fontSize,
        overflowX: isPrintPreview ? "hidden" : "auto",
        margin: "auto",
        width: "100%"
      }}
      padding={smallSize}
      ref={previewWrapperRef}
      boxShadow={smallSize ? "none" : ""}
    >
      <FlexContainer justifyContent="flex-start" alignItems="baseline">
        <QuestionLabelWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
          {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
        </QuestionLabelWrapper>

        <QuestionContentWrapper>
          <QuestionTitleWrapper>
            {!smallSize && view === PREVIEW && <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />}
          </QuestionTitleWrapper>
          <div data-cy="previewWrapper" style={wrapperStyle} className="match-list-preview-wrapper">
            <FlexContainer style={responseBoxStyle} flexDirection="column" alignItems="flex-start">
              {list.map((ite, i) => (
                <AnswerItem
                  key={i}
                  style={styles.listItemContainerStyle}
                  alignItems="center"
                  childMarginRight={smallSize ? 13 : 45}
                >
                  <ListItem smallSize={smallSize} style={stemColStyle}>
                    <StyledMathFormulaDisplay dangerouslySetInnerHTML={{ __html: ite }} />
                  </ListItem>
                  <Separator smallSize={smallSize} />
                  <DropContainer
                    noBorder={!!ans[i]}
                    borderNone={showEvaluate && !!ans[i]}
                    index={i}
                    drop={drop}
                    flag="ans"
                    style={choiceColStyle}
                  >
                    <DragItem
                      preview={showEvaluate}
                      correct={evaluation[i]}
                      flag="ans"
                      renderIndex={i}
                      displayIndex={getStemNumeration(stemNumeration, i)}
                      onDrop={onDrop}
                      item={(ans[i] && allItemsById[ans[i]]) || null}
                      width="100%"
                      centerContent
                      getStyles={getStyles}
                      disableResponse={disableResponse || !isAnswerModifiable}
                      showAnswer={previewTab === SHOW}
                      changePreviewTab={changePreviewTab}
                    />
                  </DropContainer>
                </AnswerItem>
              ))}
            </FlexContainer>

            {!disableResponse && (
              <StyledCorrectAnswersContainer style={choicesBoxStyle} title={t("component.matchList.dragItemsTitle")}>
                <DropContainer drop={drop} flag="dragItems" style={choicesBoxDropContainerStyle} noBorder>
                  <FlexContainer alignItems="stretch" justifyContent="center" flexWrap="wrap" width="100%">
                    {groupPossibleResponses ? (
                      possibleResponseGroups.map((i, index) => (
                        <Fragment key={index}>
                          <FlexContainer
                            style={{ flex: 1 }}
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            width="100%"
                          >
                            <Subtitle
                              style={{
                                color: theme.widgets.matchList.previewSubtitleColor
                              }}
                            >
                              {i.title}
                            </Subtitle>
                            <FlexContainer
                              width="100%"
                              justifyContent="center"
                              flexWrap="wrap"
                              display={horizontallyAligned ? "inline-flex" : "flex"}
                              flexDirection={horizontallyAligned ? "column" : "row"}
                            >
                              {groupedPossibleResponses[index]?.map(
                                (ite, ind) =>
                                  dragItems.find(_item => _item.value === ite.value) && ( // Here we should shuffle in place
                                    <DragItem
                                      flag="dragItems"
                                      onDrop={onDrop}
                                      key={ind}
                                      item={ite}
                                      getStyles={getStyles}
                                      disableResponse={disableResponse || !isAnswerModifiable}
                                    />
                                  )
                              )}
                            </FlexContainer>
                          </FlexContainer>
                          {index !== possibleResponseGroups.length - 1 && (
                            <GroupsSeparator horizontallyAligned={horizontallyAligned} />
                          )}
                        </Fragment>
                      ))
                    ) : (
                      <Fragment>
                        <FlexContainer
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="flex-start"
                          maxWidth="100%"
                        >
                          <FlexContainer
                            maxWidth="100%"
                            flexWrap="wrap"
                            justifyContent="center"
                            display={horizontallyAligned ? "inline-flex" : "flex"}
                            flexDirection={horizontallyAligned ? "column" : "row"}
                            alignItems={horizontallyAligned ? "baseline" : "center"}
                          >
                            <DragItems
                              dragItems={dragItems}
                              onDropHandler={onDrop}
                              getStyles={getStyles}
                              disableResponse={disableResponse || !isAnswerModifiable}
                              changePreviewTab={changePreviewTab}
                              shuffleOptions={shuffleOptions}
                              previewTab={previewTab}
                            />
                          </FlexContainer>
                        </FlexContainer>
                      </Fragment>
                    )}
                  </FlexContainer>
                </DropContainer>
              </StyledCorrectAnswersContainer>
            )}
          </div>
          {view === "edit" && (
            <FlexContainer>
              <CheckboxLabel
                className="additional-options"
                key={`shuffleOptions_${item.shuffleOptions}`}
                onChange={handleShuffleChange}
                checked={item.shuffleOptions}
              >
                {t("component.cloze.dragDrop.shuffleoptions")}
              </CheckboxLabel>
              <CheckboxLabel
                className="additional-options"
                key="duplicatedResponses"
                onChange={handleDuplicatedResponsesChange}
                checked={!!item.duplicatedResponses}
              >
                {t("component.matchList.duplicatedResponses")}
              </CheckboxLabel>
            </FlexContainer>
          )}
          <div style={{ ...wrapperStyle, alignItems: "flex-start" }}>
            {view !== EDIT && <Instructions item={item} />}
          </div>
          {previewTab === SHOW || isReviewTab ? (
            <Fragment>
              <StyledCorrectAnswersContainer
                title={t("component.matchList.correctAnswers")}
                style={correctAnswerBoxStyle}
              >
                {list.map((ite, i) => (
                  <FlexContainer key={i} marginBottom="10px" alignItems="center">
                    <CorTitle>
                      <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: ite }} />
                    </CorTitle>
                    <Separator smallSize={smallSize} correctAnswer />
                    <CorItem>
                      <Index preview correctAnswer>
                        {getStemNumeration(stemNumeration, i)}
                      </Index>
                      <MathFormulaDisplay
                        choice
                        dangerouslySetInnerHTML={{
                          __html: allItemsById?.[validArray?.[i]]?.label || ""
                        }}
                      />
                    </CorItem>
                  </FlexContainer>
                ))}
              </StyledCorrectAnswersContainer>

              {hasAlternateAnswers && (
                <StyledCorrectAnswersContainer
                  title={t("component.matchList.alternateAnswers")}
                  style={correctAnswerBoxStyle}
                >
                  {Object.keys(alternateAnswers).map((key, i) => (
                    <FlexContainer key={i} marginBottom="10px" alignItems="center">
                      <CorTitle>
                        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: list[i] }} />
                      </CorTitle>
                      <Separator smallSize={smallSize} correctAnswer />
                      <CorItem>
                        <Index preview correctAnswer>
                          {getStemNumeration(stemNumeration, i)}
                        </Index>
                        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: alternateAnswers[key].join(", ") }} />
                      </CorItem>
                    </FlexContainer>
                  ))}
                </StyledCorrectAnswersContainer>
              )}
            </Fragment>
          ) : null}
          <HorizontalScrollContainer scrollWrraper={previewWrapperRef.current} />
        </QuestionContentWrapper>
      </FlexContainer>
    </StyledPaperWrapper>
  );
};

MatchListPreview.propTypes = {
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.array,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  changePreview: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  evaluation: PropTypes.array,
  isReviewTab: PropTypes.bool
};

MatchListPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  userAnswer: [],
  evaluation: [],
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme,
  connect(
    (state, ownProps) => ({
      optionsFromStore: state.assessmentPlayer?.[ownProps?.item.id || ""] || null
    }),
    {
      setQuestionData: setQuestionDataAction,
      updateOptionsToStore: storeOrderInRedux
    }
  )
);

export default enhance(MatchListPreview);

const StyledMathFormulaDisplay = styled(MathFormulaDisplay)`
  color: ${props => props.theme.widgets.matchList.dragItemColor};
`;

const StyledCorrectAnswersContainer = styled(CorrectAnswersContainer)`
  margin: 20px auto;
  background-color: ${props => props.theme.widgets.matchList.containerBgColor};
  & > h3 {
    color: ${props => props.theme.widgets.matchList.dragItemColor};
  }
`;

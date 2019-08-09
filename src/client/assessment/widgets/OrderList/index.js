import React, { Fragment, useMemo, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import { get } from "lodash";
import styled, { withTheme } from "styled-components";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import {
  Paper,
  InstructorStimulus,
  CorrectAnswersContainer,
  FlexContainer,
  MathFormulaDisplay,
  QuestionNumberLabel,
  AnswerContext
} from "@edulastic/common";

import { Text } from "./styled/Text";
import { Index } from "./styled/Index";
import { ItemsWrapper } from "./styled/ItemsWrapper";

import CorrectAnswers from "../../components/CorrectAnswers";
import QuillSortableList from "../../components/QuillSortableList";
import { QuestionHeader } from "../../styled/QuestionHeader";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT, PREVIEW, CHECK, SHOW, CLEAR } from "../../constants/constantsForQuestions";
import withPoints from "../../components/HOC/withPoints";
import OrderListPreview from "./components/OrderListPreview";
import OrderListReport from "./components/OrderListReport";
import Options from "./components/Options";
import { getFontSize } from "../../utils/helpers";
import { replaceVariables, updateVariables } from "../../utils/variables";
import { ContentArea } from "../../styled/ContentArea";

import ComposeQuestion from "./ComposeQuestion";
import ListComponent from "./ListComponent";
import { CorrectAnswerItem } from "./components/OrderListReport/styled/CorrectAnswerItem";
import { QuestionText } from "./styled/QuestionText";

const EmptyWrapper = styled.div``;

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const OptionsList = withPoints(QuillSortableList);

const OrderList = ({
  qIndex,
  view,
  previewTab,
  smallSize,
  item,
  userAnswer,
  testItem,
  evaluation,
  setQuestionData,
  saveAnswer,
  showQuestionNumber,
  isSidebarCollapsed,
  advancedAreOpen,
  fillSections,
  cleanSections,
  theme,
  disableResponse,
  t,
  changePreviewTab,
  isReviewTab
}) => {
  const [correctTab, setCorrectTab] = useState(0);
  const answerContext = useContext(AnswerContext);

  useEffect(() => {
    if (userAnswer.length === 0) {
      const { list = [] } = item;
      saveAnswer(list.map((q, i) => i));
    }
  }, [item, userAnswer]);

  const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"));
  const styleType = get(item, "uiStyle.type", "button");
  const axis = styleType === "inline" ? "xy" : "y";
  const columns = styleType === "inline" ? 3 : 1;

  const handleCorrectSortEnd = ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.value = arrayMove(draft.validation.validResponse.value, oldIndex, newIndex);
        } else {
          draft.validation.altResponses[correctTab - 1].value = arrayMove(
            draft.validation.altResponses[correctTab - 1].value,
            oldIndex,
            newIndex
          );
        }
      })
    );
  };

  const onSortPreviewEnd = ({ oldIndex, newIndex }) => {
    const newPreviewList = arrayMove(userAnswer, oldIndex, newIndex);
    changePreviewTab();

    saveAnswer(newPreviewList);
  };

  const handleAddAltResponse = () => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.push({
          score: 1,
          value: draft.list.map((q, i) => i)
        });

        setCorrectTab(correctTab + 1);
      })
    );
  };

  const handleDeleteAltAnswers = index => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(index, 1);

        setCorrectTab(0);
        updateVariables(draft);
      })
    );
  };

  const handleUpdatePoints = points => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = points;
        } else {
          draft.validation.altResponses[correctTab - 1].score = points;
        }
        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      fontSize={fontSize}
      axis={axis}
      centerContent
      data-cy="match-option-list"
      prefix="options2"
      readOnly
      items={
        correctTab === 0
          ? item.validation.validResponse.value.map(ind => item.list[ind])
          : item.validation.altResponses[correctTab - 1].value.map(ind => item.list[ind])
      }
      onSortEnd={handleCorrectSortEnd}
      useDragHandle
      columns={columns}
      styleType={styleType}
      points={
        correctTab === 0 ? item.validation.validResponse.score : item.validation.altResponses[correctTab - 1].score
      }
      onChangePoints={handleUpdatePoints}
      canDelete={false}
    />
  );

  const onTabChange = (index = 0) => {
    setCorrectTab(index);
  };

  if (!item) return null;

  const itemForPreview = useMemo(() => replaceVariables(item), [item]);
  const correctAnswers = get(itemForPreview, "validation.validResponse.value", []);

  const Wrapper = testItem ? EmptyWrapper : Paper;

  const hasAltAnswers =
    itemForPreview &&
    itemForPreview.validation &&
    itemForPreview.validation.altResponses &&
    itemForPreview.validation.altResponses.length > 0;

  const alternateAnswers = {};

  if (hasAltAnswers) {
    const altAnswers = itemForPreview.validation.altResponses;
    altAnswers.forEach(altAnswer => {
      altAnswer.value.forEach((alt, index) => {
        alternateAnswers[index + 1] = alternateAnswers[index + 1] || [];
        if (alt !== "") {
          alternateAnswers[index + 1].push(itemForPreview.list[alt]);
        }
      });
    });
  }

  let initialAnswers;
  if (answerContext.expressGrader) {
    initialAnswers = disableResponse ? correctAnswers : userAnswer;
  } else {
    initialAnswers = userAnswer.length > 0 ? userAnswer : correctAnswers;
  }

  const evaluationFromAnswers = userAnswer.map((answer, index) => {
    if (answer === correctAnswers[index]) {
      return true;
    }

    if (hasAltAnswers) {
      for (const altAnswers of itemForPreview.validation.altResponses) {
        if (altAnswers.value[index] === answer) {
          return true;
        }
      }
    }

    return false;
  });

  return (
    <Fragment>
      {view === EDIT && (
        <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
          <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />
          <ListComponent
            saveAnswer={saveAnswer}
            item={item}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <CorrectAnswers
            onTabChange={onTabChange}
            correctTab={correctTab}
            onAdd={handleAddAltResponse}
            validation={item.validation}
            options={renderOptions()}
            onCloseTab={handleDeleteAltAnswers}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <Options advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Wrapper>
          <InstructorStimulus>{itemForPreview.instructorStimulus}</InstructorStimulus>

          <QuestionTitleWrapper>
            {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
            <QuestionHeader
              qIndex={qIndex}
              smallSize={smallSize}
              padding="0px"
              dangerouslySetInnerHTML={{ __html: itemForPreview.stimulus }}
            />
          </QuestionTitleWrapper>

          {previewTab === CHECK && (
            <OrderListReport
              onSortEnd={onSortPreviewEnd}
              questionsList={itemForPreview.list}
              previewIndexesList={userAnswer}
              evaluation={evaluation || (item && item.activity ? item.activity.evaluation : evaluation)}
              listStyle={{ fontSize }}
              styleType={styleType}
              axis={axis}
              columns={columns}
              helperClass="sortableHelper"
            />
          )}

          {previewTab === SHOW || isReviewTab ? (
            <Fragment>
              <OrderListReport
                onSortEnd={onSortPreviewEnd}
                questionsList={itemForPreview.list}
                previewIndexesList={userAnswer}
                evaluation={evaluationFromAnswers}
                validation={itemForPreview.validation}
                list={itemForPreview.list}
                styleType={styleType}
                listStyle={{ fontSize }}
                disableResponse={disableResponse}
                axis={axis}
                columns={columns}
                helperClass="sortableHelper"
              />
              <CorrectAnswersContainer title={t("component.orderlist.correctanswer")}>
                <ItemsWrapper styleType={styleType}>
                  {correctAnswers.map((correctAnswer, i) => (
                    <CorrectAnswerItem theme={theme}>
                      <Text>
                        <Index>{i + 1}</Index>
                        <FlexContainer justifyContent="center" style={{ width: "100%" }}>
                          <QuestionText>
                            <MathFormulaDisplay
                              dangerouslySetInnerHTML={{ __html: itemForPreview.list[correctAnswer] }}
                            />
                          </QuestionText>
                        </FlexContainer>
                      </Text>
                    </CorrectAnswerItem>
                  ))}
                </ItemsWrapper>
              </CorrectAnswersContainer>

              {hasAltAnswers && (
                <CorrectAnswersContainer title={t("component.orderlist.alternateAnswer")}>
                  <ItemsWrapper styleType={styleType}>
                    {Object.keys(alternateAnswers).map(key => (
                      <CorrectAnswerItem theme={theme}>
                        <Text>
                          <Index>{key}</Index>
                          <FlexContainer justifyContent="center" style={{ width: "100%" }}>
                            <QuestionText>
                              <MathFormulaDisplay
                                dangerouslySetInnerHTML={{ __html: alternateAnswers[key].join(", ") }}
                              />
                            </QuestionText>
                          </FlexContainer>
                        </Text>
                      </CorrectAnswerItem>
                    ))}
                  </ItemsWrapper>
                </CorrectAnswersContainer>
              )}
            </Fragment>
          ) : null}

          {previewTab === CLEAR && (
            <OrderListPreview
              onSortEnd={onSortPreviewEnd}
              questions={initialAnswers.map(index => itemForPreview.list && itemForPreview.list[index])}
              smallSize={smallSize}
              listStyle={{ fontSize }}
              styleType={styleType}
              axis={axis}
              columns={columns}
              disableResponse={disableResponse}
              helperClass="sortableHelper"
            />
          )}
        </Wrapper>
      )}
    </Fragment>
  );
};

OrderList.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  qIndex: PropTypes.any.isRequired,
  evaluation: PropTypes.any,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool,
  isReviewTab: PropTypes.bool
};

OrderList.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: "",
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme,
  withNamespaces("assessment"),
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    { setQuestionData: setQuestionDataAction }
  )
);

const OrderListContainer = enhance(OrderList);

export { OrderListContainer as OrderList };

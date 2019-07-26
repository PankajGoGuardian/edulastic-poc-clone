import React, { Fragment, useMemo, useState, useEffect } from "react";
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
  MathFormulaDisplay
} from "@edulastic/common";

import { Text } from "./styled/Text";
import { Index } from "./styled/Index";

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

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
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

  useEffect(() => {
    if (userAnswer.length === 0) {
      const { list = [] } = item;
      saveAnswer(list.map((q, i) => i));
    }
  }, [item, userAnswer]);

  const fontSize = getFontSize(get(item, "ui_style.fontsize", "normal"));
  const styleType = get(item, "ui_style.type", "button");
  const axis = styleType === "inline" ? "xy" : "y";
  const columns = styleType === "inline" ? 3 : 1;

  const handleCorrectSortEnd = ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.value = arrayMove(draft.validation.valid_response.value, oldIndex, newIndex);
        } else {
          draft.validation.alt_responses[correctTab - 1].value = arrayMove(
            draft.validation.alt_responses[correctTab - 1].value,
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
        draft.validation.alt_responses.push({
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
        draft.validation.alt_responses.splice(index, 1);

        setCorrectTab(0);
        updateVariables(draft);
      })
    );
  };

  const handleUpdatePoints = points => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.score = points;
        } else {
          draft.validation.alt_responses[correctTab - 1].score = points;
        }
        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      fontSize={fontSize}
      axis={axis}
      data-cy="match-option-list"
      prefix="options2"
      readOnly
      items={
        correctTab === 0
          ? item.validation.valid_response.value.map(ind => item.list[ind])
          : item.validation.alt_responses[correctTab - 1].value.map(ind => item.list[ind])
      }
      onSortEnd={handleCorrectSortEnd}
      useDragHandle
      columns={columns}
      styleType={styleType}
      points={
        correctTab === 0 ? item.validation.valid_response.score : item.validation.alt_responses[correctTab - 1].score
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
  const correctAnswers = get(itemForPreview, "validation.valid_response.value", []);

  const Wrapper = testItem ? EmptyWrapper : Paper;

  const hasAltAnswers =
    itemForPreview &&
    itemForPreview.validation &&
    itemForPreview.validation.alt_responses &&
    itemForPreview.validation.alt_responses.length > 0;

  const alternateAnswers = {};

  if (hasAltAnswers) {
    const altAnswers = itemForPreview.validation.alt_responses;
    altAnswers.forEach(altAnswer => {
      altAnswer.value.forEach((alt, index) => {
        alternateAnswers[index + 1] = alternateAnswers[index + 1] || [];
        if (alt !== "") {
          alternateAnswers[index + 1].push(itemForPreview.list[alt]);
        }
      });
    });
  }
  const initialAnswers = disableResponse ? correctAnswers : userAnswer;

  const evaluationFromAnswers = userAnswer.map((answer, index) => {
    if (answer === correctAnswers[index]) {
      return true;
    }

    if (hasAltAnswers) {
      for (const altAnswers of itemForPreview.validation.alt_responses) {
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
          <InstructorStimulus>{itemForPreview.instructor_stimulus}</InstructorStimulus>

          <QuestionTitleWrapper>
            {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
            <QuestionHeader
              qIndex={qIndex}
              smallSize={smallSize}
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
              />
              <CorrectAnswersContainer title={t("component.orderlist.correctanswer")}>
                {correctAnswers.map((correctAnswer, i) => (
                  <CorrectAnswerItem theme={theme}>
                    <Text>
                      <FlexContainer>
                        <Index>{i + 1}</Index>
                        <QuestionText>
                          <MathFormulaDisplay
                            dangerouslySetInnerHTML={{ __html: itemForPreview.list[correctAnswer] }}
                          />
                        </QuestionText>
                      </FlexContainer>
                    </Text>
                  </CorrectAnswerItem>
                ))}
              </CorrectAnswersContainer>

              {hasAltAnswers && (
                <CorrectAnswersContainer title={t("component.orderlist.alternateAnswer")}>
                  {Object.keys(alternateAnswers).map(key => (
                    <CorrectAnswerItem theme={theme}>
                      <Text>
                        <FlexContainer>
                          <Index>{key}</Index>
                          <QuestionText>
                            <MathFormulaDisplay
                              dangerouslySetInnerHTML={{ __html: alternateAnswers[key].join(", ") }}
                            />
                          </QuestionText>
                        </FlexContainer>
                      </Text>
                    </CorrectAnswerItem>
                  ))}
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

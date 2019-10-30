/* eslint-disable react/prop-types */
import React, { Fragment, useMemo, useState, useContext } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import { get, isEmpty } from "lodash";
import styled, { withTheme } from "styled-components";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import {
  CorrectAnswersContainer,
  FlexContainer,
  MathFormulaDisplay,
  QuestionTitle,
  AnswerContext
} from "@edulastic/common";

import { Text } from "./styled/Text";
import { Index } from "./styled/Index";
import { ItemsWrapper } from "./styled/ItemsWrapper";

import CorrectAnswers from "../../components/CorrectAnswers";
import QuillSortableList from "../../components/QuillSortableList";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT, PREVIEW, CHECK, SHOW, CLEAR } from "../../constants/constantsForQuestions";
import withPoints from "../../components/HOC/withPoints";
import OrderListPreview from "./components/OrderListPreview";
import OrderListReport from "./components/OrderListReport";
import Options from "./components/Options";
import { getFontSize, getStemNumeration } from "../../utils/helpers";
import { replaceVariables, updateVariables } from "../../utils/variables";
import { ContentArea } from "../../styled/ContentArea";

import ComposeQuestion from "./ComposeQuestion";
import ListComponent from "./ListComponent";
import { CorrectAnswerItem } from "./components/OrderListReport/styled/CorrectAnswerItem";
import { QuestionText } from "./styled/QuestionText";
import { StyledPaperWrapper } from "../../styled/Widget";

const EmptyWrapper = styled.div``;

const OptionsList = withPoints(QuillSortableList);

const OrderList = ({
  view,
  previewTab,
  smallSize,
  item,
  userAnswer: _userAnswer,
  testItem,
  evaluation,
  setQuestionData,
  saveAnswer,
  showQuestionNumber,
  advancedAreOpen,
  fillSections,
  cleanSections,
  theme,
  disableResponse,
  t,
  changePreviewTab,
  advancedLink,
  isReviewTab
}) => {
  const [correctTab, setCorrectTab] = useState(0);
  const answerContext = useContext(AnswerContext);

  const userAnswer = !isEmpty(_userAnswer) ? _userAnswer : get(item, "list", []).map((_, i) => i);

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

  const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper;

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
    initialAnswers = userAnswer.length > 0 ? userAnswer : itemForPreview?.list?.map((q, i) => i);
  }

  const evaluationForCheckAnswer = evaluation || (item && item.activity ? item.activity.evaluation : evaluation);

  const checkAnswerOptionComponent = isEmpty(evaluationForCheckAnswer) ? (
    <OrderListPreview
      onSortEnd={onSortPreviewEnd}
      questions={initialAnswers?.map(index => itemForPreview.list && itemForPreview.list[index])}
      smallSize={smallSize}
      listStyle={{ fontSize }}
      styleType={styleType}
      axis={axis}
      columns={columns}
      disableResponse={disableResponse}
      helperClass="sortableHelper"
      lockToContainerEdges
      lockOffset={["10%", "0%"]}
      lockAxis={item?.uiStyle?.type === "inline" ? undefined : "y"}
    />
  ) : (
    <OrderListReport
      onSortEnd={onSortPreviewEnd}
      questionsList={itemForPreview.list}
      previewIndexesList={userAnswer}
      evaluation={evaluationForCheckAnswer}
      validation={itemForPreview.validation}
      list={itemForPreview.list}
      styleType={styleType}
      listStyle={{ fontSize }}
      disableResponse={disableResponse}
      axis={axis}
      columns={columns}
      helperClass="sortableHelper"
      item={item}
    />
  );

  return (
    <Fragment>
      {view === EDIT && (
        <ContentArea>
          <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />
          <ListComponent item={item} fillSections={fillSections} cleanSections={cleanSections} />
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

          {advancedLink}

          <Options advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Wrapper>
          <QuestionTitle
            show={showQuestionNumber}
            label={item.qLabel}
            stimulus={itemForPreview.stimulus}
            smallSize={smallSize}
          />

          {previewTab === CHECK && checkAnswerOptionComponent}

          {previewTab === SHOW || isReviewTab ? (
            <Fragment>
              {checkAnswerOptionComponent}
              <CorrectAnswersContainer title={t("component.orderlist.correctanswer")}>
                <ItemsWrapper styleType={styleType} columns={columns}>
                  {correctAnswers.map((correctAnswer, i) => (
                    <CorrectAnswerItem theme={theme}>
                      <Text>
                        <Index>{getStemNumeration(item.uiStyle?.validationStemNumeration, i)}</Index>
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
                  <ItemsWrapper styleType={styleType} columns={columns}>
                    {Object.keys(alternateAnswers).map((key, i) => (
                      <CorrectAnswerItem theme={theme}>
                        <Text>
                          <Index>{getStemNumeration(item.uiStyle?.validationStemNumeration, i)}</Index>
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
              lockToContainerEdges
              lockOffset={["10%", "0%"]}
              lockAxis={item?.uiStyle?.type === "inline" ? undefined : "y"}
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
  userAnswer: PropTypes.any.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool,
  advancedLink: PropTypes.any,
  isReviewTab: PropTypes.bool
};

OrderList.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  testItem: false,
  evaluation: "",
  advancedLink: null,
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
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

const OrderListContainer = enhance(OrderList);

export { OrderListContainer as OrderList };

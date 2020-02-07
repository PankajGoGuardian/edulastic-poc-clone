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
import { CorrectAnswersContainer, QuestionNumberLabel, AnswerContext, ScrollContext } from "@edulastic/common";

import CorrectAnswers from "../../components/CorrectAnswers";
import QuillSortableList from "../../components/QuillSortableList";
import { QuestionHeader } from "../../styled/QuestionHeader";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT, PREVIEW, SHOW, CLEAR, CHECK } from "../../constants/constantsForQuestions";
import withPoints from "../../components/HOC/withPoints";
import OrderListPreview from "./components/OrderListPreview";
import Options from "./components/Options";
import { getFontSize, getStemNumeration } from "../../utils/helpers";
import { replaceVariables, updateVariables } from "../../utils/variables";
import { ContentArea } from "../../styled/ContentArea";

import ComposeQuestion from "./ComposeQuestion";
import ListComponent from "./ListComponent";
import { StyledPaperWrapper } from "../../styled/Widget";
import Question from "../../components/Question";

const EmptyWrapper = styled.div``;

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const OptionsContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  .orderlist-set-correct-answer {
    ${({ styleType }) =>
      styleType === "inline" &&
      `
      display: flex;
      overflow-x: auto;
    `}
    .sortable-item-container {
      ${({ styleType }) =>
        styleType === "inline" &&
        `
        flex: 1;
        min-width: 200px;
        max-width: 400px;
      `}
    }
  }
`;

const OptionsList = withPoints(QuillSortableList);

const OrderList = ({
  qIndex,
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
  disableResponse,
  t,
  changePreviewTab,
  advancedLink,
  isReviewTab
}) => {
  const [correctTab, setCorrectTab] = useState(0);
  const answerContext = useContext(AnswerContext);
  const scrollContext = useContext(ScrollContext);
  const scrollContainer = scrollContext.getScrollElement();

  const userAnswer = !isEmpty(_userAnswer) ? _userAnswer : get(item, "list", []).map((_, i) => i);

  const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"));
  const uiStyle = get(item, "uiStyle", {});
  const styleType = get(item, "uiStyle.type", "button");
  const axis = styleType === "inline" ? "x" : "y";
  const columns = styleType === "inline" ? 3 : 1;
  const validResponse = get(item, "validation.validResponse", { value: [] });
  const altResponses = get(item, `validation.altResponses[${correctTab - 1}]`, { value: [] });

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

  const renderOptions = view === EDIT && scrollContainer && (
    <OptionsContainer styleType={styleType}>
      <OptionsList
        fontSize={fontSize}
        axis={axis}
        centerContent
        data-cy="match-option-list"
        prefix="options2"
        readOnly
        items={
          correctTab === 0
            ? validResponse.value.map(ind => item.list[ind])
            : altResponses.value.map(ind => item.list[ind])
        }
        onSortEnd={handleCorrectSortEnd}
        useDragHandle
        columns={columns}
        styleType={styleType}
        points={correctTab === 0 ? validResponse.score : altResponses.score}
        lockToContainerEdges
        lockOffset={["10%", "10%"]}
        lockAxis={uiStyle.type === "inline" ? "x" : "y"}
        getContainer={styleType !== "inline" ? () => scrollContainer : null}
        onChangePoints={handleUpdatePoints}
        canDelete={false}
        className="orderlist-set-correct-answer"
      />
    </OptionsContainer>
  );

  const onTabChange = (index = 0) => {
    setCorrectTab(index);
  };

  if (!item) return null;

  const itemForPreview = useMemo(() => replaceVariables(item), [item]);
  const correctAnswers = get(itemForPreview, "validation.validResponse.value", []);
  const hasAltAnswers = get(itemForPreview, "validation.altResponses", []).length > 0;
  const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper;

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

  let initialAnswers = [];
  if (answerContext.expressGrader) {
    initialAnswers = disableResponse ? correctAnswers : userAnswer;
  } else {
    initialAnswers = userAnswer.length > 0 ? userAnswer : get(itemForPreview, "list", []).map((q, i) => i);
  }

  const evaluationForCheckAnswer = evaluation || (item && item.activity ? item.activity.evaluation : evaluation);

  const previewProps = {
    smallSize,
    listStyle: { fontSize },
    columns,
    uiStyle,
    styleType,
    disableResponse,
    getStemNumeration,
    onSortEnd: onSortPreviewEnd,
    axis,
    helperClass: "sortableHelper",
    lockToContainerEdges: true,
    lockOffset: ["10%", "10%"],
    lockAxis: uiStyle.type === "inline" ? "x" : "y",
    getContainer: uiStyle.type === "inline" ? null : () => scrollContainer
  };

  return (
    <Fragment>
      {view === EDIT && (
        <ContentArea columns={columns}>
          <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />
          <ListComponent
            getContainer={() => scrollContainer}
            item={item}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <Question
            section="main"
            label={t("component.orderlist.setcorrectanswers")}
            fillSections={fillSections}
            cleanSections={cleanSections}
          >
            <CorrectAnswers
              onTabChange={onTabChange}
              correctTab={correctTab}
              onAdd={handleAddAltResponse}
              validation={item.validation}
              options={renderOptions}
              onCloseTab={handleDeleteAltAnswers}
              fillSections={fillSections}
              cleanSections={cleanSections}
              questionType={item?.title}
            />
          </Question>

          {advancedLink}

          <Options
            advancedAreOpen={advancedAreOpen}
            fillSections={fillSections}
            cleanSections={cleanSections}
            item={item}
          />
        </ContentArea>
      )}
      {view === PREVIEW && scrollContainer && (
        <Wrapper>
          <QuestionTitleWrapper>
            {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
            <QuestionHeader
              qIndex={qIndex}
              smallSize={smallSize}
              padding="0px"
              dangerouslySetInnerHTML={{ __html: itemForPreview.stimulus }}
            />
          </QuestionTitleWrapper>

          {previewTab === CLEAR && (
            <OrderListPreview
              {...previewProps}
              questions={initialAnswers.map(index => itemForPreview.list && itemForPreview.list[index])}
            />
          )}

          {(previewTab === CHECK || previewTab === SHOW) && (
            <OrderListPreview
              {...previewProps}
              evaluation={evaluationForCheckAnswer}
              questions={userAnswer.map(index => itemForPreview.list[index])}
            />
          )}

          {previewTab === SHOW || isReviewTab ? (
            <Fragment>
              <CorrectAnswersContainer title={t("component.orderlist.correctanswer")}>
                <OrderListPreview
                  {...previewProps}
                  showAnswer
                  questions={correctAnswers.map(index => itemForPreview.list[index])}
                />
              </CorrectAnswersContainer>

              {hasAltAnswers && (
                <CorrectAnswersContainer title={t("component.orderlist.alternateAnswer")}>
                  <OrderListPreview
                    {...previewProps}
                    showAnswer
                    questions={Object.keys(alternateAnswers).map(key => alternateAnswers[key].join(", "))}
                  />
                </CorrectAnswersContainer>
              )}
            </Fragment>
          ) : null}
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
  qIndex: PropTypes.any.isRequired,
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
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

const OrderListContainer = enhance(OrderList);

export { OrderListContainer as OrderList };

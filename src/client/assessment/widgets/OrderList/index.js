import React, { Fragment, useMemo, useState, useContext } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import { get, isEmpty, sortBy, keys } from "lodash";
import styled, { withTheme } from "styled-components";
import produce from "immer";
import { withNamespaces } from "@edulastic/localization";
import {
  CorrectAnswersContainer,
  QuestionNumberLabel,
  AnswerContext,
  ScrollContext,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper
} from "@edulastic/common";

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
import Instructions from "../../components/Instructions";
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

const convertArrToObj = arr => arr.reduce((acc, curr, currIndex) => ({ ...acc, [curr]: currIndex }), {});

const convertObjToArr = obj => {
  let arr = keys(obj).map(key => ({ id: key, index: obj[key] }));
  arr = sortBy(arr, ite => ite.index);
  return arr;
};

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
  isReviewTab,
  isPrintPreview
}) => {
  const [correctTab, setCorrectTab] = useState(0);
  const answerContext = useContext(AnswerContext);
  const scrollContext = useContext(ScrollContext);
  const scrollContainer = scrollContext.getScrollElement();

  const options = get(item, "list", {});
  const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"));
  const uiStyle = get(item, "uiStyle", {});
  const styleType = get(item, "uiStyle.type", "button");
  const axis = styleType === "inline" ? "x" : "y";
  const columns = styleType === "inline" ? 3 : 1;
  const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper;

  const validResponse = get(item, "validation.validResponse", { value: {} });
  const altResponses = get(item, `validation.altResponses[${correctTab - 1}]`, { value: [] });
  let answersToEdit = correctTab === 0 ? validResponse.value : altResponses.value;
  answersToEdit = convertObjToArr(answersToEdit);

  const handleCorrectSortEnd = ({ oldIndex, newIndex }) => {
    let newCorrectAnswer = arrayMove(answersToEdit, oldIndex, newIndex);
    newCorrectAnswer = newCorrectAnswer.reduce((acc, curr, currIndex) => ({ ...acc, [curr.id]: currIndex }), {});
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.value = newCorrectAnswer;
        } else {
          draft.validation.altResponses[correctTab - 1].value = newCorrectAnswer;
        }
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

  const handleAddAltResponse = () => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.push({
          score: 1,
          value: keys(draft.list).reduce((acc, curr, currIndex) => ({ ...acc, [curr]: currIndex }), {})
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

  // providing props width with value 230px same as min-width provided in PointsInput
  // fixes the issue with PointsInput taking full width
  const renderOptions = view === EDIT && scrollContainer && (
    <OptionsContainer styleType={styleType}>
      <OptionsList
        fontSize={fontSize}
        width="230px"
        placement={{ position: "absolute", top: "70px" }}
        axis={axis}
        data-cy="match-option-list"
        prefix="options2"
        readOnly
        items={answersToEdit.map(ite => options[ite.id])}
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
  // ------------------ Item Preivew Start ------------------ //
  const itemForPreview = useMemo(() => replaceVariables(item), [item]);
  const correctAnswers = get(itemForPreview, "validation.validResponse.value", {});
  const hasAltAnswers = get(itemForPreview, "validation.altResponses", []).length > 0;
  const alternateAnswers = {};

  let userAnswer = correctAnswers;
  if (!answerContext.expressGrader) {
    userAnswer = !isEmpty(_userAnswer) ? _userAnswer : convertArrToObj(keys(get(item, "list", {})));
  }
  const userAnswerToShow = keys(userAnswer);
  const correctAnswersToShow = convertObjToArr(correctAnswers).map(ans => itemForPreview.list[ans.id]);

  const onSortPreviewEnd = ({ oldIndex, newIndex }) => {
    const newUserAnswer = convertArrToObj(arrayMove(userAnswerToShow, oldIndex, newIndex));
    changePreviewTab();
    saveAnswer(newUserAnswer);
  };

  if (hasAltAnswers) {
    const altAnswers = itemForPreview.validation.altResponses;
    altAnswers.forEach(altAnswer => {
      convertObjToArr(altAnswer.value).forEach((alt, index) => {
        alternateAnswers[index + 1] = alternateAnswers[index + 1] || [];
        if (alt !== "") {
          alternateAnswers[index + 1].push(itemForPreview.list[alt.id]);
        }
      });
    });
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
    options: itemForPreview.list || {},
    getContainer: uiStyle.type === "inline" && scrollContainer ? null : () => scrollContainer,
    isPrintPreview
  };
  // ------------------ Item Preivew End ------------------ //

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
          <FlexContainer justifyContent="flex-start" alignItems="baseline">
            <QuestionLabelWrapper>
              {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
              {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
            </QuestionLabelWrapper>

            <QuestionContentWrapper>
              <QuestionTitleWrapper>
                <QuestionHeader
                  qIndex={qIndex}
                  smallSize={smallSize}
                  padding="0px"
                  dangerouslySetInnerHTML={{ __html: itemForPreview.stimulus }}
                />
              </QuestionTitleWrapper>
              {previewTab === CLEAR && <OrderListPreview {...previewProps} questions={userAnswerToShow} />}

              {(previewTab === CHECK || previewTab === SHOW) && (
                <OrderListPreview
                  {...previewProps}
                  evaluation={evaluationForCheckAnswer}
                  questions={userAnswerToShow}
                />
              )}

              {view !== EDIT && <Instructions item={item} />}
              {previewTab === SHOW || isReviewTab ? (
                <Fragment>
                  <CorrectAnswersContainer title={t("component.orderlist.correctanswer")}>
                    <OrderListPreview {...previewProps} showAnswer questions={correctAnswersToShow} />
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
            </QuestionContentWrapper>
          </FlexContainer>
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

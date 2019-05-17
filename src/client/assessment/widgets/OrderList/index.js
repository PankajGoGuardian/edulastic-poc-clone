import React, { Fragment, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import { get } from "lodash";
import styled from "styled-components";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import { Paper, InstructorStimulus } from "@edulastic/common";

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

const EmptyWrapper = styled.div``;

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
  t,
  setQuestionData,
  saveAnswer,
  isSidebarCollapsed,
  advancedAreOpen,
  fillSections,
  cleanSections
}) => {
  const [correctTab, setCorrectTab] = useState(0);
  useEffect(() => {
    if (userAnswer.length === 0) {
      const { list = [] } = item;
      saveAnswer(list.map((q, i) => i));
    }
  }, [item, userAnswer]);

  const fontSize = getFontSize(get(item, "ui_style.fontsize", "normal"));
  const styleType = get(item, "ui_style.type", "list");
  const axis = styleType === "inline" ? "x" : "y";
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
      points={
        correctTab === 0 ? item.validation.valid_response.score : item.validation.alt_responses[correctTab - 1].score
      }
      onChangePoints={handleUpdatePoints}
    />
  );

  const onTabChange = (index = 0) => {
    setCorrectTab(index);
  };

  if (!item) return null;

  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  const Wrapper = testItem ? EmptyWrapper : Paper;
  return (
    <Fragment>
      {view === EDIT && (
        <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
          <Fragment>
            <Paper padding="0px" boxShadow="none">
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
                marginBottom="-50px"
              />
            </Paper>
            <Options advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
          </Fragment>
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Wrapper>
          <InstructorStimulus>{itemForPreview.instructor_stimulus}</InstructorStimulus>
          <QuestionHeader
            qIndex={qIndex}
            smallSize={smallSize}
            dangerouslySetInnerHTML={{ __html: itemForPreview.stimulus }}
          />

          {previewTab === CHECK && (
            <OrderListReport
              onSortEnd={onSortPreviewEnd}
              questionsList={itemForPreview.list}
              previewIndexesList={userAnswer}
              evaluation={evaluation}
              listStyle={{ fontSize }}
              axis={axis}
              columns={columns}
            />
          )}

          {previewTab === SHOW && (
            <OrderListReport
              onSortEnd={onSortPreviewEnd}
              questionsList={itemForPreview.list}
              previewIndexesList={userAnswer}
              showAnswers
              evaluation={evaluation}
              validation={itemForPreview.validation}
              list={itemForPreview.list}
              listStyle={{ fontSize }}
              axis={axis}
              columns={columns}
            />
          )}

          {previewTab === CLEAR && (
            <OrderListPreview
              onSortEnd={onSortPreviewEnd}
              questions={userAnswer.map(index => itemForPreview.list && itemForPreview.list[index])}
              smallSize={smallSize}
              listStyle={{ fontSize }}
              axis={axis}
              columns={columns}
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
  t: PropTypes.func.isRequired,
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
  advancedAreOpen: PropTypes.bool
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
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    { setQuestionData: setQuestionDataAction }
  )
);

const OrderListContainer = enhance(OrderList);

export { OrderListContainer as OrderList };

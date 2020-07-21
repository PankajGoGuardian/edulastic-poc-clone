import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";

import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { updateVariables } from "../../utils/variables";

import withPoints from "../../components/HOC/withPoints";
import QuillSortableList from "../../components/QuillSortableList/index";
import CorrectAnswers from "../../components/CorrectAnswers";

import AdvancedOptions from "./components/AdvancedOptions";
import ComposeQuestion from "./ComposeQuestion";
import ListLabels from "./ListLabels";
import ListComponent from "./ListComponent";
import Question from "../../components/Question";

const OptionsList = withPoints(QuillSortableList);

const EditSortList = ({ item, setQuestionData, advancedLink, advancedAreOpen, fillSections, cleanSections, t }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleUiStyleChange = (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.uiStyle) {
          draft.uiStyle = {};
        }
        draft.uiStyle[prop] = value;
        updateVariables(draft);
      })
    );
  };

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }
        draft.validation.altResponses.push({
          score: 1,
          value: [...Array(item.source ? item.source.length : 0).keys()]
        });
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);

        setCorrectTab(0);
        updateVariables(draft);
      })
    );
  };

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

  const handlePointsChange = val => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = val;
        } else {
          draft.validation.altResponses[correctTab - 1].score = val;
        }

        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      prefix="options"
      readOnly
      canDelete={false}
      items={
        correctTab === 0
          ? item.validation.validResponse.value.map(ind => item.source[ind])
          : item.validation.altResponses[correctTab - 1].value.map(ind => item.source[ind])
      }
      onSortEnd={handleCorrectSortEnd}
      useDragHandle
      columns={1}
      points={
        correctTab === 0 ? item.validation.validResponse.score : item.validation.altResponses[correctTab - 1].score
      }
      onChangePoints={handlePointsChange}
      isCorrectAnsTab={correctTab === 0}
    />
  );

  return (
    <Fragment>
      <Paper padding="0px" boxShadow="none">
        <ComposeQuestion
          item={item}
          setQuestionData={setQuestionData}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
        <ListLabels
          item={item}
          setQuestionData={setQuestionData}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
        <ListComponent
          item={item}
          setQuestionData={setQuestionData}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
        <Question
          section="main"
          label={t("component.sortList.correctAnswers")}
          fillSections={fillSections}
          cleanSections={cleanSections}
        >
          <CorrectAnswers
            onTabChange={setCorrectTab}
            correctTab={correctTab}
            readOnly
            onAdd={handleAddAnswer}
            validation={item.validation}
            options={renderOptions()}
            onCloseTab={handleCloseTab}
            fillSections={fillSections}
            cleanSections={cleanSections}
            questionType={item?.title}
          />
        </Question>
      </Paper>

      {advancedLink}

      <AdvancedOptions
        item={item}
        onUiChange={handleUiStyleChange}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />
    </Fragment>
  );
};

EditSortList.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  t: PropTypes.func.isRequired
};

EditSortList.defaultProps = {
  advancedAreOpen: false,
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(EditSortList);

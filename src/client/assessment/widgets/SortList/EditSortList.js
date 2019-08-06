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
import { Widget } from "../../styled/Widget";

import AdvancedOptions from "./components/AdvancedOptions";
import ComposeQuestion from "./ComposeQuestion";
import ListComponent from "./ListComponent";

const OptionsList = withPoints(QuillSortableList);

const EditSortList = ({ item, setQuestionData, advancedAreOpen, fillSections, cleanSections }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleUiStyleChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, draft => {
        draft.uiStyle[prop] = uiStyle;
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
          value: item.validation.validResponse.value
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
        <ListComponent
          item={item}
          setQuestionData={setQuestionData}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
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
        />
      </Paper>
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
  cleanSections: PropTypes.func
};

EditSortList.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(EditSortList);

import React, { useEffect, useState } from "react";
import { message, Button } from "antd";
import { compose } from "redux";
import { connect } from "react-redux";
import { KeyBy } from "lodash";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { testItemsApi } from "@edulastic/api";
import { evaluateItem } from "./src/utils/evalution";
import { addItemEvaluationAction } from "./src/actions/testItem";
import { changePreviewAction, changeViewAction } from "./src/actions/view";
import TestItemPreview from "../assessment/components/TestItemPreview";

const ItemPlayer = ({ match, answers, addEvaluation, changePreview, evaluation, view }) => {
  const [testItem, setTestItem] = useState(null);

  useEffect(() => {
    const { id: itemId } = match.params;
    testItemsApi
      .getByV1Id(itemId)
      .then(setTestItem)
      .catch(() => message.error("invalid test Item"));
  }, [match.params]);

  const evaluate = async () => {
    try {
      const { questions = [] } = testItem.data;
      changePreview("check");
      const { evaluation: evals, score, maxScore } = await evaluateItem(
        answers,
        KeyBy(questions, "id"),
        testItem.itemLevelScoring,
        testItem.itemLevelScore
      );
      addEvaluation(evals);
      message.success(`score: ${+score.toFixed(2)}/${maxScore}`);
    } catch (e) {
      console.log(e);
      message.error("evaluation failed");
    }
  };

  const clear = () => {
    changePreview("clear");
  };

  if (!testItem) {
    return <div> Loading... </div>;
  }

  const { questions = [], resources = [] } = testItem.data;
  const allItems = KeyBy([...questions, ...resources], "id");

  return (
    <div>
      <TestItemPreview cols={testItem.rows} questions={allItems} preview={view} evaluation={evaluation} />
      <Button onClick={evaluate}> Check Answer </Button>
      <Button onClick={clear}> Clear </Button>
    </div>
  );
};

ItemPlayer.propTypes = {
  match: PropTypes.object.isRequired,
  answers: PropTypes.object.isRequired,
  addEvaluation: PropTypes.func.isRequired,
  changePreview: PropTypes.func.isRequired,
  evaluation: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  connect(
    state => ({
      answers: state.answers,
      evaluation: state.evaluation,
      view: state.view.preview
    }),
    {
      addEvaluation: addItemEvaluationAction,
      changePreview: changePreviewAction,
      changeView: changeViewAction
    }
  )
)(ItemPlayer);

import React, { useEffect, useState } from "react";
import { message, Button } from "antd";
import { KeyBy } from "lodash";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { testItemsApi } from "@edulastic/api";
import TestItemPreview from "../assessment/components/TestItemPreview";

const ItemPlayer = ({ match }) => {
  const [testItem, setTestItem] = useState(null);

  useEffect(() => {
    const { id: itemId } = match.params;

    testItemsApi
      .getByV1Id(itemId)
      .then(setTestItem)
      .catch(() => message.error("invalid test Item"));
  }, []);

  const checkAnswer = () => {
    console.log("checking answer");
    message.success("checking answer");
  };

  if (!testItem) {
    return <div> Loading... </div>;
  }

  const { questions = [], resources = [] } = testItem.data;
  const allItems = KeyBy([...questions, ...resources], "id");

  return (
    <div>
      <TestItemPreview cols={testItem.rows} questions={allItems} />
      <Button onClick={checkAnswer}> Check Answer </Button>
    </div>
  );
};

ItemPlayer.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(ItemPlayer);

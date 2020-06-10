import React from "react";
import produce from "immer";
import PropTypes from "prop-types";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { FroalaEditor } from "@edulastic/common";

import Question from "../../../Question";
import { Subtitle } from "../../../../styled/Subtitle";

const ComposeQuestion = ({ fillSections, cleanSections, t, stimulus, title, setQuestionData, item }) => {
  const onChangeQuestion = data => {
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = data;
      })
    );
  };

  return (
    <Question
      section="main"
      label={t("common.question.composeQuestion")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle id={getFormattedAttrId(`${title}-${t("common.question.composeQuestion")}`)}>
        {t("common.question.composeQuestion")}
      </Subtitle>

      <FroalaEditor
        tag="textarea"
        placeholder={t("common.question.questionPlaceholder")}
        value={stimulus}
        toolbarId="question-text-area"
        onChange={onChangeQuestion}
        border="border"
      />
    </Question>
  );
};

ComposeQuestion.propTypes = {
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string.isRequired,
  title: PropTypes.string,
  setQuestionData: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired
};

ComposeQuestion.defaultProps = {
  title: "graph-placement"
};

export default ComposeQuestion;

import React from "react";

import Question from "../../../components/Question/index";
import { Subtitle } from "../../../styled/Subtitle";
import { FroalaEditor } from "@edulastic/common";

const ComposeQuestion = ({ fillSections, cleanSections, t, stimulus, setQuestionData, produce, item }) => {
  const onChangeQuestion = stimulus => {
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
      })
    );
  };
  return (
    <Question
      section="main"
      label={t("component.fractionEditor.composeQuestion")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle>{t("component.fractionEditor.composeQuestion")}</Subtitle>
      <FroalaEditor
        tag="textarea"
        placeholder={t("component.fractionEditor.questionPlaceholder")}
        value={stimulus}
        toolbarId={"toolbarId"}
        onChange={onChangeQuestion}
        border="border"
      />
    </Question>
  );
};

export default ComposeQuestion;

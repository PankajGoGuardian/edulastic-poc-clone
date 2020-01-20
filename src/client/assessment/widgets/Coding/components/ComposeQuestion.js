import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import produce from "immer";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";
import Question from "../../../components/Question";

import { Subtitle } from "../../../styled/Subtitle";
import { updateVariables } from "../../../utils/variables";
import { SubtitleContainer, StyledSectionContainer, StyledTextField, StyledTitle, StyledFroalaEditor } from "../styled";

const styles = {
  padding: 0,
  background: "none"
};

const ComposeQuestion = ({ t, item, toolbarId, fillSections, cleanSections, fontSize, setQuestionData }) => {
  const onChangeQuestionTitle = e => {
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = e.target.value;
        updateVariables(draft);
      })
    );
  };

  const onChangeQuestion = stimulus => {
    setQuestionData(
      produce(item, draft => {
        draft.stimulusBody = stimulus;
        updateVariables(draft);
      })
    );
  };

  return (
    <Question
      dataCy="questiontext"
      questionTextArea
      section="main"
      label={t("component.coding.composeQuestion")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      styles={styles}
    >
      <SubtitleContainer>
        <Subtitle
          id={getFormattedAttrId(`${item?.title}-${t("component.coding.composeQuestion")}`)}
          textStyles={{ margin: "0" }}
          showIcon={false}
        >
          {t("component.coding.composeQuestion")}
        </Subtitle>
      </SubtitleContainer>
      <StyledSectionContainer>
        <StyledTitle>{t("component.coding.questionTitle")}</StyledTitle>
        <StyledTextField
          type="text"
          name="title"
          placeholder={t("component.coding.questionTitlePlaceholder")}
          value={item.stimulus}
          onChange={onChangeQuestionTitle}
          disabled={false}
        />
        <StyledFroalaEditor
          tag="textarea"
          placeholder={t("component.coding.questionPlaceholder")}
          value={item.stimulusBody}
          toolbarId={toolbarId}
          onChange={onChangeQuestion}
          border="border"
          fontSize={fontSize}
        />
      </StyledSectionContainer>
    </Question>
  );
};

ComposeQuestion.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  toolbarId: PropTypes.string,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  setQuestionData: PropTypes.func.isRequired
};

ComposeQuestion.defaultProps = {
  toolbarId: "compose-question",
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(ComposeQuestion);

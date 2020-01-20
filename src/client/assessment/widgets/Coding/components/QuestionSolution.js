import React, { Component } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import produce from "immer";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";

import Question from "../../../components/Question";

import { Subtitle } from "../../../styled/Subtitle";
import { StyledButton } from "../styled";
import { updateVariables } from "../../../utils/variables";
import { SubtitleContainer, StyledSectionContainer, StyledTextField, StyledTitle } from "../styled";
import CodeEditor from "./CodeEditor";
import CodeEvaluatedResponse from "./CodeEvaluatedResponse";

const styles = {
  padding: 0,
  background: "none"
};

const QuestionSolution = ({ fillSections, cleanSections, item, setQuestionData, t }) => {
  return (
    <Question
      dataCy="codingstub"
      section="main"
      label={t("component.coding.codeSolution")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      styles={styles}
    >
      <SubtitleContainer>
        <Subtitle
          id={getFormattedAttrId(`${item?.title}-${t("component.coding.codeSolution")}`)}
          textStyles={{ margin: "0", width: "100%" }}
          showIcon={false}
        >
          {t("component.coding.codeSolution")}
        </Subtitle>
      </SubtitleContainer>
      <StyledSectionContainer style={{ paddingLeft: 0, paddingRight: 0 }}>
        <CodeEditor type="solutions" item={item} setQuestionData={setQuestionData} />
        <CodeEvaluatedResponse dataSource={[]} />
      </StyledSectionContainer>
    </Question>
  );
};

QuestionSolution.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

QuestionSolution.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(QuestionSolution);

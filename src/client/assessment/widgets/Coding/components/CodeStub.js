import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";

import Question from "../../../components/Question";

import { Subtitle } from "../../../styled/Subtitle";
import { StyledButton } from "../styled";
import { SubtitleContainer, StyledSectionContainer, StyledTextField, StyledTitle } from "../styled";
import CodeEditor from "./CodeEditor";
import CodeEvaluatedResponse from "./CodeEvaluatedResponse";

const styles = {
  padding: 0,
  background: "none"
};

const CodeStub = ({ fillSections, cleanSections, item, setQuestionData, t }) => {
  const handleAddNewTestCase = () => {};

  return (
    <Question
      dataCy="codingstub"
      section="main"
      label={t("component.coding.codeStub")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      styles={styles}
    >
      <SubtitleContainer>
        <Subtitle
          id={getFormattedAttrId(`${item?.title}-${t("component.coding.codeStub")}`)}
          textStyles={{ margin: "0", width: "100%" }}
          showIcon={false}
        >
          {t("component.coding.codeStub")}
          <StyledButton onClick={handleAddNewTestCase}>{t("component.coding.codeStubGenerateBtn")}</StyledButton>
        </Subtitle>
      </SubtitleContainer>
      <StyledSectionContainer style={{ paddingLeft: 0, paddingRight: 0 }}>
        <CodeEditor type="codeStubs" item={item} setQuestionData={setQuestionData} />
        <CodeEvaluatedResponse dataSource={[]} />
      </StyledSectionContainer>
    </Question>
  );
};

CodeStub.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

CodeStub.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(CodeStub);

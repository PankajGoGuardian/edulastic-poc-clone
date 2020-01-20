import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";

import Question from "../../../components/Question";

import { Subtitle } from "../../../styled/Subtitle";
import { StyledButton } from "../styled";
import { updateVariables } from "../../../utils/variables";
import { SubtitleContainer, StyledSectionContainer, StyledRadio, StyledRadioGroup } from "../styled";
import TestCasesTable from "./TestCasesTable";

const styles = {
  padding: 0,
  background: "none"
};

const TestCases = ({ setQuestionData, fillSections, cleanSections, item, t }) => {
  const handleAddNewTestCase = () => {};
  const onEditTestCase = id => {};
  const handleDeleteTestCase = id => {};

  const onChange = e => {
    setQuestionData(
      produce(item, draft => {
        draft.testCases.evaluationType = e.target.value;
        updateVariables(draft);
      })
    );
  };

  const renderContent = type => {
    if (type === "auto") {
      return (
        <TestCasesTable
          data={item.testCases?.values}
          onEditTestCase={onEditTestCase}
          handleDeleteTestCase={handleDeleteTestCase}
        />
      );
    } else {
      return <div>Manual</div>;
    }
  };

  return (
    <Question
      dataCy="codingtestcases"
      section="main"
      label={t("component.coding.testCases.title")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      styles={styles}
    >
      <SubtitleContainer>
        <Subtitle
          id={getFormattedAttrId(`${item?.title}-${t("component.coding.testCases.title")}`)}
          textStyles={{ margin: "0", width: "100%" }}
          showIcon={false}
        >
          {t("component.coding.testCases.title")}
          <StyledButton onClick={handleAddNewTestCase}>{t("component.coding.testCases.addtestCase")}</StyledButton>
        </Subtitle>
      </SubtitleContainer>
      <StyledSectionContainer>
        <StyledRadioGroup onChange={onChange} value={item.testCases.evaluationType}>
          <StyledRadio value="auto">{t("component.coding.testCases.evaluationOptions.auto")}</StyledRadio>
          <StyledRadio value="manual">{t("component.coding.testCases.evaluationOptions.manual")}</StyledRadio>
        </StyledRadioGroup>
        {renderContent(item.testCases.evaluationType)}
      </StyledSectionContainer>
    </Question>
  );
};

TestCases.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

TestCases.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(TestCases);

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";
import PropTypes from "prop-types";
import React from "react";
import { themeColor } from "@edulastic/colors";
import Question from "../../../components/Question";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";
import { Subtitle } from "../../../styled/Subtitle";
import { RadioLabel, RadioLabelGroup } from "../../../styled/RadioWithLabel";
import { Row } from "../../../styled/WidgetOptions/Row";
import { updateVariables } from "../../../utils/variables";
import TestCasesTable from "./TestCasesTable";

const TestCases = ({ setQuestionData, fillSections, cleanSections, item, t }) => {
  const handleAddNewTestCase = () => {};
  const onEditTestCase = () => {};
  const handleDeleteTestCase = () => {};

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
    }
    return <div>Manual</div>;
  };

  return (
    <Question
      dataCy="codingtestcases"
      section="main"
      label={t("component.coding.testCases.title")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(`${item?.title}-${t("component.coding.testCases.title")}`)}
        textStyles={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        showIcon
      >
        {t("component.coding.testCases.title")}
        <CustomStyleBtn bg={themeColor} height="30px" width="auto" margin="0px" onClick={handleAddNewTestCase}>
          {t("component.coding.testCases.addtestCase")}
        </CustomStyleBtn>
      </Subtitle>

      <Row>
        <RadioLabelGroup onChange={onChange} value={item.testCases.evaluationType}>
          <RadioLabel value="auto">{t("component.coding.testCases.evaluationOptions.auto")}</RadioLabel>
          <RadioLabel value="manual">{t("component.coding.testCases.evaluationOptions.manual")}</RadioLabel>
        </RadioLabelGroup>
        {renderContent(item.testCases.evaluationType)}
      </Row>
    </Question>
  );
};

TestCases.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

TestCases.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(TestCases);

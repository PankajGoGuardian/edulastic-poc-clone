import React, { useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import uuid from "uuid/v4";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import Question from "../../../components/Question";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";
import { Subtitle } from "../../../styled/Subtitle";
import { RadioLabel, RadioLabelGroup } from "../../../styled/RadioWithLabel";
import { Row } from "../../../styled/WidgetOptions/Row";
import { updateVariables } from "../../../utils/variables";
import TestCasesTable from "./TestCasesTable";
import TestCaseForm from "./TestCaseForm";
import { themeColor } from "@edulastic/colors";

const TestCases = ({ setQuestionData, fillSections, cleanSections, item, t }) => {
  const [showAddTestCaseModal, setShowAddTestCaseModal] = useState(false);
  const [itemIdToEdit, setItemIdToEdit] = useState();
  const toggleAddNewTestCase = () => {
    setItemIdToEdit();
    setShowAddTestCaseModal(!showAddTestCaseModal);
  };
  const onEditTestCase = id => {
    setItemIdToEdit(id);
    setShowAddTestCaseModal(true);
  };

  const handleDeleteTestCase = id => {
    setQuestionData(
      produce(item, draft => {
        draft.testCases = draft.testCases.filter(tc => tc.id !== id);
        updateVariables(draft);
      })
    );
  };

  const handleUpsertTestCase = data => {
    setQuestionData(
      produce(item, draft => {
        if (data.id) {
          draft.testCases = draft.testCases.map(tc => {
            if (tc.id === data.id) {
              return data;
            }
            return tc;
          });
        } else {
          draft.testCases.push({ id: uuid(), ...data });
        }
        updateVariables(draft);
        setItemIdToEdit();
        setShowAddTestCaseModal(!showAddTestCaseModal);
      })
    );
  };

  const onChange = e => {
    setQuestionData(
      produce(item, draft => {
        draft.testCaseEvaluationType = e.target.value;
        updateVariables(draft);
      })
    );
  };

  const renderContent = type => {
    if (type === "auto") {
      return (
        <TestCasesTable
          data={item.testCases}
          onEditTestCase={onEditTestCase}
          handleDeleteTestCase={handleDeleteTestCase}
        />
      );
    }
    return <div>Manual</div>;
  };

  const itemToEdit = item.testCases.find(tc => tc.id === itemIdToEdit);

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
        <CustomStyleBtn bg={themeColor} height="30px" width="auto" margin="0px" onClick={toggleAddNewTestCase}>
          {t("component.coding.testCases.addtestCase")}
        </CustomStyleBtn>
      </Subtitle>

      <Row>
        <RadioLabelGroup onChange={onChange} value={item.testCaseEvaluationType}>
          <RadioLabel value="auto">{t("component.coding.testCases.evaluationOptions.auto")}</RadioLabel>
          <RadioLabel value="manual">{t("component.coding.testCases.evaluationOptions.manual")}</RadioLabel>
        </RadioLabelGroup>
        {renderContent(item.testCaseEvaluationType)}
      </Row>
      {showAddTestCaseModal && (
        <TestCaseForm onClose={toggleAddNewTestCase} onSave={handleUpsertTestCase} item={itemToEdit} />
      )}
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

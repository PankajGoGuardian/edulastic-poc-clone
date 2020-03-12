import { themeColor } from "@edulastic/colors";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import Question from "../../../components/Question";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";
import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "../../../styled/WidgetOptions/Row";
import CodeEditor from "./CodeEditor";
import CodeEvaluatedResponse from "./CodeEvaluatedResponse";

const CodeStub = ({ fillSections, cleanSections, item, setQuestionData, t }) => {
  const handleAddNewTestCase = () => {};

  return (
    <Question
      dataCy="codingstub"
      section="main"
      label={t("component.coding.codeStub")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(`${item?.title}-${t("component.coding.codeStub")}`)}
        textStyles={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        showIcon
      >
        {t("component.coding.codeStub")}
        <CustomStyleBtn bg={themeColor} height="30px" width="auto" margin="0px" onClick={handleAddNewTestCase}>
          {t("component.coding.codeStubGenerateBtn")}
        </CustomStyleBtn>
      </Subtitle>

      <Row>
        <CodeEditor type="codeStubs" item={item} setQuestionData={setQuestionData} />
        <CodeEvaluatedResponse dataSource={[]} />
      </Row>
    </Question>
  );
};

CodeStub.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

CodeStub.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(CodeStub);

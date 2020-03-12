import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React from "react";
import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "../../../styled/WidgetOptions/Row";
import CodeEditor from "./CodeEditor";
import CodeEvaluatedResponse from "./CodeEvaluatedResponse";

const QuestionSolution = ({ fillSections, cleanSections, item, setQuestionData, t }) => (
  <Question
    dataCy="codingstub"
    section="main"
    label={t("component.coding.codeSolution")}
    fillSections={fillSections}
    cleanSections={cleanSections}
  >
    <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.coding.codeSolution")}`)} showIcon>
      {t("component.coding.codeSolution")}
    </Subtitle>
    <Row>
      <CodeEditor type="solutions" item={item} setQuestionData={setQuestionData} />
      <CodeEvaluatedResponse dataSource={[]} />
    </Row>
  </Question>
);

QuestionSolution.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

QuestionSolution.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(QuestionSolution);

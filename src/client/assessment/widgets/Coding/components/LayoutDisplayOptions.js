import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";
import PropTypes from "prop-types";
import React from "react";
import Question from "../../../components/Question";
import { RadioLabel, RadioLabelGroup } from "../../../styled/RadioWithLabel";
import { Subtitle } from "../../../styled/Subtitle";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Row } from "../../../styled/WidgetOptions/Row";
import { updateVariables } from "../../../utils/variables";

const LayoutDisplayOptions = ({ fillSections, cleanSections, item, setQuestionData, t }) => {
  const onChange = e => {
    setQuestionData(
      produce(item, draft => {
        draft.layout = e.target.value;
        updateVariables(draft);
      })
    );
  };

  return (
    <Question
      dataCy="codingstub"
      section="main"
      label={t("component.coding.codeDisplayOptions.title")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      sectionId="codinglayouts"
    >
      <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.coding.codeDisplayOptions.title")}`)} showIcon>
        {t("component.coding.codeDisplayOptions.title")}
      </Subtitle>

      <Row>
        <Col span={24}>
          <RadioLabelGroup onChange={onChange} value={item.layout}>
            <RadioLabel value={t("component.coding.codeDisplayOptions.leftright")}>
              {t("component.coding.codeDisplayOptions.leftright")}
            </RadioLabel>
            <RadioLabel value={t("component.coding.codeDisplayOptions.topbottom")}>
              {t("component.coding.codeDisplayOptions.topbottom")}
            </RadioLabel>
          </RadioLabelGroup>
        </Col>
      </Row>
    </Question>
  );
};

LayoutDisplayOptions.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

LayoutDisplayOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(LayoutDisplayOptions);

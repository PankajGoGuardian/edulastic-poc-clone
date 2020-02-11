import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Question from "../../../components/Question";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";
import { Subtitle } from "../../../styled/Subtitle";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Row } from "../../../styled/WidgetOptions/Row";
import { updateVariables } from "../../../utils/variables";

class FormattingOptions extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.essayText.plain.formattingOptions")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.essayText.plain.formattingOptions")}`)}>
          {t("component.essayText.plain.formattingOptions")}
        </Subtitle>
        <Row gutter={24}>
          <Col span={6}>
            <CheckboxLabel
              defaultChecked={item.showCopy}
              onChange={e => handleItemChangeChange("showCopy", e.target.checked)}
            >
              {t("component.essayText.copy")}
            </CheckboxLabel>
          </Col>
          <Col span={6}>
            <CheckboxLabel
              defaultChecked={item.showCut}
              onChange={e => handleItemChangeChange("showCut", e.target.checked)}
            >
              {t("component.essayText.cut")}
            </CheckboxLabel>
          </Col>
          <Col span={6}>
            <CheckboxLabel
              defaultChecked={item.showPaste}
              onChange={e => handleItemChangeChange("showPaste", e.target.checked)}
            >
              {t("component.essayText.paste")}
            </CheckboxLabel>
          </Col>
        </Row>
      </Question>
    );
  }
}

FormattingOptions.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

FormattingOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(FormattingOptions);

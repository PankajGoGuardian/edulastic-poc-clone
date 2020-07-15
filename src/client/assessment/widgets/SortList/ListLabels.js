import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get } from "lodash";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { Row, Col } from "antd";
import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";
import { Label } from "../../styled/WidgetOptions/Label";
import { TextInputStyled } from "../../styled/InputStyles";

class ListLabels extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const labels = get(item, "labels", {
      source: t("component.sortList.containerSourcePreview"),
      target: t("component.sortList.containerTargetPreview")
    });

    const handleItemChange = (prop, data) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = data;
          updateVariables(draft);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.sortList.listLabels")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.sortList.listLabels")}`)}>
          {t("component.sortList.listLabels")}
        </Subtitle>
        <Row gutter={24}>
          <Col md={12}>
            <Label>{t("component.sortList.containerSourcePreview")}</Label>
            <TextInputStyled
              size="large"
              transformText="uppercase"
              value={labels.source || ""}
              onChange={e => handleItemChange("labels", { ...labels, source: e.target.value })}
            />
          </Col>
          <Col md={12}>
            <Label>{t("component.sortList.containerTargetPreview")}</Label>
            <TextInputStyled
              size="large"
              transformText="uppercase"
              value={labels.target || ""}
              onChange={e => handleItemChange("labels", { ...labels, target: e.target.value })}
            />
          </Col>
        </Row>
      </Question>
    );
  }
}

ListLabels.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ListLabels.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(ListLabels);

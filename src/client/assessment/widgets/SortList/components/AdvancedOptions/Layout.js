import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { ChoiceDimensions } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import OrientationSelect from "../../../../components/OrientationSelect";
import Question from "../../../../components/Question";
import { Layout, NumberInput, StemNumerationOption } from "../../../../containers/WidgetOptions/components";
import FontSizeSelect from "../../../../containers/WidgetOptions/components/FontSize";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Row } from "../../../../styled/WidgetOptions/Row";

const { maxWidth: choiceMaxW, minWidth: choiceMinW } = ChoiceDimensions;
class LayoutWrapper extends Component {
  render() {
    const { onUiChange, advancedAreOpen, item, fillSections, cleanSections, t } = this.props;
    const fontsize = get(item, "uiStyle.fontsize");
    const orientation = get(item, "uiStyle.orientation");

    return (
      <Question
        section="advanced"
        label={t("component.options.display")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Layout id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
          <Row gutter={24}>
            <Col md={12}>
              <FontSizeSelect
                value={fontsize}
                onChange={val => {
                  onUiChange("fontsize", val);
                }}
              />
            </Col>
            <Col md={12}>
              <OrientationSelect
                data-cy="orientation"
                value={orientation}
                onChange={val => {
                  onUiChange("orientation", val);
                }}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col md={12}>
              <NumberInput
                label={t("component.options.choiceMinWidth")}
                onChange={val => onUiChange("choiceMinWidth", +val)}
                value={get(item, "uiStyle.choiceMinWidth", choiceMinW)}
              />
            </Col>
            <Col md={12}>
              <NumberInput
                label={t("component.options.choiceMaxWidth")}
                onChange={val => onUiChange("choiceMaxWidth", +val)}
                value={get(item, "uiStyle.choiceMaxWidth", choiceMaxW)}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col md={12}>
              <StemNumerationOption
                onChange={val => onUiChange("validationStemNumeration", val)}
                value={get(item, "uiStyle.validationStemNumeration", "numerical")}
              />
            </Col>
          </Row>
        </Layout>
      </Question>
    );
  }
}

LayoutWrapper.propTypes = {
  t: PropTypes.func.isRequired,
  onUiChange: PropTypes.func.isRequired,
  item: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

LayoutWrapper.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(LayoutWrapper);

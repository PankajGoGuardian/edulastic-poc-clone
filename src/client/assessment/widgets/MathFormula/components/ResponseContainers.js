import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { EduButton, FlexContainer } from "@edulastic/common";

import Question from "../../../components/Question";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../styled/Subtitle";

import { IconTrash } from "../styled/IconTrash";

class ResponseContainers extends Component {
  render() {
    const { containers, onChange, onAdd, onDelete, advancedAreOpen, fillSections, cleanSections, t } = this.props;
    return (
      <Question
        section="advanced"
        label={t("component.options.responseContainer")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.options.responseContainer")}</Subtitle>

        {containers.map((container, index) => (
          <Fragment>
            <Row>
              <Col md={12}>
                <FlexContainer justifyContent="space-between">
                  <Label>
                    {t("component.options.responseContainer")} {index + 1}
                  </Label>
                  <IconTrash onClick={() => onDelete(index)} />
                </FlexContainer>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Label>{t("component.options.widthpx")}</Label>
                <Input
                  type="number"
                  size="large"
                  style={{ width: "80%" }}
                  value={container.widthpx || 0}
                  onChange={e => onChange({ index, prop: "widthpx", value: +e.target.value })}
                />
              </Col>
              <Col md={6}>
                <Label>{t("component.options.heightpx")}</Label>
                <Input
                  type="number"
                  size="large"
                  style={{ width: "80%" }}
                  value={container.heightpx || 0}
                  onChange={e => onChange({ index, prop: "heightpx  ", value: +e.target.value })}
                />
              </Col>
            </Row>
          </Fragment>
        ))}

        <EduButton onClick={onAdd} type="primary">
          {t("component.options.addResponseContainer")}
        </EduButton>
      </Question>
    );
  }
}

ResponseContainers.propTypes = {
  containers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ResponseContainers.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(ResponseContainers);

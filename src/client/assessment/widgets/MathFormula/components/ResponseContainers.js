import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Input } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { EduButton, FlexContainer } from "@edulastic/common";

import { Widget } from "../../../styled/Widget";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../styled/Subtitle";

import { IconTrash } from "../styled/IconTrash";

class ResponseContainers extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.responseContainer"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.responseContainer"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { containers, onChange, onAdd, onDelete, advancedAreOpen, t } = this.props;
    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
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
      </Widget>
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

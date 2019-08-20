import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { EduButton, FlexContainer } from "@edulastic/common";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";

import { IconTrash } from "../styled/IconTrash";

class ResponseContainers extends Component {
  render() {
    const { containers, onChange, onAdd, onDelete, t } = this.props;
    return (
      <Container>
        <Label>{t("component.options.responseBoxOverride")}</Label>

        {containers.map((container, index) => (
          <Fragment>
            <Row gutter={30}>
              <Col md={24}>
                <FlexContainer justifyContent="space-between">
                  <Label>
                    {t("component.options.responseBox")} {index + 1}
                  </Label>
                  <IconTrash onClick={() => onDelete(index)} />
                </FlexContainer>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col md={12}>
                <Label>{t("component.options.widthpx")}</Label>
                <Input
                  type="number"
                  size="large"
                  value={container.widthpx || 0}
                  onChange={e => onChange({ index, prop: "widthpx", value: +e.target.value })}
                />
              </Col>
              <Col md={12}>
                <Label>{t("component.options.heightpx")}</Label>
                <Input
                  type="number"
                  size="large"
                  value={container.heightpx || 0}
                  onChange={e => onChange({ index, prop: "heightpx", value: +e.target.value })}
                />
              </Col>
            </Row>
          </Fragment>
        ))}

        <EduButton onClick={onAdd} type="primary">
          {t("component.options.addResponseContainer")}
        </EduButton>
      </Container>
    );
  }
}

ResponseContainers.propTypes = {
  containers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

ResponseContainers.defaultProps = {};

export default withNamespaces("assessment")(ResponseContainers);

const Container = styled.div`
  margin-top: 32px;
`;

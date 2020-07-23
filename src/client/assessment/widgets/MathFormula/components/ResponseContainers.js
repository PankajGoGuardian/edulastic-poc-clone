import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";

import { IconTrash } from "../styled/IconTrash";
import { TextInputStyled } from "../../../styled/InputStyles";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";

class ResponseContainers extends Component {
  render() {
    const { containers, onChange, onAdd, onDelete, t } = this.props;
    return (
      <Container>
        <Label>{t("component.options.responseBoxOverride")}</Label>

        {containers.map((container, index) => (
          <Fragment>
            <Row type="flex" justify="space-between" marginTop={15}>
              <Label>
                {t("component.options.responseBox")} {index + 1}
              </Label>
              <IconTrash onClick={() => onDelete(index)} />
            </Row>

            <Row gutter={24}>
              <Col md={12}>
                <Label>{t("component.options.widthpx")}</Label>
                <TextInputStyled
                  type="number"
                  size="large"
                  value={container.widthpx || 0}
                  onChange={e => onChange({ index, prop: "widthpx", value: +e.target.value })}
                />
              </Col>
              <Col md={12}>
                <Label>{t("component.options.heightpx")}</Label>
                <TextInputStyled
                  type="number"
                  size="large"
                  value={container.heightpx || 0}
                  onChange={e => onChange({ index, prop: "heightpx", value: +e.target.value })}
                />
              </Col>
            </Row>
          </Fragment>
        ))}

        <CustomStyleBtn width="180px" onClick={onAdd}>
          {t("component.options.addResponseContainer")}
        </CustomStyleBtn>
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

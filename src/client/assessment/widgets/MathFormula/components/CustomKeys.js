import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { FlexContainer } from "@edulastic/common";

import { Label } from "../../../styled/WidgetOptions/Label";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { IconTrash } from "../styled/IconTrash";
import { TextInputStyled } from "../../../styled/InputStyles";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";

const CustomKeys = ({ blocks, onChange, onAdd, onDelete, t }) => (
  <>
    <Label>{t("component.options.customkeys")}</Label>

    <Row gutter={24}>
      {blocks.map((block, index) => (
        <Col span={12} key={index}>
          <FlexContainer>
            <TextInputStyled size="large" value={block} onChange={e => onChange({ index, value: e.target.value })} />
            <IconTrash onClick={() => onDelete(index)} />
          </FlexContainer>
        </Col>
      ))}
    </Row>

    <CustomStyleBtn onClick={onAdd}>{t("component.options.addNewKey")}</CustomStyleBtn>
  </>
);

CustomKeys.propTypes = {
  blocks: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

CustomKeys.defaultProps = {};

export default withNamespaces("assessment")(CustomKeys);

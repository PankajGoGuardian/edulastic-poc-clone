import React from "react";
import PropTypes from "prop-types";
import { Input, Row, Col } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { EduButton, FlexContainer } from "@edulastic/common";

import { Label } from "../../../styled/WidgetOptions/Label";
import { IconTrash } from "../styled/IconTrash";

const CustomKeys = ({ blocks, onChange, onAdd, onDelete, t }) => (
  <>
    <Label>{t("component.options.customkeys")}</Label>

    <Row gutter={32}>
      {blocks.map((block, index) => (
        <Col style={{ marginBottom: 15 }} span={12} key={index}>
          <FlexContainer>
            <Input
              style={{ width: "100%" }}
              size="large"
              value={block}
              onChange={e => onChange({ index, value: e.target.value })}
            />
            <IconTrash onClick={() => onDelete(index)} />
          </FlexContainer>
        </Col>
      ))}
    </Row>

    <EduButton onClick={onAdd} type="primary">
      {t("component.options.addNewKey")}
    </EduButton>
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

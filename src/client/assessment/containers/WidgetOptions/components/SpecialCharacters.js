import React from "react";
import { Checkbox, Input } from "antd";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { getQuestionDataSelector, setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";
import { TextInputStyled } from "../../../styled/InputStyles";

const SpecialCharacters = ({ item, setQuestionData, t }) => {
  const _change = (propName, value) => {
    const newItem = cloneDeep(item);
    newItem[propName] = value;
    setQuestionData(newItem);
  };

  const _characterMapChange = e => {
    const { value } = e.target;
    _change("characterMap", value.split(""));
  };

  return (
    <Row gutter={24} type={"flex"} align={"middle"}>
      <Col md={12}>
        <CheckboxLabel
          checked={!!item.characterMap}
          onChange={e => {
            if (e.target.checked) {
              _change("characterMap", []);
            } else {
              _change("characterMap", undefined);
            }
          }}
        >
          {t("component.options.specialcharacters")}
        </CheckboxLabel>
      </Col>
      {item.characterMap && (
        <Col md={12}>
          <Label>{t("component.options.charactersToDisplay")}</Label>
          <TextInputStyled value={item.characterMap.join("")} size="large" onChange={_characterMapChange} />
        </Col>
      )}
    </Row>
  );
};

SpecialCharacters.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      item: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(SpecialCharacters);

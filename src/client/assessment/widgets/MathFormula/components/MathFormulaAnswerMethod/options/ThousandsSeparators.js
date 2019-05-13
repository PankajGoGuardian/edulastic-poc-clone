import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Select, Row, Col } from "antd";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const ThousandsSeparators = ({ options, separators, onChange, onChangeCheck, t }) => {
  const thousandsSeparators = [
    { value: ",", label: t("component.math.comma") },
    { value: ".", label: t("component.math.dot") },
    { value: " ", label: t("component.math.space") }
  ];

  return (
    <Col span={12}>
      <FlexContainer flexDirection="column" alignItems="flex-start">
        <Checkbox
          data-cy="answer-allow-thousand-separator"
          checked={options.allowThousandsSeparator}
          onChange={e => onChangeCheck("allowThousandsSeparator", e.target.checked)}
        >
          {t("component.math.allowThousandsSeparator")}
        </Checkbox>
        {separators &&
          !!separators.length &&
          options.allowThousandsSeparator &&
          separators.map((separator, i) => (
            <Row key={i} style={{ marginTop: 15, marginBottom: 15, width: "100%" }}>
              <Col span={24}>
                <FlexContainer>
                  <Select
                    size="large"
                    value={separator}
                    style={{ width: "100%" }}
                    onChange={val => onChange({ val, ind: i })}
                    data-cy="thousands-separator-dropdown"
                  >
                    {thousandsSeparators.map(({ value: val, label }) => (
                      <Select.Option data-cy={`thousands-separator-dropdown-list-${label}`} key={val} value={val}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                </FlexContainer>
              </Col>
            </Row>
          ))}
      </FlexContainer>
    </Col>
  );
};

ThousandsSeparators.propTypes = {
  options: PropTypes.object.isRequired,
  separators: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onChangeCheck: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

ThousandsSeparators.defaultProps = {
  separators: []
};

export default withNamespaces("assessment")(ThousandsSeparators);

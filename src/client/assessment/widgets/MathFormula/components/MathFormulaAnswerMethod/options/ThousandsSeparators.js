import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Checkbox, Select, Row, Col } from "antd";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const ThousandsSeparators = ({ separators, onChange, t }) => {
  const thousandsSeparators = [
    { value: ",", label: t("component.math.comma") },
    { value: ".", label: t("component.math.dot") },
    { value: " ", label: t("component.math.space") }
  ];
  const [allowThousandsSeparator, setAllowThousandsSeparator] = useState(false);

  useEffect(() => {
    if (separators && separators.length) {
      setAllowThousandsSeparator(true);
    }
  }, [separators]);

  return (
    <Col span={24}>
      <FlexContainer flexDirection="column" alignItems="flex-start">
        <Checkbox
          data-cy="answer-allow-thousand-separator"
          checked={allowThousandsSeparator}
          onChange={e => {
            setAllowThousandsSeparator(e.target.checked);
            if (!e.target.checked) {
              onChange({ val: null, ind: 0 });
            } else {
              onChange({ val: ",", ind: 0 });
            }
          }}
        >
          {t("component.math.setThousandsSeparator")}
        </Checkbox>
        {separators &&
          !!separators.length &&
          allowThousandsSeparator &&
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
  separators: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

ThousandsSeparators.defaultProps = {
  separators: []
};

export default withNamespaces("assessment")(ThousandsSeparators);

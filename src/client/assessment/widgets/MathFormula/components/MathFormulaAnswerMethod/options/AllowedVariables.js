import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Checkbox, Input, Row, Col } from "antd";
import styled from "styled-components";

import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

const OptionsRow = styled(Row)`
  margin: 5px 0 5px 20px;
`;

const AllowedVariablesPure = ({ options, onChange, t }) => {
  const [allowAllowedVariables, setAllowAllowedVariables] = useState(false);

  const changeOption = (key, val) => {
    onChange("allowedVariables", {
      ...(options.allowedVariables ? options.allowedVariables : {}),
      [key]: val
    });
  };

  useEffect(() => {
    if (options.allowedVariables) {
      setAllowAllowedVariables(true);
    }
  }, [options.allowedVariables]);

  const allowNumeric = options.allowedVariables && options.allowedVariables.allowNumeric;
  const allowVarsList = options.allowedVariables && options.allowedVariables.allowVarsList;

  return (
    <FlexContainer flexDirection="column" alignItems="flex-start">
      <Checkbox
        data-cy="answer-allowed-variables"
        checked={allowAllowedVariables}
        onChange={e => {
          setAllowAllowedVariables(e.target.checked);
          if (!e.target.checked) {
            onChange("allowedVariables", null);
          }
        }}
      >
        {t("component.math.allowedVariables")}
      </Checkbox>
      {allowAllowedVariables && (
        <React.Fragment>
          <OptionsRow>
            <Col span={24}>
              <Checkbox
                data-cy="answer-allowed-variables-numeric-values"
                checked={allowNumeric}
                onChange={e => changeOption("allowNumeric", e.target.checked)}
              >
                {t("component.math.allowedVariablesAllowNumeric")}
              </Checkbox>
            </Col>
          </OptionsRow>
          <OptionsRow align="middle" type="flex">
            <Col span={allowVarsList ? 12 : 24}>
              <Checkbox
                data-cy="answer-allowed-variables-string-values-check"
                checked={allowVarsList}
                onChange={e => changeOption("allowVarsList", e.target.checked)}
              >
                {t("component.math.allowedVariablesAllowVarsList")}
              </Checkbox>
            </Col>
            {allowVarsList && (
              <Col span={12}>
                <Input
                  data-cy="answer-allowed-variables-string-values-input"
                  value={options.allowedVariables ? options.allowedVariables.varsList : ""}
                  onChange={e => changeOption("varsList", e.target.value)}
                />
              </Col>
            )}
          </OptionsRow>
        </React.Fragment>
      )}
    </FlexContainer>
  );
};

AllowedVariablesPure.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

AllowedVariablesPure.defaultProps = {};

export const AllowedVariables = withNamespaces("assessment")(AllowedVariablesPure);

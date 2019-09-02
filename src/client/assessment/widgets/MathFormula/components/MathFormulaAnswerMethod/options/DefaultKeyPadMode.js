import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { math } from "@edulastic/constants";

const { Option } = Select;

const DefaultKeyPadModePure = ({ t, onChange, keypadMode }) => {
  const symbolsData = [{ value: "custom", label: t("component.options.addCustom") }, ...math.units];
  const onSelectKeypad = val => {
    onChange("keypadMode", val);
  };
  return (
    <StyledSelect onChange={onSelectKeypad} value={keypadMode}>
      {symbolsData.map(({ value: val, label }) => (
        <Option key={val} value={val} data-cy={`text-formatting-options-selected-${val}`}>
          {label}
        </Option>
      ))}
    </StyledSelect>
  );
};

DefaultKeyPadModePure.propTypes = {
  t: PropTypes.func.isRequired,
  keypadMode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export const DefaultKeyPadMode = withNamespaces("assessment")(DefaultKeyPadModePure);

const StyledSelect = styled(Select)`
  width: 100%;
  .ant-select-selection {
    padding: 5px 2px;
  }
  svg {
    display: inline-block;
  }
`;

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { math } from "@edulastic/constants";
import { SelectInputStyled } from "../../../../../styled/InputStyles";

const { Option } = Select;

const DefaultKeyPadModePure = ({ t, onChange, keypadMode }) => {
  const symbolsData = [{ value: "custom", label: t("component.options.addCustom") }, ...math.units];
  const onSelectKeypad = val => {
    onChange("keypadMode", val);
  };
  return (
    <StyledSelect
      onChange={onSelectKeypad}
      value={keypadMode}
      getPopupContainer={triggerNode => triggerNode.parentNode}
    >
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

const StyledSelect = styled(SelectInputStyled)`
  svg {
    display: inline-block;
  }
`;

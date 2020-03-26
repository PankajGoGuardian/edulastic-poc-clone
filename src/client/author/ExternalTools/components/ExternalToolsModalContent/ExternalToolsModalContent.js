import React from "react";
import { StyledContentRow, StyledInput, StyledLabel, StyledSelect } from "./styled";
import { Col, Select } from "antd";

export const ExternalToolsModalContent = ({ data, onChange }) => {
  const getPrivacyOptions = () => {
    return [
      <Select.Option key={1} value={1}>
        Do not send any user information
      </Select.Option>,
      <Select.Option key={2} value={2}>
        Only send name of the user who launches the tool
      </Select.Option>,
      <Select.Option key={3} value={3}>
        Only send Email/Username of user who launches the tool
      </Select.Option>,
      <Select.Option key={4} value={4}>
        Send Name and Email/Username of user who launches the tool
      </Select.Option>
    ];
  };

  const getConfigTypeOptions = () => {
    return [
      <Select.Option key={1} value="manual">
        Manual
      </Select.Option>,
      <Select.Option key={2} value="url">
        URL/XML
      </Select.Option>
    ];
  };

  const getMatchByOptions = () => {
    return [
      <Select.Option key={2} value="domain">
        Domain
      </Select.Option>,
      <Select.Option key={2} value="url">
        URL
      </Select.Option>
    ];
  };

  return (
    <Col span={24}>
      <StyledContentRow>
        <StyledLabel>TOOL NAME</StyledLabel>
        <StyledInput
          placeholder="Enter a tool Name"
          value={data.toolName}
          onChange={e => onChange("toolName", e.target.value)}
        />
      </StyledContentRow>
      <StyledContentRow>
        <StyledLabel>CONSUMER KEY</StyledLabel>
        <StyledInput
          placeholder="Enter a Consumer Key"
          value={data.settings.consumerKey}
          onChange={e => onChange("settings.consumerKey", e.target.value)}
        />
      </StyledContentRow>
      <StyledContentRow>
        <StyledLabel>SHARED SECRET</StyledLabel>
        <StyledInput
          placeholder="Enter a Shared Secret"
          value={data.settings.sharedSecret}
          onChange={e => onChange("settings.sharedSecret", e.target.value)}
        />
      </StyledContentRow>
      <StyledContentRow>
        <StyledLabel>PRIVACY</StyledLabel>
        <StyledSelect
          placeholder="Select privacy"
          value={data.settings.privacy || undefined}
          onChange={value => onChange("settings.privacy", value)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {getPrivacyOptions()}
        </StyledSelect>
      </StyledContentRow>
      <StyledContentRow>
        <StyledLabel>CONFIGURATION TYPE</StyledLabel>
        <StyledSelect
          placeholder="Select a configuration Type"
          value={data.settings.configurationType || undefined}
          onChange={value => onChange("settings.configurationType", value)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {getConfigTypeOptions()}
        </StyledSelect>
      </StyledContentRow>
      <StyledContentRow>
        <StyledLabel>MATCH BY</StyledLabel>
        <StyledSelect
          placeholder="Select match by"
          value={data.settings.matchBy || undefined}
          onChange={value => onChange("settings.matchBy", value)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {getMatchByOptions()}
        </StyledSelect>
      </StyledContentRow>
      <StyledContentRow>
        <StyledLabel>DOMAIN/URL</StyledLabel>
        <StyledInput
          placeholder="Enter a URL"
          value={data.settings.url}
          onChange={e => onChange("settings.url", e.target.value)}
        />
      </StyledContentRow>
    </Col>
  );
};

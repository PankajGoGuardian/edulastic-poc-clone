import React, { useState } from "react";
import { Input, Select, Row, Col } from "antd";
import { CheckboxLabel } from "@edulastic/common";
import styled from "styled-components";
import { themeColor } from "@edulastic/colors";

export const ExternalLTIModalContent = ({ data, externalToolsProviders, onChange, isAddNew, setAddNew }) => {
  const getToolProviderOptions = () => {
    return (
      externalToolsProviders &&
      externalToolsProviders.map(({ _id, toolName }) => <Select.Option value={_id}>{toolName}</Select.Option>)
    );
  };

  const getPrivacyOptions = () => {
    return [
      <Select.Option value={1}>Do not send any user information</Select.Option>,
      <Select.Option value={2}>Only send name of the user who launches the tool</Select.Option>,
      <Select.Option value={3}>Only send Email/Username of user who launches the tool</Select.Option>,
      <Select.Option value={4}>Send Name and Email/Username of user who launches the tool</Select.Option>
    ];
  };

  const getConfigTypeOptions = () => {
    return [<Select.Option value="manual">Manual</Select.Option>, <Select.Option value="url">URL/XML</Select.Option>];
  };

  const getMatchByOptions = () => {
    return [<Select.Option value="domain">Domain</Select.Option>, <Select.Option value="url">URL</Select.Option>];
  };

  const handleOnChange = (key, value) => {
    if (value === "add-new") {
      return setAddNew(true);
    }
    onChange("data.toolProvider", value);
  };

  return (
    <Col span={24}>
      {!isAddNew && (
        <StyledContentRow>
          <StyledLabel>TOOL PROVIDER</StyledLabel>
          <StyledSelect
            placeholder="Select a tool"
            value={data.data?.toolProvider}
            onChange={value => handleOnChange("data.toolProvider", value)}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {getToolProviderOptions()}
            <Select.Option value="add-new">Add New Resource</Select.Option>
          </StyledSelect>
        </StyledContentRow>
      )}
      <StyledContentRow>
        <StyledLabel>TITLE</StyledLabel>
        <StyledInput
          placeholder="Enter a title"
          value={data.contentTitle}
          onChange={e => onChange("contentTitle", e.target.value)}
        />
      </StyledContentRow>
      <StyledContentRow>
        <StyledLabel>URL</StyledLabel>
        <StyledInput
          placeholder="Enter a URL"
          value={data.data?.url}
          onChange={e => onChange("data.url", e.target.value)}
        />
      </StyledContentRow>
      {isAddNew && (
        <StyledContentRow>
          <StyledLabel>CONSUMER KEY</StyledLabel>
          <StyledInput
            placeholder="Enter a consumer key"
            value={data.data?.consumerKey}
            onChange={e => onChange("data.consumerKey", e.target.value)}
          />
        </StyledContentRow>
      )}

      {isAddNew && (
        <StyledContentRow>
          <StyledLabel>SHARED SECRET</StyledLabel>
          <StyledInput
            placeholder="Enter a shared secret"
            value={data.data?.sharedSecret}
            onChange={e => onChange("data.sharedSecret", e.target.value)}
          />
        </StyledContentRow>
      )}

      {isAddNew && (
        <StyledContentRow>
          <StyledLabel>PRIVACY</StyledLabel>
          <StyledSelect
            placeholder="Select privacy"
            value={data.data?.privacy}
            onChange={value => onChange("data.privacy", value)}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {getPrivacyOptions()}
          </StyledSelect>
        </StyledContentRow>
      )}

      {isAddNew && (
        <StyledContentRow>
          <StyledLabel>CONFIGURATION TYPE</StyledLabel>
          <StyledSelect
            placeholder="Select configuration type"
            value={data.data?.configurationType}
            onChange={value => onChange("data.configurationType", value)}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {getConfigTypeOptions()}
          </StyledSelect>
        </StyledContentRow>
      )}

      {isAddNew && (
        <StyledContentRow>
          <StyledLabel>MATCH BY</StyledLabel>
          <StyledSelect
            placeholder="Select match by"
            value={data.data?.matchBy}
            onChange={value => onChange("data.matchBy", value)}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {getMatchByOptions()}
          </StyledSelect>
        </StyledContentRow>
      )}
      {/* <StyledContentRow>
        <StyledLabel>CUSTOM PARAMETERS</StyledLabel>
        <StyledInput
          placeholder="Enter a custom parameters"
          value={data.data?.customParams}
          onChange={e => onChange("data.customParams", e.target.value)}
        />
      </StyledContentRow>
      <StyledContentRow>
        <CheckboxLabel
          checked={data.data?.enableGrading}
          onChange={() => onChange("data.enableGrading", !data.data?.enableGrading)}
        >
          ENABLE GRADING
        </CheckboxLabel>
      </StyledContentRow> */}
    </Col>
  );
};

const StyledContentRow = styled(Row)`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 10px 0 5px 0;
`;

const StyledLabel = styled.label`
  font-size: 11px;
  margin-bottom: 9px;
  height: 15px;
  font-weight: 600;
`;

const StyledInput = styled(Input)`
  .ant-input {
    border-radius: 0;
  }
`;

const StyledSelect = styled(Select)`
  .ant-select-selection {
    border-radius: 0;
  }
  .ant-select-arrow {
    color: ${themeColor};
  }
`;

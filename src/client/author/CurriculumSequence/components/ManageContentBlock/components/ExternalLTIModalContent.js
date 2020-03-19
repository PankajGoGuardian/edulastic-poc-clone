import React from "react";
import { Input, Select, Row, Col } from "antd";
import { CheckboxLabel } from "@edulastic/common";
import styled from "styled-components";

export const ExternalLTIModalContent = ({ data, onChange }) => {
  const getToolProviderOptions = () => {
    return [<Select.Option value="first">First</Select.Option>, <Select.Option value="second">Second</Select.Option>];
  };

  return (
    <Col span={24}>
      <StyledContentRow>
        <StyledLabel>TOOL PROVIDER</StyledLabel>
        <StyledSelect
          placeholder="Select a tool"
          value={data.data?.toolProvider}
          onChange={value => onChange("data.toolProvider", value)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {getToolProviderOptions()}
        </StyledSelect>
      </StyledContentRow>
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
      <StyledContentRow>
        <StyledLabel>CONSUMER KEY</StyledLabel>
        <StyledInput
          placeholder="Enter a consumer key"
          value={data.data?.consumerKey}
          onChange={e => onChange("data.consumerKey", e.target.value)}
        />
      </StyledContentRow>
      <StyledContentRow>
        <StyledLabel>SHARED SECRET</StyledLabel>
        <StyledInput
          placeholder="Enter a shared secret"
          value={data.data?.sharedSecret}
          onChange={e => onChange("data.sharedSecret", e.target.value)}
        />
      </StyledContentRow>
      <StyledContentRow>
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
      </StyledContentRow>
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
`;

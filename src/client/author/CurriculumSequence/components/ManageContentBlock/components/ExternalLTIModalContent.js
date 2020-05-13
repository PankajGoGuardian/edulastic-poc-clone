import React, { useState } from "react";
import { Input, Select, Row, Col, Form } from "antd";
import styled from "styled-components";
import { themeColor } from "@edulastic/colors";
import { ButtonsContainer, StyledModal, ModalFormItem, CancelButton, OkButton } from "../../../../../common/styled";

export const ExternalLTIModal = ({
  externalToolsProviders,
  onChange,
  isAddNew,
  setAddNew,
  isShowExternalLTITool,
  onModalClose,
  addLTIResource,
  form
}) => {
  const { getFieldDecorator } = form;

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

  const handleAddResource = () => {
    form.validateFields((err, row) => {
      if (!err) {
        addLTIResource();
      }
    });
  };

  return (
    <StyledModal
      title="External LTI Resource"
      visible={isShowExternalLTITool}
      onCancel={onModalClose}
      footer={[
        <ButtonsContainer>
          <CancelButton onClick={onModalClose}>CANCEL</CancelButton>,
          <OkButton onClick={handleAddResource}>ADD RESOURCE</OkButton>
        </ButtonsContainer>
      ]}
    >
      {!isAddNew && (
        <Row>
          <Col span={24}>
            <ModalFormItem label="TOOL PROVIDER">
              {getFieldDecorator("addNewResource", {
                validateTrigger: ["onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Please select a tool provider"
                  }
                ]
              })(
                <StyledSelect
                  placeholder="Select a tool"
                  onChange={value => handleOnChange("data.toolProvider", value)}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {getToolProviderOptions()}
                  <Select.Option value="add-new">Add New Resource</Select.Option>
                </StyledSelect>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      )}

      <Row>
        <Col span={24}>
          <ModalFormItem label="TITLE">
            {getFieldDecorator("title", {
              validateTrigger: ["onBlur"],
              rules: [
                {
                  required: true,
                  message: "Please input title"
                }
              ]
            })(<StyledInput placeholder="Enter a title" onChange={e => onChange("contentTitle", e.target.value)} />)}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label="URL">
            {getFieldDecorator("url", {
              validateTrigger: ["onBlur"],
              rules: [
                {
                  required: true,
                  message: "Please input a url"
                }
              ]
            })(<StyledInput placeholder="Enter a URL" onChange={e => onChange("data.url", e.target.value)} />)}
          </ModalFormItem>
        </Col>
      </Row>

      {isAddNew && (
        <Row>
          <Col span={24}>
            <ModalFormItem label="CONSUMER KEY">
              {getFieldDecorator("consumerKey", {
                validateTrigger: ["onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Please enter consumer key"
                  }
                ]
              })(
                <StyledInput
                  placeholder="Enter a consumer key"
                  onChange={e => onChange("data.consumerKey", e.target.value)}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
      )}

      {isAddNew && (
        <Row>
          <Col span={24}>
            <ModalFormItem label="SHARED SECRET">
              {getFieldDecorator("secret", {
                validateTrigger: ["onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Please enter shared secret"
                  }
                ]
              })(
                <StyledInput
                  placeholder="Enter a shared secret"
                  onChange={e => onChange("data.sharedSecret", e.target.value)}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
      )}

      {isAddNew && (
        <Row>
          <Col span={24}>
            <ModalFormItem label="PRIVACY">
              <StyledSelect
                placeholder="Select privacy"
                onChange={value => onChange("data.privacy", value)}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {getPrivacyOptions()}
              </StyledSelect>
            </ModalFormItem>
          </Col>
        </Row>
      )}

      {isAddNew && (
        <Row>
          <Col span={24}>
            <ModalFormItem label="CONFIGURATION TYPE">
              <StyledSelect
                placeholder="Select configuration type"
                onChange={value => onChange("data.configurationType", value)}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {getConfigTypeOptions()}
              </StyledSelect>
            </ModalFormItem>
          </Col>
        </Row>
      )}

      {isAddNew && (
        <Row>
          <Col span={24}>
            <ModalFormItem label="MATCH BY">
              <StyledSelect
                placeholder="Select match by"
                onChange={value => onChange("data.matchBy", value)}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {getMatchByOptions()}
              </StyledSelect>
            </ModalFormItem>
          </Col>
        </Row>
      )}
    </StyledModal>
  );
};

const ExternalLTIModalForm = Form.create()(ExternalLTIModal);
export default ExternalLTIModalForm;

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

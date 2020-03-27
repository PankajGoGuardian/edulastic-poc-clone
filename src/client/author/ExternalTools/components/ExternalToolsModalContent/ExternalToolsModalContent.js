import React from "react";
import { StyledInput, StyledSelect } from "./styled";
import { Select, Row, Col, Form } from "antd";
import { ButtonsContainer, StyledModal, ModalFormItem, CancelButton, OkButton } from "../../../../common/styled";

export const ExternalLTIModal = ({ data, isModalVisible, onChange, onSave, onModalClose, form }) => {
  const { getFieldDecorator } = form;
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

  const handleAddResource = () => {
    form.validateFields((err, row) => {
      if (!err) {
        onSave();
      }
    });
  };

  return (
    <StyledModal
      title="External LTI Resource"
      visible={isModalVisible}
      onCancel={onModalClose}
      footer={[
        <ButtonsContainer>
          <CancelButton onClick={onModalClose}>CANCEL</CancelButton>,
          <OkButton onClick={handleAddResource}>SAVE</OkButton>
        </ButtonsContainer>
      ]}
    >
      <Row>
        <Col span={24}>
          <ModalFormItem label="TOOL NAME">
            {getFieldDecorator("name", {
              initialValue: data.toolName,
              validateTrigger: ["onBlur"],
              rules: [
                {
                  required: true,
                  message: "Please input tool name"
                }
              ]
            })(<StyledInput placeholder="Enter a tool Name" onChange={e => onChange("toolName", e.target.value)} />)}
          </ModalFormItem>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ModalFormItem label="CONSUMER KEY">
            {getFieldDecorator("consumerKey", {
              initialValue: data.settings.consumerKey,
              validateTrigger: ["onBlur"],
              rules: [
                {
                  required: true,
                  message: "Please input consumer key"
                }
              ]
            })(
              <StyledInput
                placeholder="Enter a Consumer Key"
                onChange={e => onChange("settings.consumerKey", e.target.value)}
              />
            )}
          </ModalFormItem>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ModalFormItem label="SHARED SECRET">
            {getFieldDecorator("sharedSecret", {
              initialValue: data.settings.sharedSecret,
              validateTrigger: ["onBlur"],
              rules: [
                {
                  required: true,
                  message: "Please input shared secret"
                }
              ]
            })(
              <StyledInput
                placeholder="Enter a Shared Secret"
                onChange={e => onChange("settings.sharedSecret", e.target.value)}
              />
            )}
          </ModalFormItem>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ModalFormItem label="PRIVACY">
            <StyledSelect
              placeholder="Select privacy"
              value={data.settings.privacy || undefined}
              onChange={value => onChange("settings.privacy", value)}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {getPrivacyOptions()}
            </StyledSelect>
          </ModalFormItem>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ModalFormItem label="CONFIGURATION TYPE">
            <StyledSelect
              placeholder="Select a configuration Type"
              value={data.settings.configurationType || undefined}
              onChange={value => onChange("settings.configurationType", value)}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {getConfigTypeOptions()}
            </StyledSelect>
          </ModalFormItem>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ModalFormItem label="MATCH BY">
            <StyledSelect
              placeholder="Select match by"
              value={data.settings.matchBy || undefined}
              onChange={value => onChange("settings.matchBy", value)}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {getMatchByOptions()}
            </StyledSelect>
          </ModalFormItem>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ModalFormItem label="DOMAIN/URL">
            {getFieldDecorator("url", {
              initialValue: data.settings.url,
              validateTrigger: ["onBlur"],
              rules: [
                {
                  required: true,
                  message: "Please input a domain/url"
                }
              ]
            })(
              <StyledInput placeholder="Enter a DOMAIN/URL" onChange={e => onChange("settings.url", e.target.value)} />
            )}
          </ModalFormItem>
        </Col>
      </Row>
    </StyledModal>
  );
};
const ExternalLTIModalForm = Form.create()(ExternalLTIModal);
export default ExternalLTIModalForm;

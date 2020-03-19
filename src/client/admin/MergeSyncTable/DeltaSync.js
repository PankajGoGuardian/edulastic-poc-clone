import { CheckboxLabel } from "@edulastic/common";
import { Form, Select } from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import { FlexColumn } from "../Common/StyledComponents";
import { deltaSyncConfig, DISABLE_SUBMIT_TITLE } from "../Data";
import CancelApplyActions from "./CancelApplyActions";

const { Option } = Select;
const Column = styled(FlexColumn)`
  > label {
    margin-left: 8px;
  }
`;

function DeltaSync({ rosterSyncConfig, form, applyDeltaSyncChanges, disableFields }) {
  const { getFieldDecorator } = form;
  const { orgId, orgType } = rosterSyncConfig;
  const cancelApplyButtonProps = disableFields ? { disabled: disableFields, title: DISABLE_SUBMIT_TITLE } : {};

  const setValueBackToDefault = () => {
    form.setFieldsValue({
      studentDeltaMergeEnabled: rosterSyncConfig.studentDeltaMergeEnabled,
      studentFullMergeEnabled: rosterSyncConfig.studentFullMergeEnabled,
      studentMergeAttribute: rosterSyncConfig.studentMergeAttribute,
      teacherDeltaMergeEnabled: rosterSyncConfig.teacherDeltaMergeEnabled,
      teacherFullMergeEnabled: rosterSyncConfig.teacherFullMergeEnabled,
      teacherMergeAttribute: rosterSyncConfig.teacherMergeAttribute
    });
  };
  useEffect(() => {
    setValueBackToDefault();
  }, [
    rosterSyncConfig.studentDeltaMergeEnabled,
    rosterSyncConfig.studentFullMergeEnabled,
    rosterSyncConfig.studentMergeAttribute,
    rosterSyncConfig.teacherDeltaMergeEnabled,
    rosterSyncConfig.teacherFullMergeEnabled,
    rosterSyncConfig.teacherMergeAttribute
  ]); // this effect should run only if these 6 properties in rosterSyncConfig change

  function handleSubmit(evt) {
    const data = {
      orgId,
      orgType,
      ...form.getFieldsValue()
    };
    applyDeltaSyncChanges(data);
    evt.preventDefault();
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    labelAlign: "left"
  };

  return (
    <Column>
      <Form onSubmit={handleSubmit} {...formItemLayout}>
        <Form.Item>
          {getFieldDecorator("studentDeltaMergeEnabled", {
            valuePropName: "checked"
          })(<CheckboxLabel>{deltaSyncConfig.studentDeltaMergeEnabled}</CheckboxLabel>)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("studentFullMergeEnabled", {
            valuePropName: "checked"
          })(<CheckboxLabel>{deltaSyncConfig.studentFullMergeEnabled}</CheckboxLabel>)}
        </Form.Item>
        <Form.Item label={deltaSyncConfig.studentMergeAttribute}>
          {getFieldDecorator("studentMergeAttribute", {})(
            <Select style={{ width: 120 }}>
              <Option value="name">Username</Option>
              <Option value="email">E-Mail</Option>
              <Option value="both">Both</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("teacherDeltaMergeEnabled", {
            valuePropName: "checked"
          })(<CheckboxLabel>{deltaSyncConfig.teacherDeltaMergeEnabled}</CheckboxLabel>)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("teacherFullMergeEnabled", {
            valuePropName: "checked"
          })(<CheckboxLabel>{deltaSyncConfig.teacherFullMergeEnabled}</CheckboxLabel>)}
        </Form.Item>
        <Form.Item label={deltaSyncConfig.teacherMergeAttribute}>
          {getFieldDecorator("teacherMergeAttribute", {})(
            <Select style={{ width: 120 }}>
              <Option value="name">Username</Option>
              <Option value="email">E-Mail</Option>
              <Option value="both">Both</Option>
            </Select>
          )}
        </Form.Item>
        <CancelApplyActions {...cancelApplyButtonProps} type="submit" onCancelAction={setValueBackToDefault} />
      </Form>
    </Column>
  );
}

const WrappedForm = Form.create({ name: "deltaSync" })(DeltaSync);

export default WrappedForm;

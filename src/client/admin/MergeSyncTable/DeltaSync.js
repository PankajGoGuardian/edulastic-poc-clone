import React, { useEffect } from "react";
import { Form, Checkbox, Select } from "antd";
import styled from "styled-components";
import { deltaSyncConfig } from "../Data";
import { FlexColumn } from "../Common/StyledComponents";
import CancelApplyActions from "./CancelApplyActions";

const { Option } = Select;
const Column = styled(FlexColumn)`
  > label {
    margin-left: 8px;
  }
`;

function DeltaSync(props) {
  const {
    rosterSyncConfig,
    form: { getFieldDecorator }
  } = props;
  const { orgId, orgType } = rosterSyncConfig;

  const setValueBackToDefault = () => {
    props.form.setFieldsValue({
      studentDeltaMergeEnabled: rosterSyncConfig["studentDeltaMergeEnabled"],
      studentFullMergeEnabled: rosterSyncConfig["studentFullMergeEnabled"],
      studentMergeAttribute: rosterSyncConfig["studentMergeAttribute"],
      teacherDeltaMergeEnabled: rosterSyncConfig["teacherDeltaMergeEnabled"],
      teacherFullMergeEnabled: rosterSyncConfig["teacherFullMergeEnabled"],
      teacherMergeAttribute: rosterSyncConfig["teacherMergeAttribute"]
    });
  };
  useEffect(() => {
    setValueBackToDefault();
  }, [
    rosterSyncConfig["studentDeltaMergeEnabled"],
    rosterSyncConfig["studentFullMergeEnabled"],
    rosterSyncConfig["studentMergeAttribute"],
    rosterSyncConfig["teacherDeltaMergeEnabled"],
    rosterSyncConfig["teacherFullMergeEnabled"],
    rosterSyncConfig["teacherMergeAttribute"]
  ]); // this effect should run only if these 6 properties in rosterSyncConfig change

  function handleSubmit(evt) {
    const data = {
      orgId,
      orgType,
      ...props.form.getFieldsValue()
    };
    props.applyDeltaSyncChanges(data);
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
          })(<Checkbox>{deltaSyncConfig["studentDeltaMergeEnabled"]}</Checkbox>)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("studentFullMergeEnabled", {
            valuePropName: "checked"
          })(<Checkbox>{deltaSyncConfig["studentFullMergeEnabled"]}</Checkbox>)}
        </Form.Item>
        <Form.Item label={deltaSyncConfig["studentMergeAttribute"]}>
          {getFieldDecorator("studentMergeAttribute", {})(
            <Select style={{ width: 120 }}>
              <Option value="name">Name</Option>
              <Option value="email">E-Mail</Option>
              <Option value="both">Both</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("teacherDeltaMergeEnabled", {
            valuePropName: "checked"
          })(<Checkbox>{deltaSyncConfig["teacherDeltaMergeEnabled"]}</Checkbox>)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("teacherFullMergeEnabled", {
            valuePropName: "checked"
          })(<Checkbox>{deltaSyncConfig["teacherFullMergeEnabled"]}</Checkbox>)}
        </Form.Item>
        <Form.Item label={deltaSyncConfig["teacherMergeAttribute"]}>
          {getFieldDecorator("teacherMergeAttribute", {})(
            <Select style={{ width: 120 }}>
              <Option value="name">Name</Option>
              <Option value="email">E-Mail</Option>
              <Option value="both">Both</Option>
            </Select>
          )}
        </Form.Item>
        <CancelApplyActions applySubmit onCancelAction={setValueBackToDefault} />
      </Form>
    </Column>
  );
}

const WrappedForm = Form.create({ name: "deltaSync" })(DeltaSync);

export default WrappedForm;

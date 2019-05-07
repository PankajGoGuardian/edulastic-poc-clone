import React, { useEffect } from "react";
import { Form, Checkbox } from "antd";
import styled from "styled-components";
import { deltaSyncConfig } from "../Data";
import { FlexColumn } from "../Common/StyledComponents";
import CancelApplyActions from "./CancelApplyActions";

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

  useEffect(() => {
    props.form.setFieldsValue({
      studentDeltaMergeEnabled: rosterSyncConfig["studentDeltaMergeEnabled"],
      studentFullMergeEnabled: rosterSyncConfig["studentFullMergeEnabled"],
      teacherDeltaMergeEnabled: rosterSyncConfig["teacherDeltaMergeEnabled"],
      teacherFullMergeEnabled: rosterSyncConfig["teacherFullMergeEnabled"]
    });
  }, [
    rosterSyncConfig["studentDeltaMergeEnabled"],
    rosterSyncConfig["studentFullMergeEnabled"],
    rosterSyncConfig["teacherDeltaMergeEnabled"],
    rosterSyncConfig["teacherFullMergeEnabled"]
  ]);

  function handleSubmit(evt) {
    const data = {
      orgId,
      orgType,
      ...props.form.getFieldsValue()
    };
    props.applyDeltaSyncChanges(data);
    evt.preventDefault();
  }
  return (
    <Column>
      <Form onSubmit={handleSubmit}>
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
        <CancelApplyActions applySubmit />
      </Form>
    </Column>
  );
}

const WrappedForm = Form.create({ name: "deltaSync" })(DeltaSync);

export default WrappedForm;

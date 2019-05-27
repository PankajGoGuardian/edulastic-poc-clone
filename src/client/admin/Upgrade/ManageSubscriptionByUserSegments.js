import React from "react";
import { Form, Button, Select, Input } from "antd";
import moment from "moment";
import { HeadingSpan } from "../Common/StyledComponents/upgradePlan";
import DatesNotesFormItem from "../Common/Form/DatesNotesFormItem";
import { GRADES_LIST, SUBJECTS_LIST, CLEVER_DISTRICT_ID_REGEX } from "../Data";
import { useUpdateEffect } from "../Common/Utils";

const { Option } = Select;

const ManageSubscriptionByUserSegments = Form.create({ name: "searchUsersByEmailIdsForm" })(
  ({
    form: { getFieldDecorator, validateFields, setFieldsValue },
    partialPremiumData: { subscription = {} },
    upgradePartialPremiumUserAction
  }) => {
    const {
      subType = "partial_premium",
      districtId,
      schoolId,
      grades,
      subjects,
      notes,
      subStartDate,
      subEndDate
    } = subscription;
    const handleSubmit = evt => {
      validateFields((err, { schoolId: schoolIdValue, subStartDate: startDate, subEndDate: endDate, ...rest }) => {
        if (!err) {
          upgradePartialPremiumUserAction({
            schoolIds: [schoolIdValue],
            subType,
            subStartDate: startDate.valueOf(),
            subEndDate: endDate.valueOf(),
            ...rest
          });
        }
      });
      evt.preventDefault();
    };

    useUpdateEffect(() => {
      setFieldsValue({
        districtId,
        schoolId,
        grades,
        subjects,
        subStartDate: moment(subStartDate),
        subEndDate: moment(subEndDate),
        notes
      });
    }, [districtId, schoolId, grades, subjects, subStartDate, subEndDate, notes]);

    return (
      <Form onSubmit={handleSubmit} labelAlign="left" labelCol={{ span: 4 }}>
        <Form.Item label={<HeadingSpan>District ID</HeadingSpan>}>
          {getFieldDecorator("districtId", {
            rules: [
              {
                required: true,
                message: "Please enter valid District ID",
                pattern: CLEVER_DISTRICT_ID_REGEX
              }
            ],
            initialValue: ""
          })(<Input placeholder="District ID" style={{ width: 300 }} />)}
        </Form.Item>
        <Form.Item label={<HeadingSpan>School ID</HeadingSpan>}>
          {getFieldDecorator("schoolId", {
            rules: [
              {
                required: true,
                message: "Please enter valid School ID",
                pattern: CLEVER_DISTRICT_ID_REGEX
              }
            ],
            initialValue: ""
          })(<Input placeholder="School ID" style={{ width: 300 }} />)}
        </Form.Item>
        <Form.Item label={<HeadingSpan>Add Grade(s)</HeadingSpan>}>
          {getFieldDecorator("grades", {
            rules: [{ required: true }]
          })(
            <Select mode="multiple" style={{ width: 300 }} placeholder="Please select">
              {GRADES_LIST.map(grade => (
                <Option key={grade.value} value={grade.value}>
                  {grade.label}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={<HeadingSpan>Add Subject(s)</HeadingSpan>}>
          {getFieldDecorator("subjects", {
            rules: [{ required: true }]
          })(
            <Select mode="multiple" style={{ width: 300 }} placeholder="Please select">
              {SUBJECTS_LIST.map(subject => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <DatesNotesFormItem getFieldDecorator={getFieldDecorator} />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Upgrade to premium
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

export default ManageSubscriptionByUserSegments;

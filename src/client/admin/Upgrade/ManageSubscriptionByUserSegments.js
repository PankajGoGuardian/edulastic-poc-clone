import React, { useEffect } from "react";
import { Form, DatePicker, Button, Select, Input } from "antd";
import moment from "moment";
import { HeadingSpan } from "../Common/StyledComponents/upgradePlan";
import NotesFormItem from "../Common/Form/NotesFormItem";
import { GRADES_LIST, SUBJECTS_LIST, CLEVER_DISTRICT_ID_REGEX } from "../Data";

const { Option } = Select;

const ManageSubscriptionByUserSegments = Form.create({ name: "searchUsersByEmailIdsForm" })(
  ({
    form: { getFieldDecorator, validateFields, setFieldsValue },
    partialPremiumData: { subscription = {} },
    upgradePartialPremiumUserAction
  }) => {
    const { subType, districtId, schoolId, grades, subjects, notes, subStartDate, subEndDate } = subscription;
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

    useEffect(() => {
      setFieldsValue({
        subType,
        districtId,
        schoolId,
        grades,
        subjects,
        subStartDate: moment(subStartDate),
        subEndDate: moment(subEndDate),
        notes
      });
    }, [subType, districtId, schoolId, grades, subjects, subStartDate, subEndDate, notes]);

    return (
      <Form onSubmit={handleSubmit} labelAlign="left" labelCol={{ span: 4 }}>
        <Form.Item label={<HeadingSpan>District ID</HeadingSpan>}>
          {getFieldDecorator("districtId", {
            rules: [
              {
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
        <Form.Item label={<HeadingSpan>Start Date</HeadingSpan>}>
          {getFieldDecorator("subStartDate", {
            rules: [{ required: true }]
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label={<HeadingSpan>End Date</HeadingSpan>}>
          {getFieldDecorator("subEndDate", {
            rules: [{ required: true }]
          })(<DatePicker />)}
        </Form.Item>
        <div>
          <NotesFormItem getFieldDecorator={getFieldDecorator} />
        </div>
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

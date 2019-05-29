import React from "react";
import { Form, Button as AntdButton, Select, Input } from "antd";
import moment from "moment";
import { IconAddItems, IconTrash } from "@edulastic/icons";
import { HeadingSpan } from "../Common/StyledComponents/upgradePlan";
import DatesNotesFormItem from "../Common/Form/DatesNotesFormItem";
import { GRADES_LIST, SUBJECTS_LIST, CLEVER_DISTRICT_ID_REGEX } from "../Data";
import { useUpdateEffect } from "../Common/Utils";
import { Button, Table } from "../Common/StyledComponents";

const { Option } = Select;
const { Column } = Table;

const ManageSubscriptionByUserSegments = Form.create({ name: "searchUsersByEmailIdsForm" })(
  ({
    form: { getFieldDecorator, validateFields, setFieldsValue },
    manageUserSegmentsData: {
      partialPremiumData: { subscription = {} },
      gradeSubject
    },
    upgradePartialPremiumUserAction,
    setGradeSubjectValue,
    addGradeSubjectRow,
    deleteGradeSubjectRow
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
            ...rest,
            gradeSubject
          });
        }
      });
      evt.preventDefault();
    };

    useUpdateEffect(() => {
      setFieldsValue({
        districtId,
        schoolId,
        subStartDate: moment(subStartDate),
        subEndDate: moment(subEndDate),
        notes
      });
    }, [districtId, schoolId, subStartDate, subEndDate, notes]);

    const renderGrade = (item, _, index) => (
      <Select
        value={item.grade}
        style={{ width: 300 }}
        placeholder="Please select"
        onChange={value =>
          setGradeSubjectValue({
            type: "grade",
            value,
            index
          })
        }
      >
        {GRADES_LIST.map(grade => (
          <Option key={grade.value} value={grade.value} disabled={grade.value === "All" && item.subject === "All"}>
            {grade.label}
          </Option>
        ))}
      </Select>
    );

    const renderSubject = (item, _, index) => (
      <Select
        value={item.subject}
        style={{ width: 300 }}
        placeholder="Please select"
        onChange={value =>
          setGradeSubjectValue({
            type: "subject",
            value,
            index
          })
        }
      >
        {SUBJECTS_LIST.map(subject => (
          <Option key={subject} value={subject} disabled={subject === "All" && item.grade === "All"}>
            {subject}
          </Option>
        ))}
      </Select>
    );
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
        <Table
          bordered
          rowKey={(record, index) => `${record.subject}${index}`}
          dataSource={gradeSubject}
          pagination={false}
        >
          <Column title="Grade" key="grade" render={renderGrade} />
          <Column title="Subject" key="edulasticSubject" render={renderSubject} />
          <Column
            title={
              <Button title="Add a row" aria-label="Add a Row" noStyle onClick={addGradeSubjectRow}>
                <IconAddItems />
              </Button>
            }
            key="deleteRow"
            render={(item, _, index) => (
              <Button
                title={`Delete ${item.subject}`}
                aria-label={`Delete ${item.subject}`}
                noStyle
                onClick={() => deleteGradeSubjectRow(index)}
              >
                <IconTrash />
              </Button>
            )}
          />
        </Table>
        <DatesNotesFormItem getFieldDecorator={getFieldDecorator} />
        <Form.Item>
          <AntdButton type="primary" htmlType="submit">
            Upgrade to premium
          </AntdButton>
        </Form.Item>
      </Form>
    );
  }
);

export default ManageSubscriptionByUserSegments;

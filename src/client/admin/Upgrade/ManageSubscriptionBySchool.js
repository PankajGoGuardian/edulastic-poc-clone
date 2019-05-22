import React, { useState } from "react";
import { Row, Col, Form, DatePicker, Button, Table } from "antd";
import moment from "moment";
import NotesFormItem from "../Common/Form/NotesFormItem";

const { Column } = Table;

const SchoolsTable = () => {
  const [selectedSchools, setSelectedSchools] = useState([]);
  const rowSelection = {
    selectedRowKeys: selectedSchools,
    onChange: selectedSchoolsArray => {
      setSelectedSchools(selectedSchoolsArray);
    },
    hideDefaultSelections: true
  };
  const noOfSelectedSchools = selectedSchools.length;
  return (
    <>
      <Table rowKey={record => record.id} dataSource={[]} pagination={false} rowSelection={rowSelection} bordered>
        <Column title="School Name" dataIndex="name" key="schoolName" />
        <Column title="District Name" dataIndex="district" key="districtName" />
        <Column title="City" dataIndex="location.city" key="city" />
        <Column title="State" dataIndex="location.state" key="state" />
        <Column title="Plan" dataIndex="plan" key="plan" />
        <Column title="Action" dataIndex="action" key="action" render={() => <Button>Revoke</Button>} />
      </Table>
      {noOfSelectedSchools ? `${noOfSelectedSchools} Selected` : null}
    </>
  );
};

const BulkSubscribeForm = Form.create({ name: "bulkSubscribeForm" })(
  ({ form: { getFieldDecorator, validateFields } }) => {
    const nowDate = moment();
    const nextYearDate = nowDate.clone().add(1, "year");

    const handleSubmit = evt => {
      validateFields((err, { subStartDate, subEndDate, notes }) => {
        if (!err) {
        }
      });
      evt.preventDefault();
    };

    return (
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col span={12}>
            <Form.Item>
              {getFieldDecorator("subStartDate", {
                rules: [{ required: true }],
                initialValue: nowDate
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("subEndDate", {
                rules: [{ required: true }],
                initialValue: nextYearDate
              })(<DatePicker />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <NotesFormItem getFieldDecorator={getFieldDecorator} />
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Bulk Upgrade
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

export default function ManageSubscriptionBySchool() {
  return (
    <>
      <SchoolsTable />
      <BulkSubscribeForm />
    </>
  );
}

import React from "react";
import { Row, Col, Form, Select, Input, DatePicker, Button } from "antd";
import SearchByIdName from "../Common/Form/SearchByIdName";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ManageDistrictSearchForm = Form.create({ name: "manageDistrictSearchForm" })(
  ({ form: { getFieldDecorator, validateFields }, getDistrictDataAction }) => {
    const searchDistrictData = evt => {
      evt.preventDefault();
      validateFields((err, { radioInput, searchDistrict }) => {
        if (!err) {
          getDistrictDataAction({
            [radioInput]: searchDistrict
          });
        }
      });
    };
    return (
      <Row>
        <Col span={24}>
          <SearchByIdName getFieldDecorator={getFieldDecorator} handleSubmit={searchDistrictData} />
        </Col>
      </Row>
    );
  }
);

const ManageDistrictPrimaryForm = Form.create({ name: "manageDistrictPrimaryForm" })(
  ({ form: { getFieldDecorator, validateFields }, districtData, upgradeDistrictSubscriptionAction }) => {
    const { _source = {}, _id } = districtData;
    const { location = {} } = _source;
    const handleSubmit = evt => {
      validateFields((err, { dates, ...rest }) => {
        if (!err) {
          upgradeDistrictSubscriptionAction({
            districtId: _id,
            subStartDate: dates[0].valueOf(),
            subEndDate: dates[1].valueOf(),
            ...rest
          });
        }
      });
      evt.preventDefault();
    };
    return (
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col span={12}>
            <Input addonBefore="District ID" value={_id} disabled />
          </Col>
          <Col span={12}>
            <Form.Item>
              {getFieldDecorator("subType", {
                rules: [{ required: true }],
                initialValue: "free",
                valuePropName: "value"
              })(
                <Select style={{ width: 120 }}>
                  <Option value="free">Free</Option>
                  <Option value="enterprise">Enterprise</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Input addonBefore="District Name" value={_source.districtName} disabled />
        </Row>
        <Row>
          <Input addonBefore="Short Name" value="" disabled />
        </Row>
        <Row>
          <Col span={5}>
            <Input addonBefore="City" value={location.city} disabled />
          </Col>
          <Col span={5}>
            <Input addonBefore="State" value={location.state} disabled />
          </Col>
          <Col span={5}>
            <Input addonBefore="Zip" value={location.city} disabled />
          </Col>
        </Row>
        <Row>
          <Form.Item>
            {getFieldDecorator("dates", {
              rules: [{ required: true }]
            })(<RangePicker />)}
          </Form.Item>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator("notes", {
                rules: [{ required: true }],
                initialValue: ""
              })(<TextArea rows={4} placeholder="Add Notes*" />)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button htmlType="submit">Upgrade</Button>
        </Form.Item>
      </Form>
    );
  }
);

export default function ManageByDistrict({ getDistrictDataAction, districtData, upgradeDistrictSubscriptionAction }) {
  return (
    <>
      <ManageDistrictSearchForm getDistrictDataAction={getDistrictDataAction} />
      <ManageDistrictPrimaryForm
        districtData={districtData}
        upgradeDistrictSubscriptionAction={upgradeDistrictSubscriptionAction}
      />
    </>
  );
}

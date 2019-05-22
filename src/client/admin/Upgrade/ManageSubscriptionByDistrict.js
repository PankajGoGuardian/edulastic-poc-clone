import React, { useState, useEffect } from "react";
import { Row, Col, Form, Select, Input, DatePicker, Button } from "antd";
import moment from "moment";
import SearchDistrictByIdName from "../Common/Form/SearchDistrictByIdName";
import NotesFormItem from "../Common/Form/NotesFormItem";

const { Option } = Select;

const ManageDistrictSearchForm = Form.create({ name: "manageDistrictSearchForm" })(
  ({ form: { getFieldDecorator, validateFields }, getDistrictDataAction }) => {
    const searchDistrictData = evt => {
      evt.preventDefault();
      validateFields((err, { districtSearchOption, districtSearchValue }) => {
        if (!err) {
          getDistrictDataAction({
            [districtSearchOption]: districtSearchValue
          });
        }
      });
    };
    return (
      <Row>
        <Col span={24}>
          <SearchDistrictByIdName getFieldDecorator={getFieldDecorator} handleSubmit={searchDistrictData} />
        </Col>
      </Row>
    );
  }
);

const ManageDistrictPrimaryForm = Form.create({ name: "manageDistrictPrimaryForm" })(
  ({
    form: { getFieldDecorator, validateFields, setFieldsValue },
    districtData,
    upgradeDistrictSubscriptionAction
  }) => {
    // here button state will change according to subType from the data received
    const [ctaSubscriptionState, setCtaSubscriptionState] = useState("Apply Changes");
    const { _source = {}, _id: districtId, subscription = {} } = districtData;
    const { location = {} } = _source;
    const { subType = "free", subStartDate, subEndDate, notes } = subscription;

    // when a district is searched, the form fields are populated according to the data received
    useEffect(() => {
      setFieldsValue({
        subType,
        subStartDate: moment(subStartDate),
        subEndDate: moment(subEndDate),
        notes
      });
    }, [subType, subStartDate, subEndDate, notes]);

    const nowDate = moment();
    const nextYearDate = nowDate.clone().add(1, "year");

    const handleSubTypeChange = value => {
      // if the existing plan and the chosen plan are different, cta button text should change
      if (value !== subType) {
        if (subType === "enterprise") {
          setCtaSubscriptionState("Revoke");
        } else {
          setCtaSubscriptionState("Upgrade");
        }
      } else {
        setCtaSubscriptionState("Apply Changes");
      }
    };

    const handleSubmit = evt => {
      validateFields((err, { subStartDate: startDate, subEndDate: endDate, ...rest }) => {
        if (!err) {
          upgradeDistrictSubscriptionAction({
            districtId,
            subStartDate: startDate.valueOf(),
            subEndDate: endDate.valueOf(),
            ...rest
          });
        }
      });
      evt.preventDefault();
    };
    return (
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col span={12}>{`District ID : ${districtId}`}</Col>
          <Col span={12}>{`Existing Plan : ${subType}`}</Col>
        </Row>
        <Row>
          <Col span={4}>Change Plan :</Col>
          <Col>
            <Form.Item>
              {getFieldDecorator("subType", {
                rules: [{ required: true }],
                initialValue: "",
                valuePropName: "value"
              })(
                <Select style={{ width: 120 }} onChange={handleSubTypeChange}>
                  <Option value="free">Free</Option>
                  <Option value="enterprise">Enterprise</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>{`District Name : ${_source.districtName}`}</Row>
        <Row>{`Short Name :`}</Row>
        <Row>
          <Col span={5}>{`City : ${location.city}`}</Col>
          <Col span={5}>{`State : ${location.state}`}</Col>
          <Col span={5}>{`Zipcode : ${location.zip}`}</Col>
        </Row>
        <Row>
          <Form.Item>
            {getFieldDecorator("subStartDate", {
              rules: [{ required: true }],
              initialValue: nowDate
            })(<DatePicker />)}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item>
            {getFieldDecorator("subEndDate", {
              rules: [{ required: true }],
              initialValue: nextYearDate
            })(<DatePicker />)}
          </Form.Item>
        </Row>
        <Row>
          <Col span={8}>
            <NotesFormItem getFieldDecorator={getFieldDecorator} />
          </Col>
        </Row>
        <Form.Item>
          <Button htmlType="submit">{ctaSubscriptionState}</Button>
        </Form.Item>
      </Form>
    );
  }
);

export default function ManageSubscriptionByDistrict({
  getDistrictDataAction,
  districtData,
  upgradeDistrictSubscriptionAction
}) {
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

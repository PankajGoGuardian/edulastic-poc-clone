import React, { useState, useEffect, useRef } from "react";
import { Row as AntdRow, Col, Form, Select, DatePicker, Button, AutoComplete } from "antd";
import moment from "moment";
import styled from "styled-components";
import SearchDistrictByIdName from "../Common/Form/SearchDistrictByIdName";
import NotesFormItem from "../Common/Form/NotesFormItem";
import { HeadingSpan, ValueSpan } from "../Common/StyledComponents/upgradePlan";
import { getDate } from "../Common/Utils";

const { Option } = Select;
const { Option: AutocompleteOption } = AutoComplete;
const Row = styled(AntdRow)`
  margin: 10px 0px;
`;

const ManageDistrictSearchForm = Form.create({ name: "manageDistrictSearchForm" })(
  ({
    form: { getFieldDecorator, validateFields },
    loading,
    getDistrictDataAction,
    listOfDistricts,
    selectDistrictAction
  }) => {
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
    const onDistrictSelect = (value, option) => selectDistrictAction(option.props.index);

    // here index is passed as a prop and when the user selects district from the list of
    // districts retreived, the selected district is set with the index
    const dataSource = listOfDistricts.map(({ _source = {} }, index) => (
      <AutocompleteOption key={_source.name} index={index}>
        {_source.name}
      </AutocompleteOption>
    ));
    return (
      <SearchDistrictByIdName
        getFieldDecorator={getFieldDecorator}
        handleSubmit={searchDistrictData}
        autocomplete
        onSelect={onDistrictSelect}
        dataSource={dataSource}
        loading={loading}
      />
    );
  }
);

const ManageDistrictPrimaryForm = Form.create({ name: "manageDistrictPrimaryForm" })(
  ({
    form: { getFieldDecorator, validateFields, setFieldsValue },
    selectedDistrict,
    upgradeDistrictSubscriptionAction
  }) => {
    // here button state will change according to subType from the data received
    const [ctaSubscriptionState, setCtaSubscriptionState] = useState("Apply Changes");

    const { _source = {}, _id: districtId, subscription = {} } = selectedDistrict;
    const { location = {} } = _source;
    const { subType = "free", subStartDate, subEndDate, notes } = subscription;

    const savedDate = useRef();

    // here once component is mounted, the current date is calculated just once, and stored in a ref
    useEffect(() => {
      savedDate.current = getDate();
    }, []);

    // when a district is searched, the form fields are populated according to the data received
    useEffect(() => {
      setFieldsValue({
        subType,
        subStartDate: moment(subStartDate || savedDate.current.currentDate),
        subEndDate: moment(subEndDate || savedDate.current.oneYearDate),
        notes
      });
    }, [subType, subStartDate, subEndDate, notes]);

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

    const disabledDate = val => val < moment().startOf("day");

    return (
      <Form onSubmit={handleSubmit} labelAlign="left">
        <Row>
          <HeadingSpan>District ID:</HeadingSpan>
          <ValueSpan>{districtId}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Existing Plan:</HeadingSpan>
          <ValueSpan>{subType}</ValueSpan>
        </Row>
        <Form.Item label={<HeadingSpan>Change Plan</HeadingSpan>} labelCol={{ span: 3 }}>
          {getFieldDecorator("subType", {
            valuePropName: "value"
          })(
            <Select style={{ width: 120 }} onChange={handleSubTypeChange}>
              <Option value="free">Free</Option>
              <Option value="enterprise">Enterprise</Option>
            </Select>
          )}
        </Form.Item>
        <Row>
          <HeadingSpan>District Name:</HeadingSpan>
          <ValueSpan>{_source.name}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Short Name:</HeadingSpan>
          <ValueSpan>{_source.name}</ValueSpan>
        </Row>
        <Row>
          <Col span={5}>
            <HeadingSpan>City:</HeadingSpan>
            <ValueSpan>{location.city}</ValueSpan>
          </Col>
          <Col span={5}>
            <HeadingSpan>State:</HeadingSpan>
            <ValueSpan>{location.state}</ValueSpan>
          </Col>
          <Col span={5}>
            <HeadingSpan>Zipcode:</HeadingSpan>
            <ValueSpan>{location.zip}</ValueSpan>
          </Col>
        </Row>
        <Form.Item label={<HeadingSpan>Start Date</HeadingSpan>} labelCol={{ span: 4 }}>
          {getFieldDecorator("subStartDate", {
            rules: [{ required: true }]
          })(<DatePicker disabledDate={disabledDate} />)}
        </Form.Item>
        <Form.Item label={<HeadingSpan>End Date</HeadingSpan>} labelCol={{ span: 4 }}>
          {getFieldDecorator("subEndDate", {
            rules: [{ required: true }]
          })(<DatePicker disabledDate={disabledDate} />)}
        </Form.Item>
        <div>
          <NotesFormItem getFieldDecorator={getFieldDecorator} />
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {ctaSubscriptionState}
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

export default function ManageSubscriptionByDistrict({
  getDistrictDataAction,
  districtData: { loading, listOfDistricts, selectedDistrict },
  upgradeDistrictSubscriptionAction,
  selectDistrictAction
}) {
  return (
    <>
      <ManageDistrictSearchForm
        loading={loading}
        getDistrictDataAction={getDistrictDataAction}
        listOfDistricts={listOfDistricts}
        selectDistrictAction={selectDistrictAction}
      />
      <ManageDistrictPrimaryForm
        selectedDistrict={selectedDistrict}
        upgradeDistrictSubscriptionAction={upgradeDistrictSubscriptionAction}
      />
    </>
  );
}

import React from "react";
import { Row, Col, Radio, Select } from "antd";
import styled from "styled-components";
import { CommonText, RowWrapper, ContentWrapper } from "./styled";
import { ActivityInput, Title, InputTitle, Body, Block, RadioWrapper, RadioGroup } from "../MainSetting/styled";

const renderBodyContent = () => {
  const content = [
    {
      label: "Progress Bar",
      defaultValue: "limit-type",
      type: "select",
      selectOptions: [
        {
          text: "Limit Type",
          value: "limit-type"
        }
      ]
    },
    {
      label: "Timer",
      defaultValue: "limit-layout",
      type: "select",
      selectOptions: [
        {
          text: "Layout",
          value: "limit-layout"
        }
      ]
    },
    {
      label: "Item Count",
      defaultValue: "item-transition",
      type: "select",
      selectOptions: [
        {
          text: "Item Transition",
          value: "item-transition"
        }
      ]
    },
    {
      label: "Scrolling Indicator",
      defaultValue: "font-size",
      type: "select",
      selectOptions: [
        {
          text: "Font Size",
          value: "font-size"
        }
      ]
    },
    {
      label: "Idle Timeout Warning",
      placeholder: "Idle Timeout Countdown Time (sec)",
      type: "input"
    },
    {
      label: "Auto Save",
      placeholder: "Auto Save Interval (sec)",
      type: "input"
    },
    {
      label: "Auto Save UI Indicator",
      placeholder: "Auto Save Interval (sec)",
      type: "input"
    }
  ];

  return content.map((element, index) => (
    <RadioWrapper key={`RadioWrapper_${index}`}>
      <RowWrapper>
        <Col span={8}>
          <CommonText>{element.label}</CommonText>
        </Col>
        <Col span={8}>
          <RadioGroup defaultValue={1}>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </RadioGroup>
        </Col>
        <Col span={8}>
          {element.type === "select" && (
            <SelectWrapper optionCount={element.selectOptions.length} id="select-area">
              <Select
                defaultValue={element.defaultValue}
                dropdownClassName={element.selectOptions.length === 1 ? "ant-select-dropdown-hidden" : ""}
                getPopupContainer={() => document.getElementById("select-area")}
              >
                {element.selectOptions.map((option, indexOption) => (
                  <Select.Option value={option.value} key={`SelectOption_${indexOption}`}>
                    {option.text}
                  </Select.Option>
                ))}
              </Select>
            </SelectWrapper>
          )}
          {element.type === "input" && <ActivityInput placeholder={element.placeholder} />}
        </Col>
      </RowWrapper>
    </RadioWrapper>
  ));
};

const UiTime = () => (
  <Block id="ui-time">
    <Title>UI / Time</Title>
    <ContentWrapper>{renderBodyContent()}</ContentWrapper>
    <Body>
      <Row gutter={28}>
        <Col span={12}>
          <InputTitle>Assessment Time</InputTitle>
          <ActivityInput placeholder="000" />
        </Col>
        <Col span={12}>
          <InputTitle>End Assessment Warning Time (sec)</InputTitle>
          <ActivityInput placeholder="000" />
        </Col>
        <Col span={12} style={{ paddingTop: 15 }}>
          <InputTitle>Remote Control Countdown Time (sec)</InputTitle>
          <ActivityInput placeholder="https://edulastic.com/" />
        </Col>
        <Col span={12} style={{ paddingTop: 15 }}>
          <InputTitle>Custom Stylesheet</InputTitle>
          <ActivityInput placeholder="https://edulastic.com/" />
        </Col>
      </Row>
    </Body>
  </Block>
);

export default UiTime;

const SelectWrapper = styled.div`
  .ant-select-arrow {
    display: ${props => (props.optionCount === 1 ? "none" : "inline-block")};
  }
`;

import React from 'react';
import styled from 'styled-components';
import { Row, Col, Radio, Select, Input } from 'antd';

const UiTime = () => (
  <Block id="ui-time">
    <Title>UI / Time</Title>
    <Body>
      <Row style={{ width: '100%', marginBottom: 25 }}>
        <Col span={8}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Progress Bar</span>
        </Col>
        <Col span={8}>
          <RadioGroup value={1}>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </RadioGroup>
        </Col>
        <Col span={8} style={{ marginTop: -5 }}>
          <Select defaultValue="limit-type">
            <Select.Option value="limit-type">Limit Type</Select.Option>
          </Select>
        </Col>
      </Row>

      <Row style={{ width: '100%', marginBottom: 25 }}>
        <Col span={8}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Timer</span>
        </Col>
        <Col span={8}>
          <RadioGroup value={1}>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </RadioGroup>
        </Col>
        <Col span={8} style={{ marginTop: -5 }}>
          <Select defaultValue="limit-layout">
            <Select.Option value="limit-layout">Layout</Select.Option>
          </Select>
        </Col>
      </Row>

      <Row style={{ width: '100%', marginBottom: 25 }}>
        <Col span={8}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Item Count</span>
        </Col>
        <Col span={8}>
          <RadioGroup value={1}>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </RadioGroup>
        </Col>
        <Col span={8} style={{ marginTop: -5 }}>
          <Select defaultValue="item-transition">
            <Select.Option value="item-transition">Item Transition</Select.Option>
          </Select>
        </Col>
      </Row>

      <Row style={{ width: '100%', marginBottom: 25 }}>
        <Col span={8}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Scrolling Indicator</span>
        </Col>
        <Col span={8}>
          <RadioGroup value={1}>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </RadioGroup>
        </Col>
        <Col span={8} style={{ marginTop: -5 }}>
          <Select defaultValue="font-size">
            <Select.Option value="font-size">Font Size</Select.Option>
          </Select>
        </Col>
      </Row>

      <Row style={{ width: '100%', marginBottom: 25 }}>
        <Col span={8}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Idle Timeout Warning</span>
        </Col>
        <Col span={8}>
          <RadioGroup value={1}>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </RadioGroup>
        </Col>
        <Col span={8} style={{ marginTop: -5 }}>
          <Input placeholder="Idle Timeout Countdown Time (sec)" />
        </Col>
      </Row>

      <Row style={{ width: '100%', marginBottom: 25 }}>
        <Col span={8}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Auto Save</span>
        </Col>
        <Col span={8}>
          <RadioGroup value={1}>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </RadioGroup>
        </Col>
        <Col span={8} style={{ marginTop: -5 }}>
          <Input placeholder="Auto Save Interval (sec)" />
        </Col>
      </Row>

      <Row style={{ width: '100%', marginBottom: 25 }}>
        <Col span={8}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Auto Save UI Indicator</span>
        </Col>
        <Col span={8}>
          <RadioGroup value={1}>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </RadioGroup>
        </Col>
        <Col span={8} style={{ marginTop: -5 }}>
          <Input placeholder="Auto Save Interval (sec)" />
        </Col>
      </Row>
    </Body>
    <Row gutter={28} style={{ marginBottom: 30 }}>
      <Col span={12}>
        <InputTitle>Assessment Time</InputTitle>
        <Input placeholder="000" />
      </Col>
      <Col span={12}>
        <InputTitle>End Assessment Warning Time (sec)</InputTitle>
        <Input placeholder="000" />
      </Col>
      <Col span={12} style={{ paddingTop: 30 }}>
        <InputTitle>Remote Control Countdown Time (sec)</InputTitle>
        <Input placeholder="https://edulastic.com/" />
      </Col>
      <Col span={12} style={{ paddingTop: 30 }}>
        <InputTitle>Custom Stylesheet</InputTitle>
        <Input placeholder="https://edulastic.com/" />
      </Col>
    </Row>
  </Block>
);

export default UiTime;

const Block = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid lightgrey;

  .ant-input {
    height: 40px;
    font-size: 13px;
    border-radius: 4px;

    ::placeholder {
      font-style: italic;
    }
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #4aac8b;
`;

const Body = styled.div`
  margin-top: 30px;
  margin-bottom: 22px;

  .ant-input {
    height: 32px;
    font-size: 13px;
    border-radius: 4px;

    ::placeholder {
      font-style: italic;
    }
  }

  .ant-select {
    width: 100%;
    font-size: 13px;
    font-weight: 600;
    color: #434b5d;
  }

  .ant-select-arrow-icon {
    svg {
      fill: #00b0ff;
    }
  }
`;

const RadioGroup = styled(Radio.Group)`
  display: flex;

  span {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-radio {
    margin-right: 25px;
  }

  .ant-radio-wrapper {
    margin-bottom: 18px;
    margin-right: 40px;
  }
`;

const InputTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #434b5d;
  margin-bottom: 12px;
`;

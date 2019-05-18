import React from "react";
import { Form, Input, Icon, Radio } from "antd";
import styled from "styled-components";
import { radioButtondata } from "../../Data";
import { Button } from "../StyledComponents";

const { Group: RadioGroup } = Radio;

const CircularInput = styled(Input)`
  margin-right: 10px;
  border-radius: 20px;
`;

export default function SearchByIdName({ getFieldDecorator, handleSubmit }) {
  return (
    <Form onSubmit={handleSubmit} layout="inline">
      <Form.Item>
        {getFieldDecorator("searchDistrict", {
          initialValue: ""
        })(<CircularInput placeholder="Search..." style={{ width: 300 }} />)}
        <Button
          icon="search"
          type="submit"
          style={{
            position: "absolute",
            top: "0",
            right: "10px"
          }}
          aria-label="Search"
          noStyle
        >
          <Icon type="search" />
        </Button>
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("radioInput", {
          initialValue: radioButtondata.list[0].id
        })(
          <RadioGroup name="searchOptions">
            {radioButtondata.list.map(item => (
              <Radio key={item.id} id={item.id} value={item.id}>
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        )}
      </Form.Item>
    </Form>
  );
}

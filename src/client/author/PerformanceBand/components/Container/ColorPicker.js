import React, { useReducer, useState, useEffect } from "react";
import styled from "styled-components";

import { Popover, Button, Row, Col, Icon } from "antd";

//"#576BA9","#A1C3EA","#F39300","#FEC571","#3DB04E","#74E27A","#AFA515","#EBDD54"
function ColorPicker(props) {
  const {
    colors = ["#576BA9", "#A1C3EA", "#F39300", "#FEC571", "#3DB04E", "#74E27A", "#AFA515", "#EBDD54"],
    value = "#576BA9"
  } = props;

  const [visible, setVisible] = useState(false);

  const content = (
    <ColorBoxContainer>
      <Row gutter={4}>
        {colors.map(color => (
          <Col span={6}>
            <ColorBox
              color={color}
              onClick={() => {
                if (props.onChange) {
                  props.onChange(color);
                }
                setVisible(false);
              }}
            />
          </Col>
        ))}
      </Row>
    </ColorBoxContainer>
  );

  return (
    <div>
      <Popover
        content={content}
        placement="bottom"
        trigger="click"
        visible={visible}
        onVisibleChange={v => !props.disabled && setVisible(v)}
      >
        <div style={{ width: 30 }}>
          <ColorBox style={{ height: 30, width: 30, display: "inline-block" }} color={value} />{" "}
          <Icon style={{ display: "block", marginTop: -7 }} type="down" />
        </div>
      </Popover>
    </div>
  );
}

const ColorBox = styled.div`
  width: 100%;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid #00ad50;
  margin-bottom: 4px;
  cursor: pointer;
  background-color: ${({ color }) => `${color}`};
`;

const ColorBoxContainer = styled.div`
  width: 120px;
`;

export default ColorPicker;

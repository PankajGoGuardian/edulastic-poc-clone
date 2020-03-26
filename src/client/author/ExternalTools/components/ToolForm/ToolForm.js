import React from "react";
import { Col, Icon } from "antd";
import { StyledColRight, StyledRow, StyledListItem } from "./styled";

export const ToolForm = ({ data, deleteData, onEdit }) => {
  return (
    <StyledListItem>
      <div style={{ width: "100%" }}>
        <StyledRow style={{ height: "40px" }}>
          <Col span={12}>
            <h4 style={{ marginLeft: "10px" }}>{data.toolName}</h4>
          </Col>
          <StyledColRight span={12}>
            <Icon type="edit" theme="filled" onClick={onEdit} />
            <Icon type="delete" theme="filled" onClick={deleteData} />
          </StyledColRight>
        </StyledRow>
      </div>
    </StyledListItem>
  );
};

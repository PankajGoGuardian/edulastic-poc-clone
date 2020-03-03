import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { Paper } from "@edulastic/common";

import SideBarPLayList from "./SideBarPlayList";
import SideBar from "./Sidebar";

const SideBarSwitch = props =>
  props.isPlaylist ? (
    <PlayListFormWrapper
      style={{ width: props.windowWidth > 993 ? (props.windowWidth < 1366 ? "90%" : "80%") : "100%" }}
    >
      <SideBarPLayList {...props} isEditable />
    </PlayListFormWrapper>
  ) : (
    <TestFormWrapper style={{ width: props.windowWidth > 993 ? "700px" : "100%" }}>
      <Row gutter={32}>
        <Col>
          <SideBar {...props} />
        </Col>
      </Row>
    </TestFormWrapper>
  );

export default SideBarSwitch;

const PlayListFormWrapper = styled(Paper)`
  margin: 25px auto;
  padding: 30px 40px;
  border: 1px solid #dadae4;
  border-radius: 10px;
`;

const TestFormWrapper = styled(Paper)`
  margin: 25px auto 0 auto;
`;

import React from "react";
import { Row } from "antd";
import { EduButton } from "@edulastic/common";
import { darkGrey2 } from "@edulastic/colors";
import { StyledModal, StyledCol, StyledDiv } from "./style";

const AppUpdateModal = ({ visible, onRefresh }) => {
  return (
    <StyledModal visible={visible} footer={null} centered>
      <Row type="flex" align="middle" gutter={[20, 20]}>
        <StyledCol span={24}>
          <StyledDiv fontStyle="22px/30px Open Sans" fontWeight={700}>
            App Update
          </StyledDiv>
        </StyledCol>
        <StyledCol span={24}>
          <StyledDiv color={darkGrey2}>A New version of Edulastic is available.</StyledDiv>
        </StyledCol>
        <StyledCol span={24}>
          <EduButton height="40px" width="180px" onClick={onRefresh}>
            Refresh
          </EduButton>
        </StyledCol>
      </Row>
    </StyledModal>
  );
};

export default AppUpdateModal;

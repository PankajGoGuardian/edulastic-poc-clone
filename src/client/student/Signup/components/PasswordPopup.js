import React from "react";
import { Modal, Input, Row, Col } from "antd";
import styled from "styled-components";
import { EduButton } from "@edulastic/common";
import { themeColor } from "@edulastic/colors";
import { IconGraphRightArrow, IconLock } from "@edulastic/icons";

const Button = styled(EduButton)`
  border: none;
`;
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
`;

const roles = {
  "district-admin": "District Admin",
  "school-admin": "School Admin",
  teacher: "Teacher",
  student: "Student"
};

const PasswordModal = ({ showModal, disabled, existingUser = {}, closeModal, onChange, onClickProceed }) => {
  return (
    <Modal title="Existing Account" visible={showModal} onCancel={closeModal} footer={null}>
      <div>
        <p>
          We already have a {roles[existingUser.role]} account for you. Do you want to have the same username for a{" "}
          {roles[existingUser.currentSelectedRole]} account? If yes, Please enter your current password to proceed.
        </p>
        <Row style={{ "margin-top": "10px" }}>
          <Col span={12} offset={6}>
            <Input
              type="password"
              onChange={e => onChange(e.currentTarget.value)}
              prefix={<IconLock color={themeColor} />}
            />
          </Col>
        </Row>
      </div>
      <ButtonsContainer>
        <Button isGhost onClick={closeModal}>
          Cancle
        </Button>

        <Button disabled={disabled} onClick={() => onClickProceed(existingUser.username)}>
          Proceed <IconGraphRightArrow />
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};

export default PasswordModal;

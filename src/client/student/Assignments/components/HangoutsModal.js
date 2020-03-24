import React, { useState } from "react";
import { Modal, Row, Col, Select } from "antd";
import { EduButton } from "@edulastic/common";

const HangoutsModal = ({ classList = [], setShowHangoutsModal, ...props }) => {
  const [selectedGroupId, selectGroupId] = useState("");
  const selectedGroup = classList.find(c => c._id === selectedGroupId);
  return (
    <Modal {...props}>
      <Row type="flex" align="middle" gutter={[20, 20]}>
        <Col span={24}>
          <Select
            placeholder="Select Class"
            style={{ width: "100%" }}
            dropdownStyle={{ zIndex: 2000 }}
            onChange={selectGroupId}
          >
            {classList.map(({ _id, name }) => (
              <Select.Option key={_id} value={_id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={24} style={{ display: "inline-flex", "justify-content": "center" }}>
          <EduButton isGhost width="100px" onClick={() => setShowHangoutsModal(false)}>
            Cancel
          </EduButton>
          <EduButton width="100px" href={selectedGroup?.hangoutLink} target="_blank" disabled={!selectedGroup}>
            Join
          </EduButton>
        </Col>
      </Row>
    </Modal>
  );
};

export default HangoutsModal;

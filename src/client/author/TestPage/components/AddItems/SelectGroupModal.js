import React, { useState, useMemo } from "react";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import styled from "styled-components";
import { borderGrey } from "@edulastic/colors";
import PerfectScrollbar from "react-perfect-scrollbar";

const SelectGroupModal = ({ visible, test, handleResponse }) => {
  return (
    <StyledModal
      title={[<h3>Add Items</h3>]}
      centered
      textAlign="left"
      visible={visible}
      footer={null}
      onCancel={handleResponse}
      width="400px"
    >
      <PerfectScrollbar style={{ maxHeight: "500px", marginRight: "-14px" }}>
        <ModalBody>
          {test.itemGroups.map(({ groupName }, index) => (
            <GroupWrapper key={index} onClick={() => handleResponse(index)}>
              {groupName}
            </GroupWrapper>
          ))}
        </ModalBody>
      </PerfectScrollbar>
    </StyledModal>
  );
};

const StyledModal = styled(ConfirmationModal)`
  min-width: 550px;
  .ant-modal-content {
    .ant-modal-header {
      padding-bottom: 0px;
    }
    .ant-modal-body {
      background: transparent;
      box-shadow: unset;
    }
  }
`;

const ModalBody = styled.div`
  display: block;
  width: 100%;
  padding-right: 14px;
`;

const GroupWrapper = styled.div`
  height: 50px;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 0px 20px;
  cursor: pointer;
  border: 1px solid ${borderGrey};
`;

export default SelectGroupModal;

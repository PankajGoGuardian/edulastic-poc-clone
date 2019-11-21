import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Radio, Row } from "antd";
import styled from "styled-components";

import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

import { deleteTestRequestAction } from "../../ducks";

const DeleteItemModal = ({ isVisible, onCancel, deleteTestRequestAction, testId }) => {
  const [confirmText, setConfirmText] = useState("");

  return (
    <StyledModal
      visible={isVisible}
      title="Delete Assessment"
      onCancel={() => onCancel()}
      footer={[
        <Button key="cancel" onClick={() => onCancel(false)}>
          No, Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          onClick={() => {
            if (confirmText.toLocaleLowerCase() === "delete") {
              deleteTestRequestAction(testId);
            }
          }}
        >
          Yes, Delete
        </Button>
      ]}
    >
      <div className="delete-message">
        <p>Are you sure you want to delete this assessment?</p>
        <p>
          If yes type <b>Delete</b> in the space given below and proceed.
        </p>
      </div>
      <div className="delete-confirm-contaner">
        <input
          className="delete-confirm-input"
          type="text"
          onChange={event => setConfirmText(event.currentTarget.value)}
        />
      </div>
    </StyledModal>
  );
};

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-body {
      flex-direction: column;
      .delete-confirm-contaner {
        margin-top: 10px;
        .delete-confirm-input {
          border: solid 1px;
          padding: 10px;
        }
      }
    }
  }
`;

const ConnectedDeleteItemModal = connect(
  null,
  {
    deleteTestRequestAction
  }
)(DeleteItemModal);

export { ConnectedDeleteItemModal as DeleteItemModal };

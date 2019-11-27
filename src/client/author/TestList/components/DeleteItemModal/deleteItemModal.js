import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Radio, Row } from "antd";
import styled from "styled-components";

import {
  ModalWrapper,
  InitOptions,
  StyledButton,
  StyledInput,
  ModalFooter,
  LightGreenSpan
} from "../../../../common/components/ConfirmationModal/styled.js";

import { deleteTestRequestAction } from "../../ducks";

const DeleteItemModal = ({ isVisible, onCancel, deleteTestRequestAction, testId }) => {
  const [confirmText, setConfirmText] = useState("");

  return (
    <StyledModal
      visible={isVisible}
      width="750px"
      title="Delete Test"
      onCancel={() => onCancel()}
      footer={[
        <ModalFooter>
          <StyledButton cancel={true} key="cancel" onClick={() => onCancel(false)}>
            No, Cancel
          </StyledButton>
          <StyledButton
            key="delete"
            type="primary"
            disabled={confirmText.toLocaleLowerCase() !== "delete"}
            onClick={() => {
              if (confirmText.toLocaleLowerCase() === "delete") {
                deleteTestRequestAction(testId);
              }
            }}
          >
            Yes, Delete
          </StyledButton>
        </ModalFooter>
      ]}
    >
      <InitOptions className="delete-message-container">
        <div className="delete-message">
          <p>Are you sure you want to delete this test?</p>
          <p>
            If yes type <LightGreenSpan>DELETE</LightGreenSpan> in the space given below and proceed.
          </p>
        </div>
        <div className="delete-confirm-contaner">
          <StyledInput
            className="delete-confirm-input"
            type="text"
            onChange={event => setConfirmText(event.currentTarget.value)}
          />
        </div>
      </InitOptions>
    </StyledModal>
  );
};

const StyledModal = styled(ModalWrapper)`
  .ant-modal-content {
    .ant-modal-title {
      .title-icon {
        margin-right: 15px;
        svg {
          height: 18px;
          width: 18px;
        }
      }
    }

    .ant-modal-body {
      flex-direction: column;
      .delete-message-container {
        font-weight: 600;
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

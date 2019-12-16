import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Modal from "react-responsive-modal";
import { white, themeColor, lightGrey } from "@edulastic/colors";

const ModalStyles = {
  maxWidth: 350,
  borderRadius: "5px",
  "background-color": white,
  padding: "30px"
};

const DeleteBulkTestModal = props => {
  const { isVisible, markedTests, onClose, moduleName, handleBulkTestDelete } = props;

  const onRemoveClick = () => {
    handleBulkTestDelete();
    onClose();
  };

  return (
    <Modal styles={{ modal: ModalStyles }} open={isVisible} onClose={onClose} center>
      <ModuleWrapper>
        <h3>
          {markedTests} {markedTests > 1 ? "TESTS" : "TEST"} WILL BE REMOVED, ARE YOU SURE ?
        </h3>
      </ModuleWrapper>
      <FooterWrapper>
        <CancelBtn onClick={onClose}>Cancel</CancelBtn>
        <RemoveBtn onClick={onRemoveClick}>Remove</RemoveBtn>
      </FooterWrapper>
    </Modal>
  );
};

DeleteBulkTestModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleTestAdded: PropTypes.func.isRequired,
  markedTests: PropTypes.number.isRequired,
  moduleName: PropTypes.string.isRequired
};

export default DeleteBulkTestModal;

const ModuleWrapper = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${white};
  padding: 30px;
  text-align: center;
`;

const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CancelBtn = styled.div`
  margin-top: 8px !important;
  width: 120px;
  font-size: 12px;
  color: ${white};
  background: ${themeColor};
  padding: 8px;
  margin: 0px;
  line-height: 2.2em;
  text-transform: uppercase;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  color: ${white};
  cursor: pointer;
  &:hover {
    background: ${themeColor};
  }
`;

const RemoveBtn = styled.div`
  margin-top: 8px !important;
  width: 120px;
  font-size: 12px;
  color: ${themeColor};
  background: white;
  padding: 8px;
  margin: 0px;
  border: 1px solid ${themeColor};
  line-height: 2.2em;
  text-transform: uppercase;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  color: ${({ isTestAdded, remove }) => (isTestAdded && remove ? red : themeColor)};
  cursor: pointer;
  &:hover {
    background: ${lightGrey};
  }
`;

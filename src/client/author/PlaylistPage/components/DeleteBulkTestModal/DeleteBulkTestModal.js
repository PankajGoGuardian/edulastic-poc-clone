import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Modal from "react-responsive-modal";
import { white, themeColor, lightGrey, grey } from "@edulastic/colors";

const ModalStyles = {
  minWidth: 450,
  borderRadius: "5px",
  "background-color": lightGrey,
  padding: "30px"
};

const DeleteBulkTestModal = props => {
  const { isVisible, markedTests, onClose, moduleName, handleBulkTestDelete, modulesNamesCountMap } = props;

  const onRemoveClick = () => {
    handleBulkTestDelete(modulesNamesCountMap.length);
    onClose();
  };

  return (
    <Modal styles={{ modal: ModalStyles }} open={isVisible} onClose={onClose} title="Remove" center>
      <h2>Remove</h2>
      <ModuleWrapper data-cy="remove-count">
        {modulesNamesCountMap.length
          ? modulesNamesCountMap.map(({ count, mName }, i) => (
            <h3>
              <StyledSpan>{count}</StyledSpan> of the selected {count > 1 ? "tests" : "test"} will be removed from{" "}
              <StyledSpan>{mName}</StyledSpan>
            </h3>
          ))
          : "The selected tests are not associated with any modules yet."}
      </ModuleWrapper>
      <FooterWrapper>
        <CancelBtn onClick={onClose}>No, Cancel</CancelBtn>
        <RemoveBtn data-cy="bulk-remove" onClick={onRemoveClick}>{modulesNamesCountMap.length ? "Yes, Remove" : "Clear Selected"}</RemoveBtn>
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

const StyledSpan = styled.span`
  font-weight: 600;
`;

const ModuleWrapper = styled.ul`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  background: ${white};
  border-radius: 10px;
  padding: 30px 30px;
  text-align: center;
  box-shadow: ${grey} 2px 3px 10px 0px;
`;

const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const RemoveBtn = styled.div`
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

const CancelBtn = styled.div`
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

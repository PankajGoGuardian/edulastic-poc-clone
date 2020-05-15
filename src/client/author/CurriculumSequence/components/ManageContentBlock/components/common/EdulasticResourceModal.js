import React from "react";
import PropTypes from "prop-types";
import Modal from "react-responsive-modal";
import { white } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";
import { ModalHeader, ModalContent, ModalFooter } from "./commonStyles";

// A common bare-bone view modal component to add resource types

const EdulasticResourceModal = ({
  isVisible = false,
  closeCallback = () => {},
  submitCallback = () => {},
  headerText = "",
  okText = "SUBMIT",
  canceltext = "CANCEL",
  hideFooter = false,
  smallFont = false,
  children,
  maxWidth = null
}) => (
  <Modal
    open={isVisible}
    onClose={closeCallback}
    footer={null}
    styles={{
      modal: {
        minWidth: "630px",
        maxWidth: maxWidth || "630px",
        padding: "20px 40px",
        background: white
      },
      closeIcon: {
        cursor: "pointer",
        width: "34px",
        height: "34px",
        marginRight: "20px",
        marginTop: "5px"
      }
    }}
  >
    <ModalHeader smallFont={smallFont}>{headerText}</ModalHeader>
    <ModalContent hideFooter={hideFooter}>{children}</ModalContent>
    {!hideFooter && (
      <ModalFooter>
        <EduButton isGhost width="180px" key="cancel" onClick={closeCallback}>
          {canceltext}
        </EduButton>
        <EduButton width="180px" key="submit" onClick={submitCallback}>
          {okText}
        </EduButton>
      </ModalFooter>
    )}
  </Modal>
);

EdulasticResourceModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  okText: PropTypes.string,
  canceltext: PropTypes.string,
  hideFooter: PropTypes.bool,
  smallFont: PropTypes.bool,
  maxWidth: PropTypes.string
};

export default EdulasticResourceModal;

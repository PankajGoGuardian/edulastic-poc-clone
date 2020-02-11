import React, { useState } from "react";
import { Button } from "antd";
import ReportIssue from "../../../author/src/components/common/PreviewModal/ReportIssue";
import styled from "styled-components";
import ReportIssueConfirmaModal from "./ReportIssueConfirmaModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const ReportIssuePopover = ({ item }) => {
  const [visible, setVisibility] = useState(false);
  const [showConfirmModal, toggleModal] = useState(false);
  const [confirmationResponse, setResponse] = useState(false);

  const toggleVisibility = _visible => {
    setVisibility(_visible);
    if (!_visible) setResponse(false);
  };

  const handleResponse = value => {
    setResponse(value);
    toggleModal(false);
    if (!value) setVisibility(false);
  };

  return (
    <>
      <Popover style={visible ? { opacity: "1" } : { opacity: "0", height: "0px", width: "0px", overflow: "hidden" }}>
        <ReportIssue
          textareaRows="5"
          item={item}
          toggleReportIssue={() => toggleVisibility(false)}
          visible={visible}
          toggleModal={toggleModal}
          confirmationResponse={confirmationResponse}
        />
      </Popover>

      <StyledButton title="Report Issue" type="danger" onClick={() => toggleVisibility(!visible)}>
        <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
      </StyledButton>
      <ReportIssueConfirmaModal toggleModal={toggleModal} visible={showConfirmModal} handleResponse={handleResponse} />
    </>
  );
};
export default ReportIssuePopover;

const StyledButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 35px;
  border: none;
  font-size: 20px;
  background: transparent;
  padding: 0px 10px;
  font-size: 20px;
  &:focus {
    background: transparent;
  }
`;

const Popover = styled.div`
  position: fixed;
  width: 500px;
  right: 35px;
  bottom: 70px;
  background-color: white;
  border-radius: 10px;
  padding: 0px 15px 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
`;

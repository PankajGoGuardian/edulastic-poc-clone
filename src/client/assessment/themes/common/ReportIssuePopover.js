import React, { useState } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import ReportIssueConfirmaModal from './ReportIssueConfirmaModal'
import ReportIssue from '../../../author/src/components/common/PreviewModal/ReportIssue'

const ReportIssuePopover = ({ item, playerSkinType }) => {
  const [visible, setVisibility] = useState(false)
  const [showConfirmModal, toggleModal] = useState(false)
  const [confirmationResponse, setResponse] = useState(false)

  const toggleVisibility = (_visible) => {
    setVisibility(_visible)
    if (!_visible) setResponse(false)
  }

  const handleResponse = (value) => {
    setResponse(value)
    toggleModal(false)
    if (!value) setVisibility(false)
  }

  return (
    <>
      <Popover
        isDrc={playerSkinType === 'drc'}
        style={
          visible
            ? { opacity: '1' }
            : { opacity: '0', height: '0px', width: '0px', overflow: 'hidden' }
        }
      >
        {visible && (
          <ReportIssue
            textareaRows="5"
            item={item}
            toggleReportIssue={() => toggleVisibility(false)}
            visible={visible}
            toggleModal={toggleModal}
            confirmationResponse={confirmationResponse}
          />
        )}
      </Popover>

      <StyledButton
        isDrc={playerSkinType === 'drc'}
        title="Report Issue"
        type="danger"
        onClick={() => toggleVisibility(!visible)}
        tabIndex="-1"
      >
        <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
      </StyledButton>
      <ReportIssueConfirmaModal
        toggleModal={toggleModal}
        visible={showConfirmModal}
        handleResponse={handleResponse}
      />
    </>
  )
}
export default ReportIssuePopover

const StyledButton = styled(Button)`
  position: fixed;
  bottom: ${(props) => (props.isDrc ? '150px' : '20px')};
  right: 35px;
  border: none;
  font-size: 20px;
  background: transparent;
  padding: 0px 10px;
  font-size: 20px;
  z-index: 20000;
  &:focus {
    background: transparent;
  }
`

const Popover = styled.div`
  position: fixed;
  width: 500px;
  right: ${(props) => (props.isDrc ? '85px' : '35px')};
  bottom: ${(props) => (props.isDrc ? '80px' : '70px')};
  background-color: white;
  border-radius: 10px;
  padding: 0px 15px 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
`

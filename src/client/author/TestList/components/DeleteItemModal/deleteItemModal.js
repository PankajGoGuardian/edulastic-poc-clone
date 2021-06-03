import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { EduButton, RadioBtn } from '@edulastic/common'
import {
  ModalWrapper,
  InitOptions,
  StyledInput,
  ModalFooter,
  LightGreenSpan,
} from '../../../../common/components/ConfirmationModal/styled'

import { deleteTestRequestAction } from '../../ducks'
import { StyledRadioGroup } from '../../../TestPage/components/Setting/components/Container/styled'

const DELETE_TYPES = {
  ROLLBACK: 'rollback',
  DELETE_TEST: 'delete',
}
const DeleteItemModal = ({
  isVisible,
  onCancel,
  deleteTestRequest,
  testId,
  test,
  view = 'testLibrary',
}) => {
  const [confirmText, setConfirmText] = useState('')
  const [deleteType, setDeleteType] = useState('')

  const handleDeleteTypeChange = (e) => {
    setDeleteType(e.target.value)
  }
  const showRollback =
    test &&
    test.status === 'draft' &&
    test._id !== test.versionId &&
    !!test.previousTestId

  useEffect(() => {
    if (deleteType === DELETE_TYPES.ROLLBACK) {
      setConfirmText('delete')
    }
    if (deleteType === DELETE_TYPES.DELETE_TEST) {
      setConfirmText('')
    }
  }, [deleteType])

  return (
    <StyledModal
      visible={isVisible}
      width="570px"
      title="Delete Test"
      onCancel={() => onCancel()}
      centered
      footer={[
        <ModalFooter>
          <EduButton
            data-cy="cancel"
            isGhost
            key="cancel"
            onClick={() => onCancel(false)}
          >
            {deleteType === DELETE_TYPES.ROLLBACK ? 'Cancel' : 'No, Cancel'}
          </EduButton>
          <EduButton
            key="delete"
            data-cy="submitConfirm"
            disabled={confirmText.toLocaleLowerCase() !== 'delete'}
            onClick={() => {
              if (confirmText.toLocaleLowerCase() === 'delete') {
                deleteTestRequest({ testId, type: deleteType, view })
              }
            }}
          >
            {deleteType === DELETE_TYPES.ROLLBACK ? 'Proceed' : 'Yes, Delete'}
          </EduButton>
        </ModalFooter>,
      ]}
    >
      <InitOptions className="delete-message-container">
        {showRollback && (
          <div style={{ textAlign: 'left' }}>
            <LeadingPara>
              Please select the action you would like to proceed with.
            </LeadingPara>
            <p>
              <RadioGroup onChange={handleDeleteTypeChange} value={deleteType}>
                <RadioBtn
                  value={DELETE_TYPES.ROLLBACK}
                  key={DELETE_TYPES.ROLLBACK}
                >
                  <OptionText>Rollback Changes</OptionText>
                  <OptionExplanation>
                    This will delete changes saved in draft and restore the test
                    to last published state.
                  </OptionExplanation>
                </RadioBtn>
                <RadioBtn
                  value={DELETE_TYPES.DELETE_TEST}
                  key={DELETE_TYPES.DELETE_TEST}
                >
                  <OptionText>Delete the test</OptionText>
                  <OptionExplanation>
                    This will completely remove the test and the test will no
                    longer be available in Test Library.
                  </OptionExplanation>
                </RadioBtn>
              </RadioGroup>
            </p>
          </div>
        )}
        {(deleteType === DELETE_TYPES.DELETE_TEST || !showRollback) && (
          <div>
            <div className="delete-message">
              <p>Are you sure you want to delete this test?</p>
              <p>
                If yes type <LightGreenSpan>DELETE</LightGreenSpan> in the space
                given below and proceed.
              </p>
            </div>
            <div className="delete-confirm-contaner">
              <StyledInput
                data-cy="confirmationInput"
                className="delete-confirm-input"
                type="text"
                onChange={(event) => setConfirmText(event.currentTarget.value)}
                placeholder="Type the action"
              />
            </div>
          </div>
        )}
      </InitOptions>
    </StyledModal>
  )
}

const ConnectedDeleteItemModal = connect(null, {
  deleteTestRequest: deleteTestRequestAction,
})(DeleteItemModal)

export { ConnectedDeleteItemModal as DeleteItemModal }

const StyledModal = styled(ModalWrapper)`
  padding: 15px 45px 30px 45px;
  .ant-modal-header {
    padding: 10px 0;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-content {
    .ant-modal-title {
      font-size: 22px;
      font-weight: bold;
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
      .delete-message {
        font-size: 13px;
      }
      .delete-confirm-input {
        font-size: 13px;
        margin-top: 30px;
      }
      .delete-message-container {
        font-weight: 600;
        background: none;
      }
    }
  }
`
const LeadingPara = styled.p`
  margin-bottom: 30px;
  font-weight: normal;
`

const RadioGroup = styled(StyledRadioGroup)`
  .ant-radio-wrapper {
    margin-bottom: 20px;
  }
  &.ant-radio-group .ant-radio-wrapper .ant-radio + span {
    text-transform: unset;
  }
  margin-bottom: 30px;
`

const OptionText = styled.p`
  font-size: 10px;
  color: #434b5d;
  text-transform: uppercase;
  margin-bottom: 5px;
`

const OptionExplanation = styled.p`
  color: #6a737f;
`

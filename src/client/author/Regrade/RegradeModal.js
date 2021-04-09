import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal as AntdModal, Radio, Row, Spin } from 'antd'
import styled from 'styled-components'
import { get } from 'lodash'
import { FlexContainer, EduButton } from '@edulastic/common'
import { TitleWrapper } from '@edulastic/common/src/components/MainHeader'
import {
  getRegradeFirebaseDocIdSelector,
  toggleRegradeModalAction,
  getRegradeModalStateSelector,
} from '../TestPage/ducks'
import { ACTIONS } from './MainContent'
import { InputsWrapper } from './styled'
import { updateCorrectTestItemAction } from '../src/actions/classBoard'
import RegradeListenerLcb from './RegradeListenerLcb'

const Group = Radio.Group
const RegradeModal = ({
  districtId,
  toggleRegradeModal,
  modalState,
  updateCorrectItem,
  regradeFirebaseDocId,
}) => {
  const { oldTestId, newTestId } = modalState || {}
  const settings = {
    newTestId,
    oldTestId,
    assignmentList: [],
    districtId,
    applyChangesChoice: 'ALL',
    options: {
      removedQuestion: 'DISCARD',
      addedQuestion: 'SKIP',
      testSettings: 'EXCLUDE',
      editedQuestion: 'SCORE',
    },
  }

  const [regradeSettings, regradeSettingsChange] = useState(settings)
  const [isInRegrade, setIsInRegrade] = useState(false)
  const [confirmRegrade, setConfirmRegrade] = useState(false)

  const onUpdateSettings = (key, value) => {
    const newState = {
      ...regradeSettings,
      options: {
        ...regradeSettings.options,
        [key]: value,
      },
    }
    regradeSettingsChange(newState)
  }

  const onCloseRegardModal = () => {
    toggleRegradeModal(null)
  }

  const onApplySettings = () => {
    if (!confirmRegrade) {
      return setConfirmRegrade(true)
    }
    updateCorrectItem({
      ...modalState.itemData,
      proceedRegrade: true,
      editRegradeChoice: regradeSettings.options.editedQuestion,
      callback: toggleRegradeModal,
    })
    setIsInRegrade(true)
  }

  return (
    <Modal
      visible
      centered
      title={
        <FlexContainer
          height="36px"
          alignItems="center"
          justifyContent="flex-start"
        >
          <TitleWrapper>{confirmRegrade ? 'CONFIRM' : 'REGRADE'}</TitleWrapper>
        </FlexContainer>
      }
      footer={
        <FlexContainer justifyContent="flex-end">
          <EduButton
            isBlue
            isGhost
            onClick={onCloseRegardModal}
            disabled={isInRegrade}
            width="145px"
            height="36px"
          >
            {confirmRegrade ? 'NO, CANCEL' : 'DISCARD CHANGES'}
          </EduButton>
          <EduButton
            isBlue
            width="145px"
            height="36px"
            data-cy="regrade"
            disabled={isInRegrade}
            onClick={onApplySettings}
          >
            {confirmRegrade ? 'YES, REGRADE' : 'PUBLISH & REGRADE'}
          </EduButton>
        </FlexContainer>
      }
      width="620px"
    >
      {isInRegrade && <Spin />}
      {confirmRegrade ? (
        'Are you sure you want to regrade ?'
      ) : (
        <InputsWrapper data-cy="edited-items" mt="0px">
          <Row>
            <p>
              The change that has been made to the item requires student
              responses that have been already submitted to be regraded. How
              would you like to proceed?
            </p>
            <br />
          </Row>
          <Group
            defaultValue={regradeSettings.options.editedQuestion}
            onChange={(e) => onUpdateSettings('editedQuestion', e.target.value)}
          >
            <Row key="editedQuestion">
              <Radio data-cy="skip-grading" value={ACTIONS.SKIP}>
                Skip rescoring
              </Radio>
              <Radio data-cy="restore-grading" value={ACTIONS.SCORE}>
                Rescore automatically
              </Radio>
              <Radio data-cy="manual-grading" value={ACTIONS.MANUAL}>
                Mark for manual grading
              </Radio>
            </Row>
          </Group>
        </InputsWrapper>
      )}
      {regradeFirebaseDocId && (
        <RegradeListenerLcb onCloseModal={onCloseRegardModal} />
      )}
    </Modal>
  )
}

export default connect(
  (state) => ({
    modalState: getRegradeModalStateSelector(state),
    districtId: get(state, ['user', 'user', 'orgData', 'districtIds', 0]),
    regradeFirebaseDocId: getRegradeFirebaseDocIdSelector(state),
  }),
  {
    toggleRegradeModal: toggleRegradeModalAction,
    updateCorrectItem: updateCorrectTestItemAction,
  }
)(RegradeModal)

const Modal = styled(AntdModal)`
  .ant-modal-header {
    padding: 8px 30px 8px 24px;
    .question-bank-icon {
      width: 16px;
      height: 19px;
    }
  }
  .ant-modal-close-x {
    display: none;
  }
`

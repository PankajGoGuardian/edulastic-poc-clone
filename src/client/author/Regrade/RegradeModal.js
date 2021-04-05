import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Modal as AntdModal, Radio, Row, Spin } from 'antd'
import styled from 'styled-components'
import { get } from 'lodash'
import { FlexContainer, EduButton } from '@edulastic/common'
import { TitleWrapper } from '@edulastic/common/src/components/MainHeader'
import { fetchAssignmentsAction } from '../TestPage/components/Assign/ducks'
import {
  setRegradeSettingsDataAction,
  getRegradeFirebaseDocIdSelector,
  getRegradeSettingsAction,
  toggleRegradeModalAction,
  getIsLoadRegradeSettingsSelector,
  getAvaialbleRegradeSettingsSelector,
  getRegradeModalStateSelector,
} from '../TestPage/ducks'
import { ACTIONS } from './MainContent'
import RegradeNotificationListener from './RegradeNotificationListener'
import { InputsWrapper } from './styled'

const Group = Radio.Group
const RegradeModal = ({
  getAssignmentsByTestId,
  setRegradeSettings,
  districtId,
  getRegradeActions,
  isLoadRegradeSettings,
  availableRegradeSettings,
  toggleRegradeModal,
  regradeFirebaseDocId,
  modalState,
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

  const onApplySettings = () => {
    if (isLoadRegradeSettings) {
      return
    }
    setRegradeSettings(regradeSettings)
    setIsInRegrade(true)
  }

  const onCloseRegardModal = () => {
    toggleRegradeModal(null)
  }

  useEffect(() => {
    getAssignmentsByTestId({ testId: oldTestId, regradeAssignments: true })
    getRegradeActions({ oldTestId, newTestId })
  }, [])

  const showEdit = availableRegradeSettings.includes('EDIT')

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
          <TitleWrapper>Regrade</TitleWrapper>
        </FlexContainer>
      }
      footer={
        <FlexContainer justifyContent="flex-end">
          <EduButton
            isBlue
            isGhost
            onClick={onCloseRegardModal}
            disabled={isLoadRegradeSettings || isInRegrade}
            width="115px"
            height="36px"
          >
            CANCEL
          </EduButton>
          <EduButton
            isBlue
            width="115px"
            height="36px"
            data-cy="regrade"
            disabled={isLoadRegradeSettings || isInRegrade}
            onClick={onApplySettings}
          >
            Regrade
          </EduButton>
        </FlexContainer>
      }
      width="620px"
    >
      {(isLoadRegradeSettings || isInRegrade) && <Spin />}
      {showEdit && !isLoadRegradeSettings && (
        <InputsWrapper data-cy="edited-items" mt="0px">
          <Row>
            <p>
              the change that has been made to the item requires student
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
        <RegradeNotificationListener
          noRedirect
          onCloseModal={onCloseRegardModal}
        />
      )}
    </Modal>
  )
}

export default connect(
  (state) => ({
    modalState: getRegradeModalStateSelector(state),
    districtId: get(state, ['user', 'user', 'orgData', 'districtIds', 0]),
    regradeFirebaseDocId: getRegradeFirebaseDocIdSelector(state),
    isLoadRegradeSettings: getIsLoadRegradeSettingsSelector(state),
    availableRegradeSettings: getAvaialbleRegradeSettingsSelector(state),
  }),
  {
    getAssignmentsByTestId: fetchAssignmentsAction,
    setRegradeSettings: setRegradeSettingsDataAction,
    getRegradeActions: getRegradeSettingsAction,
    toggleRegradeModal: toggleRegradeModalAction,
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

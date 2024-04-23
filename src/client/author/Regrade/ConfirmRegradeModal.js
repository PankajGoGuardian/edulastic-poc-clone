import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import { black } from '@edulastic/colors'
import { ConfirmationModal } from '../src/components/common/ConfirmationModal'
import {
  getAvaialbleRegradeSettingsSelector,
  getRegradingSelector,
  getTestSelector,
  regradeTestAction,
} from '../TestPage/ducks'
import Actions from './Actions'
import { getUserOrgId } from '../src/selectors/user'
import { StyledIconInfoBlack, StyledQuestionTypeChangeInfo } from './styled'

const { AddedItems, EditedItems } = Actions

const ConfirmRegradeModal = ({
  visible,
  onCancel,
  loading,
  creating,
  availableRegradeSettings,
  test,
  districtId,
  regradeTest,
  isRegrading,
}) => {
  const showAdd = availableRegradeSettings.includes('ADD')
  const showEdit = availableRegradeSettings.includes('EDIT')
  const showLabel = showAdd && showEdit
  const [settings, setSettings] = useState({
    addedQuestion: 'SKIP',
    editedQuestion: 'SCORE',
  })

  const onUpdateSettings = (key, value) => {
    setSettings((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const onRegradeProceed = () => {
    regradeTest({
      notify: true,
      newTestId: test._id,
      oldTestId: test.previousTestId,
      assignmentList: [],
      districtId,
      applyChangesChoice: 'ALL',
      options: {
        removedQuestion: 'DISCARD',
        testSettings: 'ALL',
        ...settings,
      },
    })
  }

  const showLoader = loading || creating || isRegrading

  return (
    <ConfirmationModal
      centered
      visible={visible}
      onCancel={onCancel}
      title={<p style={{ fontSize: '22px' }}>Assignment Regrade</p>}
      maskClosable={false}
      closable={!showLoader}
      modalWidth="520px"
      footer={[
        <EduButton
          height="40px"
          width="200px"
          isGhost
          disabled={showLoader}
          onClick={onCancel}
          data-cy="cancelRegrade"
        >
          No, Cancel
        </EduButton>,
        <EduButton
          height="40px"
          width="200px"
          marginLeft="20px"
          data-cy="applyRegrade"
          loading={showLoader}
          disabled={showLoader}
          onClick={onRegradeProceed}
        >
          Publish & Regrade
        </EduButton>,
      ]}
    >
      <div style={{ textAlign: 'left' }}>
        {showAdd && (
          <AddedItems
            onUpdateSettings={onUpdateSettings}
            settings={settings}
            showLabel={showLabel}
          />
        )}
        {showEdit && (
          <EditedItems
            onUpdateSettings={onUpdateSettings}
            settings={settings}
            showLabel={showLabel}
          />
        )}
        <StyledQuestionTypeChangeInfo>
          <StyledIconInfoBlack fillColor={black} /> Items that have been changed
          to a new type will not be rescored, and the current student responses
          will be permanently deleted.
        </StyledQuestionTypeChangeInfo>
      </div>
    </ConfirmationModal>
  )
}

export default connect(
  (state) => ({
    loading: state?.tests?.loading,
    creating: state?.tests?.creating,
    availableRegradeSettings: getAvaialbleRegradeSettingsSelector(state),
    test: getTestSelector(state),
    districtId: getUserOrgId(state),
    isRegrading: getRegradingSelector(state),
  }),
  {
    regradeTest: regradeTestAction,
  }
)(ConfirmRegradeModal)

export const InputsWrapper = styled.div`
  margin-top: ${({ mt }) => mt || '20px'};
  .ant-radio-wrapper {
    display: block;
  }
`

export const OptionTitle = styled.h3`
  font-weight: bold;
`

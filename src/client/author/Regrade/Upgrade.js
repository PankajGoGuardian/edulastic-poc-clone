import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { EduButton } from '@edulastic/common'
import { get } from 'lodash'
import { ConfirmationModal } from '../src/components/common/ConfirmationModal'
import {
  getAvaialbleRegradeSettingsSelector,
  getIsLoadRegradeSettingsSelector,
  getRegradeSettingsAction,
  getRegradingSelector,
  getShowUpgradePopupSelector,
  getTestEntitySelector,
  regradeTestAction,
  setShowUpgradePopupAction,
} from '../TestPage/ducks'
import { getTestsLoadingSelector } from '../TestList/ducks'
import Actions from './Actions'

const { AddedItems, EditedItems } = Actions

const Upgrade = ({
  visible,
  isRegrading,
  setShowUpgradePopup,
  history,
  getRegradeSettings,
  loadRegradeActions,
  availableRegradeSettings,
  test,
  regradeTest,
  districtId,
  testLoading,
}) => {
  const showAdd = availableRegradeSettings.includes('ADD')
  const showEdit = availableRegradeSettings.includes('EDIT')
  const [proceedUpgrade, setProceedUpgrade] = useState(false)
  const [settings, setSettings] = useState({
    addedQuestion: 'SKIP',
    editedQuestion: 'SCORE',
  })

  useEffect(() => {
    if (visible && !loadRegradeActions && !testLoading && test._id) {
      getRegradeSettings({
        newTestId: test._id,
        oldTestId: test.previousTestId,
      })
    }
  }, [visible, test._id, testLoading])

  useEffect(() => {
    return () => {
      setShowUpgradePopup(false)
    }
  }, [])

  const onUpdateSettings = (key, value) => {
    setSettings((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const onRegradeProceed = () => {
    if (loadRegradeActions) {
      return
    }
    if (proceedUpgrade) {
      return regradeTest({
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
    if (
      availableRegradeSettings.some((item) => item === 'EDIT' || item === 'ADD')
    ) {
      return setProceedUpgrade(true)
    }
    regradeTest({
      notify: false,
      newTestId: test._id,
      oldTestId: test.previousTestId,
      assignmentList: [],
      districtId,
      applyChangesChoice: 'ALL',
      options: {
        removedQuestion: 'DISCARD',
        testSettings: 'ALL',
        addedQuestion: 'SKIP',
        editedQuestion: 'SCORE',
      },
    })
  }

  const onCancel = () => {
    history.push('/author/assignments')
  }
  const loader = loadRegradeActions || isRegrading
  const footerButtons = proceedUpgrade
    ? [
        <EduButton
          height="40px"
          width="200px"
          isGhost
          disabled={loader}
          onClick={onCancel}
          data-cy="cancelRegrade"
        >
          No, Cancel
        </EduButton>,
        <EduButton
          height="40px"
          width="200px"
          marginLeft="20px"
          loading={loader}
          disabled={loader}
          onClick={onRegradeProceed}
          data-cy="applyRegrade"
        >
          Publish & Regrade
        </EduButton>,
      ]
    : [
        <EduButton
          height="40px"
          width="200px"
          loading={loader}
          disabled={loader}
          onClick={onRegradeProceed}
          data-cy="upgradeProceed"
        >
          Proceed
        </EduButton>,
      ]
  return (
    <ConfirmationModal
      centered
      visible={visible}
      title={
        <p style={{ fontSize: '22px' }}>
          {proceedUpgrade ? 'Assignment Regrade' : 'Edit Test'}
        </p>
      }
      onCancel={onCancel}
      maskClosable={false}
      closable={!loader}
      footer={footerButtons}
      modalWidth="520px"
    >
      <div>
        {proceedUpgrade ? (
          <>
            {showAdd && (
              <AddedItems
                onUpdateSettings={onUpdateSettings}
                settings={settings}
              />
            )}
            {showEdit && (
              <EditedItems
                onUpdateSettings={onUpdateSettings}
                settings={settings}
              />
            )}
          </>
        ) : (
          <p>
            The test has been edited by one of the co-authors. Please upgrade to
            latest version of the test to make further edits.
          </p>
        )}
      </div>
    </ConfirmationModal>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      availableRegradeSettings: getAvaialbleRegradeSettingsSelector(state),
      isRegrading: getRegradingSelector(state),
      visible: getShowUpgradePopupSelector(state),
      loadRegradeActions: getIsLoadRegradeSettingsSelector(state),
      test: getTestEntitySelector(state),
      districtId: get(state, ['user', 'user', 'orgData', 'districtIds', 0]),
      testLoading: getTestsLoadingSelector(state),
    }),
    {
      regradeTest: regradeTestAction,
      setShowUpgradePopup: setShowUpgradePopupAction,
      getRegradeSettings: getRegradeSettingsAction,
    }
  )
)

export default enhance(Upgrade)

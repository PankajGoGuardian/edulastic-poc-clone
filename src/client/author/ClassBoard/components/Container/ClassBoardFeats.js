import React from 'react'
import { Dropdown, Tooltip } from 'antd'
import {
  IconAddStudents,
  IconDownload,
  IconMarkAsAbsent,
  IconMarkAsSubmitted,
  IconPause,
  IconMoreHorizontal,
  IconPlay,
  IconPrint,
  IconRedirect,
  IconRemove,
} from '@edulastic/icons'
import {
  RedirectButton,
  ButtonIconWrap,
  MenuItems,
  DropMenu,
  ClassBoardFeats,
} from './styled'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

const classBoardFeats = (props) => {
  const {
    classId,
    showResume,
    onClickPrint,
    isItemsVisible,
    handleRedirect,
    isRedirectButtonDisabled,
    handleTogglePauseStudents,
    handleShowMarkAsAbsentModal,
    handleShowAddStudentsPopup,
    handleShowRemoveStudentsModal,
    handleShowMarkAsSubmittedModal,
    disableMarkSubmitted,
    disableMarkAbsent,
    actionInProgress,
    enableDownload,
    isProxiedByEAAccount,
    handleDownloadGrades,
    lightFadedBlack,
  } = props
  return (
    <ClassBoardFeats>
      <RedirectButton
        disabled={!isItemsVisible}
        first
        data-cy="printButton"
        target="_blank"
        onClick={onClickPrint}
      >
        <ButtonIconWrap>
          <IconPrint />
        </ButtonIconWrap>
        PRINT
      </RedirectButton>
      <Tooltip
        placement="top"
        title={isRedirectButtonDisabled ? 'Redirect is not permitted' : ''}
      >
        <div>
          <RedirectButton
            data-cy="rediectButton"
            onClick={handleRedirect}
            disabled={isRedirectButtonDisabled}
          >
            <ButtonIconWrap>
              <IconRedirect />
            </ButtonIconWrap>
            REDIRECT
          </RedirectButton>
        </div>
      </Tooltip>
      <Dropdown
        getPopupContainer={(triggerNode) => {
          return triggerNode.parentNode
        }}
        overlay={
          <DropMenu>
            <FeaturesSwitch
              inputFeatures="LCBmarkAsSubmitted"
              key="LCBmarkAsSubmitted"
              actionOnInaccessible="hidden"
              groupId={classId}
            >
              <MenuItems
                data-cy="markSubmitted"
                disabled={disableMarkSubmitted}
                onClick={handleShowMarkAsSubmittedModal}
              >
                <IconMarkAsSubmitted width={12} />
                <span>Mark as Submitted</span>
              </MenuItems>
            </FeaturesSwitch>
            <FeaturesSwitch
              inputFeatures="LCBmarkAsAbsent"
              key="LCBmarkAsAbsent"
              actionOnInaccessible="hidden"
              groupId={classId}
            >
              <MenuItems
                data-cy="markAbsent"
                disabled={disableMarkAbsent}
                onClick={handleShowMarkAsAbsentModal}
              >
                <IconMarkAsAbsent />
                <span>Mark as Absent</span>
              </MenuItems>
            </FeaturesSwitch>

            <MenuItems
              data-cy="addStudents"
              disabled={actionInProgress}
              onClick={handleShowAddStudentsPopup}
            >
              <IconAddStudents />
              <span>Add Students</span>
            </MenuItems>
            <MenuItems
              data-cy="removeStudents"
              onClick={handleShowRemoveStudentsModal}
            >
              <IconRemove />
              <span>Unassign Students</span>
            </MenuItems>
            <FeaturesSwitch
              inputFeatures="premium"
              actionOnInaccessible="hidden"
              groupId={classId}
            >
              <MenuItems
                data-cy="pauseStudents"
                onClick={handleTogglePauseStudents(true)}
                disabled={disableMarkAbsent}
              >
                <IconPause />
                <span>Pause Students</span>
              </MenuItems>
            </FeaturesSwitch>
            {showResume && (
              <MenuItems
                data-cy="resumeStudents"
                onClick={handleTogglePauseStudents(false)}
                disabled={disableMarkAbsent}
              >
                <IconPlay />
                <span>Resume Students</span>
              </MenuItems>
            )}
            <MenuItems
              data-cy="downloadGrades"
              disabled={!enableDownload || isProxiedByEAAccount}
              title={
                isProxiedByEAAccount
                  ? 'Bulk action disabled for EA proxy accounts.'
                  : ''
              }
              onClick={() => handleDownloadGrades(false)}
            >
              <IconDownload />
              <span>Download Grades</span>
            </MenuItems>
            <MenuItems
              data-cy="downloadResponse"
              disabled={!enableDownload || isProxiedByEAAccount}
              title={
                isProxiedByEAAccount
                  ? 'Bulk action disabled for EA proxy accounts.'
                  : ''
              }
              onClick={() => handleDownloadGrades(true)}
            >
              <IconDownload
                color={isProxiedByEAAccount ? lightFadedBlack : null}
              />
              <span>Download Response</span>
            </MenuItems>
          </DropMenu>
        }
        placement="bottomRight"
      >
        <RedirectButton data-cy="moreAction" last>
          <ButtonIconWrap className="more">
            <IconMoreHorizontal />
          </ButtonIconWrap>
          MORE
        </RedirectButton>
      </Dropdown>
    </ClassBoardFeats>
  )
}
export default classBoardFeats

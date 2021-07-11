import {
  MainHeader,
  EduButton,
  TypeToConfirmModal,
  notification,
  SimpleConfirmModal,
  captureSentryException,
  DatePickerStyled,
} from '@edulastic/common'
import { LightGreenSpan } from '@edulastic/common/src/components/TypeToConfirmModal/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import withRouter from 'react-router-dom/withRouter'
import React, { useEffect, useState } from 'react'
import * as moment from 'moment'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import ItemsHistoryCard from '../../../PinBoard/itemsHistoryCard'

// components
import { Dropdown, Select, Col } from 'antd'

import GoogleLogin from 'react-google-login'
import {
  IconGoogleClassroom,
  IconClever,
  IconPlusCircle,
  IconPencilEdit,
  IconAssignment,
  IconManage,
  IconRemove,
} from '@edulastic/icons'
import IconArchive from '@edulastic/icons/src/IconArchive'
import { canvasApi } from '@edulastic/api'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {
  Institution,
  DropMenu,
  MenuItems,
  CaretUp,
  SelectStyled,
  OptionWrapper,
} from './styled'

import authorizeCanvas from '../../../../common/utils/CanavsAuthorizationModule'
import { scopes } from '../ClassListContainer/ClassCreatePage'
import AddCoTeacher from './AddCoTeacher/AddCoTeacher'
import UpdateCoTeacher from './UpdateCoTeacher/UpdateCoTeacher'
import {
  getManageCoTeacherModalVisibleStateSelector,
  showUpdateCoTeacherModalAction,
} from '../../ducks'
import SyncModal from './SyncModal'

const Option = Select.Option

const CANVAS = 'canvas'
const GOOGLE = 'google'
const CLEVER = 'clever'

const modalStatus = {}

const Header = ({
  user,
  onEdit,
  fetchClassList,
  selectedClass,
  allowCanvasLogin,
  syncCanvasModal,
  allowGoogleLogin,
  syncGCModal,
  isUserGoogleLoggedIn,
  enableCleverSync,
  syncClassesWithClever,
  added,
  archiveClass,
  location,
  unarchiveClass,
  history,
  entity,
  showCoteacherModal,
  setUpdateCoTeacherModal,
}) => {
  const handleLoginSuccess = (data) => {
    fetchClassList({ data, showModal: false })
  }

  const coTeachers = selectedClass?.owners || []

  const handleError = (err) => {
    notification({ messageKey: 'googleLoginFailed' })
    console.log('error', err)
  }

  const { _id, districtId } = entity
  const [showModal, setShowModal] = useState(false)
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false)
  const [
    showAutomaticUnarchiveModal,
    setShowAutomaticUnarchiveModal,
  ] = useState(false)
  const {
    name,
    type,
    institutionId,
    institutionName = '',
    districtName = '',
    cleverId,
    active,
    atlasId = '',
    endDate,
  } = selectedClass
  const { exitPath } = location?.state || {}
  const isDemoPlaygroundUser = user?.isPlayground

  const typeText = type !== 'class' ? 'Group' : 'Class'

  const [isOpen, setModalStatus] = useState(modalStatus)
  const [sentReq, setReqStatus] = useState(false)
  const [isClassExpired, setIsClassExpired] = useState(false)
  const [classEndDate, setClassEndDate] = useState()

  const toggleModal = (key) => {
    setModalStatus({ [key]: !isOpen[key] })
  }

  if (added && sentReq) {
    setReqStatus(false)
    setModalStatus(false)
  }

  const handleActionMenuClick = () => {
    toggleModal('addCoTeacher')
  }

  const handleArchiveClass = () => {
    archiveClass({ _id, districtId, exitPath, isGroup: type !== 'class' })

    setShowModal(false)
  }
  const handleArchiveClassCancel = () => {
    setShowModal(false)
  }

  const handleSyncWithCanvas = async () => {
    try {
      const result = await canvasApi.getCanvasAuthURI(institutionId)
      if (!result.userAuthenticated) {
        const subscriptionTopic = `canvas:${user?.districtIds?.[0]}_${
          user._id
        }_${user.username || user.email || ''}`
        authorizeCanvas(result.canvasAuthURL, subscriptionTopic)
          .then((res) => {
            syncCanvasModal(res)
          })
          .catch((err) => {
            console.error('Error while authorizing', err)
            notification({ messageKey: 'errorOccuredWhileAuthorizing' })
          })
      } else {
        syncCanvasModal()
      }
    } catch (err) {
      captureSentryException(err)
      notification(
        err.status === 403 && err.response.data?.message
          ? {
              msg: err.response.data?.message,
            }
          : { messageKey: 'errorWhileGettingAuthUri' }
      )
    }
  }

  const classDetails = (
    <>
      {name}
      <Institution>
        {districtName ? `${districtName}, ` : ''}
        {institutionName}
      </Institution>
    </>
  )

  const district = districtName ? `${districtName}, ` : ''

  const classDetail = `${name} \n ${district}${institutionName}`

  const handleCleverSync = () => {
    const classList = [{ ...selectedClass, course: selectedClass?.course?.id }]
    syncClassesWithClever({ classList })
  }

  const getAssignmentsByClass = (classId = '') => () => {
    const filter = {
      classId,
      testType: '',
      termId: '',
    }
    sessionStorage.setItem(
      `assignments_filter_${user._id}`,
      JSON.stringify(filter)
    )
    history.push('/author/assignments')
  }

  const showSyncButtons =
    type === 'class' && active === 1 && !isDemoPlaygroundUser
  const showCleverSyncButton = showSyncButtons && enableCleverSync && cleverId
  const showGoogleSyncButton = showSyncButtons && allowGoogleLogin !== false
  const showCanvasSyncButton = showSyncButtons && allowCanvasLogin

  const options = {
    [CLEVER]: showCleverSyncButton,
    [GOOGLE]: showGoogleSyncButton,
    [CANVAS]: showCanvasSyncButton,
  }

  Object.keys(options).forEach((o) => {
    if (!options[o]) delete options[o]
  })

  const showDropDown = Object.values(options).filter((o) => o).length > 1

  const disabledEndDate = (current) => current && current < moment()

  const handleUnarchiveClass = () => {
    if (isClassExpired) {
      unarchiveClass({
        groupId: _id,
        endDate: new Date(classEndDate).getTime(),
        exitPath,
        isGroup: type !== 'class',
      })
    } else {
      unarchiveClass({ groupId: _id, exitPath, isGroup: type !== 'class' })
    }
    setShowUnarchiveModal(false)
  }
  const handleUnarchiveClassCancel = () => {
    setShowUnarchiveModal(false)
    setShowAutomaticUnarchiveModal(false)
  }

  const handleCanvasAndGoogleSyncButtonClick = () => {
    if (
      (selectedClass?.canvasCode &&
        selectedClass.canvasCode.includes('deactivated')) ||
      (selectedClass?.googleId &&
        selectedClass.googleId.includes('deactivated'))
    ) {
      setShowAutomaticUnarchiveModal(true)
    } else if (selectedClass?.googleId) {
      syncGCModal()
    } else if (selectedClass?.canvasCode) {
      handleSyncWithCanvas()
    }
  }

  useEffect(() => {
    const current = moment()
    if (current.diff(moment(endDate), 'days') >= 1) {
      setIsClassExpired(true)
    }
  }, [endDate])

  return (
    <MainHeader
      Icon={IconManage}
      titleText={classDetail}
      titleMaxWidth="650px"
      headingText={classDetails}
    >
      <div style={{ display: 'flex', alignItems: 'right' }}>
        <ItemsHistoryCard showPinIcon />
        {showDropDown && !isDemoPlaygroundUser ? (
          <SelectStyled
            data-cy="sync-options-dropdown"
            minWidth="200px"
            dropdownStyle={{ zIndex: 1000 }}
            value="Sync Class"
          >
            {Object.keys(options).map((option, index) => {
              if (option === CLEVER) {
                return (
                  <Option
                    key={index}
                    data-cy={`sync-option-${index}`}
                    onClick={handleCleverSync}
                  >
                    <span className="menu-label">Sync with Clever</span>
                    <IconClever width={18} height={18} />
                  </Option>
                )
              }
              if (option === GOOGLE) {
                if (isUserGoogleLoggedIn) {
                  return (
                    <Option
                      key={index}
                      data-cy={`sync-option-${index}`}
                      onClick={handleCanvasAndGoogleSyncButtonClick}
                    >
                      <span className="menu-label">
                        Sync with Google Classroom
                      </span>
                      <IconGoogleClassroom width={18} height={18} />
                    </Option>
                  )
                }
                return (
                  <Option key={index} data-cy={`sync-option-${index}`}>
                    <GoogleLogin
                      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                      buttonText="Sync with Google Classroom"
                      render={(renderProps) => (
                        <OptionWrapper onClick={renderProps.onClick}>
                          <span className="menu-label">
                            Sync with Google Classroom
                          </span>
                          <IconGoogleClassroom />
                        </OptionWrapper>
                      )}
                      scope={scopes}
                      onSuccess={handleLoginSuccess}
                      onFailure={handleError}
                      prompt="consent"
                      responseType="code"
                    />
                  </Option>
                )
              }
              if (option === CANVAS) {
                return (
                  <Option
                    key={index}
                    data-cy={`sync-option-${index}`}
                    onClick={handleCanvasAndGoogleSyncButtonClick}
                  >
                    <span className="menu-label">Sync with Canvas</span>
                    <img
                      alt="Canvas"
                      src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
                      width={18}
                      height={18}
                    />
                  </Option>
                )
              }
              return null
            })}
          </SelectStyled>
        ) : (
          <>
            {showCleverSyncButton && (
              <EduButton isBlue isGhost onClick={handleCleverSync}>
                <IconClever width={18} height={18} />
                <span>SYNC NOW WITH CLEVER</span>
              </EduButton>
            )}
            {showGoogleSyncButton &&
              (isUserGoogleLoggedIn ? (
                <EduButton
                  isBlue
                  isGhost
                  onClick={handleCanvasAndGoogleSyncButtonClick}
                >
                  <IconGoogleClassroom />
                  <span>SYNC WITH GOOGLE CLASSROOM</span>
                </EduButton>
              ) : (
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  buttonText="Sync with Google Classroom"
                  render={(renderProps) => (
                    <EduButton isBlue isGhost onClick={renderProps.onClick}>
                      <IconGoogleClassroom />
                      <span>SYNC WITH GOOGLE CLASSROOM</span>
                    </EduButton>
                  )}
                  scope={scopes}
                  onSuccess={handleLoginSuccess}
                  onFailure={handleError}
                  prompt="consent"
                  responseType="code"
                />
              ))}
            {showCanvasSyncButton && (
              <EduButton
                data-cy="syncCanvasClass"
                isBlue
                isGhost
                onClick={handleCanvasAndGoogleSyncButtonClick}
              >
                <img
                  alt="Canvas"
                  src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
                  width={18}
                  height={18}
                  style={{ marginRight: '10px' }}
                />
                <span>Sync with Canvas Classroom</span>
              </EduButton>
            )}
          </>
        )}
        {active === 1 && (
          <EduButton isBlue onClick={handleActionMenuClick}>
            <IconPlusCircle />
            Add Co-Teacher
          </EduButton>
        )}
        {active !== 1 && (
          <>
            <EduButton isBlue onClick={() => getAssignmentsByClass(_id)()}>
              <IconAssignment />
              View Assignments
            </EduButton>
            {!cleverId && !atlasId && (
              <EduButton isBlue onClick={() => setShowUnarchiveModal(true)}>
                UNARCHIVE
              </EduButton>
            )}
          </>
        )}
        {showAutomaticUnarchiveModal && (
          <SyncModal
            visible={showAutomaticUnarchiveModal}
            handleCancel={handleUnarchiveClassCancel}
            classDetails={selectedClass}
            history={history}
            onProceed={
              selectedClass?.canvasCode ? handleSyncWithCanvas : syncGCModal
            }
          />
        )}
        {showUnarchiveModal && (
          <SimpleConfirmModal
            visible={showUnarchiveModal}
            title={`Unarchive ${typeText}`}
            description={
              <>
                <p style={{ margin: '5px 0' }}>
                  Are you sure you want to Unarchive{' '}
                  <LightGreenSpan>{name}</LightGreenSpan>?
                </p>
                {isClassExpired && (
                  <StyledCol>
                    <p>
                      The end date of class has already passed. Please update
                      the new end date to unarchive.
                    </p>
                    <DatePickerStyled
                      data-cy="endDate"
                      format="DD MMM, YYYY"
                      placeholder="End Date"
                      disabledDate={disabledEndDate}
                      onChange={(date) => setClassEndDate(date)}
                    />
                  </StyledCol>
                )}
              </>
            }
            buttonText="Unarchive"
            onProceed={handleUnarchiveClass}
            onCancel={handleUnarchiveClassCancel}
          />
        )}
        {active === 1 && (
          <Dropdown
            overlay={
              <DropMenu>
                <CaretUp className="fa fa-caret-up" />
                <MenuItems onClick={onEdit}>
                  <IconPencilEdit />
                  <span>{type === 'class' ? 'Edit Class' : 'Edit Group'}</span>
                </MenuItems>
                {!atlasId && !cleverId && (
                  <MenuItems onClick={() => setShowModal(true)}>
                    <IconArchive />
                    <span>
                      {type === 'class' ? 'Archive Class' : 'Archive Group'}
                    </span>
                  </MenuItems>
                )}
                <MenuItems onClick={handleActionMenuClick}>
                  <IconPlusCircle />
                  <span>Add a Co-Teacher</span>
                </MenuItems>
                {coTeachers && coTeachers.length > 1 && (
                  <MenuItems onClick={() => setUpdateCoTeacherModal(true)}>
                    <IconRemove />
                    <span>Manage Co-Teacher</span>
                  </MenuItems>
                )}
                <MenuItems onClick={getAssignmentsByClass(_id)}>
                  <IconAssignment />
                  <span>View Assignments</span>
                </MenuItems>
              </DropMenu>
            }
            getPopupContainer={(trigger) => trigger.parentNode}
            placement="bottomRight"
          >
            <EduButton isBlue data-cy="headerDropDown" IconBtn>
              <FontAwesomeIcon icon={faEllipsisV} />
            </EduButton>
          </Dropdown>
        )}
      </div>
      <AddCoTeacher
        isOpen={isOpen.addCoTeacher}
        type={type}
        selectedClass={selectedClass}
        handleCancel={() => toggleModal('addCoTeacher')}
      />
      {showCoteacherModal && (
        <UpdateCoTeacher
          isOpen={showCoteacherModal}
          type={type}
          selectedClass={selectedClass}
          handleCancel={() => setUpdateCoTeacherModal(false)}
        />
      )}
      {showModal && (
        <TypeToConfirmModal
          modalVisible={showModal}
          title={`Archive ${typeText}`}
          handleOnOkClick={handleArchiveClass}
          wordToBeTyped="ARCHIVE"
          primaryLabel={`Are you sure you want to archive the following ${typeText.toLowerCase()}?`}
          secondaryLabel={
            <p style={{ margin: '5px 0' }}>
              <LightGreenSpan>{name}</LightGreenSpan>
            </p>
          }
          closeModal={handleArchiveClassCancel}
          okButtonText="Archive"
        />
      )}
    </MainHeader>
  )
}

Header.propTypes = {
  onEdit: PropTypes.func,
}

Header.defaultProps = {
  onEdit: () => null,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      user: state?.user?.user,
      showCoteacherModal: getManageCoTeacherModalVisibleStateSelector(state),
    }),
    {
      setUpdateCoTeacherModal: showUpdateCoTeacherModalAction,
    }
  )
)
export default enhance(Header)

const StyledCol = styled(Col)`
  padding: 0px !important;
  margin-top: 20px;

  p {
    margin-bottom: 10px;
  }
  .ant-calendar-picker {
    width: 50%;
  }
`

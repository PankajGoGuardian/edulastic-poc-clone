import React, { useEffect, useState, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { red } from '@edulastic/colors'

// components
import { Input, Spin } from 'antd'
import {
  MainContentWrapper,
  EduButton,
  notification,
  CheckboxLabel,
} from '@edulastic/common'
import Header from './Header'
import MainInfo from './MainInfo'
import StudentsList from './StudentsList'
import BreadCrumb from '../../../src/components/Breadcrumb'
import ActionContainer from './ActionContainer'
import CanvasSyncModal from './CanvasSyncModal'
import { ButtonWrapper, GoogleClassSyncModal } from './styled'

// ducks
import { archiveClassAction } from '../../../Classes/ducks'
import {
  fetchClassListAction,
  fetchStudentsByIdAction,
  syncByCodeModalAction,
  syncClassUsingCodeAction,
  getCanvasCourseListRequestAction,
  getCanvasSectionListRequestAction,
  syncClassWithCanvasAction,
  syncClassWithAtlasAction,
  syncClassesWithCleverAction,
  getClassNotFoundError,
  setClassNotFoundErrorAction,
  unarchiveClassAction,
  getCanvasFetchingStateSelector,
  getGoogleAuthRequiredSelector,
  setGoogleAuthenticationRequiredAction,
  saveGoogleTokensAndRetrySyncAction,
  setSyncClassLoadingAction,
  toggleCreateAssignmentModalAction,
  getIsCreateAssignmentModalVisible,
  setCreateClassTypeDetailsAction,
  setStudentsLoadingStatusAction,
} from '../../ducks'
import {
  getCleverLibraryUserSelector,
  getManualEnrollmentAllowedSelector,
  getUserOrgId,
} from '../../../src/selectors/user'
import ReauthenticateModal from './ReauthenticateModal'
import CreateNewAssignmentModal from '../CreateNewAssignmentModal'
import { setShowAssignmentCreationModalAction } from '../../../Dashboard/ducks'

const ClassDetails = ({
  location,
  history,
  match,
  selectedClass,
  loadStudents,
  fetchClassList,
  isUserGoogleLoggedIn,
  syncClassLoading,
  fetchClassListLoading,
  classLoaded,
  syncClassUsingCode,
  archiveClass,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  canvasCourseList,
  canvasSectionList,
  isCleverDistrict,
  syncClassWithCanvas,
  syncClassesWithClever,
  syncClassWithAtlas,
  setSyncClassLoading,
  user,
  classCodeError = false,
  setClassNotFoundError,
  unarchiveClass,
  isFetchingCanvasData,
  isCleverUser,
  isGoogleAuthRequired,
  setGoogleAuthenticationRequired,
  saveGoogleTokensAndRetrySync,
  userDistrictId,
  isCreateAssignmentModalVisible,
  toggleCreateAssignmentModal,
  setShowAssignmentCreationModal,
  setCreateClassTypeDetails,
  studentsLoadingStatus,
  manualEnrollmentAllowed,
}) => {
  const { editPath, exitPath } = location?.state || {}
  const {
    name,
    type,
    cleverId,
    institutionId,
    districtId,
    syncGoogleCoTeacher = false,
    googleId,
    canvasCode,
  } = selectedClass
  const [isAutoArchivedClass, setIsAutoArchivedClass] = useState(false)
  const isCoTeacherFlagSet =
    googleId && !isAutoArchivedClass ? syncGoogleCoTeacher : true
  const [coTeacherFlag, setCoTeacherFlag] = useState(isCoTeacherFlagSet)
  const typeText = type !== 'class' ? 'group' : 'class'
  const { classId } = match.params

  // sync checks for institution
  const {
    allowGoogleClassroom: allowGoogleLogin,
    allowCanvas: allowCanvasLogin,
    searchAndAddStudents,
  } = useMemo(
    () =>
      user?.orgData?.policies?.institutions?.find(
        (i) => i.institutionId === institutionId
      ) ||
      user?.orgData?.policies?.district ||
      {},
    [user?.orgData?.policies, institutionId]
  )
  const enableCleverSync = isCleverUser && cleverId

  const googleCode = React.createRef()

  const [disabled, setDisabled] = useState(
    selectedClass && !selectedClass.googleCode
  )
  const [showCanvasSyncModal, setCanvasSyncModalVisibility] = useState(false)
  const [openGCModal, setOpenGCModal] = useState(false)
  const [gCode, setGCode] = useState(selectedClass.googleCode)

  useEffect(() => {
    if (!fetchClassListLoading) {
      setGCode(selectedClass.googleCode)
      setOpenGCModal(true)
    }
  }, [fetchClassListLoading])

  useEffect(() => {
    if (!syncClassLoading && !classCodeError) {
      if (openGCModal) setOpenGCModal(false)
      if (showCanvasSyncModal) setCanvasSyncModalVisibility(false)
    }
  }, [syncClassLoading])

  useEffect(() => {
    if (classId) {
      loadStudents({ classId })
    }
    setOpenGCModal(false)
  }, [classId])

  useEffect(() => {
    return () => {
      // componentWillUnmount here:
      studentsLoadingStatus(true)
    }
  }, [])

  const handleEditClick = () => {
    const currentClassId = selectedClass._id || match.params.classId
    history.push({
      pathname: editPath || `/author/manageClass/${currentClassId}/edit`,
      state: {
        type: typeText,
        exitPath,
        showPath: match.url,
        exitToShow: true,
      },
    })
  }

  const handleSyncGC = () => {
    if (googleCode.current.state.value) {
      syncClassUsingCode({
        googleCode: googleCode.current.state.value,
        groupId: selectedClass._id,
        institutionId,
        syncGoogleCoTeacher: coTeacherFlag,
      })
    } else {
      notification({ messageKey: 'enterValidGoogleClassroomCode' })
    }
  }

  const onCoTeacherChange = ({ target }) => {
    setCoTeacherFlag(target.checked)
  }

  const closeGoogleSyncModal = () => {
    setOpenGCModal(false)
    setDisabled(true)
    setClassNotFoundError(false)
  }

  const getBreadCrumbData = () => {
    const pathList = match.url.split('/')
    let breadCrumbData = []
    const classBreadCrumb = {
      title: `${name}`,
      to: match.url,
      state: { type: typeText, exitPath, editPath },
    }
    // pathList[2] determines the origin of the ClassDetails component
    switch (pathList[2]) {
      case 'groups':
        breadCrumbData = [
          {
            title: pathList[2].split('-').join(' '),
            to: `/author/${pathList[2]}`,
          },
        ]
        break
      case 'manageClass':
      default:
        breadCrumbData = [
          {
            title: 'MANAGE CLASS',
            to: '/author/manageClass',
          },
          ...(type !== 'class'
            ? [
                {
                  title: 'GROUPS',
                  to: '/author/manageClass',
                  state: { currentTab: 'group' },
                },
              ]
            : []),
        ]
    }
    return [...breadCrumbData, classBreadCrumb]
  }

  const viewAssessmentHandler = () => {}

  const syncCanvasModal = () => {
    setCanvasSyncModalVisibility(true)
  }

  const handleCreateNewAssignmentClick = () => {
    toggleCreateAssignmentModal(false)
    setShowAssignmentCreationModal(true)
  }

  useEffect(() => {
    if (
      (googleId && googleId.includes('.deactivated')) ||
      (canvasCode && canvasCode.includes('.deactivated'))
    ) {
      setIsAutoArchivedClass(true)
      setCoTeacherFlag(true)
    }
  }, [googleId, canvasCode])

  const openGoogleSyncModal = () => {
    setGCode(selectedClass.googleCode)
    setOpenGCModal(true)
  }

  return (
    <>
      {!classLoaded ? (
        <div className="spinContainer">
          <Spin />
        </div>
      ) : (
        <>
          <GoogleClassSyncModal
            visible={openGCModal}
            onCancel={closeGoogleSyncModal}
            title="Enter Google Classroom Code"
            footer={
              <ButtonWrapper>
                <div>
                  {selectedClass && selectedClass.googleCode && (
                    <EduButton
                      height="32px"
                      isGhost
                      onClick={() => setDisabled(false)}
                    >
                      CHANGE CLASSROOM
                    </EduButton>
                  )}
                </div>
                <div style={{ display: 'flex' }}>
                  <EduButton
                    height="32px"
                    isGhost
                    onClick={closeGoogleSyncModal}
                  >
                    CANCEL
                  </EduButton>
                  <EduButton
                    height="32px"
                    loading={syncClassLoading && !classCodeError}
                    onClick={handleSyncGC}
                  >
                    SYNC
                  </EduButton>
                </div>
              </ButtonWrapper>
            }
          >
            <Input
              value={isAutoArchivedClass ? '' : gCode}
              ref={googleCode}
              disabled={
                selectedClass &&
                selectedClass.googleCode &&
                disabled &&
                !isAutoArchivedClass
              }
              onChange={(e) => setGCode(e.target.value)}
            />
            {classCodeError && (
              <div style={{ 'margin-top': '10px', color: red }}>
                Enter a valid Google Classroom Code
              </div>
            )}
            <CheckboxLabel
              style={{ margin: '10px 0px 20px 0px' }}
              checked={coTeacherFlag}
              onChange={onCoTeacherChange}
              disabled={
                selectedClass &&
                selectedClass.googleCode &&
                disabled &&
                !isAutoArchivedClass
              }
            >
              Enroll Co-Teacher (All teachers present in Google classroom will
              share the same class)
            </CheckboxLabel>
          </GoogleClassSyncModal>
          {showCanvasSyncModal && (
            <CanvasSyncModal
              visible={showCanvasSyncModal}
              handleCancel={() => setCanvasSyncModalVisibility(false)}
              syncClassLoading={syncClassLoading}
              getCanvasCourseListRequest={getCanvasCourseListRequest}
              getCanvasSectionListRequest={getCanvasSectionListRequest}
              canvasCourseList={canvasCourseList}
              canvasSectionList={canvasSectionList}
              syncClassWithCanvas={syncClassWithCanvas}
              canvasCode={+selectedClass.canvasCode || null}
              canvasCourseSectionCode={
                +selectedClass.canvasCourseSectionCode || null
              }
              user={user}
              groupId={selectedClass._id}
              institutionId={institutionId}
              isFetchingCanvasData={isFetchingCanvasData}
              syncCanvasCoTeacher={selectedClass.syncCanvasCoTeacher || false}
              isAutoArchivedClass={isAutoArchivedClass}
              districtId={userDistrictId}
            />
          )}
          {isGoogleAuthRequired && (
            <ReauthenticateModal
              visible={isGoogleAuthRequired}
              toggle={() => setGoogleAuthenticationRequired()}
              handleLoginSuccess={(data) => {
                saveGoogleTokensAndRetrySync({
                  code: data.code,
                  groupId: selectedClass._id,
                  institutionId,
                })
              }}
            />
          )}

          <div>
            <Header
              onEdit={handleEditClick}
              fetchClassList={fetchClassList}
              selectedClass={selectedClass}
              allowCanvasLogin={allowCanvasLogin}
              syncCanvasModal={syncCanvasModal}
              allowGoogleLogin={allowGoogleLogin}
              syncGCModal={openGoogleSyncModal}
              isUserGoogleLoggedIn={isUserGoogleLoggedIn}
              enableCleverSync={enableCleverSync}
              isCleverDistrict={isCleverDistrict}
              syncClassesWithClever={syncClassesWithClever}
              syncClassWithAtlas={syncClassWithAtlas}
              setSyncClassLoading={setSyncClassLoading}
              unarchiveClass={unarchiveClass}
              archiveClass={archiveClass}
              entity={selectedClass}
              manualEnrollmentAllowed={manualEnrollmentAllowed}
            />
          </div>
          <MainContentWrapper>
            <BreadCrumb
              ellipsis="calc(100% - 200px)"
              data={getBreadCrumbData()}
              style={{ position: 'unset' }}
            />
            <MainInfo
              entity={selectedClass}
              fetchClassList={fetchClassList}
              viewAssessmentHandler={viewAssessmentHandler}
              isUserGoogleLoggedIn={isUserGoogleLoggedIn}
              allowGoogleLogin={allowGoogleLogin}
              syncGCModal={() => setOpenGCModal(true)}
              archiveClass={archiveClass}
              allowCanvasLogin={allowCanvasLogin}
              syncCanvasModal={syncCanvasModal}
              setCreateClassTypeDetails={setCreateClassTypeDetails}
            />

            <ActionContainer
              type={type}
              loadStudents={loadStudents}
              history={history}
              cleverId={cleverId}
              searchAndAddStudents={searchAndAddStudents}
              districtId={districtId}
              manualEnrollmentAllowed={manualEnrollmentAllowed}
            />
            <StudentsList
              selectStudent
              selectedClass={selectedClass}
              allowGoogleLogin={allowGoogleLogin}
              allowCanvasLogin={allowCanvasLogin}
            />
          </MainContentWrapper>
          {isCreateAssignmentModalVisible === 2 && (
            <CreateNewAssignmentModal
              visible={isCreateAssignmentModalVisible}
              onConfirm={handleCreateNewAssignmentClick}
              onCancel={() => toggleCreateAssignmentModal(0)}
            />
          )}
        </>
      )}
    </>
  )
}

ClassDetails.propTypes = {
  selectedClass: PropTypes.object.isRequired,
  loadStudents: PropTypes.func.isRequired,
  classLoaded: PropTypes.bool.isRequired,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      selectedClass: get(state, 'manageClass.entity'),
      fetchClassListLoading: state.manageClass.fetchClassListLoading,
      isUserGoogleLoggedIn: get(state, 'user.user.isUserGoogleLoggedIn', false),
      allowCanvasLogin: get(state, 'user.user.orgData.allowCanvas', false),
      isCleverDistrict: get(state, 'user.user.orgData.isCleverDistrict', false),
      syncClassLoading: get(state, 'manageClass.syncClassLoading'),
      classLoaded: get(state, 'manageClass.classLoaded'),
      canvasCourseList: get(state, 'manageClass.canvasCourseList', []),
      canvasSectionList: get(state, 'manageClass.canvasSectionList', []),
      user: get(state, 'user.user', {}),
      isCleverUser: getCleverLibraryUserSelector(state),
      classCodeError: getClassNotFoundError(state),
      isFetchingCanvasData: getCanvasFetchingStateSelector(state),
      isGoogleAuthRequired: getGoogleAuthRequiredSelector(state),
      userDistrictId: getUserOrgId(state),
      isCreateAssignmentModalVisible: getIsCreateAssignmentModalVisible(state),
      manualEnrollmentAllowed: getManualEnrollmentAllowedSelector(state),
    }),
    {
      syncClassUsingCode: syncClassUsingCodeAction,
      fetchClassList: fetchClassListAction,
      syncByCodeModal: syncByCodeModalAction,
      loadStudents: fetchStudentsByIdAction,
      archiveClass: archiveClassAction,
      getCanvasCourseListRequest: getCanvasCourseListRequestAction,
      getCanvasSectionListRequest: getCanvasSectionListRequestAction,
      syncClassWithCanvas: syncClassWithCanvasAction,
      syncClassWithAtlas: syncClassWithAtlasAction,
      setSyncClassLoading: setSyncClassLoadingAction,
      syncClassesWithClever: syncClassesWithCleverAction,
      setClassNotFoundError: setClassNotFoundErrorAction,
      unarchiveClass: unarchiveClassAction,
      setGoogleAuthenticationRequired: setGoogleAuthenticationRequiredAction,
      saveGoogleTokensAndRetrySync: saveGoogleTokensAndRetrySyncAction,
      toggleCreateAssignmentModal: toggleCreateAssignmentModalAction,
      setShowAssignmentCreationModal: setShowAssignmentCreationModalAction,
      setCreateClassTypeDetails: setCreateClassTypeDetailsAction,
      studentsLoadingStatus: setStudentsLoadingStatusAction,
    }
  )
)

export default enhance(ClassDetails)

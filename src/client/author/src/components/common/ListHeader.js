/* eslint-disable jsx-a11y/aria-role */
import {
  desktopWidth,
  mediumDesktopExactWidth,
  mobileWidthLarge,
  mobileWidthMax,
  themeColor,
  white,
} from '@edulastic/colors'
import { EduButton, MainHeader, withWindowSizes } from '@edulastic/common'
// constants
import { roleuser } from '@edulastic/constants'
import { IconMoreVertical, IconPlusCircle } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
// components
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'
import CartButton from '../../../ItemList/components/CartButton/CartButton'
// ducks
import {
  addBulkTeacherAdminAction,
  setTeachersDetailsModalVisibleAction,
} from '../../../SchoolAdmin/ducks'
import StudentsDetailsModal from '../../../Student/components/StudentTable/StudentsDetailsModal/StudentsDetailsModal'
import InviteMultipleTeacherModal from '../../../Teacher/components/TeacherTable/InviteMultipleTeacherModal/InviteMultipleTeacherModal'
import {
  getUserFeatures,
  getUserOrgId,
  getUserRole,
} from '../../selectors/user'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import { setShowAssignmentCreationModalAction } from '../../../Dashboard/ducks'

const ListHeader = ({
  onCreate,
  createAssignment,
  t,
  title,
  btnTitle,
  renderExtra,
  renderFilter,
  renderFilterIcon,
  isAdvancedView,
  hasButton,
  renderButton,
  midTitle,
  addBulkTeacher,
  userOrgId = '',
  setTeachersDetailsModalVisible,
  teacherDetailsModalVisible,
  userRole = '',
  windowWidth,
  titleIcon,
  userFeatures = {},
  newTest,
  titleWidth,
  isLoadingButtonState = false,
  setShowAssignmentCreationModal,
}) => {
  const [inviteTeacherModalVisible, toggleInviteTeacherModal] = useState(false)

  const sendInvite = (userDetails) => {
    addBulkTeacher({ addReq: userDetails })
  }

  const toggleInviteTeacherModalVisibility = () => {
    toggleInviteTeacherModal((prevState) => !prevState)
  }

  const closeTeachersDetailModal = () => {
    setTeachersDetailsModalVisible(false)
  }

  const createNewAssignment = () => setShowAssignmentCreationModal(true)

  return (
    <MainHeader titleMaxWidth={titleWidth} Icon={titleIcon} headingText={title}>
      {midTitle && (
        <MidTitleWrapper>
          <Title>{midTitle}</Title>
        </MidTitleWrapper>
      )}

      <RightButtonWrapper>
        <MobileHeaderFilterIcon>{renderFilterIcon()}</MobileHeaderFilterIcon>
        {renderFilter(isAdvancedView)}
        {hasButton &&
          !createAssignment &&
          (renderButton ? (
            <>
              {windowWidth > 768 ? (
                renderButton(isLoadingButtonState)
              ) : (
                <Dropdown
                  overlay={renderButton(isLoadingButtonState)}
                  trigger={['click']}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  overlayClassName="mobile-buttons-dropdown"
                >
                  <EduButton
                    IconBtn
                    isGhost
                    isBlue
                    onClick={(e) => e.preventDefault()}
                  >
                    <IconMoreVertical />
                  </EduButton>
                </Dropdown>
              )}
            </>
          ) : userRole === roleuser.EDULASTIC_CURATOR ? null : (
            <div style={{ display: 'flex' }}>
              {/* Not required for this release */}
              {/* {userRole && userRole === roleuser.TEACHER && !userFeatures.isPublisherAuthor && !userFeatures.isCurator && (
                <EduButton isGhost onClick={toggleSidebar} isBlue>
                  <FontAwesomeIcon icon={faUnlockAlt} aria-hidden="true" />
                  UNLOCK COLLECTION
                </EduButton>
              )} */}
              {btnTitle && btnTitle.length ? null : (
                <CartButton
                  onClick={newTest}
                  buttonText="Create test with"
                  displayDeselect
                />
              )}
              {renderExtra()}
              <EduButton data-cy="createNew" onClick={onCreate} isBlue>
                <IconPlusStyled aria-hidden focusable={false} />
                {btnTitle && btnTitle.length ? btnTitle : 'NEW ITEM'}
              </EduButton>
            </div>
          ))}

        {createAssignment && (
          <>
            {userRole && userRole === roleuser.DISTRICT_ADMIN && (
              <EduButton isGhost onClick={toggleInviteTeacherModal} isBlue>
                <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
                INVITE TEACHERS
              </EduButton>
            )}
            {userFeatures?.gradebook && (
              <EduButton isGhost isBlue>
                <Link to="/author/gradebook">VIEW GRADEBOOK </Link>
              </EduButton>
            )}
            <AuthorCompleteSignupButton
              renderButton={(handleClick) => (
                <EduButton data-cy="createNew" isBlue onClick={handleClick}>
                  <IconPlusStyled />
                  NEW ASSIGNMENT
                </EduButton>
              )}
              onClick={createNewAssignment}
              triggerSource="Create Assignment"
            />
          </>
        )}
      </RightButtonWrapper>
      {inviteTeacherModalVisible && (
        <InviteMultipleTeacherModal
          modalVisible={toggleInviteTeacherModalVisibility}
          closeModal={toggleInviteTeacherModalVisibility}
          addTeachers={sendInvite}
          userOrgId={userOrgId}
          t={t}
        />
      )}
      {teacherDetailsModalVisible && (
        <StudentsDetailsModal
          modalVisible={teacherDetailsModalVisible}
          closeModal={closeTeachersDetailModal}
          role="teacher"
          title="Teacher Details"
        />
      )}
    </MainHeader>
  )
}

ListHeader.propTypes = {
  onCreate: PropTypes.func,
  createAssignment: PropTypes.bool,
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  btnTitle: PropTypes.string,
  renderExtra: PropTypes.func,
  renderFilter: PropTypes.func,
  renderFilterIcon: PropTypes.func,
  isAdvancedView: PropTypes.bool,
  hasButton: PropTypes.bool,
  renderButton: PropTypes.func,
  midTitle: PropTypes.string,
}

ListHeader.defaultProps = {
  btnTitle: '',
  renderExtra: () => null,
  renderFilter: () => null,
  renderFilterIcon: () => null,
  onCreate: () => {},
  createAssignment: false,
  renderButton: null,
  isAdvancedView: false,
  hasButton: true,
  midTitle: '',
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  withWindowSizes,
  withRouter,
  connect(
    (state) => ({
      userOrgId: getUserOrgId(state),
      userRole: getUserRole(state),
      userFeatures: getUserFeatures(state),
      firstName: state?.user?.firstName || '',
      teacherDetailsModalVisible: get(
        state,
        ['schoolAdminReducer', 'teacherDetailsModalVisible'],
        false
      ),
    }),
    {
      addBulkTeacher: addBulkTeacherAdminAction,
      setTeachersDetailsModalVisible: setTeachersDetailsModalVisibleAction,
      setShowAssignmentCreationModal: setShowAssignmentCreationModalAction,
    }
  )
)
export default enhance(ListHeader)

const IconPlusStyled = styled(IconPlusCircle)`
  position: relative;
`

export const Title = styled.h1`
  font-size: 18px;
  color: ${(props) => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  margin: 0;
  padding: 0;
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${(props) => props.theme.header.headerTitleFontSize};
  }
`

const RightButtonWrapper = styled.div`
  display: flex;
  align-items: center;

  .mobile-buttons-dropdown {
    &.ant-dropdown {
      background: ${white};
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
      padding: 10px;
      & > button {
        margin: 0px 0px 5px;
        width: 100%;
      }
    }
  }
  @media (max-width: ${mobileWidthLarge}) {
    display: none;
  }
`

const MidTitleWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`

export const MobileHeaderFilterIcon = styled.div`
  display: none;
  button {
    position: relative;
    margin: 0px;
    box-shadow: none;
    width: 45px;
    border-radius: 4px;
    border-color: ${themeColor};
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: ${desktopWidth}) {
      height: 36px;
      svg {
        height: 25px;
        width: 25px;
      }
    }
    @media (max-width: ${mobileWidthLarge}) {
      height: 40px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`

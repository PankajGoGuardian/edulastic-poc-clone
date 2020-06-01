import {
  desktopWidth,
  mediumDesktopExactWidth,
  mobileWidth,
  mobileWidthLarge,
  mobileWidthMax,
  themeColor,
  white
} from "@edulastic/colors";
import { Button, EduButton, MainHeader, withWindowSizes } from "@edulastic/common";
// constants
import { roleuser } from "@edulastic/constants";
import { IconMoreVertical, IconPlusCircle } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
// components
import { Link } from "react-router-dom";
import { compose } from "redux";
import styled from "styled-components";
// ducks
import { addBulkTeacherAdminAction, setTeachersDetailsModalVisibleAction } from "../../../SchoolAdmin/ducks";
import StudentsDetailsModal from "../../../Student/components/StudentTable/StudentsDetailsModal/StudentsDetailsModal";
import InviteMultipleTeacherModal from "../../../Teacher/components/TeacherTable/InviteMultipleTeacherModal/InviteMultipleTeacherModal";
import { getUserFeatures, getUserOrgId, getUserRole } from "../../selectors/user";

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
  userOrgId = "",
  setTeachersDetailsModalVisible,
  teacherDetailsModalVisible,
  userRole = "",
  windowWidth,
  titleIcon,
  userFeatures
}) => {
  const [inviteTeacherModalVisible, toggleInviteTeacherModal] = useState(false);

  const sendInvite = userDetails => {
    addBulkTeacher({ addReq: userDetails });
  };

  const toggleInviteTeacherModalVisibility = () => {
    toggleInviteTeacherModal(prevState => !prevState);
  };

  const closeTeachersDetailModal = () => {
    setTeachersDetailsModalVisible(false);
  };

  return (
    <MainHeader Icon={titleIcon} headingText={title}>
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
                renderButton()
              ) : (
                <Dropdown
                  overlay={renderButton()}
                  trigger={["click"]}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  overlayClassName="mobile-buttons-dropdown"
                >
                  <EduButton IconBtn isGhost onClick={e => e.preventDefault()}>
                    <IconMoreVertical />
                  </EduButton>
                </Dropdown>
              )}
            </>
          ) : userRole === roleuser.EDULASTIC_CURATOR ? null : (
            <EduButton data-cy="createNew" onClick={onCreate}>
              <IconPlusStyled />
              {btnTitle && btnTitle.length ? btnTitle : "NEW ITEM"}
            </EduButton>
          ))}

        {createAssignment && (
          <>
            {userRole && userRole === roleuser.DISTRICT_ADMIN && (
              <EduButton isGhost onClick={toggleInviteTeacherModal}>
                <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
                INVITE TEACHERS
              </EduButton>
            )}
            {userFeatures.gradebook && (
              <Link to="/author/gradebook">
                <EduButton isGhost>VIEW GRADEBOOK</EduButton>
              </Link>
            )}
            <Link to="/author/assignments/select">
              <EduButton data-cy="createNew">
                <IconPlusStyled />
                NEW ASSIGNMENT
              </EduButton>
            </Link>
          </>
        )}
        {renderExtra()}
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
  );
};

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
  midTitle: PropTypes.string
};

ListHeader.defaultProps = {
  btnTitle: "",
  renderExtra: () => null,
  renderFilter: () => null,
  renderFilterIcon: () => null,
  onCreate: () => {},
  createAssignment: false,
  renderButton: null,
  isAdvancedView: false,
  hasButton: true,
  midTitle: ""
};

const enhance = compose(
  withNamespaces("manageDistrict"),
  withWindowSizes,
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      userRole: getUserRole(state),
      userFeatures: getUserFeatures(state),
      firstName: state?.user?.firstName || "",
      teacherDetailsModalVisible: get(state, ["schoolAdminReducer", "teacherDetailsModalVisible"], false)
    }),
    {
      addBulkTeacher: addBulkTeacherAdminAction,
      setTeachersDetailsModalVisible: setTeachersDetailsModalVisibleAction
    }
  )
);
export default enhance(ListHeader);

export const TestButton = styled(Button)`
  height: 36px;
  color: ${themeColor};
  border-radius: 3px;
  margin-left: 25px;
  background: ${white};
  padding: 5px 15px;
  border-color: ${props => props.theme.themeColor};
  &:hover,
  &:focus,
  &:active {
    color: ${props => props.theme.themeColor};
    border-color: ${props => props.theme.themeColor};
    outline-color: ${props => props.theme.themeColor};
  }
  span {
    margin-left: 15px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 45px;
    padding: 5px 30px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 44px;
    height: 44px;
    min-height: 44px;
    padding: 0;
    min-width: 0 !important;

    span {
      display: none;
    }

    svg {
      position: static;
    }
  }

  @media (max-width: ${mobileWidth}) {
    width: 45px;
    height: 40px;
    min-height: 40px;
    margin-left: 5px;
  }
`;

const IconPlusStyled = styled(IconPlusCircle)`
  position: relative;
`;

export const Title = styled.h1`
  font-size: 18px;
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  margin: 0;
  padding: 0;
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.header.headerTitleFontSize};
  }
`;

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
`;

const MidTitleWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`;

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
`;

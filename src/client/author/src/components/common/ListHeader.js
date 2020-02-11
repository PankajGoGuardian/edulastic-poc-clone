import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { FlexContainer, Button, MenuIcon } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { get } from "lodash";
import {
  mobileWidth,
  desktopWidth,
  mediumDesktopWidth,
  white,
  themeColor,
  mobileWidthMax,
  mobileWidthLarge
} from "@edulastic/colors";
import { IconPlusCircle } from "@edulastic/icons";
import { connect } from "react-redux";
import HeaderWrapper from "../../mainContent/headerWrapper";
import { toggleSideBarAction } from "../../actions/toggleMenu";

import { addBulkTeacherAdminAction, setTeachersDetailsModalVisibleAction } from "../../../SchoolAdmin/ducks";
import { getUserOrgId, getUserRole } from "../../selectors/user";
import InviteMultipleTeacherModal from "../../../Teacher/components/TeacherTable/InviteMultipleTeacherModal/InviteMultipleTeacherModal";
import StudentsDetailsModal from "../../../Student/components/StudentTable/StudentsDetailsModal/StudentsDetailsModal";
import UserSubHeader from "./AdminSubHeader/UserSubHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const ListHeader = ({
  onCreate,
  createAssignment,
  t,
  title,
  btnTitle,
  toggleSideBar,
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
  userRole = ""
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
    <Container>
      <FlexContainer style={{ pointerEvents: "none" }}>
        <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
        <Title>{title}</Title>
      </FlexContainer>

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
            renderButton()
          ) : (
            <CreateButton
              data-cy="createNew"
              onClick={onCreate}
              color="secondary"
              variant="create"
              shadow="none"
              icon={<IconPlusStyled color={themeColor} width={20} height={20} hoverColor={themeColor} />}
            >
              {btnTitle && btnTitle.length ? btnTitle : "New Item"}
            </CreateButton>
          ))}

        {createAssignment && (
          <>
            {userRole && userRole === roleuser.DISTRICT_ADMIN && (
              <TestButton
                color="secondary"
                onClick={toggleInviteTeacherModal}
                icon={<FontAwesomeIcon icon={faUsers} aria-hidden="true" />}
              >
                INVITE TEACHERS
              </TestButton>
            )}
            <Link to={"/author/assignments/select"}>
              <TestButton
                color="secondary"
                variant="test"
                shadow="none"
                icon={<IconPlusStyled color={themeColor} width={20} height={20} hoverColor={themeColor} />}
              >
                NEW ASSIGNMENT
              </TestButton>
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
    </Container>
  );
};

ListHeader.propTypes = {
  onCreate: PropTypes.func,
  createAssignment: PropTypes.bool,
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
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
  connect(
    state => {
      const { user } = state;
      return {
        userOrgId: getUserOrgId(state),
        userRole: getUserRole(state),
        firstName: user.firstName || "",
        teacherDetailsModalVisible: get(state, ["schoolAdminReducer", "teacherDetailsModalVisible"], false)
      };
    },
    {
      toggleSideBar: toggleSideBarAction,
      addBulkTeacher: addBulkTeacherAdminAction,
      setTeachersDetailsModalVisible: setTeachersDetailsModalVisibleAction
    }
  )
);
export default enhance(ListHeader);

const Container = styled(HeaderWrapper)`
  display: flex;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.header.headerBgColor};
  padding: 0px 15px;
  height: 62px;
  z-index: 1;
`;

export const TestButton = styled(Button)`
  height: 45px;
  color: ${themeColor};
  border-radius: 3px;
  margin-left: 25px;
  background: ${white};
  padding: 5px 30px;
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

  @media (max-width: ${mediumDesktopWidth}) {
    min-height: 36px;
    height: 36px;
    padding: 5px 15px;
  }

  @media (max-width: ${mobileWidth}) {
    width: 45px;
    height: 40px;
    min-height: 40px;
    margin-left: 5px;
  }
`;

const CreateButton = styled(Button)`
  position: relative;
  min-width: auto;
  padding: 0px 34px 0px 10px;
  height: 45px;
  color: ${themeColor};
  border-radius: 3px;
  background: ${white};
  border-color: ${props => props.theme.themeColor};
  justify-content: space-around;
  margin-left: 20px;
  border-radius: 4px;
  &:hover,
  &:focus {
    color: ${props => props.theme.themeColor};
    border-color: ${props => props.theme.themeColor};
  }
  svg {
    display: block;
    margin-right: 17px;
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
    min-height: 36px;
    margin-left: 10px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    span {
      display: none;
    }
    svg {
      display: block;
      margin-right: 0px;
    }
    padding: 0px;
    width: 45px;
    min-height: 40px;
    justify-content: center;
  }
`;

const IconPlusStyled = styled(IconPlusCircle)`
  position: relative;
`;

export const Title = styled.h1`
  font-size: ${props => props.theme.header.headerTitleFontSize};
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  margin: 0;
  padding: 0;
  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
  }
`;

const RightButtonWrapper = styled.div`
  display: flex;
  align-items: center;
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

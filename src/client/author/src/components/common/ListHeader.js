import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { FlexContainer, Button } from "@edulastic/common";
import {
  mobileWidth,
  tabletWidth,
  desktopWidth,
  darkBlueSecondary,
  white,
  lightBlueSecondary,
  newBlue,
  blue
} from "@edulastic/colors";
import { IconPlusCircle, IconMenuOpenClose } from "@edulastic/icons";
import { connect } from "react-redux";
import HeaderWrapper from "../../mainContent/headerWrapper";
import { toggleSideBarAction } from "../../actions/toggleMenu";

const ListHeader = ({
  onCreate,
  createAssignment,
  t,
  title,
  btnTitle,
  toggleSideBar,
  renderExtra,
  renderFilter,
  isAdvancedView,
  hasButton,
  renderButton,
  midTitle
}) => (
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
      {renderFilter(isAdvancedView)}
      {hasButton &&
        (renderButton ? (
          renderButton()
        ) : (
          <CreateButton onClick={onCreate} color="secondary" variant="create" shadow="none">
            {btnTitle && btnTitle.length ? btnTitle : t("component.itemlist.header.create")}
          </CreateButton>
        ))}
      {createAssignment && (
        <Link to={"/author/assessments/createAssignment"}>
          <TestButton
            color="secondary"
            variant="test"
            shadow="none"
            icon={<IconPlusStyled color={newBlue} width={20} height={20} hoverColor={newBlue} />}
          >
            NEW ASSIGNMENT
          </TestButton>
        </Link>
      )}
      {renderExtra()}
    </RightButtonWrapper>
  </Container>
);

ListHeader.propTypes = {
  onCreate: PropTypes.func,
  createAssignment: PropTypes.bool,
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  btnTitle: PropTypes.string,
  renderExtra: PropTypes.func,
  renderFilter: PropTypes.func,
  isAdvancedView: PropTypes.bool,
  hasButton: PropTypes.bool,
  renderButton: PropTypes.func,
  midTitle: PropTypes.string
};

ListHeader.defaultProps = {
  btnTitle: "",
  renderExtra: () => null,
  renderFilter: () => null,
  onCreate: () => {},
  createAssignment: false,
  renderButton: null,
  isAdvancedView: false,
  hasButton: true,
  midTitle: ""
};

const enhance = compose(
  withNamespaces("author"),
  connect(
    ({ authorUi, user }) => ({
      isSidebarCollapsed: authorUi.isSidebarCollapsed,
      firstName: user.firstName || ""
    }),
    { toggleSideBar: toggleSideBarAction }
  )
);
export default enhance(ListHeader);

const Container = styled(HeaderWrapper)`
  display: flex;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  background-color: ${darkBlueSecondary};
  padding: 0px 15px;
  height: 62px;
  z-index: 1;
`;

export const TestButton = styled(Button)`
  height: 45px;
  color: ${blue};
  border-radius: 3px;
  margin-left: 25px;
  background: ${white};
  padding: 5px 30px;
  span {
    margin-left: 15px;
  }
  @media (max-width: ${desktopWidth}) {
    width: 44px;
    height: 44px;
    min-height: 44px;
    padding: 0 !important;
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

const CreateButton = styled(Button)`
  position: relative;
  min-width: auto;
  padding: 5px 30px;
  height: 45px;
  color: ${lightBlueSecondary};
  border-radius: 3px;
  background: ${white};
  justify-content: space-around;
  margin-left: 20px;
`;

const IconPlusStyled = styled(IconPlusCircle)`
  position: relative;
`;

export const Title = styled.h1`
  color: ${white};
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

const MenuIcon = styled(IconMenuOpenClose)`
  display: none;
  fill: ${white};
  width: 18px;
  margin-right: 25px !important;
  pointer-events: all;

  @media (max-width: ${tabletWidth}) {
    display: block;
  }
`;

const RightButtonWrapper = styled.div`
  display: flex;
  margin: 8px 0 5px auto;
  align-items: center;
`;

const MidTitleWrapper = styled.div`
  display: flex;
  margin: 8px 0 5px auto;
  align-items: center;
`;

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { FlexContainer, Button, MenuIcon } from "@edulastic/common";
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
      <MobileHeaderFilterIcon>{renderFilterIcon()}</MobileHeaderFilterIcon>
      {renderFilter(isAdvancedView)}
      {hasButton &&
        !createAssignment &&
        (renderButton ? (
          renderButton()
        ) : (
          <CreateButton
            onClick={onCreate}
            color="secondary"
            variant="create"
            shadow="none"
            icon={<IconPlusStyled color={themeColor} width={20} height={20} hoverColor={themeColor} />}
          >
            {btnTitle && btnTitle.length ? btnTitle : t("component.itemlist.header.create")}
          </CreateButton>
        ))}
      {createAssignment && (
        <Link to={"/author/assignments/select"}>
          <TestButton
            color="secondary"
            variant="test"
            shadow="none"
            icon={<IconPlusStyled color={themeColor} width={20} height={20} hoverColor={themeColor} />}
          >
            NEW ASSIGNMENTS
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
  withNamespaces("author"),
  connect(
    ({ user }) => ({
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

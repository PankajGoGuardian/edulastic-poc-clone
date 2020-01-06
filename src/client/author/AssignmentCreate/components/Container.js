import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { IconTestBank, IconPlaylist } from "@edulastic/icons";
import { MenuIcon } from "@edulastic/common";
import HeaderWrapper from "../../src/mainContent/headerWrapper";
import Title, { AlignMiddle } from "../common/Title";
import { SecondHeader } from "../../TestPage/components/Summary/components/Container/styled";
import BreadCrumb from "../../src/components/Breadcrumb";
import ContainerWrapper from "../common/ContainerWrapper";
import BodyWrapper from "../common/BodyWrapper";
import CardComponent from "../common/CardComponent";
import TitleWrapper from "../common/TitleWrapper";
import IconWrapper from "../common/IconWrapper";
import TextWrapper from "../common/TextWrapper";
import TextWrapperBold from "../common/TextWrapperBold";
import ButtonComponent from "../common/ButtonComponent";
import Divider from "../common/Divider";
import CountWrapper from "../common/CountWrapper";
import LinkWrapper from "../common/LinkWrapper";
import FlexWrapper from "../common/FlexWrapper";
import { getLastPlayListSelector } from "../../Playlist/ducks";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";
import { toggleSideBarAction } from "../../src/actions/toggleMenu";

class Container extends Component {
  render() {
    const breadcrumbData = [
      {
        title: "RECENT ASSIGNMENTS",
        to: "/author/assignments"
      },
      {
        title: "NEW ASSIGNMENT",
        to: ""
      }
    ];

    const { lastPlayList = {}, toggleSideBar } = this.props;
    let toLinkForPlaylist = "/author/playlists";
    if (lastPlayList && lastPlayList.value && lastPlayList.value._id) {
      toLinkForPlaylist = `/author/playlists/${lastPlayList.value._id}/use-this`;
    }

    return (
      <div>
        <HeaderWrapper justify="flex-start">
          <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
          <Title>New Assignment</Title>
          <AlignMiddle>SELECT A TEST</AlignMiddle>
        </HeaderWrapper>
        <ContainerWrapper>
          <SecondHeader>
            <BreadCrumb data={breadcrumbData} style={{ position: "unset" }} />
          </SecondHeader>
          <BodyWrapper>
            <FlexWrapper>
              <FeaturesSwitch inputFeatures="playlist" actionOnInaccessible="hidden" key="playlist">
                <CardComponent>
                  <IconWrapper marginBottom="0px">
                    <IconPlaylist style={{ height: "40px", width: "40px" }} />
                  </IconWrapper>
                  <TitleWrapper>Choose From Play List</TitleWrapper>
                  <TextWrapper> Select pre built tests from the Curriculum aligned assessment play list</TextWrapper>
                  <Link to={toLinkForPlaylist}>
                    <ButtonComponent type="primary">Play List</ButtonComponent>
                  </Link>
                  <Divider />
                  <CountWrapper>191</CountWrapper>
                  <TextWrapperBold>Pre-built Assessment in Play List</TextWrapperBold>
                </CardComponent>
              </FeaturesSwitch>
              <CardComponent>
                <IconWrapper marginBottom="0px">
                  <IconTestBank style={{ height: "40px", width: "40px" }} />
                </IconWrapper>
                <TitleWrapper>Choose From Library</TitleWrapper>
                <TextWrapper>
                  Select pre built assessment from the <br /> Edulastic Library
                </TextWrapper>
                <Link to="/author/tests">
                  <ButtonComponent type="primary">Browse All</ButtonComponent>
                </Link>
                <Divider />
                <CountWrapper>191211</CountWrapper>
                <TextWrapperBold>Pre-built assessment in Library</TextWrapperBold>
              </CardComponent>
            </FlexWrapper>
            <FlexWrapper justifyContent="center" marginBottom="0px">
              <Link to="/author/tests/select">
                <LinkWrapper marginBottom="0px"> Or Author a Test >></LinkWrapper>
              </Link>
            </FlexWrapper>
          </BodyWrapper>
        </ContainerWrapper>
      </div>
    );
  }
}

Container.propTypes = {
  toggleSideBar: PropTypes.func.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      lastPlayList: getLastPlayListSelector(state)
    }),
    { toggleSideBar: toggleSideBarAction }
  )
);
export default enhance(Container);

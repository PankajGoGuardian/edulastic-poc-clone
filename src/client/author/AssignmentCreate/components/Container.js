import { EduButton, MainContentWrapper, MainHeader } from "@edulastic/common";
import { IconPlaylist, IconTestBank } from "@edulastic/icons";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { compose } from "redux";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";
import { getLastPlayListSelector } from "../../Playlist/ducks";
import BreadCrumb from "../../src/components/Breadcrumb";
import { SecondHeader } from "../../TestPage/components/Summary/components/Container/styled";
import BodyWrapper from "../common/BodyWrapper";
import CardComponent from "../common/CardComponent";
import CountWrapper from "../common/CountWrapper";
import Divider from "../common/Divider";
import FlexWrapper from "../common/FlexWrapper";
import IconWrapper from "../common/IconWrapper";
import LinkWrapper from "../common/LinkWrapper";
import TextWrapper from "../common/TextWrapper";
import TextWrapperBold from "../common/TextWrapperBold";
import { AlignMiddle } from "../common/Title";
import TitleWrapper from "../common/TitleWrapper";

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

    const { lastPlayList = {}, t } = this.props;
    let toLinkForPlaylist = "/author/playlists";
    let from = "playlistLibrary";
    if (lastPlayList && lastPlayList.value && lastPlayList.value._id) {
      toLinkForPlaylist = `/author/playlists/playlist/${lastPlayList.value._id}/use-this`;
      from = "myPlaylist";
    }

    return (
      <div>
        <MainHeader headingText={t("common.newAssignment")}>
          <AlignMiddle>SELECT A TEST</AlignMiddle>
        </MainHeader>
        <MainContentWrapper>
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
                  <TitleWrapper>Choose From Playlist</TitleWrapper>
                  <TextWrapper>Select pre built tests from the Curriculum aligned assessment playlist</TextWrapper>
                  <Link to={{ pathname: toLinkForPlaylist, state: { from } }}>
                    <EduButton isGhost width="234px">
                      PLAYLIST
                    </EduButton>
                  </Link>
                  <Divider />
                  <CountWrapper>191</CountWrapper>
                  <TextWrapperBold>Pre-built Assessment in Playlist</TextWrapperBold>
                </CardComponent>
              </FeaturesSwitch>
              <CardComponent ml="25px">
                <IconWrapper marginBottom="0px">
                  <IconTestBank style={{ height: "40px", width: "40px" }} />
                </IconWrapper>
                <TitleWrapper>Choose From Library</TitleWrapper>
                <TextWrapper>
                  Select pre built assessment from the <br /> Edulastic Library
                </TextWrapper>
                <Link to="/author/tests">
                  <EduButton isGhost width="234px">
                    BROWSE ALL
                  </EduButton>
                </Link>
                <Divider />
                <CountWrapper>191211</CountWrapper>
                <TextWrapperBold>Pre-built assessment in Library</TextWrapperBold>
              </CardComponent>
            </FlexWrapper>
            <FlexWrapper justifyContent="center" marginBottom="0px">
              <Link to="/author/tests/select">
                <LinkWrapper marginBottom="0px"> Or Author a Test &gt;&gt;</LinkWrapper>
              </Link>
            </FlexWrapper>
          </BodyWrapper>
        </MainContentWrapper>
      </div>
    );
  }
}

Container.propTypes = {
  lastPlayList: PropTypes.object.isRequired
};

const enhance = compose(
  withRouter,
  withNamespaces("header"),
  connect(state => ({
    lastPlayList: getLastPlayListSelector(state)
  }))
);
export default enhance(Container);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { IconTestBank, IconPlaylist } from "@edulastic/icons";
import { MainHeader, MainContentWrapper, EduButton } from "@edulastic/common";
import { AlignMiddle } from "../common/Title";
import { SecondHeader } from "../../TestPage/components/Summary/components/Container/styled";
import BreadCrumb from "../../src/components/Breadcrumb";
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

    const { lastPlayList = {} } = this.props;
    let toLinkForPlaylist = "/author/playlists";
    let from = "playlistLibrary";
    if (lastPlayList && lastPlayList.value && lastPlayList.value._id) {
      toLinkForPlaylist = `/author/playlists/${lastPlayList.value._id}/use-this`;
      from = "favouritePlaylist";
    }

    return (
      <div>
        <MainHeader headingText="common.newAssignment">
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
                  <TitleWrapper>Choose From Play List</TitleWrapper>
                  <TextWrapper>Select pre built tests from the Curriculum aligned assessment play list</TextWrapper>
                  <Link to={{ pathname: toLinkForPlaylist, state: { from } }}>
                    <EduButton isGhost width="234px">
                      PLAY LIST
                    </EduButton>
                  </Link>
                  <Divider />
                  <CountWrapper>191</CountWrapper>
                  <TextWrapperBold>Pre-built Assessment in Play List</TextWrapperBold>
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
  connect(state => ({
    lastPlayList: getLastPlayListSelector(state)
  }))
);
export default enhance(Container);

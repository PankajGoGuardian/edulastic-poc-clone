import React, { Component } from "react";
import { Link } from "react-router-dom";
import HeaderWrapper from "../../src/mainContent/headerWrapper";
import Title from "../common/Title";
import SubTitle from "../common/SubTitle";
import { SecondHeader } from "../../TestPage/components/Summary/components/Container/styled";
import BreadCrumb from "../../src/components/Breadcrumb";
import ContainerWrapper from "../common/ContainerWrapper";
import BodyWrapper from "../common/BodyWrapper";
import CardComponent from "../common/CardComponent";
import { IconTestBank, IconCurriculumSequence } from "@edulastic/icons";
import TitleWrapper from "../common/TitleWrapper";
import IconWrapper from "../common/IconWrapper";
import TextWrapper from "../common/TextWrapper";
import TextWrapperBold from "../common/TextWrapperBold";
import ButtonComponent from "../common/ButtonComponent";
import Divider from "../common/Divider";
import CountWrapper from "../common/CountWrapper";
import LinkWrapper from "../common/LinkWrapper";
import FlexWrapper from "../common/FlexWrapper";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { getLastPlayListSelector } from "../../Playlist/ducks";

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
    if (lastPlayList && lastPlayList.value && lastPlayList.value._id) {
      toLinkForPlaylist = `/author/playlists/${lastPlayList.value._id}/use-this`;
    }

    return (
      <div>
        <HeaderWrapper>
          <Title>New Assignment</Title>
        </HeaderWrapper>
        <ContainerWrapper>
          <SecondHeader>
            <BreadCrumb data={breadcrumbData} style={{ position: "unset" }} />
          </SecondHeader>
          <BodyWrapper>
            <FlexWrapper>
              <CardComponent>
                <IconWrapper>
                  <IconCurriculumSequence style={{ height: "40px", width: "40px" }} />
                </IconWrapper>
                <TitleWrapper>Choose From Play List</TitleWrapper>
                <TextWrapper> Select pre built tests from the Curriculum aligned assessment play list</TextWrapper>
                <Link to={toLinkForPlaylist}>
                  <ButtonComponent type={"primary"}>Play List</ButtonComponent>
                </Link>
                <Divider />
                <CountWrapper>191</CountWrapper>
                <TextWrapperBold>Pre-built Assessment in Play List</TextWrapperBold>
              </CardComponent>
              <CardComponent>
                <IconWrapper>
                  <IconTestBank style={{ height: "40px", width: "40px" }} />
                </IconWrapper>
                <TitleWrapper>Choose From Library</TitleWrapper>
                <TextWrapper> Select pre built assessment from the Edulastic Library</TextWrapper>
                <Link to="/author/tests">
                  <ButtonComponent type={"primary"}>Browse All</ButtonComponent>
                </Link>
                <Divider />
                <CountWrapper>191211</CountWrapper>
                <TextWrapperBold>Pre-built assessment in Library</TextWrapperBold>
              </CardComponent>
            </FlexWrapper>
            <FlexWrapper>
              <Link to="/author/tests/select">
                <LinkWrapper> Or Author a Test >></LinkWrapper>
              </Link>
            </FlexWrapper>
          </BodyWrapper>
        </ContainerWrapper>
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(state => ({
    lastPlayList: getLastPlayListSelector(state)
  }))
);
export default enhance(Container);

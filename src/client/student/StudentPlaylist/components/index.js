import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";

// components
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import PlaylistsContainer from "./PlaylistsContainer";
import { smallDesktopWidth, mobileWidthMax } from "@edulastic/colors";
import { IconPlaylist } from "@edulastic/icons";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;
const ContentWrapper = styled.div`
  padding: 0px 40px;
  @media (max-width: ${smallDesktopWidth}) {
    padding: 0px 20px 0px 30px;
  }
  @media (max-width: ${mobileWidthMax}) {
    padding: 0px 10px;
  }
`;

const StudentPlaylist = props => (
  <Wrapper>
    <Header titleIcon={IconPlaylist} titleText="common.playlistTitle" />
    <ContentWrapper>
      <SubHeader />
      <PlaylistsContainer />
    </ContentWrapper>
  </Wrapper>
);

export default StudentPlaylist;

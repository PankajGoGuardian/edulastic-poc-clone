import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import { Layout, Spin } from "antd";

import { smallDesktopWidth } from "@edulastic/colors";
import { slice } from "../ducks";
import { getLastPlayListSelector } from "../../../author/Playlist/ducks";

import NoDataNotification from "../../../common/components/NoDataNotification";

const PlaylistsContainer = ({
  flag,
  playlists,
  lastPlaylist,
  fetchPlaylists,
  currentGroup,
  isLoading,
  currentChild
}) => {
  useEffect(() => {
    fetchPlaylists();
  }, [currentChild]);

  if (isLoading) return <Spin size="large" />;

  const playlist = lastPlaylist?.value?._id
    ? playlists.find(playlist => playlist.playlistId === lastPlaylist.value._id)
    : null;

  return playlists && playlists.length ? (
    // if playlists are found, switch to the last playlist
    <Redirect
      to={{
        pathname: `/home/playlist/${playlist?.playlistId || playlists[0].playlistId}`,
        state: { currentGroupId: playlist?.groupId || playlists[0].groupId }
      }}
    />
  ) : (
    <LayoutContent>
      <Wrapper>
        <NoDataNotification heading="No Playlists" description={"You don't have any playlists assigned to you yet."} />
      </Wrapper>
    </LayoutContent>
  );
};

export default connect(
  state => ({
    isLoading: state?.studentPlaylist?.isLoading,
    playlists: state?.studentPlaylist?.playlists,
    lastPlaylist: getLastPlayListSelector(state),
    currentChild: state?.user?.currentChild
  }),
  {
    fetchPlaylists: slice.actions.fetchStudentPlaylist
  }
)(PlaylistsContainer);

const LayoutContent = styled(Layout.Content)`
  min-height: 75vh;
  width: 100%;
`;

const Wrapper = styled.div`
  height: 100%;
  margin: 15px 0px;
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.assignment.cardContainerBgColor};
  padding: 5px 15px;
  position: relative;

  @media (max-width: ${smallDesktopWidth}) {
    padding: 5px;
  }
`;

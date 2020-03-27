import React, { useEffect, lazy, Suspense } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import { compose } from "redux";
import { Layout, Spin } from "antd";

import { Progress } from "@edulastic/common";
const CurriculumContainer = lazy(() => import("../../../author/CurriculumSequence"));

import { smallDesktopWidth } from "@edulastic/colors";
import { slice, getDateKeysSelector } from "../ducks";
import { getLastPlayListSelector } from "../../../author/Playlist/ducks";
import { getEnrollClassAction } from "../../ManageClass/ducks";

import NoDataNotification from "../../../common/components/NoDataNotification";
import Recommendations from "./Recommendations";

const PlaylistsContainer = ({
  match,
  location,
  playlists,
  lastPlaylist,
  fetchPlaylists,
  fetchRecommendations,
  loadAllClasses,
  isLoading,
  currentChild,
  dateKeys
}) => {
  useEffect(() => {
    fetchPlaylists();
    loadAllClasses();
    fetchRecommendations();
  }, [currentChild]);

  const pathPlaylistId = location.pathname.substring(match.path.length).replace(/\//g, "");

  const playlist = lastPlaylist?.value?._id
    ? playlists.find(playlist => playlist.playlistId === lastPlaylist.value._id)
    : null;

  return playlists && playlists.length ? (
    // if playlists are found, switch to the last playlist
    pathPlaylistId ? (
      <Switch>
        <Route
          exact
          path={`${match.url}/:playlistId`}
          render={props => {
            const currentGroupId = playlists.find(playlist => playlist.playlistId === pathPlaylistId)?.groupId;
            props.location.state = { ...(props.location.state || {}), currentGroupId };
            if (isLoading) return <Spin size="large" />;
            return (
              <Suspense fallback={<Progress />}>
                <CurriculumContainer {...props} urlHasUseThis />
              </Suspense>
            );
          }}
        />
        <Route
          exact
          path={`${match.url}/:playlistId/recommendations`}
          render={props => (
            <Suspense fallback={<Progress />}>
              <Recommendations {...props} />
            </Suspense>
          )}
        />
      </Switch>
    ) : (
      <Redirect
        to={{
          pathname: `/home/playlist/${playlist?.playlistId || playlists[0].playlistId}`,
          state: { currentGroupId: playlist?.groupId || playlists[0].groupId }
        }}
      />
    )
  ) : (
    <LayoutContent>
      <Wrapper>
        <NoDataNotification heading="No Playlists" description={"You don't have any playlists assigned to you yet."} />
      </Wrapper>
    </LayoutContent>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      isLoading: state?.studentPlaylist?.isLoading,
      playlists: state?.studentPlaylist?.playlists,
      lastPlaylist: getLastPlayListSelector(state),
      currentChild: state?.user?.currentChild
    }),
    {
      fetchPlaylists: slice.actions.fetchStudentPlaylist,
      fetchRecommendations: slice.actions.fetchRecommendations,
      loadAllClasses: getEnrollClassAction
    }
  )
);

export default enhance(PlaylistsContainer);

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

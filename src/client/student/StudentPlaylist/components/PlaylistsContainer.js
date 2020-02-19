import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Layout, Spin } from "antd";

import { smallDesktopWidth } from "@edulastic/colors";
import { slice } from "../ducks";

import PlaylistCard from "./PlaylistCard";
import NoDataNotification from "../../../common/components/NoDataNotification";

const PlaylistsContainer = ({ flag, playlists, fetchPlaylists, currentGroup, isLoading }) => {

    useEffect(() => {
        fetchPlaylists();
    }, []);

    if (isLoading) return <Spin size="large" />;

    return (
      <LayoutContent>
        <Wrapper>
          {playlists.length < 1 ? (
            <NoDataNotification heading="No Playlists" description={"You don't have any playlists assigned to you yet."} />
                ) : (
                        playlists.map(item => (
                          <PlaylistCard key={`${item._id}_${item.classId}`} data={item} classId={item.classId} />
                        ))
                    )}
        </Wrapper>
      </LayoutContent>
    );
};

export default connect(
    state => ({
        isLoading: state?.studentPlaylist?.isLoading,
        playlists: state?.studentPlaylist?.playlists
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

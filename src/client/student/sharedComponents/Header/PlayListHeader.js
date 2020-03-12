import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose } from "redux";
import { MainHeader } from "@edulastic/common";
import HeaderTabs, { StyledTabs } from "@edulastic/common/src/components/HeaderTabs";
import { HeaderMidContainer } from "@edulastic/common/src/components/MainHeader";
import { IconPlaylist } from "@edulastic/icons";
import { getFilteredClassesSelector } from "../../ManageClass/ducks";
import ClassSelect from "../ClassSelector";

export const playlistPageNavButtons = [
  {
    icon: null,
    value: "playlist",
    text: "Playlist",
    path: "/home/playlist/:playlistId"
  },
  {
    icon: null,
    value: "recommendations",
    text: "recommendations",
    path: "/home/playlist/:playlistId/recommendations"
  }
];

const PlayListHeader = ({ title, activeClasses, studentPlaylists, t, match, history }) => {
  const handleNavChange = val => {
    const { playlistId } = match.params;
    if (val === "playlist") {
      return history.push(`/home/playlist/${playlistId}`);
    }
    return history.push(`/home/playlist/${playlistId}/recommendations`);
  };
  const currentPath = match.path;
  const playlistClassList = [...new Set(studentPlaylists.map(playlist => playlist.groupId))];
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1" && playlistClassList.includes(c._id));
  return (
    <MainHeader Icon={IconPlaylist} headingText={title} justify={"space-between"}>
      <HeaderMidContainer>
        <StyledTabs>
          {playlistPageNavButtons.map(({ value, text, path }) => (
            <HeaderTabs
              style={currentPath === path ? { cursor: "not-allowed" } : { cursor: "pointer" }}
              dataCy={value}
              isActive={currentPath === path}
              linkLabel={text}
              key={value}
              onClickHandler={() => handleNavChange(value)}
              isPlaylist
            />
          ))}
        </StyledTabs>
      </HeaderMidContainer>
      <ClassSelect t={t} classList={activeEnrolledClasses} showAllClassesOption={false} />
    </MainHeader>
  );
};

PlayListHeader.propTypes = {
  title: PropTypes.string.isRequired
};

const enhance = compose(
  memo,
  withNamespaces("header"),
  withRouter,
  connect(state => ({
    activeClasses: getFilteredClassesSelector(state),
    studentPlaylists: state?.studentPlaylist?.playlists,
    title: state?.curriculumSequence?.destinationCurriculumSequence?.title
  }))
);

export default enhance(PlayListHeader);

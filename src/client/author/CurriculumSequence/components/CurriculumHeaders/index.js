import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { reduce, isNumber } from "lodash";
import { roleuser } from "@edulastic/constants";
import { Tooltip } from "antd";
import { FlexContainer, EduButton, MainHeader } from "@edulastic/common";
import { smallDesktopWidth, themeColor, extraDesktopWidthMax } from "@edulastic/colors";
import {
  IconPencilEdit,
  IconPlaylist,
  IconShare,
  IconTile,
  IconSave,
  IconAirdrop,
  IconUseThis
} from "@edulastic/icons";
import StudentPlayListHeader from "../../../../student/sharedComponents/Header/PlayListHeader";
import PlaylistPageNav from "../PlaylistPageNav";

const MobleHeaderWrapper = styled.div`
  @media (max-width: ${smallDesktopWidth}) {
    width: 100%;
  }
`;

const CurriculumHeaderButtons = styled(FlexContainer)`
  margin-left: ${({ marginLeft }) => marginLeft};

  @media (max-width: ${smallDesktopWidth}) {
    position: absolute;
    top: 10px;
    right: 20px;
  }
`;

const HeaderButton = styled(EduButton)`
  @media (max-width: ${extraDesktopWidthMax}) {
    height: 38px;
    ${({ IconBtn }) => IconBtn && "width: 38px;"};
  }
`;

const CurriculumHeader = ({
  match,
  mode,
  role,
  features,
  isStudent,
  isTeacher,
  summaryData,
  isManageContentActive,
  isPublisherUser,
  isDesktop,
  loading,
  urlHasUseThis,
  recentPlaylists,
  curatedStudentPlaylists,
  destinationCurriculumSequence,
  collections,
  updateDestinationPlaylist,
  handleEditClick,
  handleUseThisClick,
  openDropPlaylistModal,
  onShareClick,
  onApproveClick,
  handleNavChange,
  handleGuidePopup,
  onRejectClick
}) => {
  const ResolvedMobileHeaderWrapper = isDesktop ? Fragment : MobleHeaderWrapper;
  const { isAuthor = false, status, title, collections: _playlistCollections = [] } = destinationCurriculumSequence;
  // show all recent playlists in changePlaylistModal
  const slicedRecentPlaylists = recentPlaylists || [];
  // figure out which tab contents to render || just render default playlist
  const {
    params: { cloneId = null, currentTab: cTab },
    url
  } = match;
  const currentTab = cTab || "playlist";
  const sparkCollection = collections.find(c => c.name === "Spark Math" && c.owner === "Edulastic Corp") || {};
  const isSparkMathPlaylist = _playlistCollections.some(item => item._id === sparkCollection?._id);

  const sumOfclasse = reduce(summaryData, (prev, curr) => (isNumber(curr?.classes) ? prev + curr.classes : prev), 0);
  const shouldHideUseThis = sumOfclasse > 0 && !urlHasUseThis;
  const showUseThisButton = status !== "draft" && !urlHasUseThis && !isPublisherUser && sumOfclasse === 0;

  const isPlaylistDetailsPage = window.location?.hash === "#review";
  const shouldShowEdit = url.includes("playlists") && isPlaylistDetailsPage && status === "draft" && !urlHasUseThis;
  const changePlaylistIcon = (
    <IconTile
      data-cy="open-dropped-playlist"
      style={{ cursor: "pointer", marginLeft: "18px" }}
      onClick={handleGuidePopup}
      width={18}
      height={18}
      color={themeColor}
    />
  );

  if (isStudent) {
    return <StudentPlayListHeader headingSubContent={curatedStudentPlaylists?.length > 1 && changePlaylistIcon} />;
  }

  if (mode !== "embedded") {
    return (
      <MainHeader
        Icon={isDesktop ? IconPlaylist : null}
        headingText={loading ? "Untitled Playlist" : title}
        headingSubContent={urlHasUseThis && !isPublisherUser && slicedRecentPlaylists?.length > 1 && changePlaylistIcon}
        titleMinWidth="unset"
        justify={urlHasUseThis ? "space-between" : "flex-start"}
      >
        {urlHasUseThis && isDesktop && (
          <PlaylistPageNav
            onChange={handleNavChange}
            current={currentTab}
            showDifferentiationTab={isSparkMathPlaylist}
          />
        )}

        <ResolvedMobileHeaderWrapper>
          <CurriculumHeaderButtons marginLeft={urlHasUseThis ? "unset" : "auto"}>
            {(showUseThisButton || urlHasUseThis || features.isCurator) && role !== roleuser.EDULASTIC_CURATOR && (
              <HeaderButton isGhost data-cy="share" onClick={onShareClick} IconBtn>
                <IconShare />
              </HeaderButton>
            )}

            {isManageContentActive && !cloneId && !showUseThisButton && !shouldShowEdit && (
              <HeaderButton data-cy="save" onClick={updateDestinationPlaylist} IconBtn={!isDesktop}>
                <IconSave />
                {isDesktop && "SAVE"}
              </HeaderButton>
            )}

            {urlHasUseThis && isTeacher && !isPublisherUser && (
              <HeaderButton data-cy="drop-playlist" onClick={openDropPlaylistModal} IconBtn={!isDesktop}>
                <IconAirdrop />
                {isDesktop && "AIRDROP PLAYLIST"}
              </HeaderButton>
            )}

            {(shouldShowEdit || isAuthor || role === roleuser.EDULASTIC_CURATOR) && !urlHasUseThis && (
              <Tooltip placement="bottom" title="EDIT">
                <HeaderButton isGhost data-cy="edit-playlist" onClick={handleEditClick} IconBtn={!shouldHideUseThis}>
                  <IconPencilEdit />
                  {shouldHideUseThis && "EDIT"}
                </HeaderButton>
              </Tooltip>
            )}
            {(shouldShowEdit || showUseThisButton) && !shouldHideUseThis && role !== roleuser.EDULASTIC_CURATOR && (
              <HeaderButton data-cy="use-this" onClick={handleUseThisClick} IconBtn={!isDesktop}>
                <IconUseThis />
                {isDesktop && "USE THIS"}
              </HeaderButton>
            )}
            {features.isCurator && (status === "inreview" || status === "rejected") && (
              <HeaderButton onClick={onApproveClick}>APPROVE</HeaderButton>
            )}
            {features.isCurator && status === "inreview" && <HeaderButton onClick={onRejectClick}>REJECT</HeaderButton>}
          </CurriculumHeaderButtons>

          {urlHasUseThis && !isDesktop && (
            <PlaylistPageNav
              onChange={handleNavChange}
              current={currentTab}
              showDifferentiationTab={isSparkMathPlaylist}
            />
          )}
        </ResolvedMobileHeaderWrapper>
      </MainHeader>
    );
  }

  return <Fragment />;
};

export default withRouter(CurriculumHeader);

import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { reduce, isNumber } from "lodash";
import { roleuser } from "@edulastic/constants";
import { Tooltip } from "antd";
import { FlexContainer, EduButton, MainHeader } from "@edulastic/common";
import { smallDesktopWidth, extraDesktopWidthMax, tabletWidth } from "@edulastic/colors";
import { IconPencilEdit, IconPlaylist, IconShare, IconSave, IconAirdrop, IconUseThis } from "@edulastic/icons";
import StudentPlayListHeader from "../../../../student/sharedComponents/Header/PlayListHeader";
import PlaylistPageNav from "../PlaylistPageNav";
import SwitchPlaylist from "./SwitchPlaylist";

const CurriculumHeaderButtons = styled(FlexContainer)`
  margin-left: ${({ marginLeft }) => marginLeft};
`;

const HeaderButton = styled(EduButton)`
  text-transform: uppercase;
  @media (max-width: ${extraDesktopWidthMax}) {
    height: 38px;
    ${({ IconBtn }) => IconBtn && "width: 38px;"};
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: 30px;
    width: 30px;
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
  destinationCurriculumSequence,
  collections,
  playlistsToSwitch,
  updateDestinationPlaylist,
  handleEditClick,
  handleUseThisClick,
  openDropPlaylistModal,
  onShareClick,
  onApproveClick,
  handleNavChange,
  showUseThisNotification,
  handleGuidePopup,
  onRejectClick,
  windowWidth
}) => {
  const { isAuthor = false, status, title, collections: _playlistCollections = [] } = destinationCurriculumSequence;
  // figure out which tab contents to render || just render default playlist
  const {
    params: { cloneId = null, currentTab: cTab },
    url
  } = match;
  const currentTab = cTab || "playlist";
  const sparkCollection = collections.find(c => c.name === "Spark Math" && c.owner === "Edulastic Corp") || {};
  const isSparkMathPlaylist = _playlistCollections.some(item => item._id === sparkCollection?._id);

  const sumOfclasse = reduce(summaryData, (prev, curr) => (isNumber(curr?.classes) ? prev + curr.classes : prev), 0);
  const shouldHideUseThis = (sumOfclasse > 0 && !urlHasUseThis) || status === "draft";
  const showUseThisButton = status !== "draft" && !urlHasUseThis && !isPublisherUser && sumOfclasse === 0;

  const isPlaylistDetailsPage = window.location?.hash === "#review";
  const shouldShowEdit = url.includes("playlists") && isPlaylistDetailsPage && status === "draft" && !urlHasUseThis;

  const switchPlaylist = (
    <SwitchPlaylist
      isDesktop={isDesktop}
      playlistsToSwitch={playlistsToSwitch}
      showUseThisNotification={showUseThisNotification}
      onClickHandler={handleGuidePopup}
    />
  );

  if (isStudent) {
    return <StudentPlayListHeader headingSubContent={switchPlaylist} />;
  }

  const savePlaylist = () => {
    updateDestinationPlaylist({ showNotification: true });
  };
  const isMobile = windowWidth < parseInt(tabletWidth, 10);

  if (mode !== "embedded") {
    return (
      <MainHeader
        Icon={isDesktop ? IconPlaylist : null}
        headingText={loading ? "Untitled Playlist" : title}
        titleMaxWidth="22rem"
        justify="space-between"
        headingSubContent={urlHasUseThis && !isPublisherUser && switchPlaylist}
      >
        {urlHasUseThis && !isMobile && (
          <PlaylistPageNav
            onChange={handleNavChange}
            current={currentTab}
            showDifferentiationTab={isSparkMathPlaylist}
          />
        )}

        <CurriculumHeaderButtons marginLeft={urlHasUseThis ? "unset" : "auto"}>
          {(showUseThisButton || shouldShowEdit || urlHasUseThis || features.isCurator) &&
            role !== roleuser.EDULASTIC_CURATOR && (
              <HeaderButton isGhost data-cy="share" onClick={onShareClick} IconBtn>
                <IconShare />
              </HeaderButton>
            )}

          {isManageContentActive && !cloneId && !showUseThisButton && !shouldShowEdit && (
            <HeaderButton data-cy="save" onClick={savePlaylist} IconBtn={!isDesktop}>
              <IconSave />
              {isDesktop && "SAVE"}
            </HeaderButton>
          )}

          {urlHasUseThis && isTeacher && !isPublisherUser && (
            <HeaderButton data-cy="drop-playlist" onClick={openDropPlaylistModal} IconBtn={!isDesktop}>
              <IconAirdrop />
              {isDesktop && "OPEN TO STUDENTS"}
            </HeaderButton>
          )}

          {(shouldShowEdit || isAuthor || role === roleuser.EDULASTIC_CURATOR) && !urlHasUseThis && (
            <Tooltip placement="bottom" title="EDIT">
              <HeaderButton isGhost data-cy="edit-playlist" onClick={handleEditClick} IconBtn={!shouldHideUseThis}>
                <IconPencilEdit />
                {isDesktop && shouldHideUseThis && "EDIT"}
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

        {/* <ResolvedMobileHeaderWrapper>
          {urlHasUseThis && isSmallDesktop && (
            <PlaylistPageNav
              onChange={handleNavChange}
              current={currentTab}
              showDifferentiationTab={isSparkMathPlaylist}
            />
          )}
        </ResolvedMobileHeaderWrapper> */}
      </MainHeader>
    );
  }

  return <Fragment />;
};

export default withRouter(CurriculumHeader);

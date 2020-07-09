import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { roleuser } from "@edulastic/constants";
import { Tooltip, Modal, Dropdown, Menu } from "antd";
import { FlexContainer, EduButton, MainHeader } from "@edulastic/common";
import { smallDesktopWidth, extraDesktopWidthMax, tabletWidth, themeColor, themeColorBlue } from "@edulastic/colors";
import {
  IconPencilEdit,
  IconPlaylist,
  IconShare,
  IconSave,
  IconAirdrop,
  IconUseThis,
  IconTrash,
  IconMoreVertical
} from "@edulastic/icons";
import { IconActionButton } from "../styled";
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
    span {
      display: none;
    }
  }
`;
/**
 *
 * @param {string} id
 * @param {string} title
 * @param {Function} deletePlaylist
 */
function handleConfirmForDeletePlaylist(id, title, deletePlaylist) {
  Modal.confirm({
    title: "Do you want to delete ?",
    content: `Are you sure you want to Delete the Playlist "${title}"?`,
    onOk: () => {
      deletePlaylist(id);
      Modal.destroyAll();
    },
    okText: "Continue",
    centered: true,
    width: 500,
    okButtonProps: {
      style: { background: themeColor, outline: "none" }
    }
  });
}

function handleConfirmForRemovePlaylistFromFavourite(id, title, removeFromUse) {
  Modal.confirm({
    title: "Do you want to remove ?",
    content: `"${title}" playlist will be removed from My Playlist and it can be found in Playlist Library. Are you sure you want to proceed?`,
    onOk: () => {
      removeFromUse && removeFromUse(id);
      Modal.destroyAll();
    },
    okText: "Continue",
    centered: true,
    width: 500,
    okButtonProps: {
      style: { background: themeColor, outline: "none" }
    }
  });
}

const CurriculumHeader = ({
  match,
  mode,
  role,
  features,
  isStudent,
  isTeacher,
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
  windowWidth,
  deletePlaylist,
  removePlaylistFromUse,
  customizeInDraft = false,
  publishPlaylistInDraft,
  discardDraftPlaylist
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const {
    isAuthor = false,
    status,
    title,
    collections: _playlistCollections = [],
    _id
  } = destinationCurriculumSequence;

  // figure out which tab contents to render || just render default playlist
  const {
    params: { cloneId = null, currentTab: cTab },
    url
  } = match;
  const currentTab = cTab || "playlist";
  const sparkCollection = collections.find(c => c.name === "Spark Math" && c.owner === "Edulastic Corp") || {};
  const isSparkMathPlaylist = _playlistCollections.some(item => item._id === sparkCollection?._id);

  const shouldHideUseThis = status === "draft";
  const showUseThisButton = status !== "draft" && !urlHasUseThis && !isPublisherUser;

  const isPlaylistDetailsPage = window.location?.hash === "#review";
  const shouldShowEdit = url.includes("playlists") && isPlaylistDetailsPage && status === "draft" && !urlHasUseThis;

  const switchPlaylist = (
    <SwitchPlaylist
      playlistsToSwitch={playlistsToSwitch}
      showUseThisNotification={showUseThisNotification}
      onClickHandler={handleGuidePopup}
    />
  );

  if (isStudent) {
    return <StudentPlayListHeader headingSubContent={switchPlaylist} />;
  }

  const savePlaylist = () => {
    if (customizeInDraft) {
      publishPlaylistInDraft();
      return;
    }
    updateDestinationPlaylist({ showNotification: true });
  };
  const isMobile = windowWidth < parseInt(tabletWidth, 10);

  const mainPlaylistVerticalMenu = (
    <Menu>
      <Menu.Item onClick={() => handleConfirmForRemovePlaylistFromFavourite(_id, title, removePlaylistFromUse)}>
        Remove from Favorite
      </Menu.Item>
    </Menu>
  );

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
          {(shouldShowEdit || isAuthor || role === roleuser.EDULASTIC_CURATOR) &&
            !urlHasUseThis &&
            destinationCurriculumSequence?._id && (
              <Tooltip placement="bottom" title="DELETE">
                <HeaderButton
                  loading={loadingDelete}
                  isGhost
                  isBlue
                  data-cy="delete-playlist"
                  IconBtn={!shouldHideUseThis}
                  onClick={() => {
                    setLoadingDelete();
                    handleConfirmForDeletePlaylist(_id, title, deletePlaylist);
                  }}
                >
                  <IconTrash />
                  {shouldHideUseThis && "DELETE"}
                </HeaderButton>
              </Tooltip>
            )}

          {(showUseThisButton || shouldShowEdit || urlHasUseThis || features.isCurator) &&
            role !== roleuser.EDULASTIC_CURATOR && (
              <HeaderButton isBlue isGhost data-cy="share" onClick={onShareClick} IconBtn>
                <IconShare />
              </HeaderButton>
            )}

          {customizeInDraft && (
            <HeaderButton isBlue isGhost data-cy="cancel" onClick={discardDraftPlaylist}>
              CANCEL
            </HeaderButton>
          )}

          {(isManageContentActive && !cloneId && !showUseThisButton && !shouldShowEdit) && (
            <HeaderButton isBlue data-cy="save" onClick={savePlaylist} IconBtn={!isDesktop}>
              <IconSave />
              {isDesktop && "SAVE"}
            </HeaderButton>
          )}

          {urlHasUseThis && isTeacher && !isPublisherUser && !customizeInDraft && (
            <>
              <HeaderButton isBlue data-cy="drop-playlist" onClick={openDropPlaylistModal} IconBtn={!isDesktop}>
                <IconAirdrop />
                {isDesktop && "OPEN TO STUDENTS"}
              </HeaderButton>
              <Dropdown
                overlayStyle={{ zIndex: 999, cursor: "pointer" }}
                overlay={mainPlaylistVerticalMenu}
                trigger={["click"]}
              >
                <IconActionButton style={{ cursor: "pointer" }} onClick={e => e.stopPropagation()}>
                  <IconMoreVertical width={5} height={14} color={themeColorBlue} />
                </IconActionButton>
              </Dropdown>
            </>
          )}

          {(shouldShowEdit || isAuthor || role === roleuser.EDULASTIC_CURATOR) && !urlHasUseThis && (
            <Tooltip placement="bottom" title="EDIT">
              <HeaderButton
                isBlue
                isGhost
                data-cy="edit-playlist"
                onClick={handleEditClick}
                IconBtn={!shouldHideUseThis}
              >
                <IconPencilEdit />
                {shouldHideUseThis && <span>EDIT</span>}
              </HeaderButton>
            </Tooltip>
          )}
          {(shouldShowEdit || showUseThisButton) && !shouldHideUseThis && role !== roleuser.EDULASTIC_CURATOR && (
            <HeaderButton isBlue data-cy="use-this" onClick={handleUseThisClick} IconBtn={!isDesktop}>
              <IconUseThis />
              <span>USE THIS</span>
            </HeaderButton>
          )}
          {features.isCurator && (status === "inreview" || status === "rejected") && (
            <HeaderButton isBlue onClick={onApproveClick}>
              APPROVE
            </HeaderButton>
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

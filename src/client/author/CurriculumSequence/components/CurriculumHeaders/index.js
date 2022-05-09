import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { roleuser } from '@edulastic/constants'
import { Tooltip, Modal, Dropdown, Menu } from 'antd'
import { FlexContainer, EduButton, MainHeader } from '@edulastic/common'
import {
  smallDesktopWidth,
  extraDesktopWidthMax,
  tabletWidth,
  themeColor,
  themeColorBlue,
  white,
  textColor,
  lightGrey,
  greyDarken,
  publishedColor,
} from '@edulastic/colors'
import {
  IconPencilEdit,
  IconPlaylist,
  IconShare,
  IconSave,
  IconUseThis,
  IconTrash,
  IconMoreVertical,
  IconDuplicate,
} from '@edulastic/icons'
import { IconActionButton } from '../styled'
import StudentPlayListHeader from '../../../../student/sharedComponents/Header/PlayListHeader'
import PlaylistPageNav from '../PlaylistPageNav'
import SwitchPlaylist from './SwitchPlaylist'
import { getCollectionsSelector } from '../../../src/selectors/user'
import { allowContentEditCheck } from '../../../src/utils/permissionCheck'

const CurriculumHeaderButtons = styled(FlexContainer)`
  margin-left: ${({ marginLeft }) => marginLeft};
`

const HeaderButton = styled(EduButton)`
  text-transform: uppercase;
  @media (max-width: ${extraDesktopWidthMax}) {
    height: 38px;
    ${({ IconBtn }) => IconBtn && 'width: 38px;'};
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: 30px;
    width: 30px;
    span {
      display: none;
    }
  }
`

const PlaylistStatus = styled.span`
  margin-top: 0;
  color: ${(props) => (props.mode === 'embedded' ? white : textColor)};
  background: ${(props) => (props.mode === 'embedded' ? textColor : white)};
  width: 60px;
  height: 20px;
  font-weight: 600;
  margin-left: 10px;
  display: inline-block;
  font-size: 9px;
  text-transform: uppercase;
  border-radius: 4px;
  text-align: center;
  padding-top: 3px;
  &.draft {
    background: ${lightGrey};
    color: ${greyDarken};
  }
  &.published {
    background: ${publishedColor};
    color: white;
  }
`
/**
 *
 * @param {string} id
 * @param {string} title
 * @param {Function} deletePlaylist
 */
function handleConfirmForDeletePlaylist(id, title, deletePlaylist) {
  Modal.confirm({
    title: 'Do you want to delete ?',
    content: `Are you sure you want to Delete the Playlist "${title}"?`,
    onOk: () => {
      deletePlaylist(id)
      Modal.destroyAll()
    },
    okText: 'Continue',
    centered: true,
    width: 500,
    okButtonProps: {
      style: { background: themeColor, outline: 'none' },
    },
  })
}

function handleConfirmForRemovePlaylistFromFavourite(id, title, removeFromUse) {
  Modal.confirm({
    title: 'Do you want to remove ?',
    content: `"${title}" playlist will be removed from My Playlist and it can be found in Playlist Library. Are you sure you want to proceed?`,
    onOk: () => {
      removeFromUse && removeFromUse(id)
      Modal.destroyAll()
    },
    okText: 'Continue',
    centered: true,
    width: 500,
    okButtonProps: {
      style: { background: themeColor, outline: 'none' },
    },
  })
}

const CurriculumHeader = ({
  match,
  mode,
  role,
  features,
  isStudent,
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
  discardDraftPlaylist,
  canAllowDuplicate,
  duplicatePlayList,
  writableCollections,
  isDemoPlaygroundUser,
  isSMPlaylist,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false)
  const {
    isAuthor = false,
    status,
    title,
    collections: _playlistCollections = [],
    clonedCollections = [],
    _id,
  } = destinationCurriculumSequence
  const hasCollectionAccess = allowContentEditCheck(
    _playlistCollections,
    writableCollections
  )
  // figure out which tab contents to render || just render default playlist
  const {
    params: { currentTab: cTab },
    url,
  } = match
  const currentTab = cTab || 'playlist'
  const sparkCollection =
    collections.find(
      (c) => c.name === 'Spark Math' && c.owner === 'Edulastic Corp'
    ) || {}
  const isSparkMathPlaylist =
    _playlistCollections.some((item) => item._id === sparkCollection?._id) ||
    clonedCollections.some((item) => item._id === sparkCollection?._id)

  const shouldHideUseThis = status === 'draft'
  const showUseThisButton =
    status !== 'draft' && !urlHasUseThis && !isPublisherUser

  const isPlaylistDetailsPage = window.location?.hash === '#review'
  const shouldShowEdit =
    url.includes('playlists') &&
    isPlaylistDetailsPage &&
    status === 'draft' &&
    !urlHasUseThis

  const switchPlaylist = (
    <SwitchPlaylist
      playlistsToSwitch={playlistsToSwitch}
      showUseThisNotification={showUseThisNotification}
      onClickHandler={handleGuidePopup}
    />
  )

  if (isStudent) {
    return <StudentPlayListHeader headingSubContent={switchPlaylist} />
  }

  const savePlaylist = () => {
    if (customizeInDraft) {
      publishPlaylistInDraft()
      return
    }
    updateDestinationPlaylist({ showNotification: true, isSMPlaylist })
  }
  const isMobile = windowWidth < parseInt(tabletWidth, 10)

  const mainPlaylistVerticalMenu = (
    <Menu>
      <Menu.Item
        onClick={() =>
          handleConfirmForRemovePlaylistFromFavourite(
            _id,
            title,
            removePlaylistFromUse
          )
        }
      >
        Remove from Favorite
      </Menu.Item>
    </Menu>
  )

  const headingSubContent =
    urlHasUseThis && !isPublisherUser ? (
      switchPlaylist
    ) : (
      <PlaylistStatus className={status} data-cy="playlist-status">
        {status}
      </PlaylistStatus>
    )

  if (mode !== 'embedded') {
    return (
      <MainHeaderWrapper>
        <MainHeader
          containerClassName="tabAlignment"
          Icon={isDesktop ? IconPlaylist : null}
          headingText={loading ? 'Untitled Playlist' : title}
          titleText={
            loading
              ? 'Untitled Playlist'
              : `${title} - ${destinationCurriculumSequence?.alignmentInfo}`
          }
          titleMaxWidth="22rem"
          justify="space-between"
          headingSubContent={headingSubContent}
          headerLeftClassName="headerLeftWrapper"
        >
          {urlHasUseThis && !isMobile && (
            <PlaylistPageNav
              onChange={handleNavChange}
              current={currentTab}
              showDifferentiationTab={isSparkMathPlaylist}
              showInsightTab={role === roleuser.TEACHER}
              role={role}
            />
          )}

          <CurriculumHeaderButtons
            justifyContent="flex-end"
            marginLeft={urlHasUseThis ? 'unset' : 'auto'}
          >
            {(shouldShowEdit ||
              isAuthor ||
              role === roleuser.EDULASTIC_CURATOR) &&
              !urlHasUseThis &&
              destinationCurriculumSequence?._id && (
                <Tooltip placement="bottom" title="DELETE">
                  <HeaderButton
                    loading={loadingDelete}
                    isGhost
                    isBlue
                    data-cy="delete-playlist"
                    IconBtn
                    onClick={() => {
                      setLoadingDelete()
                      handleConfirmForDeletePlaylist(_id, title, deletePlaylist)
                    }}
                  >
                    <IconTrash />
                  </HeaderButton>
                </Tooltip>
              )}

            {(showUseThisButton ||
              shouldShowEdit ||
              urlHasUseThis ||
              features.isCurator) &&
              !customizeInDraft &&
              role !== roleuser.EDULASTIC_CURATOR && (
                <Tooltip placement="bottom" title="SHARE">
                  <HeaderButton
                    isBlue
                    isGhost
                    data-cy="share"
                    onClick={onShareClick}
                    IconBtn
                    disabled={isDemoPlaygroundUser}
                    title={
                      isDemoPlaygroundUser
                        ? 'This feature is not available in demo account.'
                        : ''
                    }
                  >
                    <IconShare />
                  </HeaderButton>
                </Tooltip>
              )}

            {(canAllowDuplicate ||
              isAuthor ||
              role === roleuser.EDULASTIC_CURATOR) && (
              <Tooltip placement="bottom" title="CLONE">
                <HeaderButton
                  isBlue
                  isGhost
                  data-cy="clone"
                  disabled={isDemoPlaygroundUser}
                  title={
                    isDemoPlaygroundUser
                      ? 'This feature is not available in demo account.'
                      : ''
                  }
                  onClick={() =>
                    duplicatePlayList({
                      _id: destinationCurriculumSequence._id,
                      title: destinationCurriculumSequence.title,
                    })
                  }
                  IconBtn
                >
                  <IconDuplicate />
                </HeaderButton>
              </Tooltip>
            )}

            {customizeInDraft && (
              <HeaderButton
                isBlue
                isGhost
                data-cy="cancel"
                onClick={discardDraftPlaylist}
              >
                CANCEL
              </HeaderButton>
            )}

            {isManageContentActive &&
              (!showUseThisButton || customizeInDraft) &&
              !shouldShowEdit && (
                <HeaderButton
                  isBlue
                  data-cy="save"
                  onClick={savePlaylist}
                  IconBtn={!isDesktop}
                >
                  <IconSave />
                  {isDesktop && 'SAVE'}
                </HeaderButton>
              )}

            {urlHasUseThis &&
              (role === 'teacher' ||
                role === 'district-admin' ||
                role === 'school-admin') &&
              !isPublisherUser &&
              !customizeInDraft && (
                <>
                  {/* need to hide this button for now until figuring out the complete flow  */}
                  {/* {<HeaderButton isBlue data-cy="drop-playlist" onClick={openDropPlaylistModal} IconBtn={!isDesktop}>
                <IconAirdrop />
                {isDesktop && "OPEN TO STUDENTS"}
              </HeaderButton>} */}
                  <Dropdown
                    overlayStyle={{ zIndex: 999, cursor: 'pointer' }}
                    overlay={mainPlaylistVerticalMenu}
                    trigger={['click']}
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    <IconActionButton
                      style={{ cursor: 'pointer', alignSelf: 'center' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconMoreVertical
                        width={5}
                        height={14}
                        color={themeColorBlue}
                      />
                    </IconActionButton>
                  </Dropdown>
                </>
              )}

            {(shouldShowEdit ||
              isAuthor ||
              role === roleuser.EDULASTIC_CURATOR) &&
              !urlHasUseThis && (
                <Tooltip placement="bottom" title="EDIT">
                  <HeaderButton
                    isBlue
                    isGhost={!shouldHideUseThis}
                    data-cy="edit-playlist"
                    onClick={handleEditClick}
                    IconBtn={!shouldHideUseThis}
                  >
                    <IconPencilEdit />
                    {shouldHideUseThis && <span>EDIT</span>}
                  </HeaderButton>
                </Tooltip>
              )}
            {(shouldShowEdit || showUseThisButton) &&
              !customizeInDraft &&
              !shouldHideUseThis &&
              role !== roleuser.EDULASTIC_CURATOR && (
                <HeaderButton
                  isBlue
                  data-cy="use-this"
                  onClick={handleUseThisClick}
                  IconBtn={!isDesktop}
                >
                  <IconUseThis />
                  <span>USE THIS</span>
                </HeaderButton>
              )}
            {features.isCurator &&
              (status === 'inreview' || status === 'rejected') &&
              hasCollectionAccess && (
                <HeaderButton isBlue onClick={onApproveClick}>
                  APPROVE
                </HeaderButton>
              )}
            {features.isCurator &&
              status === 'inreview' &&
              hasCollectionAccess && (
                <HeaderButton onClick={onRejectClick}>REJECT</HeaderButton>
              )}
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
      </MainHeaderWrapper>
    )
  }

  return <></>
}

const enhance = compose(
  withRouter,
  connect((state) => ({
    writableCollections: getCollectionsSelector(state),
    isDemoPlaygroundUser: state?.user?.user?.isPlayground,
  }))
)

export default enhance(CurriculumHeader)

const MainHeaderWrapper = styled.div`
  .headerLeftWrapper > h1 {
    max-width: 200px;
  }
`

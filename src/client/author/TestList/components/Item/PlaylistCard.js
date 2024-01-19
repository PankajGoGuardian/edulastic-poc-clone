import React from 'react'
import { message } from 'antd'
import { first } from 'lodash'
import { IconUser, IconUsers } from '@edulastic/icons'
import { cardTitleColor, darkGrey } from '@edulastic/colors'
import { PremiumLabel, EduButton } from '@edulastic/common'
import { PEAR_ASSESSMENT_CERTIFIED_NAME } from '@edulastic/constants/const/common'

import {
  Container,
  Inner,
  Footer,
  Author,
  AuthorName,
  Header,
  Stars,
  StyledLink,
  TestInfo,
  ShareIcon,
  AuthorWrapper,
  IconText,
  MidRow,
  PlaylistId,
  StatusRow,
  PlaylistDesc,
  PlaylistCardHeaderRow,
  PlaylistSkinType,
  Grade,
  ButtonWrapper,
  FullSizeThumbnailCard,
  CardCover,
} from './styled'
import Tags from '../../../src/components/common/Tags'
import { TestStatus } from '../ListItem/styled'
import { getAuthorCollectionMap } from '../../../dataUtils'
import TestStatusWrapper from '../TestStatusWrapper/testStatusWrapper'

const PlaylistCard = ({
  _source,
  moveToItem,
  status,
  collections,
  showPremiumTag,
  tags,
  usage,
  standardsIdentifiers,
  authorName,
  testItemId,
  history,
  useThisPlayList,
  _id,
  isPublisherUser,
  isOrganizationDistrictUser,
  isUseThisLoading,
}) => {
  const grade = first(_source.grades)
  const { thumbnail, skin } = _source
  const isFullSizeImage = skin === 'FULL_SIZE'
  const isDraft = status === 'draft'

  const handleUseThisClick = () => {
    const { title, grades, subjects, customize = null, authors } = _source
    const msg = message.loading('Using this playlist. Please Wait....', 0)

    useThisPlayList({
      _id,
      title,
      grades,
      subjects,
      customize,
      fromUseThis: true,
      notificationCallback: msg,
      authors,
    })
  }

  const handleDetailsClick = () => {
    history.push(`/author/playlists/${_id}#review`)
  }

  const playListId = testItemId ? (
    <PlaylistId data-cy="test-id" key="playlistId">
      <span>#</span>
      <span>{testItemId}</span>
    </PlaylistId>
  ) : null

  const playListStatus = (
    <TestStatusWrapper
      status={status || _source?.status}
      checkUser={false}
      key="playlist-status"
    >
      {({ children, ...rest }) => (
        <TestStatus
          {...rest}
          view="tile"
          data-cy="test-status"
          className="playlist-status"
        >
          {children}
        </TestStatus>
      )}
    </TestStatusWrapper>
  )

  const playListUsage = !isDraft && (
    <ShareIcon>
      <IconUsers color={darkGrey} width={14} height={14} /> &nbsp;
      <IconText>{usage}</IconText>
    </ShareIcon>
  )

  const showUseThisButton =
    _source.status === 'published' &&
    !isOrganizationDistrictUser &&
    !isPublisherUser

  if (isFullSizeImage) {
    return (
      <FullSizeThumbnailCard
        isPlaylist
        onClick={moveToItem}
        cover={
          <CardCover uri={thumbnail}>
            <ButtonWrapper position="relative" className="showHover">
              <EduButton
                width="145px"
                height="45px"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDetailsClick()
                }}
              >
                Details
              </EduButton>

              {showUseThisButton && (
                <EduButton
                  loading={isUseThisLoading}
                  disabled={isUseThisLoading}
                  width="145px"
                  height="45px"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleUseThisClick()
                  }}
                >
                  Use This
                </EduButton>
              )}
            </ButtonWrapper>
          </CardCover>
        }
        actions={[
          playListId,
          playListUsage,
          isDraft ? playListStatus : '',
        ].filter((x) => x)}
      />
    )
  }

  return (
    <Container
      isPlaylist
      src={thumbnail}
      onClick={moveToItem}
      title={
        <Header src={thumbnail} isPlaylist>
          <PlaylistCardHeaderRow>
            <PlaylistSkinType />
            <Grade>Grade {grade}</Grade>
          </PlaylistCardHeaderRow>

          <ButtonWrapper className="showHover">
            <EduButton
              height="32px"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDetailsClick()
              }}
            >
              Details
            </EduButton>

            {showUseThisButton && (
              <EduButton
                loading={isUseThisLoading}
                disabled={isUseThisLoading}
                height="32px"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleUseThisClick()
                }}
              >
                Use This
              </EduButton>
            )}
          </ButtonWrapper>

          <Stars isPlaylist />
          {collections.find((o) => o.name === PEAR_ASSESSMENT_CERTIFIED_NAME) &&
            getAuthorCollectionMap(false, 30, 30).edulastic_certified.icon}
          {showPremiumTag && <PremiumLabel>PREMIUM</PremiumLabel>}
        </Header>
      }
    >
      <TestInfo isPlaylist>
        <StyledLink data-cy="test-title" title={_source.title}>
          {_source.title}
        </StyledLink>
        <PlaylistDesc
          dangerouslySetInnerHTML={{ __html: _source.description }}
        />
        <MidRow data-cy="test-standards">
          <Tags
            show={4}
            tags={standardsIdentifiers}
            key="standards"
            isStandards
            margin="0px"
          />
          <Tags
            data-cy="test-tags"
            show={2}
            tags={_source.tags || tags}
            key="tags"
            margin="0px"
          />
        </MidRow>
      </TestInfo>
      <Inner>
        {authorName && (
          <Author isPlaylist>
            <AuthorWrapper>
              {collections.find(
                (o) => o.name === PEAR_ASSESSMENT_CERTIFIED_NAME
              ) ? (
                getAuthorCollectionMap(true, 30, 30).edulastic_certified.icon
              ) : (
                <IconUser color={cardTitleColor} />
              )}
              <AuthorName data-cy="test-author-name" title={authorName}>
                {authorName}
              </AuthorName>
            </AuthorWrapper>
          </Author>
        )}
        <StatusRow>{playListStatus}</StatusRow>
      </Inner>

      <Footer>
        {playListId}
        {playListUsage}
      </Footer>
    </Container>
  )
}

export default PlaylistCard

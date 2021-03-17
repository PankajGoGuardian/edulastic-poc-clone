import React from 'react'
import { first } from 'lodash'
import { IconUser, IconUsers } from '@edulastic/icons'
import { cardTitleColor, darkGrey } from '@edulastic/colors'
import { PremiumLabel, EduButton } from '@edulastic/common'

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
  allowDuplicate,
  duplicatePlayList,
  _id,
}) => {
  const grade = first(_source.grades)
  const { thumbnail, fullSizeThumbnail } = _source
  const isDraft = status === 'draft'

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

  if (fullSizeThumbnail) {
    return (
      <FullSizeThumbnailCard
        isPlaylist
        cover={<CardCover uri={thumbnail} />}
        actions={[playListId, playListUsage, isDraft ? playListStatus : '']}
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

          {allowDuplicate && (
            <ButtonWrapper className="showHover">
              <EduButton
                height="32px"
                onClick={(e) => {
                  e.stopPropagation()
                  duplicatePlayList({ _id, title: _source.title })
                }}
              >
                clone
              </EduButton>
            </ButtonWrapper>
          )}

          <Stars isPlaylist />
          {collections.find((o) => o.name === 'Edulastic Certified') &&
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
              {collections.find((o) => o.name === 'Edulastic Certified') ? (
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

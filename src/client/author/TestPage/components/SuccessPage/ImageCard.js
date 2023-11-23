import React from 'react'
import { IconHeart, IconUser, IconUsers } from '@edulastic/icons'
import { cardTitleColor, secondaryTextColor } from '@edulastic/colors'
import { keyBy } from 'lodash'
import Tags from '../../../src/components/common/Tags'
import {
  flattenPlaylistStandards,
  getTestAuthorName,
  getPlaylistAuthorName,
  getAuthorCollectionMap,
} from '../../../dataUtils'

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
  LikeIcon,
  ShareIcon,
  AuthorWrapper,
  IconText,
  TagsWrapper,
  PlaylistId,
  StatusRow,
  Qcount,
  MidRow,
  Collection,
  CollectionNameWrapper,
  ThinLine,
} from '../../../TestList/components/Item/styled'
import TestStatusWrapper from '../../../TestList/components/TestStatusWrapper/testStatusWrapper'
import { TestStatus } from '../../../TestList/components/ListItem/styled'
import { getTestCollectionName } from '../../../utils/testCardDetails'

const ImageCard = ({
  isPlaylist,
  _source = {},
  collections: itemBanks = [],
  contentData = {},
}) => {
  const {
    title,
    summary = {},
    tags,
    modules,
    analytics = [],
    _id = '',
    collections = [],
    status,
    thumbnail,
    isDocBased,
    sharedType,
  } = _source

  const collectionName = getTestCollectionName(
    itemBanks,
    collections,
    sharedType
  )
  const authorName = isPlaylist
    ? getPlaylistAuthorName({ _source })
    : getTestAuthorName(_source)
  const { usage = 0, likes = 0 } = analytics[0] || {}
  const itemId = _id.substr(_id.length - 5)
  const collectionById = keyBy(itemBanks, '_id')
  const filterCollections = collections
    .map((col) => collectionById[col._id])
    .filter((c) => c)
  const { totalItems, totalQuestions, standards = [] } = summary
  const standardsIdentifiers = isPlaylist
    ? flattenPlaylistStandards(modules)
    : standards.map((item) => item.identifier)

  return (
    <Container
      data-cy={_id}
      className={`testCard${_id}`}
      src={thumbnail}
      onClick={() => {}}
      title={
        <Header src={thumbnail}>
          <Stars />
          {filterCollections.find((o) => o.name === 'Edulastic Certified') &&
            getAuthorCollectionMap(false, 30, 30).edulastic_certified.icon}
        </Header>
      }
    >
      <TestInfo style={{ textAlign: 'left' }}>
        <StyledLink data-cy="test-title" title={contentData.title || title}>
          {contentData.title || title}
        </StyledLink>
        <TagsWrapper data-cy="test-standards" isPlaylist={isPlaylist}>
          <Tags
            show={4}
            tags={contentData.standardsIdentifiers || standardsIdentifiers}
            key="standards"
            isStandards
            margin="0px"
            testId={_id}
          />
          {isPlaylist && <Tags show={2} tags={tags} key="tags" />}
        </TagsWrapper>
      </TestInfo>

      {!isPlaylist && (
        <MidRow>
          <Collection>
            <label>COLLECTIONS</label>
            <CollectionNameWrapper
              data-cy="test-collection"
              title={collectionName}
              style={{ color: secondaryTextColor }}
            >
              {collectionName}
            </CollectionNameWrapper>
          </Collection>
          <Qcount>
            <label>TOTAL ITEMS</label>
            {/**
             * For doc based wee need to consider
             *  total number questions and toal number of items
             *  */}
            <div data-cy="test-item-count">
              {isDocBased ? totalQuestions : totalItems}
            </div>
          </Qcount>
        </MidRow>
      )}
      {isPlaylist ? <ThinLine /> : null}
      <Inner>
        {authorName && (
          <Author>
            <AuthorWrapper>
              <IconUser color={cardTitleColor} />
              <AuthorName data-cy="test-author-name" title={authorName}>
                {authorName}
              </AuthorName>
            </AuthorWrapper>
          </Author>
        )}
        <StatusRow>
          <TestStatusWrapper status={status} checkUser={false}>
            {({ children, _status }) => (
              <TestStatus status={_status} view="tile">
                {children}
              </TestStatus>
            )}
          </TestStatusWrapper>
        </StatusRow>
      </Inner>

      <Footer>
        {itemId ? (
          <PlaylistId>
            <span>#</span>
            <span data-cy="test-id">{itemId}</span>
          </PlaylistId>
        ) : null}
        {status !== 'draft' && (
          <>
            <ShareIcon>
              <IconUsers
                color={cardTitleColor}
                width={14}
                height={14}
                style={{ marginRight: '8px' }}
              />
              <IconText>{usage}</IconText>
            </ShareIcon>
            <LikeIcon>
              <IconHeart
                color={cardTitleColor}
                width={14}
                height={14}
                style={{ marginRight: '8px' }}
              />
              <IconText>{likes}</IconText>
            </LikeIcon>
          </>
        )}
      </Footer>
    </Container>
  )
}

export default ImageCard

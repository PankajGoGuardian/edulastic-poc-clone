import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { FlexContainer, PremiumTag, LikeIconStyled } from '@edulastic/common'
import { darkGrey } from '@edulastic/colors'
import {
  IconUser,
  IconHash,
  IconVolumeUp,
  IconNoVolume,
  IconHeart,
  IconShare,
  IconRubric,
} from '@edulastic/icons'
import CollectionTag from '@edulastic/common/src/components/CollectionTag/CollectionTag'
import { isPublisherUserSelector } from '../../../../../../src/selectors/user'
import Tags from '../../../../../../src/components/common/Tags'
import Standards from '../../../../../../ItemList/components/Item/Standards'
import { renderAnalytics } from '../../../../Summary/components/Sidebar/Sidebar'
import {
  AnalyticsItem,
  MetaTitle,
} from '../../../../Summary/components/Sidebar/styled'
import { MetaTag, DokStyled } from './styled'
import { toggleTestLikeAction } from '../../../../../ducks'
import TestStatusWrapper from '../../../../../../TestList/components/TestStatusWrapper/testStatusWrapper'
import { TestStatus } from '../../../../../../TestList/components/ListItem/styled'

const MetaInfo = ({
  data: {
    item,
    type,
    by,
    id,
    audio = {},
    isPremium = false,
    dok,
    tags,
    analytics,
  },
  isPublisherUser,
  toggleTestItemLikeRequest,
}) => {
  const isItemLiked = item?.alreadyLiked || false

  const questions = get(item, 'data.questions', [])
  const isRubricAttached = questions.some((q) => q?.rubrics)

  const handleItemLike = () => {
    toggleTestItemLikeRequest({
      contentId: id,
      contentType: 'TESTITEM',
      toggleValue: !isItemLiked,
      versionId: item.versionId,
    })
  }

  return (
    <FlexContainer
      mt="15px"
      justifyContent="space-between"
      alignItems="flex-end"
    >
      <FlexContainer>
        {!isPublisherUser && !!isPremium && (
          <PremiumTag key="premium" mr="16px">
            Premium
          </PremiumTag>
        )}
        {item && item.data && (
          <Standards
            item={item}
            search={{ curriculumId: '' }}
            reviewpage
            margin="0px"
            labelStyle={{ marginBottom: 0 }}
          />
        )}
        <Tags
          tags={tags}
          show={1}
          margin="0px"
          labelStyle={{ marginBottom: 0 }}
        />
        {type && (
          <FlexContainer alignItems="center">
            {type.map((t) => (
              <MetaTag data-cy="ques-type" key={t} marginLeft="0px">
                {t}
              </MetaTag>
            ))}
          </FlexContainer>
        )}
        <CollectionTag collectionName={item?.collectionName} />
        <TestStatusWrapper status={item.status}>
          {({ children, ...rest }) => (
            <TestStatus {...rest}>{children}</TestStatus>
          )}
        </TestStatusWrapper>
      </FlexContainer>
      <FlexContainer justifyContent="flex-end" alignItems="flex-end">
        {dok && <DokStyled data-cy="itemDok">{`DOK:${dok}`}</DokStyled>}
        {isRubricAttached &&
          renderAnalytics(' ', IconRubric, false, 'rubricIcon')}
        {renderAnalytics(by, IconUser, false, 'authorName')}
        {renderAnalytics(id && id.substring(18), IconHash, false, 'itemId')}
        <AnalyticsItem>
          <IconShare color={darkGrey} width={15} height={15} />
          <MetaTitle>{analytics?.[0]?.usage || 0}</MetaTitle>
        </AnalyticsItem>
        <LikeIconStyled
          data-cy="like-item"
          isLiked={isItemLiked}
          onClick={handleItemLike}
          height="20px"
          ml="15px"
        >
          <IconHeart
            color={isItemLiked ? '#ca481e' : darkGrey}
            width={15}
            height={15}
          />
          <MetaTitle>{analytics?.[0]?.likes || 0}</MetaTitle>
        </LikeIconStyled>
        {audio && Object.prototype.hasOwnProperty.call(audio, 'ttsSuccess') ? (
          audio.ttsSuccess ? (
            <IconVolumeUp margin="0px 0px 0px 20px" />
          ) : (
            <IconNoVolume margin="0px 0px 0px 20px" />
          )
        ) : (
          ''
        )}
      </FlexContainer>
    </FlexContainer>
  )
}

MetaInfo.propTypes = {
  data: PropTypes.object.isRequired,
}

export default connect(
  (state) => ({
    isPublisherUser: isPublisherUserSelector(state),
  }),
  {
    toggleTestItemLikeRequest: toggleTestLikeAction,
  }
)(MetaInfo)

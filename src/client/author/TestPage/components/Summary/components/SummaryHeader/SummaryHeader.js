import React from 'react'
import PropTypes from 'prop-types'
import { IconShare, IconHeart, IconEduLogo } from '@edulastic/icons'
import { FlexContainer } from '@edulastic/common'

import IconPearAssessLogoCompact from '@edulastic/icons/src/IconPearAssessLogoCompact'
import { Photo } from '../../../common'
import {
  Container,
  Avatar,
  AvatarContainer,
  CreatedByTitle,
  CreatedByValue,
  ContainerLeft,
  ContainerRight,
} from './styled'
import { Block, AnalyticsContainer } from '../Sidebar/styled'
import { renderAnalytics } from '../Sidebar/Sidebar'
import { isPearDomain } from '../../../../../../../utils/pear'

const SummaryHeader = ({
  createdBy,
  windowWidth,
  onChangeField,
  thumbnail,
  analytics,
  owner,
  isEditable,
  isPlaylist = false,
  test,
  toggleTestLikeRequest,
}) => {
  const isTestLiked = test?.alreadyLiked || false
  const handleTestLike = () => {
    if (test._id) {
      toggleTestLikeRequest({
        contentId: test._id,
        contentType: 'TEST',
        toggleValue: !isTestLiked,
        versionId: test?.versionId,
      })
    }
  }
  return (
    <Container>
      <ContainerLeft>
        <Photo
          height={windowWidth > 993 ? 165 : 120}
          windowWidth={windowWidth}
          owner={owner}
          onChangeField={onChangeField}
          url={thumbnail}
          isEditable={isEditable}
        />
      </ContainerLeft>
      <ContainerRight>
        <AvatarContainer>
          <FlexContainer justifyContent="flex-start" alignItems="center">
            <Avatar>
              {isPearDomain ? (
                <IconPearAssessLogoCompact width="50px" height="50px" />
              ) : (
                <>
                  <IconEduLogo />
                </>
              )}
            </Avatar>
            {/* Default Icon */}
            <FlexContainer
              flexDirection="column"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <CreatedByTitle style={{ marginRight: 0 }}>
                Created by:
              </CreatedByTitle>
              <CreatedByValue>
                {createdBy &&
                  (createdBy.name ||
                    `${createdBy.firstName} ${
                      createdBy.lastName ? createdBy.lastName : ''
                    }`)}
              </CreatedByValue>
            </FlexContainer>
          </FlexContainer>
        </AvatarContainer>
        <Block>
          <AnalyticsContainer
            justifyContent="flex-start"
            alignItems="center"
            style={{ marginBottom: windowWidth > 993 ? '0' : '15px' }}
            padding="10px 10px 10px 50px"
          >
            {renderAnalytics(
              (analytics && analytics?.[0]?.usage) || 0,
              IconShare
            )}
            {!isPlaylist && (
              <span onClick={handleTestLike}>
                {renderAnalytics(
                  (analytics && analytics?.[0]?.likes) || 0,
                  IconHeart,
                  isTestLiked
                )}
              </span>
            )}
          </AnalyticsContainer>
        </Block>
      </ContainerRight>
    </Container>
  )
}

SummaryHeader.propTypes = {
  createdBy: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  owner: PropTypes.bool,
  windowWidth: PropTypes.number.isRequired,
  onChangeField: PropTypes.func.isRequired,
  thumbnail: PropTypes.string.isRequired,
}

SummaryHeader.defaultProps = {
  owner: false,
}

export default SummaryHeader

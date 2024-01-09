import React, { useRef, useState, useEffect } from 'react'
import { IconHeart, IconUser, IconDynamic, IconUsers } from '@edulastic/icons'
import { cardTitleColor, themeColor, darkGrey } from '@edulastic/colors'
// eslint-disable-next-line no-unused-vars
import {
  EduButton,
  LikeIconStyled,
  EduIf,
  EduThen,
  EduElse,
} from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { PEAR_ASSESSMENT_CERTIFIED_NAME } from '@edulastic/constants/const/common'
import {
  Container,
  Inner,
  Footer,
  Author,
  AuthorName,
  Header,
  HeaderThumbnail,
  StyledLink,
  TestInfo,
  ShareIcon,
  AuthorWrapper,
  IconText,
  ButtonWrapper,
  TagsWrapper,
  PlaylistId,
  StatusRow,
  Qcount,
  MidRow,
  Collection,
  CollectionNameWrapper,
  DynamicIconWrapper,
  StyledIcon,
} from './styled'
import Tags from '../../../src/components/common/Tags'
import { TestStatus } from '../ListItem/styled'
import { getAuthorCollectionMap } from '../../../dataUtils'
import TestStatusWrapper from '../TestStatusWrapper/testStatusWrapper'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const TestItemCard = ({
  thumbnail,
  openModal,
  isOwner,
  status,
  btnStyle,
  moveToItem,
  assignTest,
  userRole,
  showPreviewModal,
  testId,
  collections,
  // showPremiumTag,
  standardsIdentifiers,
  title,
  collectionName,
  isDocBased,
  summary,
  isDynamicTest,
  authorName,
  testItemId,
  usage,
  isTestLiked,
  handleLikeTest,
  likes,
  isTestRecommendation,
  videoUrl,
}) => {
  const [height, setHeight] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [ref.current])

  return (
    <Container
      isTestCard
      src={thumbnail}
      onClick={openModal}
      isTestRecommendation={isTestRecommendation}
      title={
        <Header isTestRecommendation={isTestRecommendation} src={null}>
          <HeaderThumbnail
            isTestRecommendation={isTestRecommendation}
            alt=""
            src={thumbnail}
          />
          <ButtonWrapper className="showHover">
            {isOwner && status === 'draft' && (
              <EduButton style={btnStyle} height="32px" onClick={moveToItem}>
                Edit
              </EduButton>
            )}
            {status === 'published' && userRole !== roleuser.EDULASTIC_CURATOR && (
              <AuthorCompleteSignupButton
                renderButton={(handleClick) => (
                  <EduButton
                    style={btnStyle}
                    height="32px"
                    onClick={(e) => {
                      e?.stopPropagation()
                      handleClick()
                    }}
                  >
                    Assign
                  </EduButton>
                )}
                onClick={assignTest}
              />
            )}
            {(status === 'published' || status === 'draft') && (
              <>
                <EduButton
                  data-cy="test-preview-button"
                  style={btnStyle}
                  height="32px"
                  onClick={(e) => showPreviewModal(testId, e)}
                >
                  Preview
                </EduButton>
                <EduButton
                  style={btnStyle}
                  height="32px"
                  onClick={() => openModal('more')}
                >
                  More
                </EduButton>
              </>
            )}
          </ButtonWrapper>
          {collections.find((o) => o.name === PEAR_ASSESSMENT_CERTIFIED_NAME) &&
            getAuthorCollectionMap(false, 30, 30).edulastic_certified.icon}
          {/* hiding premium tag temporarily as per CR */}
          {/* {showPremiumTag && <PremiumLabel> PREMIUM</PremiumLabel>} */}
          <EduIf condition={isDocBased}>
            <EduIf condition={videoUrl}>
              <EduThen>
                <StyledIcon type="play-square" />
              </EduThen>
              <EduElse>
                <StyledIcon type="file-pdf" />
              </EduElse>
            </EduIf>
          </EduIf>
        </Header>
      }
    >
      <TestInfo>
        <StyledLink ref={ref} data-cy="test-title" title={title}>
          {title}
        </StyledLink>
        <TagsWrapper testNameHeight={height} data-cy="test-standards">
          <Tags
            show={3}
            tags={standardsIdentifiers}
            key="standards"
            isStandards
            margin="0px"
            isTestCard
            testId={testId}
          />
        </TagsWrapper>
      </TestInfo>

      {!isTestRecommendation && (
        <MidRow>
          <Collection isDynamicTest={isDynamicTest}>
            <label>COLLECTIONS</label>
            <CollectionNameWrapper
              data-cy="test-collection"
              title={collectionName}
            >
              {collectionName}
            </CollectionNameWrapper>
          </Collection>
          <Qcount>
            <label>{isDocBased ? 'TOTAL QUESTIONS' : 'TOTAL ITEMS'}</label>
            {/**
             * For doc based wee need to consider
             *  total number questions and toal number of items
             *  */}
            <div data-cy="test-item-count">
              {isDocBased ? summary.totalQuestions : summary.totalItems}
            </div>
          </Qcount>
          {isDynamicTest && (
            <DynamicIconWrapper title="SmartBuild Test. Every student might get different items in assignment">
              <IconDynamic color={themeColor} />
            </DynamicIconWrapper>
          )}
        </MidRow>
      )}

      {!isTestRecommendation && (
        <Inner>
          {authorName && (
            <Author>
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
          <StatusRow>
            <TestStatusWrapper status={status} checkUser={false}>
              {({ children, ...rest }) => (
                <TestStatus data-cy="test-status" {...rest} view="tile">
                  {children}
                </TestStatus>
              )}
            </TestStatusWrapper>
          </StatusRow>
        </Inner>
      )}

      {!isTestRecommendation && (
        <Footer>
          {testItemId ? (
            <PlaylistId data-cy="test-id">
              <span>#</span>
              <span>{testItemId}</span>
            </PlaylistId>
          ) : null}
          {status !== 'draft' && (
            <>
              <ShareIcon>
                <IconUsers color={darkGrey} width={14} height={14} /> &nbsp;
                <IconText>{usage}</IconText>
              </ShareIcon>
              <LikeIconStyled isLiked={isTestLiked} onClick={handleLikeTest}>
                <IconHeart
                  color={isTestLiked ? '#ca481e' : darkGrey}
                  width={14}
                  height={14}
                />
                <IconText>{likes}</IconText>
              </LikeIconStyled>
            </>
          )}
        </Footer>
      )}
    </Container>
  )
}

export default TestItemCard

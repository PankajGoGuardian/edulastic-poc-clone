import React, { useRef, useState, useEffect } from 'react'
import { Dropdown } from 'antd'
import styled from 'styled-components'
import {
  IconHeart,
  IconUser,
  IconDynamic,
  IconUsers,
  IconAddToFolder,
} from '@edulastic/icons'
import { cardTitleColor, themeColor, darkGrey } from '@edulastic/colors'
// eslint-disable-next-line no-unused-vars
import {
  EduButton,
  LikeIconStyled,
  EduIf,
  EduThen,
  EduElse,
} from '@edulastic/common'
import { PEAR_ASSESSMENT_CERTIFIED_NAME } from '@edulastic/constants/const/common'
import { roleuser } from '@edulastic/constants'
import {
  Container,
  Inner,
  Footer,
  Author,
  AuthorName,
  Header,
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
import CombineTestButton from './CombineTestButton'
import AddRemoveTest from './AddRemoveTestToFolder'

const TestItemCard = ({
  thumbnail,
  openModal,
  isOwner,
  status,
  btnStyle,
  moveToItem,
  testId,
  collections,
  // showPremiumTag,
  standardsIdentifiers,
  assignTest,
  userRole,
  showPreviewModal,
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
  testCategory,
  itemGroups,
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
    >
      <OnHoverContainer data-cy="test-hover-container">
        <Header
          isTest
          src={thumbnail}
          isTestRecommendation={isTestRecommendation}
        >
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
        <ButtonWrapper isTest className="showHoverTestCard">
          {isOwner && status === 'draft' && (
            <EduButton
              style={btnStyle}
              width="140px"
              height="32px"
              onClick={moveToItem}
            >
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
                  width="140px"
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
                width="140px"
                height="32px"
                onClick={(e) => showPreviewModal(testId, e)}
              >
                Preview
              </EduButton>

              <CombineTestButton
                testId={testId}
                test={{
                  itemGroups,
                  testCategory,
                }}
                style={btnStyle}
                width="140px"
                height="32px"
                isTestCard
              />
              <EduButton
                style={btnStyle}
                height="32px"
                width="140px"
                onClick={() => openModal('more')}
              >
                More
              </EduButton>
            </>
          )}
        </ButtonWrapper>
        <TestInfo>
          <StyledLink ref={ref} data-cy="test-title" title={title}>
            {title}
          </StyledLink>
          <TagsWrapper testNameHeight={height} data-cy="test-standards">
            <Tags
              show={2}
              tags={standardsIdentifiers}
              key="standards"
              isStandards
              margin="0px"
              isTestCard
              flexWrap="noWrap"
              testId={testId}
            />
          </TagsWrapper>
        </TestInfo>

        {!isTestRecommendation && (
          <MidRow isTest>
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
      </OnHoverContainer>
      {!isTestRecommendation && (
        <Inner isTest>
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
          <Dropdown
            overlay={
              <AddRemoveTest testDetail={{ itemId: testId, name: title }} />
            }
          >
            <StyledCircleButton>
              <IconAddToFolder />
            </StyledCircleButton>
          </Dropdown>
        </Footer>
      )}
    </Container>
  )
}

export default TestItemCard

const OnHoverContainer = styled.div`
  &:hover {
    .showHoverTestCard {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      padding: 30px 0px;
    }
  }
`

export const StyledCircleButton = styled(EduButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border-radius: 50%;
  border: none;
  outline: none;
  &.ant-btn.ant-btn-primary {
    background-color: transparent;
    box-shadow: none !important;
  }
  &:hover,
  &:focus,
  &:active {
    &.ant-btn.ant-btn-primary {
      background-color: transparent;
      box-shadow: none !important;
    }
  }
`

import React, { useRef, useState, useEffect } from "react";
import { IconHeart, IconUser, IconDynamic, IconUsers } from "@edulastic/icons";
import { cardTitleColor, themeColor, darkGrey } from "@edulastic/colors";
import { PremiumLabel, EduButton, LikeIconStyled } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
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
  ButtonWrapper,
  TagsWrapper,
  PlaylistId,
  StatusRow,
  Qcount,
  MidRow,
  Collection,
  CollectionNameWrapper,
  DynamicIconWrapper
} from "./styled";
import Tags from "../../../src/components/common/Tags";
import { TestStatus } from "../ListItem/styled";
import { getAuthorCollectionMap } from "../../../dataUtils";
import TestStatusWrapper from "../TestStatusWrapper/testStatusWrapper";

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
  showPremiumTag,
  standardsIdentifiers,
  title,
  collectionName,
  isDocBased,
  summary,
  isDynamic,
  authorName,
  testItemId,
  usage,
  isTestLiked,
  handleLikeTest,
  likes
}) => {
  const [height, setHeight] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    setHeight(ref.current.clientHeight);
  }, [ref.current]);

  return (
    <Container
      src={thumbnail}
      onClick={openModal}
      title={
        <Header src={thumbnail}>
          <Stars />
          <ButtonWrapper className="showHover">
            {isOwner && status === "draft" && (
              <EduButton style={btnStyle} height="32px" onClick={moveToItem}>
                Edit
              </EduButton>
            )}
            {status === "published" && userRole !== roleuser.EDULASTIC_CURATOR && (
              <EduButton style={btnStyle} height="32px" onClick={assignTest}>
                Assign
              </EduButton>
            )}
            {(status === "published" || status === "draft") && (
              <>
                <EduButton
                  data-cy="test-preview-button"
                  style={btnStyle}
                  height="32px"
                  onClick={e => showPreviewModal(testId, e)}
                >
                  Preview
                </EduButton>
                <EduButton style={btnStyle} height="32px" onClick={openModal}>
                  More
                </EduButton>
              </>
            )}
          </ButtonWrapper>
          {collections.find(o => o.name === "Edulastic Certified") &&
            getAuthorCollectionMap(false, 30, 30).edulastic_certified.icon}
          {showPremiumTag && <PremiumLabel> PREMIUM</PremiumLabel>}
        </Header>
      }
    >
      <TestInfo>
        <StyledLink ref={ref} data-cy="test-title" title={title}>
          {title}
        </StyledLink>

        <TagsWrapper testNameHeight={height} data-cy="test-standards">
          <Tags show={2} tags={standardsIdentifiers} key="standards" isStandards margin="0px" trigger="hover" />
        </TagsWrapper>
      </TestInfo>

      <MidRow>
        <Collection isDynamic>
          <label>COLLECTIONS</label>
          <CollectionNameWrapper data-cy="test-collection" title={collectionName}>
            {collectionName}
          </CollectionNameWrapper>
        </Collection>
        <Qcount>
          <label>{isDocBased ? "TOTAL QUESTIONS" : "TOTAL ITEMS"}</label>
          {/**
           * For doc based wee need to consider
           *  total number questions and toal number of items
           *  */}
          <div data-cy="test-item-count">{isDocBased ? summary.totalQuestions : summary.totalItems}</div>
        </Qcount>
        {isDynamic && (
          <DynamicIconWrapper title="Dynamic Test. Every student might get different items in assignment">
            <IconDynamic color={themeColor} />
          </DynamicIconWrapper>
        )}
      </MidRow>

      <Inner>
        {authorName && (
          <Author>
            <AuthorWrapper>
              {collections.find(o => o.name === "Edulastic Certified") ? (
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

      <Footer>
        {testItemId ? (
          <PlaylistId data-cy="test-id">
            <span>#</span>
            <span>{testItemId}</span>
          </PlaylistId>
        ) : null}
        {status !== "draft" && (
          <>
            <ShareIcon>
              <IconUsers color={darkGrey} width={14} height={14} /> &nbsp;
              <IconText>{usage}</IconText>
            </ShareIcon>
            <LikeIconStyled isLiked={isTestLiked} onClick={handleLikeTest}>
              <IconHeart color={isTestLiked ? "#ca481e" : darkGrey} width={14} height={14} />
              <IconText>{likes}</IconText>
            </LikeIconStyled>
          </>
        )}
      </Footer>
    </Container>
  );
};

export default TestItemCard;

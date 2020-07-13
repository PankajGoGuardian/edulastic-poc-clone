import React from "react";
import { first } from "lodash";
import { IconShare, IconUser } from "@edulastic/icons";
import { cardTitleColor, darkGrey } from "@edulastic/colors";
import { PremiumLabel } from "@edulastic/common";

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
  AlignmentInfo,
  PlaylistCardHeaderRow,
  PlaylistSkinType,
  Grade
} from "./styled";
import Tags from "../../../src/components/common/Tags";
import { TestStatus } from "../ListItem/styled";
import { getAuthorCollectionMap } from "../../../dataUtils";
import TestStatusWrapper from "../TestStatusWrapper/testStatusWrapper";

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
  testItemId
}) => {
  const grade = first(_source.grades);
  const { title, alignmentInfo, skin } = _source;

  const isSparkMathSkin = skin === "SPARK";
  const isPublisherSkin = skin === "PUBLISHER";

  let headerTitle = title;
  if (alignmentInfo && isSparkMathSkin) {
    headerTitle += ` - ${alignmentInfo}`;
  } else if (!isSparkMathSkin && !isPublisherSkin) {
    headerTitle = "";
  }

  let skinType = "";
  if (isSparkMathSkin) {
    skinType = "SparkMath";
  } else if (isPublisherSkin) {
    skinType = (
      <span>
        EUREKA
        <br />
        MATH
      </span>
    );
  }

  return (
    <Container
      isPlaylist
      src={_source.thumbnail}
      onClick={moveToItem}
      title={
        <Header src={_source.thumbnail} isPlaylist>
          <PlaylistCardHeaderRow>
            <PlaylistSkinType>{skinType}</PlaylistSkinType>
            <Grade>Grade {grade}</Grade>
          </PlaylistCardHeaderRow>
          <PlaylistCardHeaderRow>
            <AlignmentInfo title={headerTitle}>{headerTitle}</AlignmentInfo>
          </PlaylistCardHeaderRow>
          <Stars isPlaylist />
          {collections.find(o => o.name === "Edulastic Certified") &&
            getAuthorCollectionMap(false, 30, 30).edulastic_certified.icon}
          {showPremiumTag && <PremiumLabel>PREMIUM</PremiumLabel>}
        </Header>
      }
    >
      <TestInfo isPlaylist>
        <StyledLink data-cy="test-title" title={title}>
          {title}
        </StyledLink>
        {isSparkMathSkin && alignmentInfo && <AlignmentInfo dark>Alignment: {alignmentInfo}</AlignmentInfo>}
        <PlaylistDesc dangerouslySetInnerHTML={{ __html: _source.description }} />
        <MidRow data-cy="test-standards">
          <Tags show={4} tags={standardsIdentifiers} key="standards" isStandards margin="0px" />
          <Tags data-cy="test-tags" show={2} tags={_source.tags || tags} key="tags" margin="0px" />
        </MidRow>
      </TestInfo>
      <Inner>
        {authorName && (
          <Author isPlaylist>
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
          <TestStatusWrapper status={status || _source?.status} checkUser={false}>
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
          <ShareIcon>
            <IconShare color={darkGrey} width={14} height={14} /> &nbsp;
            <IconText>{usage}</IconText>
          </ShareIcon>
        )}
      </Footer>
    </Container>
  );
};

export default PlaylistCard;

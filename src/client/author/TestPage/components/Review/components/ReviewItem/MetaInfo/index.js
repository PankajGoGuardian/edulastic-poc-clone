import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FlexContainer, PremiumTag, LikeIconStyled } from "@edulastic/common";
import { darkGrey } from "@edulastic/colors";
import { IconUser, IconHash, IconVolumeUp, IconNoVolume, IconHeart, IconShare } from "@edulastic/icons";
import CollectionTag from "@edulastic/common/src/components/CollectionTag/CollectionTag";
import { isPublisherUserSelector } from "../../../../../../src/selectors/user";
import Tags from "../../../../../../src/components/common/Tags";
import Standards from "../../../../../../ItemList/components/Item/Standards";
import { renderAnalytics } from "../../../../Summary/components/Sidebar/Sidebar";
import { AnalyticsItem, MetaTitle } from "../../../../Summary/components/Sidebar/styled";
import { MetaTag, DokStyled } from "./styled";
import { toggleTestLikeAction } from "../../../../../ducks";
import TestStatusWrapper from "../../../../../../TestList/components/TestStatusWrapper/testStatusWrapper";
import { TestStatus } from "../../../../../../TestList/components/ListItem/styled";

const MetaInfo = ({
  data: { item, type, by, id, audio = {}, isPremium = false, dok, tags, analytics },
  isPublisherUser,
  toggleTestItemLikeRequest
}) => {
  const isItemLiked = item?.alreadyLiked || false;

  const handleItemLike = () => {
    toggleTestItemLikeRequest({
      contentId: id,
      contentType: "TESTITEM",
      toggleValue: !isItemLiked,
      versionId: item.versionId
    });
  };

  return (
    <FlexContainer justifyContent="space-between" style={{ width: "100%", paddingTop: "15px" }}>
      <FlexContainer>
        {item && item.data && <Standards item={item} search={{ curriculumId: "" }} reviewpage />}
        <Tags tags={tags} show={1} />
        {type && (
          <FlexContainer>
            {type.map(t => (
              <MetaTag key={t} marginLeft="0px">
                {t}
              </MetaTag>
            ))}
            {!isPublisherUser && !!isPremium && <PremiumTag key="premium">Premium</PremiumTag>}
          </FlexContainer>
        )}
        <CollectionTag collectionName={item?.collectionName} />
        <TestStatusWrapper status={item.status}>
          {({ children, ...rest }) => <TestStatus {...rest}>{children}</TestStatus>}
        </TestStatusWrapper>
      </FlexContainer>
      <FlexContainer justifyContent="flex-end">
        {dok && <DokStyled>{`DOK:${dok}`}</DokStyled>}
        {renderAnalytics(by, IconUser)}
        {renderAnalytics(id && id.substring(18), IconHash)}
        <AnalyticsItem>
          <IconShare color={darkGrey} width={15} height={15} />
          <MetaTitle>{analytics?.[0]?.usage || 0}</MetaTitle>
        </AnalyticsItem>
        <LikeIconStyled isLiked={isItemLiked} onClick={handleItemLike} style={{ marginLeft: "15px" }}>
          <IconHeart color={isItemLiked ? "#ca481e" : darkGrey} width={15} height={15} />
          <MetaTitle>{analytics?.[0]?.likes || 0}</MetaTitle>
        </LikeIconStyled>
        {audio && Object.prototype.hasOwnProperty.call(audio, "ttsSuccess") ? (
          audio.ttsSuccess ? (
            <IconVolumeUp margin="0px 0px 0px 20px" />
          ) : (
            <IconNoVolume margin="0px 0px 0px 20px" />
          )
        ) : (
          ""
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

MetaInfo.propTypes = {
  data: PropTypes.object.isRequired
};

export default connect(
  state => ({
    isPublisherUser: isPublisherUserSelector(state)
  }),
  {
    toggleTestItemLikeRequest: toggleTestLikeAction
  }
)(MetaInfo);

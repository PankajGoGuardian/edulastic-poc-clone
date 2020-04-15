import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { FlexContainer, PremiumTag } from "@edulastic/common";
import { IconUser, IconHash, IconVolumeUp, IconNoVolume } from "@edulastic/icons";

import { isPublisherUserSelector } from "../../../../../../src/selectors/user";

import CollectionTag from "@edulastic/common/src/components/CollectionTag/CollectionTag";
import Tags from "../../../../../../src/components/common/Tags";
import Standards from "../../../../../../ItemList/components/Item/Standards";
import { renderAnalytics } from "../../../../Summary/components/Sidebar/Sidebar";
import { MetaTag, DokStyled } from "./styled";

const MetaInfo = ({ data: { item, type, by, id, audio = {}, isPremium = false, dok, tags }, isPublisherUser }) => (
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
          {!isPublisherUser && isPremium && <PremiumTag key="premium">Premium</PremiumTag>}
        </FlexContainer>
      )}
      <CollectionTag collectionName={item?.collectionName} />
    </FlexContainer>
    <FlexContainer justifyContent="flex-end">
      {dok && <DokStyled>{`DOK:${dok}`}</DokStyled>}
      {renderAnalytics(by, IconUser)}
      {renderAnalytics(id && id.substring(18), IconHash)}
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

MetaInfo.propTypes = {
  data: PropTypes.object.isRequired
};

export default connect(
  state => ({
    isPublisherUser: isPublisherUserSelector(state)
  }),
  {}
)(MetaInfo);

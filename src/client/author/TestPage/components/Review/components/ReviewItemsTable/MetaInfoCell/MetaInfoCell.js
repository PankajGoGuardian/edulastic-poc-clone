import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

import { FlexContainer } from "@edulastic/common";
import { IconShare, IconHeart, IconUser, IconHash } from "@edulastic/icons";
import { greenDark } from "@edulastic/colors";

import Tags from "../../../../../../src/components/common/Tags";
import { renderAnalytics } from "../../../../Summary/components/Sidebar/Sidebar";
import { AudioIcon } from "../../../../../../ItemList/components/Item/styled";
import { MetaTag, ExtraInfo } from "./styled";
import PremiumTag from "../../../../../../ItemList/components/PremiumTag/PremiumTag";

const MetaInfoCell = ({
  data: { standards, types, by, id, shared, likes, audio = {}, isPremium = false, points = 0 },
  itemTableView
}) => {
  return (
    <FlexContainer justifyContent="space-between" style={{ width: "100%" }}>
      <FlexContainer>
        {standards && !!standards.length && (
          <FlexContainer>
            <Tags
              tags={standards}
              labelStyle={{
                color: greenDark,
                background: "#d1f9eb",
                border: "none"
              }}
            />
          </FlexContainer>
        )}
        {types && !!types.length && (
          <FlexContainer>
            {types.map(type => (
              <MetaTag key={type}>{type}</MetaTag>
            ))}
          </FlexContainer>
        )}
      </FlexContainer>
      {itemTableView && (
        <FlexContainer justifyContent="flex-end">
          {isPremium && <PremiumTag />}
          {renderAnalytics(by, IconUser)}
          {renderAnalytics(id && id.substring(18), IconHash)}
          {renderAnalytics(shared, IconShare)}
          {renderAnalytics(likes, IconHeart)}
          {audio && audio.hasOwnProperty("ttsSuccess") ? (
            <AudioIcon className="fa fa-volume-up" success={audio.ttsSuccess} />
          ) : (
            ""
          )}
        </FlexContainer>
      )}
      {!itemTableView && (
        <FlexContainer justifyContent="flex-end">
          {renderAnalytics(id && id.substring(18), IconHash)}
          <ExtraInfo> Points </ExtraInfo>
          <ExtraInfo> {points}</ExtraInfo>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired
};

export default MetaInfoCell;

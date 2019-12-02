import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

import { FlexContainer, PremiumTag } from "@edulastic/common";
import { IconShare, IconHeart, IconUser, IconHash, IconVolumeUp, IconNoVolume } from "@edulastic/icons";
import { greenDark } from "@edulastic/colors";

import Tags from "../../../../../../src/components/common/Tags";
import Standards from "../../../../../../ItemList/components/Item/Standards";
import { renderAnalytics } from "../../../../Summary/components/Sidebar/Sidebar";
import { MetaTag, ExtraInfo, DokStyled } from "./styled";

const MetaInfoCell = ({
  data: { item, type, by, id, shared, likes, audio = {}, isPremium = false, points = 0, dok }
}) => {
  return (
    <FlexContainer justifyContent="space-between" style={{ width: "100%", paddingTop: "15px" }}>
      <FlexContainer>
        {isPremium && <PremiumTag />}
        {item && item.data && <Standards item={item} search={{ curriculumId: "" }} reviewpage={true} />}
        {type && (
          <FlexContainer>
            {type.map(t => {
              return (
                <MetaTag key={t} marginLeft={"0px"}>
                  {t}
                </MetaTag>
              );
            })}
          </FlexContainer>
        )}
      </FlexContainer>
      <FlexContainer justifyContent="flex-end">
        {dok && <DokStyled>{`DOK:${dok}`}</DokStyled>}
        {renderAnalytics(by, IconUser)}
        {renderAnalytics(id && id.substring(18), IconHash)}
        {audio && audio.hasOwnProperty("ttsSuccess") ? (
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

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired
};

export default MetaInfoCell;

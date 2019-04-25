import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

import { FlexContainer } from "@edulastic/common";
import { IconShare, IconHeart, IconUser, IconHash } from "@edulastic/icons";
import { greenDark } from "@edulastic/colors";

import Tags from "../../../../../../src/components/common/Tags";
import { renderAnalytics } from "../../../../Summary/components/Sidebar/Sidebar";
import { MetaTag } from "./styled";

const MetaInfoCell = ({ data: { standards, types, by, id, shared, likes } }) => (
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
    <FlexContainer justifyContent="flex-end">
      {renderAnalytics(by, IconUser)}
      {renderAnalytics(id, IconHash)}
      {renderAnalytics(shared, IconShare)}
      {renderAnalytics(likes, IconHeart)}
    </FlexContainer>
  </FlexContainer>
);

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired
};

export default MetaInfoCell;

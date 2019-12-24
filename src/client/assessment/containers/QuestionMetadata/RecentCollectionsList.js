import React from "react";
import StandardTags from "./styled/StandardTags";
import StandardsWrapper, { RecentStandards } from "./styled/StandardsWrapper";
import { themeColor, grey } from "@edulastic/colors";

const RecentStandardsList = ({ recentCollectionsList, collectionName, handleCollectionNameSelect, isDocBased }) => {
  return (
    <StandardsWrapper isDocBased={isDocBased}>
      <div>RECENTLY USED:</div>
      <RecentStandards>
        {recentCollectionsList.map(recentCollection => (
          <StandardTags
            color={collectionName.includes(recentCollection._id) ? grey : themeColor}
            onClick={() => {
              handleCollectionNameSelect(recentCollection._id);
            }}
          >
            {recentCollection.name}
          </StandardTags>
        ))}
      </RecentStandards>
    </StandardsWrapper>
  );
};

export default RecentStandardsList;

import React from "react";
import StandardTags from "./styled/StandardTags";
import StandardsWrapper, { RecentStandards } from "./styled/StandardsWrapper";
import { themeColor, grey } from "@edulastic/colors";

const RecentCollectionsList = ({ recentCollectionsList, collections, handleCollectionsSelect, isDocBased }) => {
  return (
    <StandardsWrapper isDocBased={isDocBased}>
      <div>RECENTLY USED:</div>
      <RecentStandards>
        {recentCollectionsList.map(recentCollection => (
          <StandardTags
            color={collections.find(o => o._id === recentCollection._id) ? grey : themeColor}
            onClick={() => {
              if (!collections.find(o => o._id === recentCollection._id)) {
                handleCollectionsSelect(recentCollection);
              }
            }}
          >
            {recentCollection.name}
          </StandardTags>
        ))}
      </RecentStandards>
    </StandardsWrapper>
  );
};

export default RecentCollectionsList;

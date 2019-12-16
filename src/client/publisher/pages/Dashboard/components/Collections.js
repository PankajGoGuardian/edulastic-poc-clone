import React, { useEffect } from "react";
import styled from "styled-components";

import { CollectionItem } from "./CollectionItem";
import { StyledH3, StyledPrimaryGreenButton } from "./styled";

// static collection data
const sampleData = [
  {
    name: "Bank 1",
    itemBank: {
      draft: 34,
      published: 25000,
      issues: 34
    },
    tests: {
      draft: 34,
      published: 25000,
      issues: 34
    },
    playlist: {
      draft: 34,
      published: 25000,
      issues: 34
    },
    chartData: [
      { name: "itembank", value: 50, fill: "#009BFFCC" },
      { name: "tests", value: 25, fill: "#00FFED6C" },
      { name: "playlist", value: 25, fill: "#AB2EFE9A" }
    ]
  }
];

const Collections = props => {
  const { className } = props;

  return (
    <div className={className}>
      <div className="heading-bar">
        <StyledH3>Collection</StyledH3>
        <StyledPrimaryGreenButton type="primary">ADD NEW</StyledPrimaryGreenButton>
      </div>
      {sampleData.map(item => (
        <CollectionItem data={item} />
      ))}
    </div>
  );
};

const StyledCollections = styled(Collections)`
  .heading-bar {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
  }
`;

export { StyledCollections as Collections };

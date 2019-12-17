import React, { useEffect } from "react";
import styled from "styled-components";

import { CollectionItem } from "./CollectionItem";
import { StyledH3, StyledPrimaryGreenButton } from "./styled";

// static collection data

const defs = (
  <defs>
    <linearGradient
      id="publisherDashboardItembankIconColor"
      x1="0"
      y1="0"
      x2="100%"
      y2="100%"
      gradientTransform="rotate(135)"
    >
      <stop offset="0%" stopColor="#009BFFCC" stopOpacity={1} />
      <stop offset="100%" stopColor="#009BFFA5" stopOpacity={1} />
    </linearGradient>
    <linearGradient
      id="publisherDashboardTestsIconColor"
      x1="0"
      y1="0"
      x2="100%"
      y2="100%"
      gradientTransform="rotate(174)"
    >
      <stop offset="0%" stopColor="#00FFED6C" stopOpacity={1} />
      <stop offset="100%" stopColor="#00FFEDD3" stopOpacity={1} />
    </linearGradient>
    <linearGradient
      id="publisherDashboardPlaylistIconColor"
      x1="0"
      y1="0"
      x2="100%"
      y2="100%"
      gradientTransform="rotate(135)"
    >
      <stop offset="0%" stopColor="#AB2EFE9A" stopOpacity={1} />
      <stop offset="100%" stopColor="#AB2EFE80" stopOpacity={1} />
    </linearGradient>
  </defs>
);

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
      { name: "itembank", value: 50, fill: "url('#publisherDashboardItembankIconColor')" },
      { name: "tests", value: 25, fill: "url('#publisherDashboardTestsIconColor')" },
      { name: "playlist", value: 25, fill: "url('#publisherDashboardPlaylistIconColor')" }
    ],
    defs
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

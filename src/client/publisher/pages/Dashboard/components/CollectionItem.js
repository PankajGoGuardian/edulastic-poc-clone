import React, { useEffect } from "react";
import styled from "styled-components";

import {
  publisherFont1,
  publisherFont2,
  publisherCollectionBg,
  publisherItemBankIcon,
  publisherTestsIcon,
  publisherPlaylistIcon,
  publisherBorder1
} from "@edulastic/colors";
import { IconItemLibrary, IconTestBank, IconPlaylist, IconSettings } from "@edulastic/icons";
import { StyledH4, ItemContent } from "./styled";
import { DonutChartWithText } from "../../../../common/components/charts/DonutChartWithText";

const CollectionItem = props => {
  const { className, data } = props;

  const { PlayLists: playlists, TestItems: itemBank, Tests: tests } = data.metrics;

  return (
    <div className={className}>
      <div className="item-heading-section">
        <StyledH4>{data.name}</StyledH4>
        <IconSettings className="collection-item-icon" style={{ fill: publisherFont2 }} />
      </div>
      <div className="item-content-section">
        <ItemContent className="item-content">
          <div className="item-content-body">
            <DonutChartWithText
              chartData={data.chartData}
              defs={data.defs}
              dataKey="value"
              centerTextNumber={data.totalIssues}
              centerTextUnit="ISSUES"
              width={150}
              height={150}
              innerRadius={45}
              outerRadius={75}
            />
          </div>
        </ItemContent>
        <ItemContent className="item-content">
          <div className="content-type-heading">
            <IconItemLibrary className="collection-item-icon" style={{ fill: publisherItemBankIcon }} />
            <p>Item Bank</p>
          </div>
          <div className="item-content-body">
            <div className="item-content-key-value">
              <p>{"draft"}</p>
              <StyledH4>{itemBank.draft}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"published"}</p>
              <StyledH4>{itemBank.published}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"issues"}</p>
              <StyledH4>{itemBank.issues}</StyledH4>
            </div>
          </div>
        </ItemContent>
        <ItemContent className="item-content">
          <div className="content-type-heading">
            <IconTestBank className="collection-item-icon" style={{ fill: publisherTestsIcon }} />
            <p>Tests</p>
          </div>
          <div className="item-content-body">
            <div className="item-content-key-value">
              <p>{"draft"}</p>
              <StyledH4>{tests.draft}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"published"}</p>
              <StyledH4>{tests.published}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"issues"}</p>
              <StyledH4>{tests.issues}</StyledH4>
            </div>
          </div>
        </ItemContent>
        <ItemContent className="item-content">
          <div className="content-type-heading">
            <IconPlaylist className="collection-item-icon" style={{ fill: publisherPlaylistIcon }} />
            <p>Playlists</p>
          </div>
          <div className="item-content-body">
            <div className="item-content-key-value">
              <p>{"draft"}</p>
              <StyledH4>{playlists.draft}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"published"}</p>
              <StyledH4>{playlists.published}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"issues"}</p>
              <StyledH4>{playlists.issues}</StyledH4>
            </div>
          </div>
        </ItemContent>
      </div>
    </div>
  );
};

const StyledCollectionItem = styled(CollectionItem)`
  background-color: ${publisherCollectionBg};
  padding: 20px;
  border-radius: 10px;
  margin: 10px;

  .collection-item-icon {
    padding: 5px;
    height: 30px;
    width: 30px;
  }

  .item-heading-section {
    display: flex;
    justify-content: space-between;
  }

  .item-content-section {
    display: flex;
    > div {
      flex: 1;
    }

    .item-content {
      .content-type-heading {
        display: flex;
        p {
          color: ${publisherFont2};
        }
      }
      .item-content-body {
        padding-left: 5px;
        margin-top: 10px;
        .item-content-key-value {
          display: flex;
          padding: 2px 0;
          p {
            color: ${publisherFont1};
            padding: 0;
            width: 66px;
          }
          h4 {
            font-size: 26px;
            flex: 1;
            margin: 0 0 0 20px;
            text-align: left;
            color: ${publisherFont1};
          }
        }
      }
    }

    .item-content:nth-child(2) {
      .item-content-body {
        border-right: solid 1px ${publisherBorder1};
      }
    }
    .item-content:nth-child(3) {
      .item-content-body {
        border-right: solid 1px ${publisherBorder1};
      }
    }
  }
`;

export { StyledCollectionItem as CollectionItem };

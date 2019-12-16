import React, { useEffect } from "react";
import styled from "styled-components";
import { Icon } from "antd";

import {
  black,
  fadedBlack,
  darkGrey,
  someGreyColor1,
  mediumDesktopWidth,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { IconItemLibrary, IconTestBank, IconPlaylist, IconSettings } from "@edulastic/icons";
import { StyledH4, ItemContent } from "./styled";
import { DonutChartWithText } from "../../../../common/components/charts/DonutChartWithText";

const CollectionItem = props => {
  const { className, data } = props;

  return (
    <div className={className}>
      <div className="item-heading-section">
        <StyledH4>{data.name}</StyledH4>
        <IconSettings className="collection-item-icon" />
      </div>
      <div className="item-content-section">
        <ItemContent className="item-content">
          <div className="item-content-body">
            <DonutChartWithText
              chartData={data.chartData}
              dataKey="value"
              centerTextNumber={13}
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
            <IconItemLibrary className="collection-item-icon" style={{ fill: "#D36DF6" }} />
            <p>Item Bank</p>
          </div>
          <div className="item-content-body">
            <div className="item-content-key-value">
              <p>{"draft"}</p>
              <StyledH4>{data.itemBank.draft}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"published"}</p>
              <StyledH4>{data.itemBank.published}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"issues"}</p>
              <StyledH4>{data.itemBank.issues}</StyledH4>
            </div>
          </div>
        </ItemContent>
        <ItemContent className="item-content">
          <div className="content-type-heading">
            <IconTestBank className="collection-item-icon" style={{ fill: "#00FFEDD3" }} />
            <p>Tests</p>
          </div>
          <div className="item-content-body">
            <div className="item-content-key-value">
              <p>{"draft"}</p>
              <StyledH4>{data.tests.draft}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"published"}</p>
              <StyledH4>{data.tests.published}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"issues"}</p>
              <StyledH4>{data.tests.issues}</StyledH4>
            </div>
          </div>
        </ItemContent>
        <ItemContent className="item-content">
          <div className="content-type-heading">
            <IconPlaylist className="collection-item-icon" style={{ fill: "#1487DB" }} />
            <p>Playlists</p>
          </div>
          <div className="item-content-body">
            <div className="item-content-key-value">
              <p>{"draft"}</p>
              <StyledH4>{data.playlist.draft}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"published"}</p>
              <StyledH4>{data.playlist.published}</StyledH4>
            </div>
            <div className="item-content-key-value">
              <p>{"issues"}</p>
              <StyledH4>{data.playlist.issues}</StyledH4>
            </div>
          </div>
        </ItemContent>
      </div>
    </div>
  );
};

const StyledCollectionItem = styled(CollectionItem)`
  background-color: #f3f3f8;
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
          color: ${black};
        }
      }
      .item-content-body {
        padding-left: 5px;
        margin-top: 10px;
        .item-content-key-value {
          display: flex;
          padding: 2px 0;
          p {
            color: ${fadedBlack};
            padding: 0;
            width: 66px;
          }
          h4 {
            font-size: 25px;
            flex: 1;
            margin: 0 0 0 20px;
            text-align: left;
          }
        }
      }
    }

    .item-content:nth-child(2) {
      border-right: solid 1px ${someGreyColor1};
    }
    .item-content:nth-child(3) {
      border-right: solid 1px ${someGreyColor1};
    }
  }
`;

export { StyledCollectionItem as CollectionItem };

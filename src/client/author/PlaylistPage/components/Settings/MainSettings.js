import React from "react";
import { Row, Col, Anchor, Switch } from "antd";

import { playlists } from "@edulastic/constants";
import styled from "styled-components";
import { themeColor } from "@edulastic/colors";
import {
  StyledAnchor,
  Body,
  Title,
  Block,
  Description,
  Container
} from "../../../TestPage/components/Setting/components/MainSetting/styled";

const { settingCategories } = playlists;

const Settings = ({ history, windowWidth, customize, handleUserCustomize }) => {
  const isSmallSize = windowWidth < 993 ? 1 : 0;
  return (
    <Container>
      <Row style={{ padding: 0 }}>
        <Col span={isSmallSize ? 0 : 6}>
          <CustomStyledAnchor affix={false} offsetTop={125}>
            {settingCategories.map((category, index) => (
              <Anchor.Link
                key={category.id}
                href={`${history.location.pathname}#${category.id}`}
                title={category.title.toLowerCase()}
                className={index === 0 && "active-link"}
              />
            ))}
          </CustomStyledAnchor>
        </Col>
        <Col span={isSmallSize ? 24 : 18}>
          <StyledBlock id="user-customization" smallSize={isSmallSize}>
            <Title>User Customization</Title>
            <Body smallSize={isSmallSize}>
              <Switch data-cy="customization" defaultChecked={customize} onChange={handleUserCustomize} />
              <Description>
                If set to ON (default), the playlist can be customized by the users i.e, users can add/remove the items in the playlist
              </Description>
            </Body>
          </StyledBlock>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;

const CustomStyledAnchor = styled(StyledAnchor)`
  margin-left: 0px;
  padding-left: 25px;
  .ant-anchor-link {
    margin: 20px 12px;
  }
  .active-link {
    &.ant-anchor-link {
      &:after {
        opacity: 1;
      }
      a {
        color: ${themeColor};
      }
    }
  }
`;
const StyledBlock = styled(Block)`
  margin: 0px;
`;

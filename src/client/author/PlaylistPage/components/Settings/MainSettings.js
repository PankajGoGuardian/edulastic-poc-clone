import React from "react";
import { Row, Col, Anchor, Switch } from "antd";

import { playlists } from "@edulastic/constants";
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
          <StyledAnchor affix={false} offsetTop={125}>
            {settingCategories.map(category => (
              <Anchor.Link
                key={category.id}
                href={`${history.location.pathname}#${category.id}`}
                title={category.title.toLowerCase()}
              />
            ))}
          </StyledAnchor>
        </Col>
        <Col span={isSmallSize ? 24 : 18}>
          <Block id="user-customization" smallSize={isSmallSize}>
            <Title>User Customization</Title>
            <Body smallSize={isSmallSize}>
              <Switch defaultChecked={customize} onChange={handleUserCustomize} />
              <Description>
                {
                  "If set to ON(default), the play list can be customized by users ie, they can add/remove the items in the play list."
                }
              </Description>
            </Body>
          </Block>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;

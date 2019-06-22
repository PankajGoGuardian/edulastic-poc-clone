import React from "react";
import PropTypes from "prop-types";

import { FlexContainer } from "@edulastic/common";

import { Photo } from "../../../common";
import {
  Container,
  Avatar,
  AvatarContainer,
  CreatedByTitle,
  CreatedByValue,
  ContainerLeft,
  ContainerRight
} from "./styled";
import { Block, AnalyticsContainer } from "../Sidebar/styled";
import { IconShare, IconHeart } from "@edulastic/icons";
import { renderAnalytics } from "../Sidebar/Sidebar";

const SummaryHeader = ({ createdBy, windowWidth, onChangeField, thumbnail, analytics, owner }) => {
  const avatar = createdBy && createdBy.firstName ? createdBy.firstName[0] : "E";
  return (
    <Container>
      <ContainerLeft>
        <Photo
          height={windowWidth > 993 ? 165 : 120}
          windowWidth={windowWidth}
          owner={owner}
          onChangeField={onChangeField}
          url={thumbnail}
        />
      </ContainerLeft>
      <ContainerRight>
        <AvatarContainer>
          <FlexContainer alignItems="flex-start">
            <Avatar>{avatar}</Avatar>
            <FlexContainer flexDirection="column" justifyContent="space-between" alignItems="flex-start">
              <CreatedByTitle style={{ marginRight: 0 }}>Created by:</CreatedByTitle>
              <CreatedByValue>
                {createdBy && createdBy.firstName} {createdBy && createdBy.lastName}
              </CreatedByValue>
            </FlexContainer>
          </FlexContainer>
        </AvatarContainer>
        <Block>
          <AnalyticsContainer style={{ marginBottom: windowWidth > 993 ? "0" : "15px" }}>
            {renderAnalytics((analytics && analytics.usage) || 0, IconShare)}
            {renderAnalytics((analytics && analytics.likes) || 0, IconHeart)}
          </AnalyticsContainer>
        </Block>
      </ContainerRight>
    </Container>
  );
};

SummaryHeader.propTypes = {
  createdBy: PropTypes.shape({
    firstName: PropTypes.string
  }).isRequired,
  owner: PropTypes.bool,
  windowWidth: PropTypes.number.isRequired,
  onChangeField: PropTypes.func.isRequired,
  thumbnail: PropTypes.string.isRequired
};

export default SummaryHeader;

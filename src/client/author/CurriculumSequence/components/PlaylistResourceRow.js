import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import { themeColor } from "@edulastic/colors";
import { AssignmentButton, AssignmentIcon, CustomIcon } from "./CurriculumModuleRow";
import { IconTrash } from "@edulastic/icons";
import { connect } from "react-redux";
import { getUserRole } from "../../src/selectors/user";
import { ResouceIcon } from "./ResourceItem";
import { FlexContainer } from "@edulastic/common";

const ResourceRow = ({
  isStudent,
  data = {},
  mode,
  urlHasUseThis,
  deleteTest,
  moduleIndex,
  showResource,
  setEmbeddedVideoPreviewModal
}) => {
  const viewResource = () => {
    if (data.contentType === "lti_resource") showResource(data.contentId);
    if (data.contentType === "website_resource") window.open(data.contentUrl, "_blank");
    if (data.contentType === "video_resource")
      setEmbeddedVideoPreviewModal({ title: data.contentTitle, url: data.contentUrl });
  };

  if (mode === "embedded") {
    return (
      <FlexContainer width="100%" justifyContent="space-between">
        <ResourceWrapper>
          <ResouceIcon type={data.contentType} isAdded />
          <Title>{data.contentTitle}</Title>
        </ResourceWrapper>
        <FlexContainer style={{ marginRight: "5px" }} width="148px">
          <AssignmentButton>
            <Button onClick={viewResource}>VIEW</Button>
          </AssignmentButton>
          <AssignmentIcon>
            <CustomIcon
              data-cy="resourceDeleteOptionsIcon"
              onClick={e => {
                e.stopPropagation();
                deleteTest(moduleIndex, data.contentId);
              }}
            >
              <IconTrash color={themeColor} />
            </CustomIcon>
          </AssignmentIcon>
        </FlexContainer>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer width="100%" justifyContent="space-between" onClick={viewResource}>
      <ResourceWrapper>
        <ResouceIcon type={data.contentType} isAdded />
        <Title>{data.contentTitle}</Title>
      </ResourceWrapper>
    </FlexContainer>
  );
};

export const PlaylistResourceRow = connect(({ user }) => ({
  isStudent: getUserRole({ user }) === "student"
}))(ResourceRow);

const ResourceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 2px dashed #d2d2d2;
  border-radius: 8px;
  padding: 6px;
  max-width: 90%;
`;

const Title = styled.div`
  font-size: 12px;
  color: ${themeColor};
  font: 11px/15px Open Sans;
  font-weight: 600;
  text-transform: uppercase;
`;

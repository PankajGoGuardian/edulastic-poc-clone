import React from "react";
import { Button } from "antd";
import { themeColor } from "@edulastic/colors";
import { IconTrash } from "@edulastic/icons";
import { connect } from "react-redux";
import { FlexContainer } from "@edulastic/common";
import { LastColumn, IconActionButton, AssignmentButton } from "../CurriculumModuleRow";
import { getUserRole } from "../../../src/selectors/user";
import { ResouceIcon } from "../ResourceItem";
import { ResourceWrapper, Title } from "./styled";

const ResourceRow = ({
  data = {},
  mode,
  deleteTest,
  moduleIndex,
  showResource,
  setEmbeddedVideoPreviewModal,
  isManageContentActive,
  hideEditOptions
}) => {
  const viewResource = () => {
    if (data.contentType === "lti_resource") showResource(data.contentId);
    if (data.contentType === "website_resource") window.open(data.contentUrl, "_blank");
    if (data.contentType === "video_resource")
      setEmbeddedVideoPreviewModal({ title: data.contentTitle, url: data.contentUrl });
  };

  const deleteResource = e => {
    e.stopPropagation();
    deleteTest(moduleIndex, data.contentId);
  };

  if (mode === "embedded") {
    return (
      <FlexContainer width="100%" justifyContent="space-between">
        <ResourceWrapper>
          <ResouceIcon type={data.contentType} isAdded />
          <Title>{data.contentTitle}</Title>
        </ResourceWrapper>
        <LastColumn justifyContent="space-between">
          <AssignmentButton>
            <Button onClick={viewResource}>VIEW</Button>
          </AssignmentButton>
          {(!hideEditOptions || mode === "embedded") && isManageContentActive && (
            <IconActionButton onClick={deleteResource}>
              <IconTrash color={themeColor} />
            </IconActionButton>
          )}
        </LastColumn>
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

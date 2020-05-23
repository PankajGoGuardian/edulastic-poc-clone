/* eslint-disable no-unused-vars */
import React from "react";
import { connect } from "react-redux";
import { FlexContainer } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { useDrop } from "react-dnd";
import { ResouceIcon } from "../ResourceItem";
import { removeSubResourceAction } from "../../ducks";
import { SupportResourceDropTarget, ResourceLabel, ResourceWrapper, Title, InlineDelete } from "./styled";
import { ModuleDataName } from "../CurriculumModuleRow";

export const SubResourceView = ({
  data: itemData = {},
  mode,
  moduleIndex,
  showResource,
  itemIndex,
  setEmbeddedVideoPreviewModal,
  removeSubResource,
  isManageContentActive,
  type,
  inDiffrentiation
}) => {
  const viewResource = data => () => {
    if (data.contentType === "lti_resource") showResource(data.contentId);
    if (data.contentType === "website_resource") window.open(data.contentUrl, "_blank");
    if (data.contentType === "video_resource")
      setEmbeddedVideoPreviewModal({ title: data.contentTitle, url: data.contentUrl });
  };

  const deleteSubResource = data => e => {
    e.stopPropagation();
    if (inDiffrentiation) {
      removeSubResource({ type, parentTestId: itemData.testId, contentId: data.contentId });
    } else {
      removeSubResource({ moduleIndex, itemIndex, contentId: data.contentId });
    }
  };

  const hasResources = itemData?.resources?.length > 0;

  return (
    <FlexContainer width="100%" justifyContent="flex-start" data-cy="subResourceView">
      {hasResources && (
        <ModuleDataName isReview isResource>
          <ResourceLabel>resources</ResourceLabel>
        </ModuleDataName>
      )}
      {itemData?.resources?.map(data => (
        <ResourceWrapper onClick={viewResource(data)} showBorder={isManageContentActive}>
          <ResouceIcon type={data.contentType} isAdded />
          <Title>{data.contentTitle}</Title>
          {mode === "embedded" && (
            <InlineDelete title="Delete" onClick={deleteSubResource(data)}>
              <IconClose />
            </InlineDelete>
          )}
        </ResourceWrapper>
      ))}
    </FlexContainer>
  );
};

export const SubResource = connect(
  null,
  {
    removeSubResource: removeSubResourceAction
  }
)(SubResourceView);

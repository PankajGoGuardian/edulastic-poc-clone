import React from "react";
import { useDrag } from "react-dnd";
import { IconEye } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { ResourceItemWrapper, IconWrapper, ResourceTitle, TitleText } from "./styled";
import Tags from "../../../src/components/common/Tags";
import TestIcon from "./static/TestIcon";
import WebsiteIcon from "./static/WebsiteIcon";
import LTIResourceIcon from "./static/LTIResourceIcon";
import { Tooltip } from "../../../../common/utils/helpers";

export const ICONS_BY_TYPE = {
  test: <TestIcon />,
  video_resource: <i style={{ fontSize: "20px", color: "rgb(190, 190, 190)" }} class="fa fa-play-circle-o" />, // Update once standard svg is available
  lti_resource: <LTIResourceIcon />,
  website_resource: <WebsiteIcon />
};

export const ResouceIcon = ({ type, isAdded }) => <IconWrapper isAdded={isAdded}>{ICONS_BY_TYPE[type]}</IconWrapper>;

const ResourceItem = ({ title, type, id, summary, data = undefined, isAdded, previewTest, status, testType }) => {
  const standardIdentifiers = (summary?.standards || []).map(x => x.identifier);
  const [{ opacity }, drag] = useDrag({
    item: {
      type: "item",
      contentType: type,
      id,
      fromPlaylistTestsBox: true,
      contentTitle: title,
      standardIdentifiers,
      data,
      status,
      testType
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });

  return (
    <ResourceItemWrapper data-cy={`${id}`} ref={drag}>
      <ResouceIcon type={type} isAdded={isAdded} />
      <ResourceTitle isAdded={isAdded}>
        <TitleText noStandards={standardIdentifiers.length === 0} title={title}>
          {title}
        </TitleText>
        <Tags tags={standardIdentifiers} show={1} showTitle />
      </ResourceTitle>
      <Tooltip title="preview">
        <IconEye className="preview-btn" color={themeColor} width={18} height={16} onClick={previewTest} />
      </Tooltip>
    </ResourceItemWrapper>
  );
};

export default ResourceItem;

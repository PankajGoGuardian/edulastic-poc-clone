import React from "react";
import { useDrag } from "react-dnd";
import { IconEye } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { ResourceItemWrapper, IconWrapper, ResourceTitle, TitleText } from "./styled";
import Tags from "../../../src/components/common/Tags";
import TestIcon from "./static/TestIcon";
import LessonIcon from "./static/writing.svg";
import VideoIcon from "./static/graduation-cap.svg";
import { Tooltip } from "../../../../common/utils/helpers";

export const ICONS_BY_TYPE = {
  test: <TestIcon />,
  video: <img src={VideoIcon} />,
  lti_resource: <img src={LessonIcon} />
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

import React from "react";
import { useDrag } from "react-dnd";
import { ResourceItemWrapper, IconWrapper, ResourceTitle, TitleText } from "./styled";
import Tags from "../../../src/components/common/Tags";
import TestIcon from "./static/blank-document.svg";
import LessonIcon from "./static/writing.svg";
import VideoIcon from "./static/graduation-cap.svg";

const ICONS_BY_TYPE = {
  tests: <img src={TestIcon} />,
  video: <img src={VideoIcon} />,
  lessons: <img src={LessonIcon} />
};

const ResourceItem = ({ title, type, id, summary }) => {
  const standardIdentifiers = (summary?.standards || []).map(x => x.identifier);
  const [{ opacity }, drag] = useDrag({
    item: {
      type: "item",
      id,
      fromPlaylistTestsBox: true,
      title,
      standardIdentifiers
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });

  return (
    <ResourceItemWrapper ref={drag}>
      <IconWrapper>{ICONS_BY_TYPE[type]}</IconWrapper>
      <ResourceTitle title={title}>
        <TitleText noStandards={standardIdentifiers.length === 0}>{title}</TitleText>{" "}
        <Tags tags={standardIdentifiers} show={1} showTitle />{" "}
      </ResourceTitle>
    </ResourceItemWrapper>
  );
};

export default ResourceItem;

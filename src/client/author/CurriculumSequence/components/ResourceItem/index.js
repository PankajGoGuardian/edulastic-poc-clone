import React from "react";
import { ResourceItemWrapper, IconWrapper, ResourceTitle } from "./styled";
import TestIcon from "./static/blank-document.svg";
import LessonIcon from "./static/writing.svg";
import VideoIcon from "./static/graduation-cap.svg";

const ICONS_BY_TYPE = {
  tests: <img src={TestIcon} />,
  video: <img src={VideoIcon} />,
  lessons: <img src={LessonIcon} />
};

const ResourceItem = ({ title, type }) => {
  return (
    <ResourceItemWrapper>
      <IconWrapper>{ICONS_BY_TYPE[type]}</IconWrapper>
      <ResourceTitle>{title}</ResourceTitle>
    </ResourceItemWrapper>
  );
};

export default ResourceItem;

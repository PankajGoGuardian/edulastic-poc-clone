import React from "react";
import styled from "styled-components";
import BreadCrumb from "../../../src/components/Breadcrumb";
import { SecondHeader } from "../../../TestPage/components/Summary/components/Container/styled";

const CurriculumBreadCrumb = () => {
  const playlistBreadcrumbData = [
    {
      title: "PLAYLIST",
      to: "/author/playlists"
    },
    {
      title: "REVIEW",
      to: ""
    }
  ];

  return (
    <ReviewBreadCrumbWrapper>
      <SecondHeader>
        <BreadCrumb data={playlistBreadcrumbData} style={{ position: "unset" }} />
      </SecondHeader>
    </ReviewBreadCrumbWrapper>
  );
};

export default CurriculumBreadCrumb;

const ReviewBreadCrumbWrapper = styled.div`
  padding: 0px 0px 15px;
  width: 100%;
`;
